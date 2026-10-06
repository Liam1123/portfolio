// All résumé content lives here, dressed up as Pokédex data.
// Edit this file to update the site — the UI and /api/dex both read from it.

export type DexType =
  | "SECURITY"
  | "IDENTITY"
  | "AUTOMATION"
  | "FORENSICS"
  | "LEADERSHIP"
  | "ECON"
  | "NORMAL";

export const TYPE_COLORS: Record<DexType, { bg: string; fg: string; blurb: string }> = {
  SECURITY: { bg: "#7b8fb8", fg: "#fff", blurb: "Defends endpoints, detects threats, responds to incidents." },
  IDENTITY: { bg: "#e05a8c", fg: "#fff", blurb: "Controls who gets in, and exactly how far." },
  AUTOMATION: { bg: "#e8b828", fg: "#2a2a2a", blurb: "Makes a thousand endpoints behave like one." },
  FORENSICS: { bg: "#b08a4a", fg: "#fff", blurb: "Digs through memory, disks and logs for the truth." },
  LEADERSHIP: { bg: "#e8742c", fg: "#fff", blurb: "Rallies the party and keeps it organized." },
  ECON: { bg: "#58a848", fg: "#fff", blurb: "Thinks in incentives, trade-offs and data." },
  NORMAL: { bg: "#a8a878", fg: "#fff", blurb: "Plain, dependable, everywhere." },
};

export const trainer = {
  number: "001",
  name: "LIAM MAHONE",
  species: "DEFENDER POKéMON",
  types: ["SECURITY", "ECON"] as DexType[],
  height: "HOUSTON, TX",
  weight: "3.76 GPA",
  entry:
    "Cybersecurity analyst at UT Austin's Regional Security Operations Center. Provisions, secures and maintains a cloud-managed endpoint security platform for multi-tenant Texas public-sector clients. Hands-on with role-based access control, least-privilege tenant separation, cross-platform deployment automation (Intune/GPO, JAMF, Ansible, Bash) and vendor escalations. CDSA-certified and known for explaining technical issues clearly to engineers, vendors and non-technical stakeholders.",
  email: "liammahone3@gmail.com",
  linkedin: "https://linkedin.com/in/liam-mahone",
  linkedinLabel: "linkedin.com/in/liam-mahone",
  location: "Austin / Houston, TX",
  workAuth: "U.S. work authorization, no sponsorship required",
};

export type Move = {
  name: string;
  type: DexType;
  category: "PHYSICAL" | "SPECIAL" | "STATUS";
  pwr: number | "—";
  acc: number;
  pp: number;
  text: string;
};

export const job = {
  where: "UT AUSTIN REGIONAL SECURITY OPERATIONS CENTER (RSOC)",
  title: "Cybersecurity Analyst",
  when: "Jan 2026 – Present",
  place: "Austin, TX",
};

export const moves: Move[] = [
  {
    name: "TENANT SHIELD",
    type: "IDENTITY",
    category: "STATUS",
    pwr: "—",
    acc: 100,
    pp: 30,
    text: "Set up SentinelOne accounts, licensing and admin users in the cloud-managed console for Texas cities, ISDs and public agencies ranging from ~70 to ~1,000 endpoints, enforcing least privilege and keeping each tenant's access separate.",
  },
  {
    name: "SAML SLEUTH",
    type: "IDENTITY",
    category: "SPECIAL",
    pwr: 90,
    acc: 100,
    pp: 10,
    text: "Troubleshot a client SSO login failure by opening a vendor case with full SAML and Microsoft Entra ID details; traced the error to an Entra Conditional Access block and gave the client a 5-step checklist to isolate it.",
  },
  {
    name: "ACCESS CYCLE",
    type: "IDENTITY",
    category: "STATUS",
    pwr: "—",
    acc: 100,
    pp: 40,
    text: "Handle the user access lifecycle: resetting 2FA, re-creating logins, copying role permissions to grant scoped access, and training client admins to add their own users.",
  },
  {
    name: "TOKEN FORGE",
    type: "IDENTITY",
    category: "SPECIAL",
    pwr: 60,
    acc: 100,
    pp: 15,
    text: "Guided a client in creating a read-only service user API token for a Rapid7 integration under least-privilege practices.",
  },
  {
    name: "WAVE DEPLOY",
    type: "AUTOMATION",
    category: "PHYSICAL",
    pwr: 100,
    acc: 95,
    pp: 5,
    text: "Wrote client rollout plans covering a Detect-mode pilot, the move to Protect, wave deployments via Intune/GPO, JAMF and Ansible, legacy antivirus removal, and anti-tamper and agent upgrade policies.",
  },
  {
    name: "FALSE SWIPE",
    type: "FORENSICS",
    category: "SPECIAL",
    pwr: 120,
    acc: 100,
    pp: 5,
    text: "Analyzed a Mac false positive during a ~16,000-endpoint rollout, showing alerts jumped from ~11 to ~71 per hour with unchanged content versions, and worked with SentinelOne engineering to a live fix.",
  },
  {
    name: "ALERT TRIAGE",
    type: "SECURITY",
    category: "PHYSICAL",
    pwr: 80,
    acc: 100,
    pp: 35,
    text: "Triage SIEM/EDR alerts and network traffic, and author wiki knowledge articles and incident reports that standardize team procedures.",
  },
];

