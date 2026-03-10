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

# Extraction

Extract **names**, **actions**, and **context** from raw article text.

<v-clicks>

- Source formats vary wildly
- Oblique references common
- Need rich profiles, not just names
- Structured output for matching

</v-clicks>

::right::

<div style="margin-top: 3.5rem;"></div>

<v-clicks>

- **LLM (Claude)** — all formats, expensive
- **NER (spaCy/BERT)** — fast, names only
- **Regex** — structured sources only
- **Hybrid** — regex + LLM by source?

</v-clicks>

<div style="margin-top: 1.5rem; padding: 0.5rem 0.75rem; background: rgba(124, 58, 237, 0.1); border-left: 3px solid #7c3aed; border-radius: 0 6px 6px 0; font-size: 0.8rem;">
  <strong>Proposed:</strong> LLM for everything — one model, all formats, no per-source logic
</div>

---

# Extraction: LLM vs Alternatives

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 0.5rem;">
  <div style="background: rgba(124, 58, 237, 0.08); border: 1px solid rgba(124, 58, 237, 0.3); border-radius: 8px; padding: 1rem;">
    <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: #a78bfa; margin-bottom: 0.5rem;">Why LLM</div>
    <div style="font-size: 0.85rem; line-height: 1.7; color: #8b949e;">
      ▸ One model handles all source formats<br/>
      ▸ Extracts context, not just names<br/>
      ▸ ~$0.01-0.05/article via Bedrock<br/>
      ▸ ~$2-20/mo at PoC volume
    </div>
  </div>
  <div style="background: rgba(0, 212, 255, 0.05); border: 1px solid rgba(0, 212, 255, 0.2); border-radius: 8px; padding: 1rem;">
    <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: #00d4ff; margin-bottom: 0.5rem;">Counter-argument</div>
    <div style="font-size: 0.85rem; line-height: 1.7; color: #8b949e;">
      ▸ Fine-tuned BERT-NER: 80% coverage at 1/100th cost<br/>
      ▸ Regex handles structured regulators trivially<br/>
      ▸ Hybrid = less LLM spend, same coverage?
    </div>
  </div>
</div>

<div style="margin-top: 1rem; padding: 0.5rem 0.75rem; background: rgba(124, 58, 237, 0.1); border-left: 3px solid #7c3aed; border-radius: 0 6px 6px 0; font-size: 0.85rem;">
  💬 Is LLM-for-everything the right default, or should we invest in per-source extractors?
</div>

---
layout: two-cols
---

# Matching

Match extracted profiles against **Salesforce CRM** members.

<v-clicks>

- "John Smith" returns hundreds
- Need compound signals for confidence
- Abbreviations, maiden names, typos
- Context narrows common names

</v-clicks>

::right::

<div style="margin-top: 3.5rem;"></div>

<v-clicks>

- **LLM (Claude)** — holistic reasoning
- **Fuzzy strings** — Jaro-Winkler, fast
- **Embeddings** — cosine similarity
- **ML classifier** — needs training data

</v-clicks>

<div style="margin-top: 1.5rem; padding: 0.5rem 0.75rem; background: rgba(124, 58, 237, 0.1); border-left: 3px solid #7c3aed; border-radius: 0 6px 6px 0; font-size: 0.8rem;">
  <strong>Proposed:</strong> LLM reasons over name + employer + location + role = confidence
</div>

---

# Matching: LLM vs Alternatives

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 0.5rem;">
  <div style="background: rgba(124, 58, 237, 0.08); border: 1px solid rgba(124, 58, 237, 0.3); border-radius: 8px; padding: 1rem;">
    <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: #a78bfa; margin-bottom: 0.5rem;">Why LLM</div>
    <div style="font-size: 0.85rem; line-height: 1.7; color: #8b949e;">
      ▸ Compound reasoning across weak signals<br/>
      ▸ "former Deloitte partner" narrows instantly<br/>
      ▸ Explainable: <em>why</em> it matched
    </div>
  </div>
  <div style="background: rgba(0, 212, 255, 0.05); border: 1px solid rgba(0, 212, 255, 0.2); border-radius: 8px; padding: 1rem;">
    <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: #00d4ff; margin-bottom: 0.5rem;">Counter-argument</div>
    <div style="font-size: 0.85rem; line-height: 1.7; color: #8b949e;">
      ▸ Embeddings: cheaper, faster, semantic<br/>
      ▸ Two-stage: fuzzy filter 500K → 10, then LLM<br/>
      ▸ 90% accuracy at 10% cost?
    </div>
  </div>
