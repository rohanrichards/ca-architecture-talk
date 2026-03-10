---
theme: ./theme
title: "AI Media Monitoring — Architecture & Model Decisions"
info: |
  Internal discussion on the proposed CA media monitoring architecture.
  Focus: where AI lives in the pipeline, and whether LLM is the right tool for each job.
transition: slide-left
mdc: true
---

# AI Media Monitoring

Architecture & Model Decisions — Internal Discussion

---
layout: section
---

# The Problem

What we're solving and why it matters

---

# Manual Media Monitoring

A chartered accountants body (AU/NZ) monitors ~20+ regulatory and news sources for conduct matters involving current or former members.

<v-clicks>

- **Today:** Staff manually check each site, read articles, identify names, cross-reference CRM
- **Volume:** 20+ websites — regulators (TPB, ATO, ASIC, APRA), courts (Austlii), news (AFR, Accountants Daily)
- **Risk:** Missed articles = missed conduct matters = regulatory and reputational exposure
- **Trigger:** Internal audit recommended automating with AI

</v-clicks>

---

# The Core Workflow

Five stages, three of which involve AI decisions worth discussing.

<div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 2rem; flex-wrap: wrap;">
  <div style="background: rgba(0, 212, 255, 0.1); border: 1px solid rgba(0, 212, 255, 0.3); border-radius: 8px; padding: 0.75rem 1.25rem; text-align: center;">
    <div style="font-size: 1.5rem;">1</div>
    <div style="font-size: 0.85rem; color: #8b949e;">Scrape</div>
  </div>
  <div style="color: #00d4ff; font-size: 1.5rem;">→</div>
  <div style="background: rgba(124, 58, 237, 0.15); border: 1px solid rgba(124, 58, 237, 0.4); border-radius: 8px; padding: 0.75rem 1.25rem; text-align: center;">
    <div style="font-size: 1.5rem;">2</div>
    <div style="font-size: 0.85rem; color: #a78bfa;">Extract ✦ AI</div>
  </div>
  <div style="color: #00d4ff; font-size: 1.5rem;">→</div>
  <div style="background: rgba(124, 58, 237, 0.15); border: 1px solid rgba(124, 58, 237, 0.4); border-radius: 8px; padding: 0.75rem 1.25rem; text-align: center;">
    <div style="font-size: 1.5rem;">3</div>
    <div style="font-size: 0.85rem; color: #a78bfa;">Match ✦ AI</div>
  </div>
  <div style="color: #00d4ff; font-size: 1.5rem;">→</div>
  <div style="background: rgba(124, 58, 237, 0.15); border: 1px solid rgba(124, 58, 237, 0.4); border-radius: 8px; padding: 0.75rem 1.25rem; text-align: center;">
    <div style="font-size: 1.5rem;">4</div>
    <div style="font-size: 0.85rem; color: #a78bfa;">Associate ✦ AI</div>
  </div>
  <div style="color: #00d4ff; font-size: 1.5rem;">→</div>
  <div style="background: rgba(0, 212, 255, 0.1); border: 1px solid rgba(0, 212, 255, 0.3); border-radius: 8px; padding: 0.75rem 1.25rem; text-align: center;">
    <div style="font-size: 1.5rem;">5</div>
    <div style="font-size: 0.85rem; color: #8b949e;">Review</div>
  </div>
</div>

<div style="margin-top: 1.5rem; font-size: 1rem; color: #8b949e;">
  ✦ = AI decision point — is an LLM the right tool here?
</div>

---
layout: section
---

# Where AI Lives

Three decision points, three different problems

---
layout: two-cols
---

# AI Decision 1: Extraction

Given raw article text, extract **names**, **actions**, **context**, and **identifying details**.

<v-clicks>

- Articles vary wildly — regulatory notices, court decisions, news stories
- Oblique references: "a Sydney-based accountant" without naming them directly
- Need rich profiles: name + employer + location + role + registration numbers
- Structured output required for downstream matching

</v-clicks>

::right::

## The Options

<v-clicks>

