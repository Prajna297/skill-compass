// Simulated AI analysis JSON structure (Whisper/Falcon-7B pipeline output)

export type Persona = "faculty" | "admin";

export interface Student {
  id: string;
  name: string;
  rollNo: string;
  company: string;
  role: string;
  avatarColor: string;
  jdRequired: string[];
  actualUsed: string[];
  matchPercent: number;
  fruitfulnessScore: number;
  daysSinceLog: number;
  status: "on-track" | "at-risk" | "critical";
  weeklyScores: number[];
}

export interface ActivityLog {
  id: string;
  studentId: string;
  studentName: string;
  company: string;
  timestamp: string;
  transcript: string;
  techTags: string[];
  sentiment: number;
  source: "whisper" | "falcon-7b";
}

export const students: Student[] = [
  {
    id: "s1",
    name: "Aarav Mehta",
    rollNo: "21BCE1042",
    company: "Infosys",
    role: "Data Analyst Intern",
    avatarColor: "oklch(0.78 0.18 152)",
    jdRequired: ["SQL", "Power BI", "Python", "Excel", "Tableau"],
    actualUsed: ["SQL", "Power BI", "Python", "Excel"],
    matchPercent: 80,
    fruitfulnessScore: 4.2,
    daysSinceLog: 0,
    status: "on-track",
    weeklyScores: [3.2, 3.5, 3.8, 4.0, 4.1, 4.2, 4.2],
  },
  {
    id: "s2",
    name: "Priya Sharma",
    rollNo: "21BCE1078",
    company: "TCS",
    role: "Software Engineer Intern",
    avatarColor: "oklch(0.7 0.15 230)",
    jdRequired: ["Java", "Spring Boot", "Microservices", "Docker", "Kubernetes", "AWS"],
    actualUsed: ["Java", "Spring Boot", "MySQL"],
    matchPercent: 50,
    fruitfulnessScore: 2.8,
    daysSinceLog: 1,
    status: "at-risk",
    weeklyScores: [3.5, 3.2, 3.0, 2.9, 2.8, 2.8, 2.8],
  },
  {
    id: "s3",
    name: "Rohan Verma",
    rollNo: "21BCE1112",
    company: "Deloitte",
    role: "Business Analyst Intern",
    avatarColor: "oklch(0.82 0.16 80)",
    jdRequired: ["SQL", "Excel", "Power BI", "Stakeholder Mgmt"],
    actualUsed: ["SQL", "Excel", "Power BI", "Stakeholder Mgmt", "Python"],
    matchPercent: 100,
    fruitfulnessScore: 4.6,
    daysSinceLog: 0,
    status: "on-track",
    weeklyScores: [4.0, 4.2, 4.3, 4.4, 4.5, 4.6, 4.6],
  },
  {
    id: "s4",
    name: "Sneha Iyer",
    rollNo: "21BCE1156",
    company: "Accenture",
    role: "ML Engineer Intern",
    avatarColor: "oklch(0.7 0.18 295)",
    jdRequired: ["Python", "TensorFlow", "PyTorch", "MLOps", "Docker"],
    actualUsed: ["Python", "Pandas"],
    matchPercent: 30,
    fruitfulnessScore: 1.8,
    daysSinceLog: 5,
    status: "critical",
    weeklyScores: [2.8, 2.5, 2.2, 2.0, 1.9, 1.8, 1.8],
  },
  {
    id: "s5",
    name: "Karthik Nair",
    rollNo: "21BCE1201",
    company: "Wipro",
    role: "Cloud Engineer Intern",
    avatarColor: "oklch(0.65 0.22 25)",
    jdRequired: ["AWS", "Terraform", "Linux", "Docker", "Jenkins"],
    actualUsed: ["AWS", "Linux", "Docker", "Jenkins"],
    matchPercent: 75,
    fruitfulnessScore: 3.9,
    daysSinceLog: 0,
    status: "on-track",
    weeklyScores: [3.4, 3.5, 3.7, 3.8, 3.8, 3.9, 3.9],
  },
  {
    id: "s6",
    name: "Anjali Reddy",
    rollNo: "21BCE1255",
    company: "Cognizant",
    role: "Frontend Intern",
    avatarColor: "oklch(0.78 0.15 200)",
    jdRequired: ["React", "TypeScript", "Tailwind", "Next.js", "Testing"],
    actualUsed: ["React", "TypeScript", "Tailwind"],
    matchPercent: 60,
    fruitfulnessScore: 1.6,
    daysSinceLog: 4,
    status: "critical",
    weeklyScores: [2.5, 2.2, 2.0, 1.9, 1.7, 1.6, 1.6],
  },
];

