// ─── Keyword category + status types ───────────────────────────────────────
export type KeywordCategory = 'hard_skill' | 'soft_skill' | 'action_verb' | 'domain_term';
export type KeywordStatus   = 'strong' | 'weak' | 'missing';

export interface KeywordNode {
  id:               string;
  label:            string;
  category:         KeywordCategory;
  status:           KeywordStatus;
  highlightScore:   number;
  connections:      string[];   // ids of connected nodes
  frequency:        number;     // occurrences in resume
  breadth:          number;     // distinct experience bullets it appears in
  inJobDescription: boolean;
  inResume:         boolean;
}

export interface KeywordEdge {
  source: string;
  target: string;
  weight: number;
}

export interface KeywordMapResult {
  nodes:           KeywordNode[];
  edges:           KeywordEdge[];
  gaps:            KeywordNode[];
  topKeywords:     KeywordNode[];
  totalMatched:    number;
  totalJDKeywords: number;
}

// ─── Predefined keyword dictionaries ─────────────────────────────────────────
const HARD_SKILLS: string[] = [
  // Languages
  'javascript','typescript','python','java','go','golang','rust','c++','c#','ruby',
  'php','swift','kotlin','scala','r','matlab','sql','html','css','sass','scss',
  // Frontend
  'react','reactjs','angular','vue','vuejs','nextjs','next.js','nuxt','svelte',
  'redux','mobx','zustand','tailwind','bootstrap','material ui','chakra',
  'webpack','vite','rollup','babel',
  // Backend
  'nodejs','node.js','express','expressjs','django','flask','fastapi','spring',
  'hibernate','rails','laravel','asp.net',
  // APIs
  'graphql','rest','restful','grpc','websocket','openapi','swagger',
  // Cloud & DevOps
  'aws','azure','gcp','google cloud','docker','kubernetes','k8s','terraform',
  'ansible','jenkins','github actions','gitlab ci','ci/cd','devops','devsecops',
  'serverless','lambda','api gateway','cloudformation','helm',
  // Databases
  'postgresql','postgres','mysql','mongodb','redis','elasticsearch','dynamodb',
  'sqlite','cassandra','neo4j','firestore','supabase','prisma','sequelize',
  // Data & ML
  'kafka','rabbitmq','celery','spark','hadoop','airflow','dbt',
  'tensorflow','pytorch','scikit-learn','keras','pandas','numpy','opencv',
  'machine learning','deep learning','nlp','computer vision','llm','ai',
  // BI / Analytics
  'tableau','powerbi','looker','metabase','bigquery','snowflake','redshift',
  // Mobile
  'ios','android','react native','flutter','mobile',
  // Testing
  'jest','pytest','mocha','cypress','playwright','selenium','junit',
  'unit testing','integration testing','tdd','bdd','testing',
  // Methodologies
  'agile','scrum','kanban','jira','confluence','git','github','gitlab','bitbucket',
  'linux','unix','bash','shell','powershell',
  // Architecture
  'microservices','monolithic','event-driven','api','rest api',
  'design patterns','solid','dry','mvc','clean architecture',
];

const SOFT_SKILLS: string[] = [
  'leadership','communication','collaboration','teamwork','problem solving',
  'problem-solving','analytical','creative','adaptable','adaptability',
  'mentoring','coaching','strategic','innovation','innovative','ownership',
  'initiative','proactive','attention to detail','critical thinking',
  'decision making','time management','project management',
  'stakeholder management','cross-functional','empathy','organized',
  'flexibility','resilience','self-motivated','fast learner',
];

const ACTION_VERBS: string[] = [
  'led','built','developed','designed','architected','implemented','optimized',
  'improved','reduced','increased','deployed','managed','created','launched',
  'delivered','automated','migrated','scaled','integrated','collaborated',
  'mentored','drove','spearheaded','established','coordinated','streamlined',
  'accelerated','transformed','revamped','engineered','pioneered','championed',
  'owned','defined','analyzed','evaluated','researched','identified',
  'resolved','troubleshot','debugged','refactored','reviewed','documented',
  'shipped','maintained','monitored','configured','provisioned','orchestrated',
];

