// =====================================================
// BLOCK: ATS Controlled Test Fixtures
// Crestpoint Solutions V2
// Version: 1.6.3-test
// =====================================================

import type { ResumeBuilderFormData } from "@/modules/resume-builder"

export type ATSTestFixture = {
  id: string
  title: string
  expectedIndustry: string
  expectedQuality: "poor" | "weak" | "moderate" | "strong" | "excellent"
  resume: ResumeBuilderFormData
  jobDescription: string
}

// =====================================================
// BLOCK: Shared Job Descriptions
// =====================================================

export const manufacturingMaintenanceManagerJob = `
Job Title: Maintenance Manager

Education:
Associate Degree in Industrial Maintenance, Manufacturing Technology,
Mechanical Technology, Engineering Technology, or related field preferred.

Experience:
5+ years maintenance experience.
2+ years supervisory experience within manufacturing operations.

Required Skills:
Preventive maintenance, CMMS, root cause analysis, equipment troubleshooting,
mechanical maintenance, electrical troubleshooting, work orders, safety compliance,
OSHA, lockout tagout, production equipment, inventory management, vendor management,
team leadership, staff training, scheduling, continuous improvement.

Preferred:
Lean manufacturing, Six Sigma, PLC troubleshooting, hydraulic systems,
pneumatic systems, forklift certification.
`

export const softwareEngineerJob = `
Job Title: Software Engineer

Required Skills:
TypeScript, JavaScript, React, Next.js, API integration, database design,
GitHub, debugging, security, dashboard development, Supabase, Vercel.

Preferred:
Cloud deployment, authentication, Stripe, automated testing, scalable architecture.
`

export const customerSuccessJob = `
Job Title: Customer Success Specialist

Required Skills:
Customer relationship management, CRM, account management, sales, customer success,
pipeline management, communication, retention, onboarding, problem solving.

Preferred:
HubSpot, Salesforce, lead generation, negotiation, performance tracking.
`

// =====================================================
// BLOCK: Resume Fixtures
// =====================================================