export const activityFeed: ActivityLog[] = [
  {
    id: "a1",
    studentId: "s1",
    studentName: "Aarav Mehta",
    company: "Infosys",
    timestamp: "Today · 09:42",
    transcript:
      "Built a dashboard in Power BI to track quarterly revenue. Wrote SQL queries with CTEs to aggregate transaction data across three regional databases...",
    techTags: ["Power BI", "SQL", "CTE", "Data Modeling"],
    sentiment: 4.5,
    source: "whisper",
  },
  {
    id: "a2",
    studentId: "s3",
    studentName: "Rohan Verma",
    company: "Deloitte",
    timestamp: "Today · 08:15",
    transcript:
      "Presented a stakeholder analysis to the project lead. Used Python pandas to clean a messy CSV with 50k rows before importing to Power BI for visualization.",
    techTags: ["Python", "Pandas", "Power BI", "Stakeholder Mgmt"],
    sentiment: 4.8,
    source: "falcon-7b",
  },
  {
    id: "a3",
    studentId: "s2",
    studentName: "Priya Sharma",
    company: "TCS",
    timestamp: "Yesterday · 18:30",
    transcript:
      "Spent the day fixing legacy MySQL queries. Did not get exposure to the microservices stack today. Mentor was unavailable.",
    techTags: ["MySQL", "Java"],
    sentiment: 2.5,
    source: "whisper",
  },
  {
    id: "a4",
    studentId: "s5",
    studentName: "Karthik Nair",
    company: "Wipro",
    timestamp: "Yesterday · 16:05",
    transcript:
      "Deployed a containerized Node service via Jenkins pipeline to AWS ECS. Debugged IAM policies for S3 read access.",
    techTags: ["AWS", "Docker", "Jenkins", "IAM"],
    sentiment: 4.1,
    source: "falcon-7b",
  },
  {
    id: "a5",
    studentId: "s4",
    studentName: "Sneha Iyer",
    company: "Accenture",
    timestamp: "5 days ago · 11:20",
    transcript:
      "Worked on data preprocessing in pandas. Have not been assigned to a model training task yet — feeling stuck.",
    techTags: ["Python", "Pandas"],
    sentiment: 1.8,
    source: "whisper",
  },
];

export const weeklyTrend = [
  { week: "W1", faculty: 3.4, admin: 3.2, cohort: 3.3 },
  { week: "W2", faculty: 3.5, admin: 3.3, cohort: 3.4 },
  { week: "W3", faculty: 3.6, admin: 3.4, cohort: 3.5 },
  { week: "W4", faculty: 3.7, admin: 3.5, cohort: 3.6 },
  { week: "W5", faculty: 3.5, admin: 3.4, cohort: 3.4 },
  { week: "W6", faculty: 3.8, admin: 3.6, cohort: 3.7 },
  { week: "W7", faculty: 3.9, admin: 3.7, cohort: 3.8 },
];

export const skillDistribution = [
  { skill: "SQL", required: 12, used: 11 },
  { skill: "Python", required: 10, used: 8 },
  { skill: "Cloud", required: 9, used: 6 },
  { skill: "React", required: 7, used: 6 },
  { skill: "ML/AI", required: 8, used: 4 },
  { skill: "DevOps", required: 6, used: 5 },
];
