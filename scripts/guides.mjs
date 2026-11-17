// Guide pages for grantsandhacks.com/guides/.
// Every factual claim must come from an official source listed in `sources`.
// When you re-check a guide against its sources, update `reviewed`.
// `body` is trusted HTML written by us; `answer` / `answerZh` may contain inline HTML too.

const SRC = {
  ato: ["ATO: Eligibility for the R&D tax incentive", "https://www.ato.gov.au/Business/Research-and-development-tax-incentive/In-detail/Who-can-claim/"],
  rdti: ["business.gov.au: Research and Development Tax Incentive", "https://business.gov.au/grants-and-programs/research-and-development-tax-incentive"],
  igp: ["business.gov.au: Industry Growth Program", "https://business.gov.au/grants-and-programs/industry-growth-program"],
  igpGuide: ["Industry Growth Program: Early-Stage Commercialisation grant guidelines (PDF)", "https://business.gov.au/-/media/grants-and-programs/industry-growth-program/esc/industry-growth-program-early-stage-commercialisation-grant-opportunity-guidelines-pdf"],
  csiro: ["CSIRO Kick-Start", "https://www.csiro.au/en/work-with-us/funding-programs/SME/CSIRO-Kick-Start"],
  csiroFaq: ["CSIRO Kick-Start FAQs", "https://www.csiro.au/en/work-with-us/funding-programs/SME/CSIRO-Kick-Start/FAQs"],
  brii: ["Business Research and Innovation Initiative FAQs (PDF)", "https://business.gov.au/-/media/Grants-and-programs/BRII/Business-Research-and-Innovation-Initiative-FAQs-PDF.pdf"],
  mvp: ["NSW Government: MVP Ventures Program", "https://www.nsw.gov.au/business-and-economy/innovation/grants-and-programs/mvp-ventures-program"],
  mvpR3: ["NSW Government: MVP Ventures 2025–2026 Round 3 (eligibility)", "https://www.nsw.gov.au/grants-and-funding/mvp-ventures-2025-2026-round-3"],
  unihack: ["UNIHACK", "https://www.unihack.net/"],
  aieng: ["AI Engineer Sydney Hack Day (Web Directions)", "https://webdirections.org/ai-engineer/hack-day/"],
};