const STOPWORDS = new Set([
  'the','a','an','is','are','was','were','be','been','being','have','has','had',
  'do','does','did','will','would','could','should','may','might','shall','must',
  'can','to','of','in','on','at','by','for','with','from','as','into','through',
  'during','about','including','after','before','between','each','every','when',
  'where','while','although','because','since','unless','until','whether','nor',
  'but','or','and','not','no','so','such','their','this','that','these','those',
  'than','then','also','both','either','only','own','same','other','another',
  'more','most','very','just','well','even','back','still','way','work','works',
  'working','new','use','used','using','make','made','making','get','got','good',
  'our','your','its','we','you','they','he','she','it','i','me','my','him','her',
  'us','them','what','which','who','whom','whose','how','any','all','some','few',
  'many','much','part','set','up','out','over','under','again','further','here',
  'there','once','first','second','third','four','five','six','seven','eight',
  'nine','ten','per','year','years','month','months','week','weeks','day','days',
  'time','times','one','two','three','team','teams','able','need','needs',
  'looking','seeking','required','requirements','preferred','ideal','strong',
  'excellent','experience','experienced','role','position','company','organization',
  'candidate','candidates','applicant','applicants','job','jobs','apply','applying',
]);

// ─── Text utilities ─────────────────────────────────────────────────────────
function normalize(text: string): string {
  return text.toLowerCase().replace(/['']/g, "'").replace(/[–—]/g, '-');
}

/** Split experience text into individual bullet / sentence blocks */
function splitIntoBullets(text: string): string[] {
  const lines = text.split(/\n/);
  const bullets: string[] = [];
  for (const line of lines) {
    const cleaned = line.replace(/^[\s•\-\*\+]+/, '').trim();
    if (cleaned.length > 10) bullets.push(normalize(cleaned));
  }
  // If no bullet structure was found, fall back to sentence splitting
  if (bullets.length <= 1) {
    return normalize(text)
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 10);
  }
  return bullets;
}