export type Ability = { name: string; type: DexType; text: string; skills: string[] };

export const abilities: Ability[] = [
  {
    name: "LEAST PRIVILEGE",
    type: "IDENTITY",
    text: "Nobody gets more access than they need. Ever.",
    skills: [
      "Role-based access control",
      "Least privilege",
      "Multi-tenant access separation",
      "Account provisioning",
      "SSO / SAML",
      "Microsoft Entra ID",
      "Conditional Access",
      "API service accounts",
    ],
  },
  {
    name: "THREAT SENSE",
    type: "SECURITY",
    text: "Notices when something is off before it becomes a problem.",
    skills: [
      "EDR policy & exclusions",
      "SIEM",
      "Threat detection",
      "Incident response",
      "MITRE ATT&CK",
      "CIA triad",
    ],
  },
  {
    name: "MASS DEPLOY",
    type: "AUTOMATION",
    text: "Pushes agents and policy to thousands of machines at once.",
    skills: [
      "SentinelOne",
      "Splunk (SPL)",
      "Elastic SIEM / Kibana",
      "Microsoft Intune",
      "Group Policy",
      "JAMF",
      "Ansible",
      "Volatility 3",
      "KAPE",
    ],
  },
  {
    name: "POLYGLOT",
    type: "NORMAL",
    text: "Speaks fluent shell and gets along with every OS.",
    skills: ["Python", "Bash", "JavaScript", "Windows", "macOS", "Linux", "TCP/IP", "DNS", "HTTP"],
  },
];

// Playful self-assessed base stats (max 255, like the games).
export const baseStats: { label: string; value: number }[] = [
  { label: "IDENTITY", value: 205 },
  { label: "DEFENSE", value: 190 },
  { label: "AUTOMATN", value: 170 },
  { label: "FORENSIC", value: 165 },
  { label: "COMMS", value: 210 },
  { label: "SCRIPTING", value: 140 },
];

export type Badge = { name: string; issuer: string; color: string; shape: "boulder" | "cascade" | "thunder" | "rainbow" | "soul" | "marsh" | "volcano" | "earth"; year?: string };

export const badges: Badge[] = [
  { name: "CDSA", issuer: "HTB Certified Defensive Security Analyst", color: "#58a848", shape: "earth", year: "2026" },
  { name: "SPLUNK POWER USER", issuer: "Splunk Core Certified Power User", color: "#e8742c", shape: "volcano" },
  { name: "EAGLE SCOUT", issuer: "Boy Scouts of America — fewer than 4% of Scouts", color: "#e8b828", shape: "thunder" },
  { name: "MAGNA CUM LAUDE", issuer: "Dean's List, UT Austin (Spring 2026)", color: "#e05a8c", shape: "soul" },
  { name: "AP SCHOLAR", issuer: "AP Scholar with Distinction", color: "#68a0e8", shape: "cascade" },
  { name: "CPR / FIRST AID", issuer: "Certified", color: "#d83838", shape: "rainbow" },
];