- **LLM (Claude via Bedrock)** — handles unstructured text, varied formats, oblique references. Expensive per-call but flexible
- **NER models (spaCy, BERT-NER)** — fast, cheap, good at name extraction. Struggles with context and oblique references
- **Regex / rule-based** — works for structured regulatory notices (TPB, ATO). Breaks on news articles
- **Hybrid** — regex for structured sources, LLM for unstructured?

</v-clicks>

---

# Extraction: Why We Proposed LLM

<GlowCard>

The sources are too varied for a single traditional approach. Regulatory notices have predictable structure (regex could work). Court decisions have legal language (NER could work). News articles are free-form (only LLM handles reliably).

</GlowCard>

<v-clicks>

- **LLM advantage:** one model handles all source formats. No per-source extraction logic
- **LLM advantage:** extracts *context* (employer, location, role) — not just names. NER gives you the name, LLM gives you the profile
- **LLM cost:** ~$0.01-0.05 per article via Bedrock. At 50-100 articles/week, ~$2-20/month
- **Counter-argument:** a fine-tuned BERT-NER model trained on regulatory text could handle 80% of sources at 1/100th the cost. But requires training data and maintenance

</v-clicks>

<div style="margin-top: 1rem; padding: 0.75rem 1rem; background: rgba(124, 58, 237, 0.1); border-left: 3px solid #7c3aed; border-radius: 0 8px 8px 0; font-size: 0.95rem;">
  💬 <strong>Discussion:</strong> Is the flexibility worth the per-call cost? Would a hybrid approach (regex for regulators, LLM for news) reduce costs without losing coverage?
</div>

---
layout: two-cols
---

# AI Decision 2: Matching

Given an extracted name + profile, find the matching Chartered Accountant in Salesforce.

<v-clicks>

- Not just name lookup — "John Smith" returns hundreds
- Need to match against: name variations, employer, location, registration status, specialisations
- Common names require stacked signals for confidence
- Must handle: abbreviations, maiden names, misspellings

</v-clicks>

::right::

## The Options

<v-clicks>

- **LLM (Claude via Bedrock)** — reasons holistically about article profile vs CRM profile. Natural language understanding of context
- **Fuzzy string matching** — Levenshtein, Jaro-Winkler. Fast, deterministic. Good for typos, bad for "context" matching
- **Embedding similarity** — encode profiles as vectors, cosine similarity. Good for semantic matching but needs embeddings infrastructure
- **ML classifier** — trained on past confirmed matches. High accuracy but needs labeled training data

</v-clicks>

---

# Matching: Why We Proposed LLM

<GlowCard>

The matching problem is fundamentally about *reasoning over multiple weak signals*, not pattern matching. "John Smith, a Sydney accountant" + Salesforce record "Jonathan Smith, NSW, Big4 firm" — is that the same person? LLM can reason about it. Levenshtein can't.

</GlowCard>

<v-clicks>

- **LLM advantage:** compound reasoning — name + employer + location + role = confidence score. Not achievable with string distance alone
- **LLM advantage:** handles context from the article: "the former partner at Deloitte" narrows a common name instantly
- **Embedding alternative:** encode both profiles as embeddings, use cosine similarity. Cheaper, faster, but loses the *explainability* — why did it match?
- **Hybrid possibility:** fuzzy string match as a first pass (filter 500K members to 10 candidates), then LLM for final ranking

</v-clicks>

<div style="margin-top: 1rem; padding: 0.75rem 1rem; background: rgba(124, 58, 237, 0.1); border-left: 3px solid #7c3aed; border-radius: 0 8px 8px 0; font-size: 0.95rem;">
  💬 <strong>Discussion:</strong> Is LLM reasoning overkill? Could a two-stage pipeline (fuzzy filter → embedding re-rank) achieve 90% of the accuracy at 10% of the cost?
</div>

---
layout: two-cols
---

# AI Decision 3: Case Association

Group independent findings into **potential cases** — "these 3 articles from different sources are about the same person/matter."

<v-clicks>