export const atsTestFixtures: ATSTestFixture[] = [
  {
    id: "manufacturing-strong-match",
    title: "Manufacturing Maintenance Manager - Strong Match",
    expectedIndustry: "Manufacturing / Maintenance",
    expectedQuality: "excellent",
    jobDescription: manufacturingMaintenanceManagerJob,
    resume: {
      contact: {
        fullName: "Jordan Miller",
        email: "jordan.miller@example.com",
        phone: "555-222-1010",
        location: "Decatur, IL",
        linkedIn: "https://linkedin.com/in/jordanmiller",
        website: "",
      },
      summary:
        "Maintenance Manager with 8 years of manufacturing maintenance experience, including preventive maintenance, CMMS administration, root cause analysis, and production equipment troubleshooting. Skilled in leading maintenance teams, reducing downtime, improving safety compliance, and coordinating vendors, inventory, and work orders in fast-paced manufacturing environments.",
      experience: [
        {
          id: "manufacturing-strong-exp-1",
          company: "Midwest Manufacturing Group",
          role: "Maintenance Supervisor",
          location: "Decatur, IL",
          startDate: "2020",
          endDate: "Present",
          bullets: [
            "Supervised a team of 12 maintenance technicians across daily production equipment support and preventive maintenance schedules.",
            "Reduced machine downtime by 18% through root cause analysis, CMMS work order tracking, and improved maintenance planning.",
            "Managed OSHA safety compliance, lockout tagout procedures, and weekly safety inspections across production lines.",
            "Coordinated vendor management, parts inventory, hydraulic systems repair, and pneumatic systems troubleshooting.",
            "Trained 6 new technicians on equipment troubleshooting, work orders, and preventive maintenance procedures.",
          ],
        },
        {
          id: "manufacturing-strong-exp-2",
          company: "Central Equipment Services",
          role: "Maintenance Technician",
          location: "Springfield, IL",
          startDate: "2016",
          endDate: "2020",
          bullets: [
            "Performed mechanical maintenance, electrical troubleshooting, and production equipment repair.",
            "Completed over 1,200 CMMS work orders while supporting lean manufacturing and continuous improvement projects.",
            "Maintained forklifts, conveyors, pumps, motors, and pneumatic equipment with strong safety compliance.",
          ],
        },
      ],
      education: [
        {
          id: "manufacturing-strong-edu-1",
          school: "Richland Community College",
          degree: "Associate Degree",
          field: "Industrial Maintenance Technology",
          graduationDate: "2016",
        },
      ],
      skills: [
        "Preventive Maintenance",
        "CMMS",
        "Root Cause Analysis",
        "Equipment Troubleshooting",
        "Mechanical Maintenance",
        "Electrical Troubleshooting",
        "Work Orders",
        "OSHA",
        "Lockout Tagout",
        "Safety Compliance",
        "Hydraulic Systems",
        "Pneumatic Systems",
        "Team Leadership",
        "Inventory Management",
        "Vendor Management",
        "Continuous Improvement",
      ],
      certifications: ["OSHA 30", "Forklift Certification", "Lockout Tagout"],
    },
  },

  {
    id: "manufacturing-keyword-only",
    title: "Manufacturing Resume - Keyword Stuffed / Weak Evidence",
    expectedIndustry: "Manufacturing / Maintenance",
    expectedQuality: "moderate",
    jobDescription: manufacturingMaintenanceManagerJob,
    resume: {
      contact: {
        fullName: "Casey Roberts",
        email: "casey.roberts@example.com",
        phone: "555-333-2020",
        location: "Peoria, IL",
        linkedIn: "",
        website: "",
      },
      summary:
        "Maintenance professional with experience in manufacturing, safety, maintenance, leadership, equipment, troubleshooting, CMMS, OSHA, preventive maintenance, and production.",
      experience: [
        {
          id: "manufacturing-keyword-exp-1",
          company: "Industrial Services LLC",
          role: "Maintenance Worker",
          location: "Peoria, IL",
          startDate: "2021",
          endDate: "Present",
          bullets: [
            "Worked on equipment and helped team with daily tasks.",
            "Handled maintenance duties as assigned.",
            "Supported production and followed safety rules.",
          ],
        },
      ],
      education: [
        {
          id: "manufacturing-keyword-edu-1",
          school: "Peoria Technical Center",
          degree: "Certificate",
          field: "General Maintenance",
          graduationDate: "2020",
        },
      ],
      skills: [
        "Maintenance",
        "Manufacturing",
        "CMMS",
        "OSHA",
        "Troubleshooting",
        "Leadership",
        "Safety",
        "Production",
      ],
      certifications: [],
    },
  },

  {
    id: "manufacturing-poor-match",
    title: "Manufacturing Job - Poor Resume Match",
    expectedIndustry: "General Professional",
    expectedQuality: "poor",
    jobDescription: manufacturingMaintenanceManagerJob,
    resume: {
      contact: {
        fullName: "Taylor Green",
        email: "",
        phone: "",
        location: "Chicago, IL",
        linkedIn: "",
        website: "",
      },
      summary: "Reliable worker looking for a good job.",
      experience: [
        {
          id: "manufacturing-poor-exp-1",
          company: "Retail Mart",
          role: "Cashier",
          location: "Chicago, IL",
          startDate: "2022",
          endDate: "Present",
          bullets: [
            "Helped customers.",
            "Handled checkout.",
            "Kept work area clean.",
          ],
        },
      ],
      education: [],
      skills: ["Customer Service", "Teamwork"],
      certifications: [],
    },
  },

  {
    id: "software-strong-match",
    title: "Software Engineer - Strong Match",
    expectedIndustry: "Information Technology",
    expectedQuality: "excellent",
    jobDescription: softwareEngineerJob,
    resume: {
      contact: {
        fullName: "Alex Chen",
        email: "alex.chen@example.com",
        phone: "555-444-3030",
        location: "Remote",
        linkedIn: "https://linkedin.com/in/alexchen",
        website: "https://alexchen.dev",
      },
      summary:
        "Software Engineer specializing in TypeScript, React, Next.js, API integration, authentication, Supabase, and Vercel deployments. Experienced building scalable dashboards, secure user workflows, and production-ready web applications.",
      experience: [
        {
          id: "software-strong-exp-1",
          company: "CloudApps Studio",
          role: "Software Engineer",
          location: "Remote",
          startDate: "2021",
          endDate: "Present",
          bullets: [
            "Built production Next.js dashboards using TypeScript, React, Supabase, and Vercel.",
            "Implemented authentication, database design, API integration, and secure user session handling.",
            "Reduced dashboard load time by 32% through component refactoring and query optimization.",
            "Used GitHub workflows, debugging tools, and code reviews to improve release stability.",
          ],
        },
      ],
      education: [
        {
          id: "software-strong-edu-1",
          school: "State University",
          degree: "Bachelor of Science",
          field: "Computer Science",
          graduationDate: "2020",
        },
      ],
      skills: [
        "TypeScript",
        "JavaScript",
        "React",
        "Next.js",
        "API Integration",
        "Database Design",
        "GitHub",
        "Debugging",
        "Security",
        "Supabase",
        "Vercel",
      ],
      certifications: [],
    },
  },

  {
    id: "software-poor-match",
    title: "Software Job - Poor Resume Match",
    expectedIndustry: "Sales / Customer Success",
    expectedQuality: "weak",
    jobDescription: softwareEngineerJob,
    resume: {
      contact: {
        fullName: "Morgan Sales",
        email: "morgan.sales@example.com",
        phone: "555-555-4040",
        location: "Dallas, TX",
        linkedIn: "",
        website: "",
      },
      summary:
        "Customer success professional with experience supporting accounts, sales pipelines, and client onboarding.",
      experience: [
        {
          id: "software-poor-exp-1",
          company: "GrowthCRM",
          role: "Customer Success Associate",
          location: "Dallas, TX",
          startDate: "2021",
          endDate: "Present",
          bullets: [
            "Managed customer accounts and supported CRM updates.",
            "Improved onboarding follow-up process for new clients.",
            "Worked with sales team to maintain pipeline records.",
          ],
        },
      ],
      education: [],
      skills: ["CRM", "Customer Success", "Sales", "Account Management"],
      certifications: [],
    },
  },

  {
    id: "customer-success-strong-match",
    title: "Customer Success - Strong Match",
    expectedIndustry: "Sales / Customer Success",
    expectedQuality: "strong",
    jobDescription: customerSuccessJob,
    resume: {
      contact: {
        fullName: "Jamie Parker",
        email: "jamie.parker@example.com",
        phone: "555-666-5050",
        location: "Austin, TX",
        linkedIn: "https://linkedin.com/in/jamieparker",
        website: "",
      },
      summary:
        "Customer Success Specialist with 5 years of experience in CRM management, account management, onboarding, retention, pipeline support, and customer relationship management. Skilled in HubSpot, Salesforce, communication, and performance tracking.",
      experience: [
        {
          id: "customer-success-exp-1",
          company: "ClientFlow SaaS",
          role: "Customer Success Specialist",
          location: "Austin, TX",
          startDate: "2019",
          endDate: "Present",
          bullets: [
            "Managed 85 customer accounts using HubSpot and Salesforce while improving retention by 14%.",
            "Led onboarding for new clients and reduced time-to-value by 22%.",
            "Partnered with sales to improve pipeline management and renewal forecasting.",
            "Resolved customer issues through clear communication, documentation, and follow-up workflows.",
          ],
        },
      ],
      education: [
        {
          id: "customer-success-edu-1",
          school: "Austin Community College",
          degree: "Associate Degree",
          field: "Business Administration",
          graduationDate: "2018",
        },
      ],
      skills: [
        "Customer Success",
        "Customer Relationship Management",
        "CRM",
        "Account Management",
        "Pipeline Management",
        "Sales",
        "HubSpot",
        "Salesforce",
        "Communication",
        "Retention",
      ],
      certifications: [],
    },
  },

  {
    id: "blank-resume-control",
    title: "Blank Resume Control",
    expectedIndustry: "General Professional",
    expectedQuality: "poor",
    jobDescription: manufacturingMaintenanceManagerJob,
    resume: {
      contact: {
        fullName: "",
        email: "",
        phone: "",
        location: "",
        linkedIn: "",
        website: "",
      },
      summary: "",
      experience: [],
      education: [],
      skills: [],
      certifications: [],
    },
  },
]

// =====================================================
// BLOCK: Helper Lookup
// =====================================================

export function getATSTestFixtureById(id: string) {
  return atsTestFixtures.find((fixture) => fixture.id === id)
}
