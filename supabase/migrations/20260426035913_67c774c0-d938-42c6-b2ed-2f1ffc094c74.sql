
-- Roles enum and table
create type public.app_role as enum ('student', 'faculty');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  roll_no text,
  email text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  unique(user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- Trigger: auto-create profile + role on signup, role taken from raw_user_meta_data.role
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  _role public.app_role;
begin
  insert into public.profiles (id, full_name, roll_no, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name',''),
    coalesce(new.raw_user_meta_data->>'roll_no',''),
    new.email
  );
  _role := coalesce((new.raw_user_meta_data->>'role')::public.app_role, 'student');
  insert into public.user_roles (user_id, role) values (new.id, _role)
  on conflict do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Profiles policies
create policy "Profiles: own select" on public.profiles for select to authenticated
using (auth.uid() = id);
create policy "Profiles: faculty select all" on public.profiles for select to authenticated
using (public.has_role(auth.uid(),'faculty'));
create policy "Profiles: own update" on public.profiles for update to authenticated
using (auth.uid() = id);

-- User roles policies (read-only to user; faculty can read all)
create policy "Roles: own select" on public.user_roles for select to authenticated
using (auth.uid() = user_id);
create policy "Roles: faculty select all" on public.user_roles for select to authenticated
using (public.has_role(auth.uid(),'faculty'));

-- Student internship submission (one-time)
create table public.internship_submissions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null unique references auth.users(id) on delete cascade,
  company text not null,
  role_title text not null,
  jd_text text,
  jd_file_path text,
  required_tech text[] not null default '{}',
  work_summary text not null,
  actual_tech text[] not null default '{}',
  submitted_at timestamptz not null default now()
);
alter table public.internship_submissions enable row level security;

create policy "Submissions: student own select" on public.internship_submissions for select to authenticated
using (auth.uid() = student_id);
create policy "Submissions: faculty select all" on public.internship_submissions for select to authenticated
using (public.has_role(auth.uid(),'faculty'));
create policy "Submissions: student insert own once" on public.internship_submissions for insert to authenticated
with check (auth.uid() = student_id and public.has_role(auth.uid(),'student'));
-- no update/delete policies => locked after submit

-- Daily activity logs (ongoing)
create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users(id) on delete cascade,
  log_date date not null default current_date,
  transcript text not null,
  tech_tags text[] not null default '{}',
  sentiment numeric(2,1),
  created_at timestamptz not null default now()
);
alter table public.activity_logs enable row level security;
create index on public.activity_logs (student_id, created_at desc);

create policy "Logs: student own select" on public.activity_logs for select to authenticated
using (auth.uid() = student_id);
create policy "Logs: faculty select all" on public.activity_logs for select to authenticated
using (public.has_role(auth.uid(),'faculty'));
create policy "Logs: student insert own" on public.activity_logs for insert to authenticated
with check (auth.uid() = student_id and public.has_role(auth.uid(),'student'));

-- Faculty comments per student
create table public.student_comments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users(id) on delete cascade,
  faculty_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);
alter table public.student_comments enable row level security;
create index on public.student_comments (student_id, created_at desc);

create policy "Comments: student own select" on public.student_comments for select to authenticated
using (auth.uid() = student_id);
create policy "Comments: faculty select all" on public.student_comments for select to authenticated
using (public.has_role(auth.uid(),'faculty'));
create policy "Comments: faculty insert" on public.student_comments for insert to authenticated
with check (auth.uid() = faculty_id and public.has_role(auth.uid(),'faculty'));

-- Storage bucket for JD files
insert into storage.buckets (id, name, public) values ('jd-files','jd-files', false)
on conflict (id) do nothing;

create policy "JD: student upload own" on storage.objects for insert to authenticated
with check (bucket_id = 'jd-files' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "JD: student read own" on storage.objects for select to authenticated
using (bucket_id = 'jd-files' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "JD: faculty read all" on storage.objects for select to authenticated
using (bucket_id = 'jd-files' and public.has_role(auth.uid(),'faculty'));