- Findings arrive over time — not all at once
- Same matter may appear on TPB, then ASIC, then AFR weeks apart
- Need temporal and contextual reasoning
- Cross-run accumulation — new findings re-evaluated against history

</v-clicks>

::right::

## The Options

<v-clicks>

- **LLM reasoning** — reads all findings, reasons about connections. Expensive at scale but handles nuance
- **Graph-based clustering** — build a graph of name/entity co-occurrence, cluster connected components. No AI needed
- **Embedding clustering** — embed findings, cluster with DBSCAN/HDBSCAN. Good for semantic similarity
- **Rule-based** — same name + same timeframe = same case. Simple, brittle, but surprisingly effective for 80% of cases

</v-clicks>

---

# Association: The Weakest LLM Case?

<GlowCard>

This is arguably where LLM is hardest to justify. Most case association is straightforward: same name, overlapping timeframe, related sources. A graph-based or rule-based approach handles the majority of cases.

</GlowCard>

<v-clicks>

- **Rule-based baseline:** same extracted name + within 90 days + related source types → associate. Handles ~80% of cases
- **LLM adds value for:** ambiguous names, cross-matter connections, when one article references another's case details without naming the person
- **Embedding clustering:** encode findings, run HDBSCAN. Catches semantic similarity the rules miss. Cheaper than LLM
- **Proposed approach:** Rule-based first pass, LLM for ambiguous cases only — reduces LLM calls by ~80%

</v-clicks>

<div style="margin-top: 1rem; padding: 0.75rem 1rem; background: rgba(124, 58, 237, 0.1); border-left: 3px solid #7c3aed; border-radius: 0 8px 8px 0; font-size: 0.95rem;">
  💬 <strong>Discussion:</strong> Should we even use LLM here? A deterministic approach (rules + embeddings) is cheaper, faster, and more predictable. LLM adds marginal value at significant cost.
</div>

---
layout: section
---

# AWS Infrastructure

Why serverless over AgentCore

---

# The Proposed Stack

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 1rem;">
  <div style="background: var(--gp-bg-surface); border: 1px solid var(--gp-border); border-radius: 10px; padding: 1.25rem;">
    <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: #00d4ff; margin-bottom: 0.75rem;">Orchestration</div>
    <div style="font-size: 0.95rem; line-height: 1.8;">
      <strong>EventBridge</strong> — daily/hourly triggers<br/>
      <strong>Step Functions</strong> — pipeline orchestration with retries
    </div>
  </div>
  <div style="background: var(--gp-bg-surface); border: 1px solid var(--gp-border); border-radius: 10px; padding: 1.25rem;">
    <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: #00d4ff; margin-bottom: 0.75rem;">Scraping</div>
    <div style="font-size: 0.95rem; line-height: 1.8;">
      <strong>Lambda</strong> — ~15 simple public HTML sites<br/>
      <strong>Fargate + Playwright</strong> — authenticated / JS-heavy sites
    </div>
  </div>
  <div style="background: var(--gp-bg-surface); border: 1px solid var(--gp-border); border-radius: 10px; padding: 1.25rem;">
    <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: #7c3aed; margin-bottom: 0.75rem;">AI Processing</div>
    <div style="font-size: 0.95rem; line-height: 1.8;">
      <strong>Bedrock (Claude)</strong> — extraction + matching<br/>
      <strong>Textract</strong> — PDF extraction (ASIC Gazettes)
    </div>
  </div>
  <div style="background: var(--gp-bg-surface); border: 1px solid var(--gp-border); border-radius: 10px; padding: 1.25rem;">
    <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: #00d4ff; margin-bottom: 0.75rem;">Storage & UI</div>
    <div style="font-size: 0.95rem; line-height: 1.8;">
      <strong>S3 + DynamoDB</strong> — content, state, audit trail<br/>
      <strong>React SPA + Cognito</strong> — review dashboard
    </div>
  </div>
</div>

---

# Why Not AgentCore?