</div>

<div style="margin-top: 1rem; padding: 0.5rem 0.75rem; background: rgba(124, 58, 237, 0.1); border-left: 3px solid #7c3aed; border-radius: 0 6px 6px 0; font-size: 0.85rem;">
  💬 Is LLM reasoning overkill? Could fuzzy filter → embedding re-rank do the job?
</div>

---
layout: two-cols
---

# Case Association

Group findings into **potential cases** — same person, different sources.

<v-clicks>

- Findings arrive over time
- Same matter across TPB → ASIC → AFR
- Temporal and contextual reasoning
- Cross-run accumulation

</v-clicks>

::right::

<div style="margin-top: 3.5rem;"></div>

<v-clicks>

- **LLM** — reasons about connections
- **Graph clustering** — co-occurrence
- **Embeddings** — HDBSCAN clusters
- **Rules** — name + timeframe = case

</v-clicks>

<div style="margin-top: 1.5rem; padding: 0.5rem 0.75rem; background: rgba(124, 58, 237, 0.1); border-left: 3px solid #7c3aed; border-radius: 0 6px 6px 0; font-size: 0.8rem;">
  <strong>Proposed:</strong> Rules first, LLM only for ambiguous cases
</div>

---

# Association: The Weakest LLM Case?

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 0.5rem;">
  <div style="background: rgba(124, 58, 237, 0.08); border: 1px solid rgba(124, 58, 237, 0.3); border-radius: 8px; padding: 1rem;">
    <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: #a78bfa; margin-bottom: 0.5rem;">Where LLM helps</div>
    <div style="font-size: 0.85rem; line-height: 1.7; color: #8b949e;">
      ▸ Ambiguous names across sources<br/>
      ▸ Cross-matter references<br/>
      ▸ Articles referencing cases without naming
    </div>
  </div>
  <div style="background: rgba(0, 212, 255, 0.05); border: 1px solid rgba(0, 212, 255, 0.2); border-radius: 8px; padding: 1rem;">
    <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: #00d4ff; margin-bottom: 0.5rem;">Counter-argument</div>
    <div style="font-size: 0.85rem; line-height: 1.7; color: #8b949e;">
      ▸ Rules handle ~80% of cases trivially<br/>
      ▸ Embeddings catch what rules miss<br/>
      ▸ Deterministic = cheaper, faster, predictable
    </div>
  </div>
</div>

<div style="margin-top: 1rem; padding: 0.5rem 0.75rem; background: rgba(124, 58, 237, 0.1); border-left: 3px solid #7c3aed; border-radius: 0 6px 6px 0; font-size: 0.85rem;">
  💬 Should we even use LLM here? Rules + embeddings might be sufficient.
</div>

---
layout: section
---

# AWS Infrastructure

Why serverless over AgentCore

---

# The Proposed Stack

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 0.5rem;">
  <div style="background: var(--gp-bg-surface); border: 1px solid var(--gp-border); border-radius: 8px; padding: 1rem;">
    <div style="font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: #00d4ff; margin-bottom: 0.5rem;">Orchestration</div>
    <div style="font-size: 0.85rem; line-height: 1.6;">
      <strong>EventBridge</strong> — cron triggers<br/>
      <strong>Step Functions</strong> — pipeline + retries
    </div>
  </div>
  <div style="background: var(--gp-bg-surface); border: 1px solid var(--gp-border); border-radius: 8px; padding: 1rem;">
    <div style="font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: #00d4ff; margin-bottom: 0.5rem;">Scraping</div>
    <div style="font-size: 0.85rem; line-height: 1.6;">
      <strong>Lambda</strong> — ~15 public HTML sites<br/>
      <strong>Fargate + Playwright</strong> — auth / JS sites
    </div>
  </div>
  <div style="background: var(--gp-bg-surface); border: 1px solid var(--gp-border); border-radius: 8px; padding: 1rem;">
    <div style="font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: #7c3aed; margin-bottom: 0.5rem;">AI Processing</div>
    <div style="font-size: 0.85rem; line-height: 1.6;">
      <strong>Bedrock (Claude)</strong> — extraction + matching<br/>
      <strong>Textract</strong> — PDF extraction
    </div>
  </div>
  <div style="background: var(--gp-bg-surface); border: 1px solid var(--gp-border); border-radius: 8px; padding: 1rem;">
    <div style="font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: #00d4ff; margin-bottom: 0.5rem;">Storage & UI</div>
    <div style="font-size: 0.85rem; line-height: 1.6;">
      <strong>S3 + DynamoDB</strong> — content, state, audit<br/>
      <strong>React SPA + Cognito</strong> — review UI
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

