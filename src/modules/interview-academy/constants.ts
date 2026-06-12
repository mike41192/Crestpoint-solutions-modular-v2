// =====================================================
// BLOCK: Interview Academy Constants
// Crestpoint Solutions V2
// Version: 1.10.0
// =====================================================

import type {
  InterviewAcademyHeroContent,
  InterviewAcademyTopic,
  InterviewAcademyTrack,
  InterviewAcademyVideo,
} from "./types"

export const INTERVIEW_ACADEMY_HERO: InterviewAcademyHeroContent = {
  eyebrow: "Guided Training",
  title: "Build interview skill before the pressure is on",
  description:
    "Use structured lessons to improve story selection, answer clarity, confidence, and follow-up strategy.",
  nextStepTitle: "Turn lessons into live practice",
  nextStepHref: "/dashboard/interview",
  nextStepLabel: "Open AI Interviewer",
}

export const INTERVIEW_ACADEMY_TRACKS: InterviewAcademyTrack[] = [
  {
    id: "foundations",
    title: "Interview Basics",
    description:
      "Learn how interviews work, what employers evaluate, and how to prepare from the job description.",
    iconKey: "book",
    difficulty: "Foundation",
    href: "/dashboard/interview-academy/foundations",
    ctaLabel: "Start foundations",
    lessons: [
      "Understand the interviewer's goal",
      "Prepare from a job description",
      "Prepare a concise career overview",
      "Research the company and ask strong questions",
    ],
  },
  {
    id: "answer-frameworks",
    title: "STAR Method",
    description:
      "Build clear interview stories with STAR, CAR, SOAR, and resume-to-story translation.",
    iconKey: "target",
    difficulty: "Foundation",
    href: "/dashboard/interview-academy/answer-frameworks",
    ctaLabel: "Build answer frameworks",
    lessons: [
      "Choose strong career stories",
      "Separate situation, task, action, and result",
      "Add measurable outcomes without rambling",
    ],
  },
  {
    id: "confidence-communication",
    title: "Confidence Training",
    description:
      "Improve pacing, body language, video presence, and recovery from difficult questions.",
    iconKey: "mic",
    difficulty: "Intermediate",
    href: "/dashboard/interview-academy/confidence-communication",
    ctaLabel: "Train confidence",
    lessons: [
      "Control pacing and pauses",
      "Handle nerves with prepared openings",
      "Recover from unclear or difficult questions",
    ],
  },
  {
    id: "recruiter-screens",
    title: "Recruiter Screens",
    description:
      "Prepare for early phone screens, salary expectations, logistics, and recruiter red flags.",
    iconKey: "phone",
    difficulty: "Intermediate",
    href: "/dashboard/interview-academy/recruiter-screens",
    ctaLabel: "Prepare screens",
    lessons: [
      "Explain your background clearly",
      "Handle salary expectations professionally",
      "Manage availability, logistics, and next steps",
    ],
  },
  {
    id: "behavioral-interviews",
    title: "Behavioral Interviews",
    description:
      "Prepare stories for conflict, failure, ownership, teamwork, and problem solving.",
    iconKey: "message",
    difficulty: "Intermediate",
    href: "/dashboard/interview-academy/behavioral-interviews",
    ctaLabel: "Practice behaviorals",
    lessons: [
      "Build a story bank",
      "Answer conflict and failure questions",
      "Show ownership, teamwork, and judgment",
    ],
  },
  {
    id: "technical-role-specific",
    title: "Technical and Role-Specific Interviews",
    description:
      "Prepare for job-knowledge, scenario, case, portfolio, and role-specific interview rounds.",
    iconKey: "briefcase",
    difficulty: "Advanced",
    href: "/dashboard/interview-academy/technical-role-specific",
    ctaLabel: "Prepare role rounds",
    lessons: [
      "Translate requirements into likely questions",
      "Explain decisions, tradeoffs, and process",
      "Prepare work samples and role-specific evidence",
    ],
  },
  {
    id: "leadership-management",
    title: "Leadership and Management Interviews",
    description:
      "Show coaching ability, judgment, delegation, accountability, and team impact.",
    iconKey: "users",
    difficulty: "Advanced",
    href: "/dashboard/interview-academy/leadership-management",
    ctaLabel: "Build leadership stories",
    lessons: [
      "Show how you lead through others",
      "Explain conflict, coaching, and accountability",
      "Connect leadership decisions to outcomes",
    ],
  },
  {
    id: "difficult-questions",
    title: "Difficult Questions",
    description:
      "Handle weaknesses, gaps, job changes, rejection history, and curveball questions with control.",
    iconKey: "brain",
    difficulty: "Advanced",
    href: "/dashboard/interview-academy/difficult-questions",
    ctaLabel: "Handle hard questions",
    lessons: [
      "Answer weaknesses with maturity",
      "Explain gaps or transitions",
      "Recover when you do not know the answer",
    ],
  },
  {
    id: "post-interview-follow-up",
    title: "Post-Interview Follow-Up",
    description:
      "Send stronger thank-you notes, follow up at the right time, and keep opportunities warm.",
    iconKey: "clipboard",
    difficulty: "Career Closing",
    href: "/dashboard/interview-academy/post-interview-follow-up",
    ctaLabel: "Plan follow-up",
    lessons: [
      "Write specific thank-you messages",
      "Choose follow-up timing",
      "Keep momentum without sounding pushy",
    ],
  },
  {
    id: "salary-offers-negotiation",
    title: "Salary, Offers, and Negotiation",
    description:
      "Evaluate offers, discuss compensation, negotiate professionally, and decide with confidence.",
    iconKey: "handshake",
    difficulty: "Career Closing",
    href: "/dashboard/interview-academy/salary-offers-negotiation",
    ctaLabel: "Prepare negotiation",
    lessons: [
      "Discuss compensation with recruiters",
      "Evaluate the full offer",
      "Negotiate without damaging trust",
    ],
  },
  {
    id: "ai-mock-interview-practice",
    title: "AI Interview Practice",
    description:
      "Use job descriptions and target roles to practice mock interviews with AI feedback.",
    iconKey: "sparkles",
    difficulty: "Career Closing",
    href: "/dashboard/interview",
    ctaLabel: "Open AI Interviewer",
    lessons: [
      "Use target roles for question context",
      "Review answer quality signals",
      "Convert feedback into next practice actions",
    ],
  },
]