export const school = {
  name: "THE UNIVERSITY OF TEXAS AT AUSTIN",
  degree: "B.S. Economics",
  gpa: "3.76",
  honors: "Dean's List, Magna Cum Laude (Spring 2026)",
  when: "Expected May 2028",
  extra: "Certificate in Programming and Computation (in progress)",
  coursework: ["Elements of Software Design (CS 313E)", "Statistics", "Data Analysis"],
};

export type Quest = { name: string; when: string; type: DexType; bullets: string[] };

export const quests: Quest[] = [
  {
    name: "HTB CDSA — EXAM INVESTIGATION",
    when: "2026",
    type: "FORENSICS",
    bullets: [
      "Investigated a simulated enterprise breach across a Windows Active Directory domain (workstation, IIS web server, domain controller) using Elastic SIEM (Kibana), Splunk, Volatility 3 and KAPE artifacts.",
      "Traced identity and credential abuse across MITRE ATT&CK tactics (phishing, lateral movement, UAC bypass, Kerberoasting, Pass-the-Ticket, LSASS credential dumping) and wrote an incident report for technical and business readers.",
    ],
  },
  {
    name: "HACK THE BOX — SHERLOCKS & WEB",
    when: "2026",
    type: "FORENSICS",
    bullets: [
      "Performed Windows disk forensics (registry hives, prefetch, browser artifacts) and web application challenges analyzing HTTP requests, encoding/decoding and client-side JavaScript.",
    ],
  },
];

export const evolution = [
  { stage: "SCOUT", when: "2018", note: "Joined Troop 320" },
  { stage: "LONGHORN", when: "2025", note: "Started at UT Austin" },
  { stage: "ANALYST", when: "2026", note: "Joined UT RSOC" },
  { stage: "CDSA", when: "2026", note: "Certified defender" },
];

export type PartyMember = { name: string; role: string; when: string; lv: number; hp: number; type: DexType; text: string };

export const party: PartyMember[] = [
  {
    name: "EAGLE SCOUT",
    role: "Troop 320 — Patrol Leader",
    when: "Aug 2018 – Present",
    lv: 50,
    hp: 100,
    type: "LEADERSHIP",
    text: "Earned Eagle Scout, Scouting's highest rank (fewer than 4% of Scouts); coordinates Flags Across America, placing ~300 flags on 7 holidays a year and managing inventory, logistics and volunteers.",
  },
  {
    name: "BAND COUNCIL",
    role: "Westside High School — President",
    when: "May 2024 – Jun 2025",
    lv: 42,
    hp: 100,
    type: "LEADERSHIP",
    text: "Selected to lead the council for a 200+ member program; ran meetings and served as liaison between students and staff.",
  },
  {
    name: "LONGHORN BAND",
    role: "Trombone",
    when: "Aug 2025 – Present",
    lv: 38,
    hp: 100,
    type: "NORMAL",
    text: "Performs with one of the largest collegiate marching bands in the U.S. at football games and university events.",
  },
  {
    name: "LEGAL COALITION",
    role: "Longhorn Legal Coalition — Member",
    when: "Jan 2026 – Present",
    lv: 21,
    hp: 100,
    type: "ECON",
    text: "Attends pre-law programming, speaker panels and workshops with attorneys, law students and faculty.",
  },
];

export const sections = [
  { id: "entry", label: "ENTRY", hint: "Dex entry #001", blurb: "Species, type and the official dex entry for trainer #001." },
  { id: "moves", label: "MOVES", hint: "Experience", blurb: "Every move Liam uses on the job at the UT Austin RSOC. Select one to see its stats." },
  { id: "powers", label: "POWERS", hint: "Skills & abilities", blurb: "Base stats and abilities. Mostly IDENTITY and SECURITY type." },
  { id: "badges", label: "BADGES", hint: "Certs & honors", blurb: "Certifications and honors collected on the journey so far." },
  { id: "training", label: "TRAINING", hint: "Education & projects", blurb: "Trainer school, the evolution chain, and HTB side quests." },
  { id: "party", label: "PARTY", hint: "Leadership", blurb: "The teams Liam leads, marches with and learns from." },
  { id: "pc", label: "PC", hint: "Contact & guestbook", blurb: "Boot up the PC to contact Liam or sign the trainer log." },
] as const;

export type SectionId = (typeof sections)[number]["id"];