export const GUIDES = [
  {
    slug: "can-a-sole-trader-get-startup-grants-australia",
    short: "Sole traders and startup grants",
    title: "Can an Australian sole trader get startup grants?",
    titleZh: "澳洲 Sole Trader（独资经营者）能申请创业补助吗？",
    description: "Most Australian startup grants and the R&D Tax Incentive require a company. Here is what a sole trader can and cannot apply for, with official sources.",
    published: "2026-11-17",
    reviewed: "2026-11-17",
    answer: "Mostly no. The main federal and NSW startup programs we track (R&D Tax Incentive, Industry Growth Program, CSIRO Kick-Start, NSW MVP Ventures) require a company with an ACN; individuals and sole traders are excluded. BRII is the exception: an individual can apply if they form an Australian company before signing the grant agreement. If you plan to apply for startup grants, registering a Pty Ltd company is usually the first step.",
    answerZh: "大多数不行。我们收录的主要联邦和新州创业资助（R&D Tax Incentive、Industry Growth Program、CSIRO Kick-Start、NSW MVP Ventures）都要求是有 ACN 的公司，个人和 sole trader 不能申请。BRII 是例外：个人可以申请，但签资助协议前必须注册成立澳洲公司。打算申请创业资助的话，通常第一步是注册一家 Pty Ltd 公司。",
    body: `
<h2>Program by program</h2>
<div class="table-wrap"><table>
<thead><tr><th>Program</th><th>Sole trader?</th><th>What the official rules say</th></tr></thead>
<tbody>
<tr><td><a href="/grants/r-and-d-tax-incentive/">R&amp;D Tax Incentive</a> (federal)</td><td>No</td><td>You must be a corporation incorporated under Australian law (or a foreign resident company in some cases). The ATO says individuals are not eligible. You also need at least A$20,000 of eligible R&amp;D spending in the year.</td></tr>
<tr><td><a href="/grants/industry-growth-program/">Industry Growth Program</a> (federal)</td><td>No</td><td>Applicants need an ABN, GST registration and must be a company incorporated in Australia, a co-operative or an incorporated trustee. Individuals and partnerships are excluded. As of 16 November 2026 the program is paused to new grant applications.</td></tr>
<tr><td><a href="/grants/csiro-kick-start/">CSIRO Kick-Start</a> (federal)</td><td>No</td><td>You must hold an ACN or ICN and be registered for GST. CSIRO's FAQ answers “I don't run my own company, am I eligible?” with “No”.</td></tr>
<tr><td><a href="/grants/business-research-and-innovation-initiative-brii/">BRII</a> (federal)</td><td>Yes, with a condition</td><td>Individuals and partnerships may apply, provided they form an Australian company before entering the grant agreement. Turnover must be under A$20 million.</td></tr>
<tr><td><a href="/grants/nsw-mvp-ventures-program/">NSW MVP Ventures</a> (NSW)</td><td>No</td><td>The round guidelines list “an individual/sole trader”, partnerships and trusts under “who can't apply”. You must be a company incorporated in Australia (or an Aboriginal and/or Torres Strait Islander corporation) headquartered in NSW.</td></tr>
</tbody></table></div>

<h2>What this means if you are a sole trader today</h2>
<ul>
<li><strong>Register a company before you need the money.</strong> Almost every program above checks your entity type at application time, and some (like the R&amp;D Tax Incentive) only count spending incurred by the company.</li>
<li><strong>Check the turnover and age tests.</strong> MVP Ventures caps turnover at A$400,000 in each of the three prior financial years and staff at 10 full-time equivalents. CSIRO Kick-Start wants turnover and operating spend under A$10 million or a business trading for under three years.</li>
<li><strong>Plan for co-funding.</strong> Kick-Start must be matched dollar for dollar in cash, and the Industry Growth Program covers at most 50% of eligible spending.</li>
<li><strong>Prizes and hackathons don't care about your structure.</strong> Competition prizes and hackathons are usually open to individuals, so they are a realistic source of non-dilutive money while you are still a sole trader. See our <a href="/hackathons/">hackathon list</a>.</li>
</ul>
<p>Every grant on this site lists who can apply. Browse the <a href="/grants/">current grants list</a>.</p>`,
    faq: [
      ["Can a sole trader claim the R&D Tax Incentive?", "No. The ATO says you must be a corporation incorporated under Australian law, and individuals are not eligible for the R&D tax offset."],
      ["Can a sole trader apply for NSW MVP Ventures?", "No. The NSW Government lists individuals and sole traders, partnerships and trusts as unable to apply. You need a company incorporated in Australia that is headquartered in NSW."],
      ["Is there any federal startup grant a sole trader can apply for?", "The Business Research and Innovation Initiative (BRII) lets individuals apply, but they must form an Australian company before signing a grant agreement. It only runs when government agencies publish challenges."],
      ["Do I need GST registration?", "For CSIRO Kick-Start and the Industry Growth Program, yes. Both require GST registration as well as a company structure."],
    ],
    sources: [SRC.ato, SRC.rdti, SRC.igp, SRC.igpGuide, SRC.csiro, SRC.csiroFaq, SRC.brii, SRC.mvpR3, SRC.mvp],
  },
  {
    slug: "startup-grants-australia-2027",
    short: "Startup grants in Australia 2027",
    title: "What startup grants are available in Australia in 2027?",
    titleZh: "2027 年澳洲有哪些创业资助可以申请？",
    description: "A checked summary of the main equity-free grants and incentives for Australian startups heading into 2027: amounts, who qualifies and current status.",
    published: "2026-11-17",
    reviewed: "2026-11-17",
    answer: "Heading into 2027, the main equity-free options for an early-stage Australian startup are the R&amp;D Tax Incentive (claimed every financial year), CSIRO Kick-Start (A$20k–60k, matched, applications all year) and, in NSW, MVP Ventures (A$20k–75k, next round announced as “opening soon”). The federal Industry Growth Program is paused to new grant applications, and BRII only opens when agencies publish challenges. All of them require a company.",
    answerZh: "进入 2027 年，澳洲早期初创可申请的主要不占股资助有：R&amp;D Tax Incentive（每个财年申报）、CSIRO Kick-Start（A$2–6 万，需配套，全年可申请），以及新州的 MVP Ventures（A$2–7.5 万，官网称下一轮“即将开放”）。联邦 Industry Growth Program 目前暂停受理新申请，BRII 只在政府部门发布挑战题目时开放。以上都要求申请方是公司。",
    body: `
<h2>Summary as of November 2026</h2>
<div class="table-wrap"><table>
<thead><tr><th>Program</th><th>How much</th><th>Status</th><th>Key conditions</th></tr></thead>
<tbody>
<tr><td><a href="/grants/r-and-d-tax-incentive/">R&amp;D Tax Incentive</a></td><td>Tax offset on eligible R&amp;D spending</td><td>Ongoing; claimed per financial year. Changes announced in the 2026–27 Budget start 1 July 2028.</td><td>Company incorporated in Australia; at least A$20,000 of eligible R&amp;D spending a year.</td></tr>
<tr><td><a href="/grants/csiro-kick-start/">CSIRO Kick-Start</a></td><td>A$20,000–60,000, matched 1:1 in cash</td><td>Expressions of interest accepted all year</td><td>ACN or ICN, GST registered, turnover and operating spend under A$10m or trading under 3 years.</td></tr>
<tr><td><a href="/grants/nsw-mvp-ventures-program/">NSW MVP Ventures</a></td><td>A$20,000–75,000 depending on stream</td><td>2025–26 Round 3 closed 10 April 2026; the 2026–27 round “will open soon”</td><td>NSW company, owns IP, ≤10 FTE, turnover ≤A$400k in each of the past 3 years.</td></tr>
<tr><td><a href="/grants/industry-growth-program/">Industry Growth Program</a></td><td>A$50k–250k (early stage) or A$100k–5m (growth), up to 50% of costs</td><td>Paused to new grant applications (16 Nov 2026)</td><td>Company with ABN and GST, turnover under A$20m; Advisory Service report first.</td></tr>
<tr><td><a href="/grants/business-research-and-innovation-initiative-brii/">BRII</a></td><td>Up to A$100k feasibility; up to A$1m proof of concept</td><td>Opens per challenge round</td><td>Turnover under A$20m; must be or become an Australian company.</td></tr>
</tbody></table></div>

<h2>How to use this list</h2>
<ul>
<li>Start with the programs that are open all year (R&amp;D Tax Incentive, CSIRO Kick-Start) and plan your records and co-funding around them.</li>
<li>Put dated rounds like MVP Ventures in your calendar. Our <a href="/grants/">grants page</a> is refreshed every Monday and shows the latest round dates we have confirmed.</li>
<li>Not a company yet? Read <a href="/guides/can-a-sole-trader-get-startup-grants-australia/">Can an Australian sole trader get startup grants?</a></li>
</ul>`,
    faq: [
      ["Is CSIRO Kick-Start open in 2027?", "CSIRO says Kick-Start expressions of interest can be submitted all year round. Funding is A$20,000 to A$60,000 and must be matched in cash."],
      ["When does NSW MVP Ventures open next?", "As of 12 November 2026 the NSW Government page says the next funding round will open soon, without a date. The previous round opened 9 March 2026 and closed 10 April 2026."],
      ["Is the Industry Growth Program accepting applications?", "As of 16 November 2026, business.gov.au says the program remains paused to new grant applications."],
    ],
    sources: [SRC.rdti, SRC.ato, SRC.csiro, SRC.csiroFaq, SRC.mvp, SRC.mvpR3, SRC.igp, SRC.igpGuide, SRC.brii],
  },
  {
    slug: "how-to-prepare-a-hackathon-project",
    short: "Preparing a hackathon project",
    title: "How to prepare a hackathon project",
    titleZh: "如何准备 Hackathon 作品",
    description: "A practical checklist for preparing a hackathon project: what to do before the event, how to scope a demo, and how to pitch to judges.",
    published: "2026-11-17",
    reviewed: "2026-11-17",
    answer: "Read the event rules first (eligibility, team size, what may be built before the start, judging criteria), then arrive with a problem and a team rather than finished code. During the event, scope one working demo path, keep a running README, and spend the last few hours on a short pitch that shows the problem, the live demo and what you would do next.",
    answerZh: "先读清楚比赛规则（参赛资格、队伍人数、开赛前能准备什么、评分标准），带着一个问题和队友去，而不是带着做好的代码。比赛中只做一条能跑通的演示路径，随手写 README，最后几小时留给路演：讲清问题、现场演示、下一步计划。",
    body: `
<h2>Before the event</h2>
<ol>
<li><strong>Read the rules page carefully.</strong> Each event sets its own eligibility, team size and judging criteria. For example, <a href="https://www.unihack.net/" rel="noopener">UNIHACK</a> is for current university and TAFE students in Australia and New Zealand, while many company-run hack days are open to anyone who registers. Check whether code written before the event is allowed; many hackathons require projects to be started at the event.</li>
<li><strong>Bring a problem, not a product.</strong> Write down two or three problems you understand well, ideally ones that fit the event's theme or sponsor challenges.</li>
<li><strong>Form a balanced team.</strong> A typical strong team has someone to build the core, someone for the interface, and someone to own the story and the pitch.</li>
<li><strong>Prepare your tools.</strong> Install your stack, sign up for any sponsor APIs or credits the event offers, and test that everything runs on your laptop.</li>
</ol>

<h2>During the event</h2>
<ol>
<li><strong>Scope one demo path.</strong> Pick the single flow a judge will see and make it work end to end. Fake anything that isn't on that path.</li>
<li><strong>Check in with mentors early.</strong> They often know what judges and sponsors care about.</li>
<li><strong>Keep a README as you go.</strong> Problem, how it works, what's real vs mocked, how to run it. Many events ask for a repo or a submission page.</li>
<li><strong>Freeze features early.</strong> Leave the last few hours for bug fixes, a recorded backup demo and the pitch.</li>
</ol>

<h2>The pitch</h2>
<ul>
<li>Open with who has the problem and why it matters, in one or two sentences.</li>
<li>Show the live demo early. Keep a screen recording ready in case the Wi-Fi or an API fails.</li>
<li>Map what you show to the judging criteria the organisers published.</li>
<li>End with what you would build next and what you need (users, partners, funding).</li>
</ul>

<h2>After the event</h2>
<p>Hackathons are a common route into accelerators and grants. Some events send finalists to a bigger stage: for example, finalists of the <a href="https://webdirections.org/ai-engineer/hack-day/" rel="noopener">AI Engineer Sydney Hack Day</a> pitch at the AI Engineer Sydney conference. Keep your demo and README online, and look at our <a href="/accelerators/">accelerators</a> and <a href="/grants/">grants</a> lists for the next step.</p>
<p>Find your next event in our <a href="/hackathons/">hackathon list</a>, updated every Monday.</p>`,
    faq: [
      ["Can I start coding before a hackathon?", "It depends on the event's rules. Many hackathons require the project to be built during the event and only allow preparation such as ideas, designs and tool setup. Check the rules page of your event."],
      ["Do I need a team?", "Most hackathons allow solo entries or help you find a team on the day, but a team of three to four with mixed skills is common. Check the event's team size limits."],
    ],
    sources: [SRC.unihack, SRC.aieng],
  },
];