function createSearchEmbed(query: string) {
  return `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(query)}`
}

function createSearchWatchUrl(query: string) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
}

function video(title: string, query: string, objective: string): InterviewAcademyVideo {
  return {
    title,
    provider: "YouTube",
    embedUrl: createSearchEmbed(query),
    watchUrl: createSearchWatchUrl(query),
    durationLabel: "Curated search",
    description:
      "A curated public-video search for this lesson topic. Replace with a specific approved embed URL when preferred.",
    objective,
  }
}

export const INTERVIEW_ACADEMY_TOPICS: InterviewAcademyTopic[] = [
  {
    id: "foundations",
    title: "Interview Foundations",
    subtitle: "Know what employers evaluate before you start answering.",
    description:
      "Build the baseline skills every job seeker needs: preparation, role alignment, communication, company research, and closing questions.",
    difficulty: "Foundation",
    iconKey: "book",
    videos: [
      video(
        "What interviewers look for",
        "what interviewers look for in a job interview career advice",
        "Understand fit, evidence, communication, and preparation signals.",
      ),
      video(
        "Tell me about yourself",
        "how to answer tell me about yourself job interview",
        "Build a concise opening answer connected to the target role.",
      ),
    ],
    guide: [
      {
        title: "Start from the job description",
        body:
          "Interview preparation begins by identifying the skills, responsibilities, tools, and outcomes the employer repeats. Those signals become your likely question categories and your proof points.",
      },
      {
        title: "Interviewers evaluate evidence, not claims",
        body:
          "Strong candidates back up strengths with examples. Instead of saying you are organized, explain a time your organization improved speed, quality, customer outcomes, or team clarity.",
      },
      {
        title: "Close like a professional",
        body:
          "Prepare questions about success expectations, team priorities, process, and next steps. Strong questions show judgment and help you evaluate the opportunity.",
      },
    ],
    interviewerSignals: [
      "Preparation from the job description",
      "Clear professional summary",
      "Relevant examples",
      "Communication and listening",
      "Thoughtful closing questions",
    ],
    commonMistakes: [
      "Giving a generic career overview",
      "Talking through the resume without connecting to the role",
      "Asking no questions at the end",
      "Failing to research the company or team",
    ],
    preparationChecklist: [
      "Highlight the top five job requirements",
      "Prepare a 60-second career overview",
      "Choose three stories that match the role",
      "Write five questions to ask the interviewer",
    ],
    practiceDrills: [
      "Record a 60-second answer to tell me about yourself.",
      "Turn one job requirement into a story from your experience.",
      "Practice asking two company-specific questions out loud.",
    ],
    aiPracticePrompt:
      "Ask me foundation interview questions for this role. Focus on job fit, tell me about yourself, company interest, and closing questions.",
    relatedTopicIds: [
      "answer-frameworks",
      "recruiter-screens",
      "ai-mock-interview-practice",
    ],
  },
  {
    id: "answer-frameworks",
    title: "Answer Frameworks",
    subtitle: "Use structure so your experience is easy to trust.",
    description:
      "Master STAR, CAR, SOAR, and story selection so behavioral answers are clear, specific, and outcome-oriented.",
    difficulty: "Foundation",
    iconKey: "target",
    videos: [
      video(
        "STAR method interview answers",
        "STAR method interview answer examples",
        "Learn how to separate situation, task, action, and result.",
      ),
      video(
        "Behavioral interview story bank",
        "behavioral interview story bank examples",
        "Choose reusable stories for common interview competencies.",
      ),
    ],
    guide: [
      {
        title: "STAR is a clarity tool",
        body:
          "Use Situation and Task briefly, spend most time on Action, and close with a measurable Result. The interviewer needs to know what you personally did and why it mattered.",
      },
      {
        title: "CAR and SOAR are alternatives",
        body:
          "CAR works for concise screen answers. SOAR works when you need to show obstacles and ownership. The framework matters less than whether the answer is specific and credible.",
      },
      {
        title: "Build stories from resume bullets",
        body:
          "Each strong resume bullet can become an interview story if you know the problem, action, tools, stakeholders, and outcome behind it.",
      },
    ],
    interviewerSignals: [
      "Specific situation",
      "Personal ownership",
      "Relevant actions",
      "Measurable result",
      "Reflection or learning",
    ],
    commonMistakes: [
      "Spending too long on background",
      "Saying we instead of I for personal contribution",
      "Forgetting the result",
      "Using vague claims without evidence",
    ],
    preparationChecklist: [
      "Prepare five STAR stories",
      "Map each story to two or more competencies",
      "Add measurable results where truthful",
      "Practice each story in under two minutes",
    ],
    practiceDrills: [
      "Rewrite one resume bullet as a STAR story.",
      "Answer a conflict question using only 90 seconds.",
      "Take one story and adapt it for leadership, teamwork, and problem solving.",
    ],
    aiPracticePrompt:
      "Ask me behavioral questions and grade my answer using STAR. Push me to add measurable results and clearer personal ownership.",
    relatedTopicIds: [
      "behavioral-interviews",
      "leadership-management",
      "difficult-questions",
    ],
  },
  {
    id: "confidence-communication",
    title: "Confidence and Communication",
    subtitle: "Sound prepared, calm, and clear without sounding scripted.",
    description:
      "Improve pacing, pauses, video presence, body language, nervous-system control, and recovery from difficult questions.",
    difficulty: "Intermediate",
    iconKey: "mic",
    videos: [
      video(
        "Interview confidence and body language",
        "job interview confidence body language tips",
        "Improve presence, eye contact, pacing, and professional energy.",
      ),
      video(
        "Video interview preparation",
        "video interview tips job interview preparation",
        "Prepare camera, environment, eye line, notes, and delivery.",
      ),
    ],
    guide: [
      {
        title: "Confidence comes from structure",
        body:
          "You do not need to memorize answers. You need repeatable openings, story outlines, and a recovery phrase when you need time to think.",
      },
      {
        title: "Slow down on purpose",
        body:
          "Nervous candidates often rush. A short pause before answering makes you sound thoughtful and gives you time to choose the right story.",
      },
      {
        title: "Video interviews require staging",
        body:
          "Test lighting, camera height, sound, background, and notes before the interview. Your setup should reduce friction, not become part of the performance.",
      },
    ],
    interviewerSignals: [
      "Clear speech",
      "Professional energy",
      "Active listening",
      "Calm recovery after hard questions",
      "Appropriate eye contact and pacing",
    ],
    commonMistakes: [
      "Speaking too fast",
      "Over-apologizing when uncertain",
      "Reading from notes",
      "Letting one hard question derail the interview",
    ],
    preparationChecklist: [
      "Prepare a calm opening answer",
      "Practice one recovery phrase",
      "Test video setup before the interview",
      "Record and review a two-minute practice answer",
    ],
    practiceDrills: [
      "Answer one question with a two-second pause before speaking.",
      "Practice a recovery phrase for a question you cannot answer immediately.",
      "Record a video answer and check eye line, pace, and filler words.",
    ],
    aiPracticePrompt:
      "Ask me interview questions one at a time. After each answer, coach my clarity, pacing, confidence, and conciseness.",
    relatedTopicIds: [
      "foundations",
      "difficult-questions",
      "ai-mock-interview-practice",
    ],
  },
  {
    id: "recruiter-screens",
    title: "Recruiter Screens",
    subtitle: "Pass the first gate with clarity and professionalism.",
    description:
      "Prepare for early phone screens, background summaries, compensation questions, logistics, and recruiter follow-up.",
    difficulty: "Intermediate",
    iconKey: "phone",
    videos: [
      video(
        "Recruiter phone screen preparation",
        "recruiter phone screen interview tips",
        "Understand what recruiters screen for and how to answer efficiently.",
      ),
      video(
        "Salary expectations recruiter screen",
        "how to answer salary expectations recruiter screen",
        "Handle compensation questions without weakening your position.",
      ),
    ],
    guide: [
      {
        title: "Recruiters qualify fit and logistics",
        body:
          "Recruiter screens often check role fit, compensation range, availability, location, communication, and whether you understand the job.",
      },
      {
        title: "Keep answers concise",
        body:
          "Early screens are not the place for every detail. Give enough proof to move forward and save deeper examples for hiring manager rounds.",
      },
      {
        title: "Know your non-negotiables",
        body:
          "Prepare your compensation range, schedule constraints, work authorization, location needs, and start-date expectations before the call.",
      },
    ],
    interviewerSignals: [
      "Role alignment",
      "Clear compensation expectations",
      "Professional communication",
      "Availability and logistics",
      "Interest in next steps",
    ],
    commonMistakes: [
      "Rambling through the full resume",
      "Giving an unresearched salary number",
      "Sounding unsure why the role is a fit",
      "Not asking about process or timeline",
    ],
    preparationChecklist: [
      "Prepare a 45-second background summary",
      "Know your target salary range",
      "Confirm availability and work preferences",
      "Prepare two role-fit questions",
    ],
    practiceDrills: [
      "Practice a recruiter screen in five minutes.",
      "Answer salary expectations three different ways.",
      "Explain why this role fits your background in 30 seconds.",
    ],
    aiPracticePrompt:
      "Run a recruiter phone screen for this role. Ask about my background, salary expectations, availability, and interest.",
    relatedTopicIds: [
      "foundations",
      "salary-offers-negotiation",
      "post-interview-follow-up",
    ],
  },
  {
    id: "behavioral-interviews",
    title: "Behavioral Interviews",
    subtitle: "Prove how you act when work gets real.",
    description:
      "Prepare high-quality stories for conflict, failure, ownership, teamwork, problem solving, and customer situations.",
    difficulty: "Intermediate",
    iconKey: "message",
    videos: [
      video(
        "Behavioral interview questions and answers",
        "behavioral interview questions and answers examples",
        "See how common behavioral questions are structured and evaluated.",
      ),
      video(
        "Conflict and failure interview answers",
        "how to answer conflict failure interview questions",
        "Prepare mature answers for difficult behavioral prompts.",
      ),
    ],
    guide: [
      {
        title: "Behavioral questions test patterns",
        body:
          "Interviewers ask about past behavior because it gives evidence of judgment, accountability, communication, and problem solving.",
      },
      {
        title: "Your story bank should be reusable",
        body:
          "One strong story can answer several questions if you know which competency it proves. Tag each story by ownership, conflict, teamwork, leadership, and results.",
      },
      {
        title: "Failure answers need maturity",
        body:
          "A strong failure answer names the mistake, explains the fix, shows learning, and avoids blaming others.",
      },
    ],
    interviewerSignals: [
      "Self-awareness",
      "Conflict resolution",
      "Ownership",
      "Team collaboration",
      "Learning from mistakes",
    ],
    commonMistakes: [
      "Blaming coworkers or managers",
      "Choosing stories with no stakes",
      "Skipping the result",
      "Sounding rehearsed but not reflective",
    ],
    preparationChecklist: [
      "Prepare stories for conflict, failure, teamwork, ownership, and problem solving",
      "Identify the competency each story proves",
      "Write the result for every story",
      "Practice follow-up questions",
    ],
    practiceDrills: [
      "Answer a conflict question without blaming anyone.",
      "Turn a failure story into a learning story.",
      "Explain one teamwork example with your personal contribution clearly.",
    ],
    aiPracticePrompt:
      "Ask me behavioral questions about conflict, failure, ownership, teamwork, and problem solving. Challenge vague answers.",
    relatedTopicIds: [
      "answer-frameworks",
      "difficult-questions",
      "leadership-management",
    ],
  },
  {
    id: "technical-role-specific",
    title: "Technical and Role-Specific Interviews",
    subtitle: "Show you can do the actual work.",
    description:
      "Prepare for role-specific knowledge, scenario questions, case prompts, portfolio walkthroughs, and practical tradeoffs.",
    difficulty: "Advanced",
    iconKey: "briefcase",
    videos: [
      video(
        "Technical interview preparation by role",
        "technical interview preparation role specific interview tips",
        "Prepare for job knowledge and problem-solving interviews.",
      ),
      video(
        "Case and scenario interview tips",
        "case interview scenario interview tips job interview",
        "Practice structuring ambiguous work scenarios.",
      ),
    ],
    guide: [
      {
        title: "Role-specific interviews test job judgment",
        body:
          "These rounds ask whether you understand the work, can explain tradeoffs, and can apply skills to realistic situations.",
      },
      {
        title: "Use the job description as a question map",
        body:
          "Every responsibility can become a scenario question. Prepare examples, process explanations, tools, metrics, and decisions for each major requirement.",
      },
      {
        title: "Explain your thinking",
        body:
          "For technical, case, or role-specific questions, the interviewer often evaluates how you reason, clarify assumptions, and adapt.",
      },
    ],
    interviewerSignals: [
      "Job knowledge",
      "Structured thinking",
      "Tradeoff awareness",
      "Relevant tools or methods",
      "Role-specific outcomes",
    ],
    commonMistakes: [
      "Memorizing facts without explaining decisions",
      "Ignoring assumptions",
      "Not connecting answers to business impact",
      "Failing to prepare examples from the target role",
    ],
    preparationChecklist: [
      "Convert responsibilities into likely questions",
      "Prepare examples for top role requirements",
      "Practice explaining process and tradeoffs",
      "Prepare work samples or portfolio notes if relevant",
    ],
    practiceDrills: [
      "Pick one job requirement and explain how you would approach it.",
      "Walk through a decision you made and the tradeoffs involved.",
      "Practice asking clarifying questions before answering a scenario.",
    ],
    aiPracticePrompt:
      "Use this job description to ask role-specific scenario questions. Evaluate my process, assumptions, tradeoffs, and business impact.",
    relatedTopicIds: [
      "foundations",
      "behavioral-interviews",
      "leadership-management",
    ],
  },
  {
    id: "leadership-management",
    title: "Leadership and Management Interviews",
    subtitle: "Prove you can lead people, priorities, and outcomes.",
    description:
      "Prepare for coaching, delegation, accountability, stakeholder management, conflict, and team performance questions.",
    difficulty: "Advanced",
    iconKey: "users",
    videos: [
      video(
        "Leadership interview questions and answers",
        "leadership interview questions and answers management",
        "Prepare for leadership, coaching, and team-impact questions.",
      ),
      video(
        "Management interview preparation",
        "management interview preparation coaching delegation accountability",
        "Practice manager-level stories and decision examples.",
      ),
    ],
    guide: [
      {
        title: "Leadership answers must show outcomes through others",
        body:
          "Interviewers want to know how you coach, delegate, align people, resolve conflict, and create measurable team results.",
      },
      {
        title: "Use people plus performance evidence",
        body:
          "Strong leadership stories include the human context and the business result. Show empathy, standards, and follow-through.",
      },
      {
        title: "Prepare judgment stories",
        body:
          "Leadership interviews often test how you make decisions under ambiguity, manage tradeoffs, and communicate difficult decisions.",
      },
    ],
    interviewerSignals: [
      "Coaching ability",
      "Delegation and accountability",
      "Stakeholder communication",
      "Conflict management",
      "Team outcomes",
    ],
    commonMistakes: [
      "Talking about authority instead of influence",
      "Ignoring the team impact",
      "Taking all credit",
      "Avoiding difficult people-management moments",
    ],
    preparationChecklist: [
      "Prepare coaching, conflict, delegation, and accountability stories",
      "Know team size, metrics, and outcomes",
      "Prepare a difficult decision example",
      "Practice explaining your leadership philosophy",
    ],
    practiceDrills: [
      "Answer how you handled an underperforming team member.",
      "Explain a time you influenced without authority.",
      "Describe a leadership decision that had tradeoffs.",
    ],
    aiPracticePrompt:
      "Interview me for a leadership role. Ask about coaching, delegation, conflict, accountability, and stakeholder communication.",
    relatedTopicIds: [
      "behavioral-interviews",
      "difficult-questions",
      "salary-offers-negotiation",
    ],
  },
  {
    id: "difficult-questions",
    title: "Difficult Questions",
    subtitle: "Stay composed when the question is uncomfortable.",
    description:
      "Handle weaknesses, employment gaps, job changes, termination, lack of experience, curveballs, and questions you cannot answer immediately.",
    difficulty: "Advanced",
    iconKey: "brain",
    videos: [
      video(
        "How to answer weakness interview question",
        "how to answer what is your weakness interview question",
        "Answer weakness questions with self-awareness and growth.",
      ),
      video(
        "How to answer employment gaps interview",
        "how to explain employment gap job interview",
        "Handle gaps and transitions directly and professionally.",
      ),
    ],
    guide: [
      {
        title: "Difficult questions test composure",
        body:
          "The interviewer is often evaluating self-awareness, honesty, ownership, and whether you can communicate under pressure.",
      },
      {
        title: "Use direct, brief, forward-moving answers",
        body:
          "Name the issue, give enough context, show what changed, and redirect toward readiness for the role.",
      },
      {
        title: "You can pause",
        body:
          "A thoughtful pause is better than a rushed weak answer. Use a recovery phrase to buy time and choose the right structure.",
      },
    ],
    interviewerSignals: [
      "Self-awareness",
      "Accountability",
      "Composure",
      "Growth mindset",
      "Professional boundaries",
    ],
    commonMistakes: [
      "Overexplaining sensitive details",
      "Blaming others",
      "Pretending to have no weaknesses",
      "Sounding defensive or evasive",
    ],
    preparationChecklist: [
      "Prepare answers for weakness, gap, transition, and failure questions",
      "Write a recovery phrase",
      "Keep sensitive answers short and professional",
      "Practice redirecting to the role",
    ],
    practiceDrills: [
      "Answer a weakness question in under 60 seconds.",
      "Explain a gap without overexplaining.",
      "Practice saying you do not know while showing how you would find the answer.",
    ],
    aiPracticePrompt:
      "Ask me difficult interview questions about weaknesses, gaps, transitions, failure, and lack of experience. Coach my composure and ownership.",
    relatedTopicIds: [
      "confidence-communication",
      "behavioral-interviews",
      "recruiter-screens",
    ],
  },
  {
    id: "post-interview-follow-up",
    title: "Post-Interview Follow-Up",
    subtitle: "Keep momentum after the conversation ends.",
    description:
      "Learn thank-you messages, follow-up timing, recruiter updates, post-interview notes, and how to stay top-of-mind professionally.",
    difficulty: "Career Closing",
    iconKey: "clipboard",
    videos: [
      video(
        "Job interview thank you email",
        "job interview thank you email follow up tips",
        "Write specific follow-ups that reinforce fit and interest.",
      ),
      video(
        "When to follow up after interview",
        "when to follow up after job interview",
        "Choose timing that is professional and effective.",
      ),
    ],
    guide: [
      {
        title: "Follow-up is part of interview performance",
        body:
          "A strong thank-you note reinforces your understanding of the role, reminds them of your strongest evidence, and keeps the process warm.",
      },
      {
        title: "Specific beats generic",
        body:
          "Mention a conversation detail, connect your experience to the team need, and restate interest without sounding desperate.",
      },
      {
        title: "Track next steps",
        body:
          "Record the interview date, names, promised timeline, follow-up date, and any notes that can help future rounds.",
      },
    ],
    interviewerSignals: [
      "Professional follow-through",
      "Attention to details",
      "Continued interest",
      "Communication quality",
      "Respect for timeline",
    ],
    commonMistakes: [
      "Sending a generic note",
      "Following up too aggressively",
      "Not tracking promised timelines",
      "Failing to reference the actual conversation",
    ],
    preparationChecklist: [
      "Write a thank-you template before the interview",
      "Record key conversation notes immediately after",
      "Set a follow-up reminder",
      "Prepare a concise status-check message",
    ],
    practiceDrills: [
      "Write a thank-you note using one interview detail.",
      "Create a follow-up message for no response after one week.",
      "Summarize the interview in three bullet notes for your tracker.",
    ],
    aiPracticePrompt:
      "Help me write a thank-you note and follow-up plan based on this interview context and target role.",
    relatedTopicIds: [
      "recruiter-screens",
      "salary-offers-negotiation",
      "ai-mock-interview-practice",
    ],
  },
  {
    id: "salary-offers-negotiation",
    title: "Salary, Offers, and Negotiation",
    subtitle: "Evaluate the offer and negotiate with professionalism.",
    description:
      "Prepare for compensation conversations, offer comparison, negotiation language, benefits, tradeoffs, and final decision-making.",
    difficulty: "Career Closing",
    iconKey: "handshake",
    videos: [
      video(
        "Salary negotiation job offer tips",
        "salary negotiation job offer tips career advice",
        "Learn negotiation timing, framing, and professional language.",
      ),
      video(
        "How to evaluate a job offer",
        "how to evaluate a job offer benefits salary negotiation",
        "Compare compensation, benefits, growth, risk, and lifestyle factors.",
      ),
    ],
    guide: [
      {
        title: "Negotiation starts before the offer",
        body:
          "Know your range, priorities, and market context before compensation comes up. The goal is alignment, not confrontation.",
      },
      {
        title: "Evaluate the full package",
        body:
          "Salary matters, but also consider benefits, bonus, equity, schedule, commute, growth, manager quality, and stability.",
      },
      {
        title: "Use collaborative language",
        body:
          "Strong negotiation language is specific, appreciative, and evidence-based. It protects the relationship while advocating for your value.",
      },
    ],
    interviewerSignals: [
      "Professional communication",
      "Market awareness",
      "Clear priorities",
      "Respectful negotiation",
      "Decision readiness",
    ],
    commonMistakes: [
      "Giving a number too early without context",
      "Negotiating emotionally",
      "Ignoring benefits and tradeoffs",
      "Accepting before reviewing details",
    ],
    preparationChecklist: [
      "Research target compensation range",
      "List must-haves and nice-to-haves",
      "Prepare negotiation language",
      "Review full offer details before deciding",
    ],
    practiceDrills: [
      "Practice answering salary expectations.",
      "Write a counteroffer message.",
      "Compare two hypothetical offers by total value and growth.",
    ],
    aiPracticePrompt:
      "Role-play an offer and salary negotiation. Help me answer compensation questions and evaluate tradeoffs professionally.",
    relatedTopicIds: [
      "recruiter-screens",
      "post-interview-follow-up",
      "leadership-management",
    ],
  },
]
