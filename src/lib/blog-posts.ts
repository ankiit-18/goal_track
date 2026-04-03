export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readingTime: string;
  publishedAt: string;
  content: string[];
};

const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-stay-consistent-when-motivation-drops",
    title: "How to stay consistent when motivation drops",
    excerpt:
      "Build consistency with systems, not mood. Learn a practical rhythm you can repeat even on low-energy days.",
    category: "Consistency",
    readingTime: "12 min read",
    publishedAt: "2026-04-03",
    content: [
      "Motivation is useful, but it is not reliable. Consistency comes from reducing friction so you can act even when you do not feel inspired.",
      "Start with actions that are small enough to never feel heavy. If your routine is too ambitious, you will skip it. If it is clear and short, you will show up.",
      "Tie your work to a fixed trigger. For example, start your focus block immediately after breakfast, or review your goals every Sunday evening.",
      "Track only meaningful completion signals. In GoalTrack, that means finishing stages and honoring weekly habits, not collecting random busy tasks.",
      "When you miss a day, avoid the spiral. Reset quickly and protect the next step. Long-term consistency is built by fast recovery, not perfection.",
      "Define your minimum standard for tough days. Your minimum can be as small as ten minutes of focused work, one review note, or one completed habit. The key is preserving identity and rhythm.",
      "Create visual accountability. Keep your next stage, weekly focus habit, and current deadline visible in one place. Visibility reduces mental load and keeps you from drifting into reactive work.",
      "Use environment design. Place your study material, work tools, and planning dashboard where starting becomes easier than delaying. Convenience quietly drives consistency.",
      "Avoid all-or-nothing language. Replace 'I ruined the week' with 'I missed one block and can recover now.' The language you use changes whether you restart quickly or procrastinate longer.",
      "Every weekend, review what made consistency easier and what made it harder. Remove one blocker each week. Over a few months, your system becomes lighter and more sustainable.",
    ],
  },
  {
    slug: "time-management-for-goal-builders",
    title: "Time management for goal builders",
    excerpt:
      "Manage time with priorities, protected focus blocks, and realistic weekly planning.",
    category: "Time Management",
    readingTime: "13 min read",
    publishedAt: "2026-04-03",
    content: [
      "Good time management starts with deciding what does not matter this week. Without clear exclusion, your calendar fills with noise.",
      "Pick one priority goal and assign deep-work blocks to it before scheduling everything else. Protect these blocks like meetings.",
      "Use a two-layer plan: long-term stage milestones and weekly execution habits. This keeps strategy and daily effort connected.",
      "Batch low-value tasks, reduce context switching, and leave transition buffers between heavy sessions.",
      "End each week with a short review: what moved, what stalled, and what should be simplified next week.",
      "Plan your week in theme blocks. For example, Monday for planning and setup, Tuesday to Thursday for execution, and Friday for review and cleanup. Themes reduce decision fatigue.",
      "Measure realistic capacity instead of ideal capacity. Most people overestimate how much deep work they can sustain each day. Plan with margin so deadlines stay reliable.",
      "Use a single source of truth for priorities. When tasks are split across scattered notes and apps, time leaks into searching, deciding, and re-prioritizing.",
      "Protect transition rituals between sessions. A quick reset, short walk, or breathing break helps your brain switch context and maintain quality across the day.",
      "Replace constant urgency with deadline tiers. Define what is urgent this week, what is important this month, and what is exploratory. This keeps your schedule aligned with impact.",
      "During review, remove one recurring time-waster. Better time management is often subtraction: fewer meetings, fewer context switches, and clearer boundaries.",
    ],
  },
  {
    slug: "how-to-plan-a-long-term-goal",
    title: "How to plan a long-term goal",
    excerpt:
      "Turn a big ambition into a practical roadmap with milestones, deadlines, and weekly execution.",
    category: "Goal Planning",
    readingTime: "14 min read",
    publishedAt: "2026-04-03",
    content: [
      "A long-term goal should define a clear finish line. If the outcome is vague, planning will remain vague too.",
      "Break the goal into stages with deadlines. Each stage should represent a real milestone, not a random checklist item.",
      "Sequence the stages in the order they naturally unlock progress. This creates clarity and reduces decision fatigue.",
      "Then define weekly habits that support the current stage. Weekly habits are your engine; stages are your direction.",
      "Review progress often and adjust scope when reality changes. Strong plans evolve, but they never lose focus.",
      "Write a success definition before starting. Ask: what does 'done' look like in observable terms? A concrete result helps you avoid drifting into side goals.",
      "Set planning horizons. Keep long-term direction for 6-12 months, stage planning for 4-8 weeks, and weekly execution for daily action. Different horizons solve different problems.",
      "Anticipate constraints early: time, energy, skill gaps, and dependencies. Planning that ignores constraints feels good on paper but fails in real weeks.",
      "Design stage outcomes that can be reviewed objectively. Instead of 'improve skills,' use outcomes like 'complete mock test cycle with analysis report.'",
      "Create checkpoints, not just deadlines. Checkpoints help you detect slippage early so you can correct before the final date becomes stressful.",
      "Plan for disruption. Include backup actions for low-energy days and recovery rules for missed weeks. A resilient plan survives imperfect execution.",
      "Keep the plan visible and alive. A long-term roadmap should be reviewed and refined, not written once and forgotten.",
    ],
  },
  {
    slug: "weekly-review-system-that-actually-works",
    title: "A weekly review system that actually works",
    excerpt:
      "Use a simple weekly review template to stay aligned, reduce chaos, and move goals forward consistently.",
    category: "Weekly Systems",
    readingTime: "11 min read",
    publishedAt: "2026-04-03",
    content: [
      "A weekly review should take less than thirty minutes. If it is too heavy, you will avoid it.",
      "Check three things: completed stages, upcoming deadlines, and habit consistency. Keep the review focused.",
      "Write one improvement for next week, not ten. One meaningful adjustment compounds better than over-planning.",
      "Carry unfinished work carefully. Either recommit with a date or remove it completely. Avoid vague carryover lists.",
      "End with a single sentence: what matters most next week? This keeps your attention sharp.",
      "Start your review with evidence, not feelings. Look at what was completed, what slipped, and which stage moved. This keeps the process objective and useful.",
      "Use a fixed structure each week: reflect, decide, schedule, and simplify. Consistent structure makes review fast even during busy seasons.",
      "Identify one bottleneck that repeated this week. It might be unclear tasks, poor energy timing, or over-commitment. Fixing bottlenecks improves the entire system.",
      "Move unfinished items through a filter: do now, schedule, delegate, or delete. Deleting low-value tasks is often the highest-impact move.",
      "Choose next week’s anchor milestone before adding minor tasks. This prevents shallow busyness and keeps momentum aligned with long-term outcomes.",
      "Finish by designing your first Monday action so the week starts with clarity instead of hesitation.",
    ],
  },
  {
    slug: "avoid-burnout-while-chasing-big-goals",
    title: "How to avoid burnout while chasing big goals",
    excerpt:
      "Sustain progress with realistic pacing, recovery, and clear boundaries.",
    category: "Sustainable Growth",
    readingTime: "12 min read",
    publishedAt: "2026-04-03",
    content: [
      "Burnout often comes from unmanaged ambition, not from ambition itself. Pace is a strategy, not a weakness.",
      "Set fewer active goals and fewer weekly commitments than you think you can handle.",
      "Build white space into your plan. Recovery time is part of performance, especially in long projects.",
      "Track stress signals the same way you track stages. If your routine becomes brittle, simplify before it breaks.",
      "The best long-term performers optimize for repeatability. If you cannot repeat it, it is not a system.",
      "Separate intensity from consistency. You do not need maximum intensity every day. You need a sustainable baseline you can maintain through changing energy levels.",
      "Use weekly capacity limits. Decide maximum deep-work sessions, admin hours, and meetings before the week starts. Capacity limits protect health and quality.",
      "Protect sleep and recovery as non-negotiable. Poor recovery lowers focus, increases errors, and slows long-term progress more than people realize.",
      "Notice early signs: irritability, constant fatigue, inability to focus, and avoidance. Early detection lets you adjust scope before burnout deepens.",
      "Create a downshift protocol for overloaded weeks: reduce goals, keep only critical habits, and simplify stage expectations until stability returns.",
      "Long-term success is not about doing the most in one month. It is about staying healthy enough to keep showing up for many months in a row.",
    ],
  },
  {
    slug: "deep-work-routine-for-students-and-builders",
    title: "A deep-work routine for students and builders",
    excerpt:
      "Create high-quality focus sessions that move meaningful work forward every week.",
    category: "Focus",
    readingTime: "13 min read",
    publishedAt: "2026-04-03",
    content: [
      "Deep work needs a ritual: fixed start time, clear objective, and no interruptions.",
      "Define one session outcome before you begin. A specific target improves execution quality.",
      "Use short pre-session setup: clear desk, silence notifications, open only required tools.",
      "Finish each session by writing the next action. This makes tomorrow's restart effortless.",
      "Depth beats duration. Two focused hours with intention are often better than six scattered hours.",
      "Start with a short warm-up to sharpen context: review yesterday's note, read the stage objective, and define today’s deliverable.",
      "Use time blocks with explicit boundaries. A 90-minute focused block followed by a 10-minute reset often works better than open-ended sessions.",
      "Treat distractions as data. Track what breaks concentration and remove it at the source: phone placement, tab overload, noisy environments, or unclear tasks.",
      "Set a finish criterion for each block. Completion could be one section drafted, one chapter revised, or one problem set solved with review notes.",
      "Do not stack heavy cognitive tasks back-to-back without recovery. High quality requires alternating deep effort and deliberate rest.",
      "Review deep-work quality weekly, not just hours logged. Ask whether your sessions moved key milestones forward. Quality progress is the real metric.",
    ],
  },
];

export function getAllBlogPosts() {
  return BLOG_POSTS;
}

export function getBlogPostBySlug(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