AWS proposed AgentCore (Runtime, Gateway, Memory, Identity) + QuickSuite. The capabilities are real, but the fit is questionable.

<v-clicks>

- **8-hour runtime** — scraping ~20 sites should take minutes, not hours
- **Agent Memory** — they need a database of seen articles, not agent memory
- **OAuth Identity** — news subscriptions use username/password, not OAuth. This is Playwright, not federation
- **Multi-Agent Collaboration** — these are sequential pipeline stages. Step Functions handles this trivially
- **QuickSuite Chat Agents** — conduct staff need a review queue, not a chatbot
- **Cost:** AgentCore + QuickSuite ($20-40/user/mo + $250 base) vs Lambda/Fargate (pennies) + Bedrock (main cost)

</v-clicks>

---

# Phased Implementation

<div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
  <div style="flex: 1; background: var(--gp-bg-surface); border: 1px solid var(--gp-border); border-top: 3px solid #00d4ff; border-radius: 0 0 10px 10px; padding: 1.25rem;">
    <div style="font-weight: 700; margin-bottom: 0.5rem;">Phase 2</div>
    <div style="font-size: 0.8rem; color: #8b949e; margin-bottom: 0.75rem;">2-4 weeks</div>
    <div style="font-size: 0.85rem; line-height: 1.6;">
      Monitoring agent<br/>
      5-6 public AU sources<br/>
      Bedrock extraction<br/>
      Findings store (S3/DynamoDB)
    </div>
  </div>
  <div style="flex: 1; background: var(--gp-bg-surface); border: 1px solid var(--gp-border); border-top: 3px solid #7c3aed; border-radius: 0 0 10px 10px; padding: 1.25rem;">
    <div style="font-weight: 700; margin-bottom: 0.5rem;">Phase 3</div>
    <div style="font-size: 0.8rem; color: #8b949e; margin-bottom: 0.75rem;">2.5-4 weeks</div>
    <div style="font-size: 0.85rem; line-height: 1.6;">
      Salesforce matching<br/>
      Fuzzy name resolution<br/>
      Case association logic<br/>
      Confidence scoring
    </div>
  </div>
  <div style="flex: 1; background: var(--gp-bg-surface); border: 1px solid var(--gp-border); border-top: 3px solid #00d4ff; border-radius: 0 0 10px 10px; padding: 1.25rem;">
    <div style="font-weight: 700; margin-bottom: 0.5rem;">Phase 4</div>
    <div style="font-size: 0.8rem; color: #8b949e; margin-bottom: 0.75rem;">3-4 weeks</div>
    <div style="font-size: 0.85rem; line-height: 1.6;">
      React SPA review UI<br/>
      Cognito auth<br/>
      Triage workflow<br/>
      Salesforce case creation
    </div>
  </div>
</div>

<div style="margin-top: 1.5rem; text-align: center; font-size: 1rem; color: #8b949e;">
  Total: <strong style="color: #e6edf3;">6-10 weeks</strong> (Phases 3+4 in parallel) &nbsp;|&nbsp; Main cost driver: <strong style="color: #00d4ff;">Bedrock inference</strong>
</div>

---
layout: section
---

# Discussion

---

# Open Questions

<v-clicks>

- **Extraction:** Is LLM-for-everything the right default, or should we invest in per-source-type extractors (regex for regulators, NER for courts, LLM for news)?
- **Matching:** Should matching be a two-stage pipeline (fuzzy filter → LLM re-rank) to reduce Bedrock costs?
- **Association:** Does case association even need AI? Rule-based + embedding clustering might be sufficient and more predictable
- **Model choice:** We defaulted to Claude via Bedrock. Is that the right model for all three tasks? Should extraction use a smaller/cheaper model (Haiku) while matching uses a larger one (Sonnet)?
- **Evaluation:** How do we measure extraction quality before deployment? Do we need a labeled test set from the customer's past conduct matters?
- **Cost sensitivity:** At scale (100+ sources, 500+ articles/week), does the per-article LLM cost become a problem? Where's the crossover point where training a custom model pays off?

</v-clicks>