# The Review UI

Conduct staff need a **work queue**, not a chatbot. Same UX pattern as content moderation tools.

<div style="display: flex; gap: 1rem; margin-top: 1.5rem; font-family: 'JetBrains Mono', monospace; font-size: 0.75rem;">
  <div style="flex: 1; background: var(--gp-bg-surface); border: 1px solid var(--gp-border); border-radius: 10px; padding: 1.25rem;">
    <div style="font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: #00d4ff; margin-bottom: 0.75rem;">Queue View</div>
    <div style="line-height: 2;">
      <div style="padding: 0.3rem 0.5rem; background: rgba(124, 58, 237, 0.1); border-radius: 4px; margin-bottom: 0.4rem;">▸ John Smith (3) <span style="color: #ff5f57;">HIGH</span></div>
      <div style="padding: 0.3rem 0.5rem; background: rgba(0, 212, 255, 0.05); border-radius: 4px; margin-bottom: 0.4rem;">▸ Jane Doe (1) <span style="color: #febc2e;">MED</span></div>
      <div style="padding: 0.3rem 0.5rem; background: rgba(0, 212, 255, 0.05); border-radius: 4px;">▸ R. Johnson (2) <span style="color: #28c840;">LOW</span></div>
    </div>
  </div>
  <div style="display: flex; align-items: center; color: #00d4ff; font-size: 1.5rem;">→</div>
  <div style="flex: 1.5; background: var(--gp-bg-surface); border: 1px solid var(--gp-border); border-radius: 10px; padding: 1.25rem;">
    <div style="font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: #00d4ff; margin-bottom: 0.75rem;">Case Detail</div>
    <div style="line-height: 1.8;">
      <div><strong style="color: #e6edf3;">John Smith</strong> — 3 findings</div>
      <div style="color: #8b949e;">Finding 1: TPB media release</div>
      <div style="color: #8b949e;">Finding 2: ASIC disciplinary</div>
      <div style="color: #8b949e;">Finding 3: AFR article</div>
      <div style="margin-top: 0.5rem;">SF Match: Member #12345 <span style="color: #28c840;">92%</span></div>
    </div>
  </div>
  <div style="display: flex; align-items: center; color: #00d4ff; font-size: 1.5rem;">→</div>
  <div style="flex: 0.8; background: var(--gp-bg-surface); border: 1px solid var(--gp-border); border-radius: 10px; padding: 1.25rem;">
    <div style="font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: #00d4ff; margin-bottom: 0.75rem;">Actions</div>
    <div style="line-height: 2.2;">
      <div style="padding: 0.2rem 0.5rem; background: rgba(40, 200, 64, 0.15); border-radius: 4px; margin-bottom: 0.3rem; color: #28c840;">✓ Confirm</div>
      <div style="padding: 0.2rem 0.5rem; background: rgba(255, 95, 87, 0.15); border-radius: 4px; margin-bottom: 0.3rem; color: #ff5f57;">✗ Dismiss</div>
      <div style="padding: 0.2rem 0.5rem; background: rgba(0, 212, 255, 0.1); border-radius: 4px; margin-bottom: 0.3rem; color: #00d4ff;">✎ Adjust</div>
      <div style="padding: 0.2rem 0.5rem; background: rgba(124, 58, 237, 0.15); border-radius: 4px; color: #a78bfa;">⑂ Split</div>
    </div>
  </div>
</div>

<div style="margin-top: 1rem; font-size: 0.85rem; color: #8b949e; font-family: 'Inter', sans-serif;">
  React SPA + API Gateway + Lambda + Cognito + DynamoDB — <strong style="color: #e6edf3;">~$0-5/mo</strong> at PoC scale
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