/** Find all keyword phrase occurrences in a text snippet */
function findKeywordsInText(text: string, phrases: string[]): string[] {
  const found: string[] = [];
  for (const phrase of phrases) {
    // whole-word match for single-word terms, substring for multi-word
    if (phrase.includes(' ')) {
      if (text.includes(phrase)) found.push(phrase);
    } else {
      const re = new RegExp(`(?<![a-z0-9])${escapeRegex(phrase)}(?![a-z0-9])`, 'i');
      if (re.test(text)) found.push(phrase);
    }
  }
  return found;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Extract domain terms from text: frequent significant words not already classified */
function extractDomainTerms(
  jdText: string,
  resumeText: string,
  classifiedSet: Set<string>,
): string[] {
  const combined = normalize(jdText + ' ' + resumeText);
  const wordFreq: Map<string, number> = new Map();

  // Count words ≥5 chars that aren't stopwords or already classified
  const tokens = combined.match(/[a-z][a-z0-9\-]{3,}/g) ?? [];
  for (const token of tokens) {
    if (STOPWORDS.has(token)) continue;
    if (classifiedSet.has(token)) continue;
    wordFreq.set(token, (wordFreq.get(token) ?? 0) + 1);
  }

  // Also check bigrams in JD
  const jdNorm = normalize(jdText);
  const jdTokens = jdNorm.match(/[a-z][a-z0-9\-]{2,}/g) ?? [];
  const bigrams: string[] = [];
  for (let i = 0; i < jdTokens.length - 1; i++) {
    const bg = `${jdTokens[i]} ${jdTokens[i+1]}`;
    if (!STOPWORDS.has(jdTokens[i]) && !STOPWORDS.has(jdTokens[i+1])) {
      bigrams.push(bg);
    }
  }
  const bigramFreq: Map<string, number> = new Map();
  for (const bg of bigrams) {
    if (classifiedSet.has(bg)) continue;
    bigramFreq.set(bg, (bigramFreq.get(bg) ?? 0) + 1);
  }

  const terms: string[] = [];
  for (const [word, freq] of wordFreq) {
    if (freq >= 2) terms.push(word); // appears at least twice
  }
  for (const [bg, freq] of bigramFreq) {
    if (freq >= 2) terms.push(bg);
  }

  return terms.slice(0, 30); // cap domain terms
}

// ─── Main analysis function ───────────────────────────────────────────────────
export function analyzeKeywords(
  experience: string,
  jobDescription: string,
  skills: string = '',
): KeywordMapResult {
  if (!experience.trim() || !jobDescription.trim()) {
    return { nodes: [], edges: [], gaps: [], topKeywords: [], totalMatched: 0, totalJDKeywords: 0 };
  }

  const resumeText    = normalize(experience + ' ' + skills);
  const jdText        = normalize(jobDescription);
  const bullets       = splitIntoBullets(experience + ' ' + skills);

  // Build a set of all explicitly classified keywords for deduplication
  const allPredefined = [...HARD_SKILLS, ...SOFT_SKILLS, ...ACTION_VERBS];
  const classifiedSet = new Set(allPredefined);
  const domainTerms   = extractDomainTerms(jdText, resumeText, classifiedSet);

  const allKeywords: Array<{ phrase: string; category: KeywordCategory }> = [
    ...HARD_SKILLS.map(p => ({ phrase: p, category: 'hard_skill'  as KeywordCategory })),
    ...SOFT_SKILLS.map(p => ({ phrase: p, category: 'soft_skill'  as KeywordCategory })),
    ...ACTION_VERBS.map(p => ({ phrase: p, category: 'action_verb' as KeywordCategory })),
    ...domainTerms.map(p => ({ phrase: p, category: 'domain_term' as KeywordCategory })),
  ];

  // Deduplicate by phrase
  const seen = new Set<string>();
  const uniqueKeywords = allKeywords.filter(k => {
    if (seen.has(k.phrase)) return false;
    seen.add(k.phrase);
    return true;
  });

  // ── Step 1: which keywords appear in JD and/or resume ───────────────────
  interface RawKeyword {
    phrase:    string;
    category:  KeywordCategory;
    inJD:      boolean;
    inResume:  boolean;
    frequency: number;
    breadth:   number;
    bullets:   number[]; // indices of bullets where it appears
  }

  const rawMap = new Map<string, RawKeyword>();

  for (const { phrase, category } of uniqueKeywords) {
    const inJD     = findKeywordsInText(jdText, [phrase]).length > 0;
    const bulletMatches: number[] = [];
    let   frequency = 0;

    for (let i = 0; i < bullets.length; i++) {
      const matches = findKeywordsInText(bullets[i], [phrase]);
      if (matches.length) {
        bulletMatches.push(i);
        frequency += matches.length;
      }
    }

    // Also count occurrences in full resume text for frequency
    const re = phrase.includes(' ')
      ? new RegExp(escapeRegex(phrase), 'gi')
      : new RegExp(`(?<![a-z0-9])${escapeRegex(phrase)}(?![a-z0-9])`, 'gi');
    const allMatches = resumeText.match(re);
    frequency = allMatches ? allMatches.length : 0;

    const inResume = frequency > 0;

    if (!inJD && !inResume) continue; // irrelevant — skip

    rawMap.set(phrase, {
      phrase, category, inJD, inResume,
      frequency, breadth: bulletMatches.length, bullets: bulletMatches,
    });
  }

  // ── Step 2: co-occurrence edges ─────────────────────────────────────────
  const edgeMap = new Map<string, number>(); // "a||b" -> weight

  for (let bulletIdx = 0; bulletIdx < bullets.length; bulletIdx++) {
    const presentInBullet: string[] = [];
    for (const [phrase, raw] of rawMap) {
      if (raw.bullets.includes(bulletIdx)) presentInBullet.push(phrase);
    }
    // Create edges between all pairs present in this bullet
    for (let i = 0; i < presentInBullet.length; i++) {
      for (let j = i + 1; j < presentInBullet.length; j++) {
        const key = [presentInBullet[i], presentInBullet[j]].sort().join('||');
        edgeMap.set(key, (edgeMap.get(key) ?? 0) + 1);
      }
    }
  }

  // Build adjacency lists
  const adjacency = new Map<string, Set<string>>();
  for (const [key] of edgeMap) {
    const [a, b] = key.split('||');
    if (!adjacency.has(a)) adjacency.set(a, new Set());
    if (!adjacency.has(b)) adjacency.set(b, new Set());
    adjacency.get(a)!.add(b);
    adjacency.get(b)!.add(a);
  }

  // ── Step 3: Highlight Score ─────────────────────────────────────────────
  const nodes: KeywordNode[] = [];

  for (const [phrase, raw] of rawMap) {
    const connectionSet = adjacency.get(phrase) ?? new Set<string>();
    const connections   = Array.from(connectionSet);
    const connCount     = connections.length;

    // Score formula
    const score =
      connCount  * 2.0 +
      raw.breadth * 3.0 +
      raw.frequency * 0.8 +
      (raw.inJD ? 8 : 0);

    let status: KeywordStatus;
    if (!raw.inResume) {
      status = 'missing';
    } else if (raw.inJD) {
      // strong vs weak decided after we know all scores (below)
      status = 'strong'; // placeholder
    } else {
      status = 'weak';
    }

    nodes.push({
      id:               phrase,
      label:            phrase,
      category:         raw.category,
      status,
      highlightScore:   Math.round(score * 10) / 10,
      connections,
      frequency:        raw.frequency,
      breadth:          raw.breadth,
      inJobDescription: raw.inJD,
      inResume:         raw.inResume,
    });
  }

  // Finalize strong vs weak: bottom 40% of JD-matched resume keywords = weak
  const jdResumeNodes = nodes.filter(n => n.inJobDescription && n.inResume);
  if (jdResumeNodes.length > 0) {
    const scores   = jdResumeNodes.map(n => n.highlightScore).sort((a, b) => a - b);
    const p40idx   = Math.floor(scores.length * 0.4);
    const threshold = scores[p40idx] ?? 0;
    for (const node of nodes) {
      if (node.inJobDescription && node.inResume) {
        node.status = node.highlightScore >= threshold ? 'strong' : 'weak';
      }
    }
  }

  // ── Step 4: Build final edges list (limit to meaningful ones) ───────────
  const edges: KeywordEdge[] = [];
  for (const [key, weight] of edgeMap) {
    const [source, target] = key.split('||');
    if (rawMap.has(source) && rawMap.has(target)) {
      edges.push({ source, target, weight });
    }
  }

  // Sort edges by weight, keep top 60 for visual clarity
  edges.sort((a, b) => b.weight - a.weight);
  const topEdges = edges.slice(0, 60);

  // ── Step 5: Sort and slice ───────────────────────────────────────────────
  const sortedNodes = [...nodes].sort((a, b) => b.highlightScore - a.highlightScore);

  const jdKeywords      = nodes.filter(n => n.inJobDescription);
  const matchedKeywords = nodes.filter(n => n.inJobDescription && n.inResume);
  const gaps            = nodes
    .filter(n => n.inJobDescription && !n.inResume)
    .sort((a, b) => b.highlightScore - a.highlightScore);

  const topKeywords = sortedNodes
    .filter(n => n.inResume)
    .slice(0, 15);

  // Limit graph nodes to top 30 by score for readability
  const graphNodes = sortedNodes.slice(0, 30);

  // Filter edges to only those between graph nodes
  const graphNodeIds = new Set(graphNodes.map(n => n.id));
  const graphEdges   = topEdges.filter(
    e => graphNodeIds.has(e.source) && graphNodeIds.has(e.target),
  );

  return {
    nodes:           graphNodes,
    edges:           graphEdges,
    gaps,
    topKeywords,
    totalMatched:    matchedKeywords.length,
    totalJDKeywords: jdKeywords.length,
  };
}
