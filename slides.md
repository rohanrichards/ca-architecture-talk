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

<div style="font-size: 0.95rem; color: #8b949e; margin: -0.5rem 0 0.75rem;">Five stages — three involve AI decisions worth discussing.</div>

<!-- Pipeline row -->
<div style="display: flex; align-items: stretch; gap: 0.5rem; margin-top: 0.25rem;">

  <div style="flex: 1; background: rgba(0, 212, 255, 0.08); border: 1px solid rgba(0, 212, 255, 0.25); border-radius: 10px; padding: 0.6rem 0.5rem; text-align: center;">
    <div style="font-size: 1.1rem; font-weight: 700; color: #00d4ff;">①</div>
    <div style="font-size: 0.75rem; font-weight: 600; color: #e6edf3; margin: 0.2rem 0;">Scrape</div>
    <div style="font-size: 0.55rem; line-height: 1.5; color: #484f58;">20+ sources<br/>Lambda + Fargate</div>
  </div>

  <div style="display: flex; align-items: center; color: rgba(0, 212, 255, 0.4); font-size: 1.25rem;">›</div>

  <div style="flex: 1; background: rgba(124, 58, 237, 0.1); border: 1px solid rgba(124, 58, 237, 0.3); border-radius: 10px; padding: 0.6rem 0.5rem; text-align: center;">
    <div style="font-size: 1.1rem; font-weight: 700; color: #a78bfa;">②</div>
    <div style="font-size: 0.75rem; font-weight: 600; color: #e6edf3; margin: 0.2rem 0;">Extract</div>
    <div style="font-size: 0.55rem; line-height: 1.5; color: #484f58;">Names, roles, actions<br/>from raw article text</div>
    <div style="margin-top: 0.3rem; font-size: 0.5rem; background: rgba(124, 58, 237, 0.2); color: #a78bfa; padding: 0.1rem 0.3rem; border-radius: 3px; display: inline-block;">✦ AI</div>
  </div>

  <div style="display: flex; align-items: center; color: rgba(0, 212, 255, 0.4); font-size: 1.25rem;">›</div>

  <div style="flex: 1; background: rgba(124, 58, 237, 0.1); border: 1px solid rgba(124, 58, 237, 0.3); border-radius: 10px; padding: 0.6rem 0.5rem; text-align: center;">
    <div style="font-size: 1.1rem; font-weight: 700; color: #a78bfa;">③</div>
    <div style="font-size: 0.75rem; font-weight: 600; color: #e6edf3; margin: 0.2rem 0;">Match</div>
    <div style="font-size: 0.55rem; line-height: 1.5; color: #484f58;">Cross-ref against<br/>Salesforce CRM</div>
    <div style="margin-top: 0.3rem; font-size: 0.5rem; background: rgba(124, 58, 237, 0.2); color: #a78bfa; padding: 0.1rem 0.3rem; border-radius: 3px; display: inline-block;">✦ AI</div>
  </div>

  <div style="display: flex; align-items: center; color: rgba(0, 212, 255, 0.4); font-size: 1.25rem;">›</div>

  <div style="flex: 1; background: rgba(124, 58, 237, 0.1); border: 1px solid rgba(124, 58, 237, 0.3); border-radius: 10px; padding: 0.6rem 0.5rem; text-align: center;">
    <div style="font-size: 1.1rem; font-weight: 700; color: #a78bfa;">④</div>
    <div style="font-size: 0.75rem; font-weight: 600; color: #e6edf3; margin: 0.2rem 0;">Associate</div>
    <div style="font-size: 0.55rem; line-height: 1.5; color: #484f58;">Group findings<br/>into cases</div>
    <div style="margin-top: 0.3rem; font-size: 0.5rem; background: rgba(124, 58, 237, 0.2); color: #a78bfa; padding: 0.1rem 0.3rem; border-radius: 3px; display: inline-block;">✦ AI?</div>
  </div>

  <div style="display: flex; align-items: center; color: rgba(0, 212, 255, 0.4); font-size: 1.25rem;">›</div>

  <div style="flex: 1; background: rgba(0, 212, 255, 0.08); border: 1px solid rgba(0, 212, 255, 0.25); border-radius: 10px; padding: 0.6rem 0.5rem; text-align: center;">
    <div style="font-size: 1.1rem; font-weight: 700; color: #00d4ff;">⑤</div>
    <div style="font-size: 0.75rem; font-weight: 600; color: #e6edf3; margin: 0.2rem 0;">Review</div>
    <div style="font-size: 0.55rem; line-height: 1.5; color: #484f58;">Human approval<br/>React SPA queue</div>
  </div>

</div>

<!-- Source examples -->
<div style="margin-top: 0.75rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
  <div style="font-size: 0.6rem; color: #484f58; padding: 0.15rem 0.4rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 4px;">TPB</div>
  <div style="font-size: 0.6rem; color: #484f58; padding: 0.15rem 0.4rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 4px;">ASIC</div>
  <div style="font-size: 0.6rem; color: #484f58; padding: 0.15rem 0.4rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 4px;">APRA</div>
  <div style="font-size: 0.6rem; color: #484f58; padding: 0.15rem 0.4rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 4px;">ATO</div>
  <div style="font-size: 0.6rem; color: #484f58; padding: 0.15rem 0.4rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 4px;">Austlii</div>
  <div style="font-size: 0.6rem; color: #484f58; padding: 0.15rem 0.4rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 4px;">AFR</div>
  <div style="font-size: 0.6rem; color: #484f58; padding: 0.15rem 0.4rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 4px;">Accountants Daily</div>
  <div style="font-size: 0.6rem; color: #484f58; padding: 0.15rem 0.4rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 4px;">+ 12 more</div>
</div>

<div style="margin-top: 0.6rem; padding: 0.35rem 0.65rem; background: rgba(124, 58, 237, 0.08); border-left: 3px solid rgba(124, 58, 237, 0.4); border-radius: 0 6px 6px 0; font-size: 0.7rem; color: #8b949e;">
  The central question: <strong style="color: #e6edf3;">is an LLM the right tool</strong> for each ✦ stage — or are there better, cheaper alternatives?
</div>

---

# Example: Article → Case

<div style="font-size: 0.85rem; color: #8b949e; margin: -0.5rem 0 0.5rem;">Concrete data flowing through the pipeline — one scrape run.</div>

<div style="display: grid; grid-template-columns: 1.2fr auto 1fr auto 1fr auto 0.9fr; align-items: center; gap: 0; font-family: 'JetBrains Mono', monospace;">

  <!-- SCRAPE -->
  <div>
    <div style="font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.1em; color: #00d4ff; font-weight: 600; margin-bottom: 0.35rem;">Scraped</div>
    <div style="padding: 0.35rem 0.45rem; background: rgba(0,0,0,0.25); border-left: 2px solid #ff5f57; border-radius: 3px; margin-bottom: 0.3rem;">
      <span style="font-size: 0.5rem; background: rgba(255,95,87,0.15); color: #ff5f57; padding: 0.1rem 0.25rem; border-radius: 2px; font-weight: 600;">TPB</span>
      <div style="font-size: 0.55rem; color: #8b949e; margin-top: 0.15rem;"><strong style="color:#e6edf3;">John David Smith</strong>, tax agent, registration cancelled...</div>
    </div>
    <div style="padding: 0.35rem 0.45rem; background: rgba(0,0,0,0.25); border-left: 2px solid #febc2e; border-radius: 3px; margin-bottom: 0.3rem;">
      <span style="font-size: 0.5rem; background: rgba(254,188,46,0.15); color: #febc2e; padding: 0.1rem 0.25rem; border-radius: 2px; font-weight: 600;">ASIC</span>
      <div style="font-size: 0.55rem; color: #8b949e; margin-top: 0.15rem;"><strong style="color:#e6edf3;">JD Smith</strong> of Smith & Partners — civil proceedings...</div>
    </div>
    <div style="padding: 0.35rem 0.45rem; background: rgba(0,0,0,0.25); border-left: 2px solid #00d4ff; border-radius: 3px; margin-bottom: 0.3rem;">
      <span style="font-size: 0.5rem; background: rgba(0,212,255,0.15); color: #00d4ff; padding: 0.1rem 0.25rem; border-radius: 2px; font-weight: 600;">AFR</span>
      <div style="font-size: 0.55rem; color: #8b949e; margin-top: 0.15rem;"><strong style="color:#e6edf3;">Jane Doe</strong>, former BDO partner, charged with tax fraud...</div>
    </div>
    <div style="padding: 0.35rem 0.45rem; background: rgba(0,0,0,0.25); border-left: 2px solid #28c840; border-radius: 3px;">
      <span style="font-size: 0.5rem; background: rgba(40,200,64,0.15); color: #28c840; padding: 0.1rem 0.25rem; border-radius: 2px; font-weight: 600;">TPB</span>
      <div style="font-size: 0.55rem; color: #8b949e; margin-top: 0.15rem;"><strong style="color:#e6edf3;">R. Johnson</strong>, BAS agent, formal caution...</div>
    </div>
  </div>

  <div style="display: flex; align-items: center; color: rgba(0, 212, 255, 0.4); font-size: 1.25rem; padding: 0 0.25rem;">›</div>

  <!-- EXTRACT -->
  <div>
    <div style="font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.1em; color: #a78bfa; font-weight: 600; margin-bottom: 0.35rem;">Extracted</div>
    <div style="padding: 0.3rem 0.4rem; background: rgba(0,0,0,0.25); border-radius: 3px; margin-bottom: 0.25rem;">
      <div style="font-size: 0.6rem; color: #e6edf3; font-weight: 600;">John David Smith</div>
      <div style="font-size: 0.5rem; color: #484f58;">tax agent · cancelled</div>
    </div>
    <div style="padding: 0.3rem 0.4rem; background: rgba(0,0,0,0.25); border-radius: 3px; margin-bottom: 0.25rem;">
      <div style="font-size: 0.6rem; color: #e6edf3; font-weight: 600;">JD Smith</div>
      <div style="font-size: 0.5rem; color: #484f58;">Smith & Partners · proceedings</div>
    </div>
    <div style="padding: 0.3rem 0.4rem; background: rgba(0,0,0,0.25); border-radius: 3px; margin-bottom: 0.25rem;">
      <div style="font-size: 0.6rem; color: #e6edf3; font-weight: 600;">Jane Doe</div>
      <div style="font-size: 0.5rem; color: #484f58;">BDO Brisbane · tax fraud</div>
    </div>
    <div style="padding: 0.3rem 0.4rem; background: rgba(0,0,0,0.25); border-radius: 3px;">
      <div style="font-size: 0.6rem; color: #e6edf3; font-weight: 600;">R. Johnson</div>
      <div style="font-size: 0.5rem; color: #484f58;">BAS agent · caution</div>
    </div>
  </div>

  <div style="display: flex; align-items: center; color: rgba(0, 212, 255, 0.4); font-size: 1.25rem; padding: 0 0.25rem;">›</div>

  <!-- MATCH -->
  <div>
    <div style="font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.1em; color: #a78bfa; font-weight: 600; margin-bottom: 0.35rem;">Matched</div>
    <div style="padding: 0.3rem 0.4rem; background: rgba(0,0,0,0.25); border-radius: 3px; margin-bottom: 0.25rem;">
      <div style="font-size: 0.55rem;"><span style="color: #e6edf3;">J.D. Smith</span> → <span style="color: #8b949e;">#4821</span> <span style="color: #28c840; font-weight: 600;">94%</span></div>
    </div>
    <div style="padding: 0.3rem 0.4rem; background: rgba(0,0,0,0.25); border-radius: 3px; margin-bottom: 0.25rem;">
      <div style="font-size: 0.55rem;"><span style="color: #e6edf3;">JD Smith</span> → <span style="color: #8b949e;">#4821</span> <span style="color: #febc2e; font-weight: 600;">78%</span></div>
    </div>
    <div style="padding: 0.3rem 0.4rem; background: rgba(0,0,0,0.25); border-radius: 3px; margin-bottom: 0.25rem;">
      <div style="font-size: 0.55rem;"><span style="color: #e6edf3;">Jane Doe</span> → <span style="color: #8b949e;">#7203</span> <span style="color: #28c840; font-weight: 600;">91%</span></div>
    </div>
    <div style="padding: 0.3rem 0.4rem; background: rgba(0,0,0,0.25); border-radius: 3px;">
      <div style="font-size: 0.55rem;"><span style="color: #e6edf3;">R. Johnson</span> → <span style="color: #8b949e;">#1156</span> <span style="color: #febc2e; font-weight: 600;">67%</span></div>
    </div>
  </div>

  <div style="display: flex; align-items: center; color: rgba(0, 212, 255, 0.4); font-size: 1.25rem; padding: 0 0.25rem;">›</div>

  <!-- ASSOCIATE -->
  <div>
    <div style="font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.1em; color: #a78bfa; font-weight: 600; margin-bottom: 0.35rem;">Cases</div>
    <div style="padding: 0.35rem 0.45rem; background: rgba(255,95,87,0.06); border: 1px solid rgba(255,95,87,0.2); border-radius: 4px; margin-bottom: 0.3rem;">
      <div style="font-size: 0.5rem; color: #ff5f57; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Case #1</div>
      <div style="font-size: 0.55rem; color: #e6edf3;">John Smith</div>
      <div style="font-size: 0.5rem; color: #484f58;">2 findings · #4821</div>
    </div>
    <div style="padding: 0.35rem 0.45rem; background: rgba(0,212,255,0.06); border: 1px solid rgba(0,212,255,0.2); border-radius: 4px; margin-bottom: 0.3rem;">
      <div style="font-size: 0.5rem; color: #00d4ff; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Case #2</div>
      <div style="font-size: 0.55rem; color: #e6edf3;">Jane Doe</div>
      <div style="font-size: 0.5rem; color: #484f58;">1 finding · #7203</div>
    </div>
    <div style="padding: 0.35rem 0.45rem; background: rgba(40,200,64,0.06); border: 1px solid rgba(40,200,64,0.2); border-radius: 4px;">
      <div style="font-size: 0.5rem; color: #28c840; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Case #3</div>
      <div style="font-size: 0.55rem; color: #e6edf3;">R. Johnson</div>
      <div style="font-size: 0.5rem; color: #484f58;">1 finding · #1156</div>
    </div>
  </div>

</div>

<div style="margin-top: 0.6rem; padding: 0.35rem 0.65rem; background: rgba(124, 58, 237, 0.1); border-left: 3px solid #7c3aed; border-radius: 0 6px 6px 0; font-size: 0.7rem; color: #8b949e;">
  Note: "John David Smith" (TPB) and "JD Smith" (ASIC) both resolve to <strong style="color: #e6edf3;">Member #4821</strong> — the matcher does the hard work, association is just <code>GROUP BY</code>.
</div>

---
layout: section
---

# Where AI Lives

Three decision points, three different problems

---

# Extraction

<div style="font-size: 0.95rem; color: #8b949e; margin: -0.5rem 0 0.75rem;">Extract names, actions, and context from raw article text.</div>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
  <div style="background: var(--gp-bg-surface); border: 1px solid var(--gp-border); border-radius: 8px; padding: 0.75rem 1rem;">
    <div style="font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: #00d4ff; margin-bottom: 0.4rem;">The Challenge</div>
    <div style="font-size: 0.8rem; line-height: 1.6; color: #8b949e;">
      ▸ Source formats vary wildly<br/>
      ▸ Oblique references common<br/>
      ▸ Need rich profiles, not just names<br/>
      ▸ Structured output for matching
    </div>
  </div>
  <div style="background: var(--gp-bg-surface); border: 1px solid var(--gp-border); border-radius: 8px; padding: 0.75rem 1rem;">
    <div style="font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: #a78bfa; margin-bottom: 0.4rem;">The Options</div>
    <div style="font-size: 0.8rem; line-height: 1.6; color: #8b949e;">
      ▸ <strong style="color: #e6edf3;">LLMs</strong> — flexible, expensive<br/>
      ▸ <strong style="color: #e6edf3;">Zero-shot NER</strong> — GLiNER, NuNER<br/>
      ▸ <strong style="color: #e6edf3;">Fine-tuned encoders</strong> — DeBERTa, Flair<br/>
      ▸ <strong style="color: #e6edf3;">Rules / regex</strong> — structured sources
    </div>
  </div>
</div>

<div style="margin-top: 0.75rem; padding: 0.4rem 0.75rem; background: rgba(124, 58, 237, 0.1); border-left: 3px solid #7c3aed; border-radius: 0 6px 6px 0; font-size: 0.8rem;">
  <strong>Proposed:</strong> LLM for everything — one model, all formats, no per-source logic
</div>

---

# The Non-LLM Extraction Landscape

<div style="font-size: 0.95rem; color: #8b949e; margin: -0.5rem 0 0.5rem;">The non-LLM extraction space has matured significantly.</div>

<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.6rem;">
  <div style="background: rgba(124, 58, 237, 0.08); border: 1px solid rgba(124, 58, 237, 0.3); border-radius: 8px; padding: 0.6rem 0.75rem;">
    <div style="font-size: 0.7rem; font-weight: 700; color: #a78bfa; margin-bottom: 0.3rem;">GLiNER</div>
    <div style="font-size: 0.7rem; line-height: 1.5; color: #8b949e;">Zero-shot NER. Describe entities in English, no training. <strong style="color: #e6edf3;">Beats ChatGPT</strong> on NER benchmarks. Runs on CPU.</div>
  </div>
  <div style="background: rgba(124, 58, 237, 0.08); border: 1px solid rgba(124, 58, 237, 0.3); border-radius: 8px; padding: 0.6rem 0.75rem;">
    <div style="font-size: 0.7rem; font-weight: 700; color: #a78bfa; margin-bottom: 0.3rem;">NuNER</div>
    <div style="font-size: 0.7rem; line-height: 1.5; color: #8b949e;">125M params. <strong style="color: #e6edf3;">Competes with GPT-4</strong> given 12 examples per entity type. 56x smaller than UniversalNER.</div>
  </div>
  <div style="background: rgba(124, 58, 237, 0.08); border: 1px solid rgba(124, 58, 237, 0.3); border-radius: 8px; padding: 0.6rem 0.75rem;">
    <div style="font-size: 0.7rem; font-weight: 700; color: #a78bfa; margin-bottom: 0.3rem;">ReLiK</div>
    <div style="font-size: 0.7rem; line-height: 1.5; color: #8b949e;">Relation extraction without LLMs. Extracts <strong style="color: #e6edf3;">"Person — suspended by — ICAI"</strong> links in one pass.</div>
  </div>
  <div style="background: rgba(0, 212, 255, 0.05); border: 1px solid rgba(0, 212, 255, 0.2); border-radius: 8px; padding: 0.6rem 0.75rem;">
    <div style="font-size: 0.7rem; font-weight: 700; color: #00d4ff; margin-bottom: 0.3rem;">DeBERTa-v3</div>
    <div style="font-size: 0.7rem; line-height: 1.5; color: #8b949e;">Strictly better than BERT for NER. 22M params beats RoBERTa-Base (125M). Fine-tune on domain data.</div>
  </div>
  <div style="background: rgba(0, 212, 255, 0.05); border: 1px solid rgba(0, 212, 255, 0.2); border-radius: 8px; padding: 0.6rem 0.75rem;">
    <div style="font-size: 0.7rem; font-weight: 700; color: #00d4ff; margin-bottom: 0.3rem;">Flair</div>
    <div style="font-size: 0.7rem; line-height: 1.5; color: #8b949e;">BiLSTM-CRF with stacked embeddings. Better than spaCy on small datasets. GPU recommended.</div>
  </div>
  <div style="background: rgba(0, 212, 255, 0.05); border: 1px solid rgba(0, 212, 255, 0.2); border-radius: 8px; padding: 0.6rem 0.75rem;">
    <div style="font-size: 0.7rem; font-weight: 700; color: #00d4ff; margin-bottom: 0.3rem;">Spark NLP Legal</div>
    <div style="font-size: 0.7rem; line-height: 1.5; color: #8b949e;">Pre-trained legal NER models. Enterprise license. 10K+ models including finance/law domains.</div>
  </div>
</div>

<div style="margin-top: 0.5rem; padding: 0.4rem 0.75rem; background: rgba(124, 58, 237, 0.1); border-left: 3px solid #7c3aed; border-radius: 0 6px 6px 0; font-size: 0.75rem;">
  💬 Alternative pipeline: <strong>GLiNER</strong> (zero-shot entities) + <strong>spaCy EntityRuler</strong> (reg numbers, dates) + <strong>ReLiK</strong> (relationships). No training data needed.
</div>

---

# Matching

<div style="font-size: 0.95rem; color: #8b949e; margin: -0.5rem 0 0.75rem;">Match extracted profiles against Salesforce CRM members.</div>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
  <div style="background: var(--gp-bg-surface); border: 1px solid var(--gp-border); border-radius: 8px; padding: 0.75rem 1rem;">
    <div style="font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: #00d4ff; margin-bottom: 0.4rem;">The Challenge</div>
    <div style="font-size: 0.8rem; line-height: 1.6; color: #8b949e;">
      ▸ "John Smith" returns hundreds<br/>
      ▸ Need compound signals for confidence<br/>
      ▸ Abbreviations, maiden names, typos<br/>
      ▸ Context narrows common names
    </div>
  </div>
  <div style="background: var(--gp-bg-surface); border: 1px solid var(--gp-border); border-radius: 8px; padding: 0.75rem 1rem;">
    <div style="font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: #a78bfa; margin-bottom: 0.4rem;">The Options</div>
    <div style="font-size: 0.8rem; line-height: 1.6; color: #8b949e;">
      ▸ <strong style="color: #e6edf3;">LLMs</strong> — holistic reasoning, expensive<br/>
      ▸ <strong style="color: #e6edf3;">Probabilistic linkage</strong> — Splink, Dedupe<br/>
      ▸ <strong style="color: #e6edf3;">Bi-encoder + cross-encoder</strong> pipeline<br/>
      ▸ <strong style="color: #e6edf3;">AWS Entity Resolution</strong> — managed
    </div>
  </div>
</div>

<div style="margin-top: 0.75rem; padding: 0.4rem 0.75rem; background: rgba(124, 58, 237, 0.1); border-left: 3px solid #7c3aed; border-radius: 0 6px 6px 0; font-size: 0.8rem;">
  <strong>Proposed:</strong> LLM reasons over name + employer + location + role = confidence
</div>

---

# The Non-LLM Matching Landscape

<div style="font-size: 0.95rem; color: #8b949e; margin: -0.5rem 0 0.5rem;">Entity resolution is a solved problem — with mature, production-proven tools.</div>

<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.6rem;">
  <div style="background: rgba(124, 58, 237, 0.08); border: 1px solid rgba(124, 58, 237, 0.3); border-radius: 8px; padding: 0.6rem 0.75rem;">
    <div style="font-size: 0.7rem; font-weight: 700; color: #a78bfa; margin-bottom: 0.3rem;">Splink</div>
    <div style="font-size: 0.7rem; line-height: 1.5; color: #8b949e;">Probabilistic linkage (Fellegi-Sunter). <strong style="color: #e6edf3;">No labeled data needed.</strong> 500K records in seconds. UK MoJ, NHS, ABS Census.</div>
  </div>
  <div style="background: rgba(124, 58, 237, 0.08); border: 1px solid rgba(124, 58, 237, 0.3); border-radius: 8px; padding: 0.6rem 0.75rem;">
    <div style="font-size: 0.7rem; font-weight: 700; color: #a78bfa; margin-bottom: 0.3rem;">Bi-Encoder → Cross-Encoder</div>
    <div style="font-size: 0.7rem; line-height: 1.5; color: #8b949e;">Two-stage: fast vector retrieval (top 100), then precise pairwise scoring. <strong style="color: #e6edf3;">Sub-millisecond at 500K.</strong></div>
  </div>
  <div style="background: rgba(124, 58, 237, 0.08); border: 1px solid rgba(124, 58, 237, 0.3); border-radius: 8px; padding: 0.6rem 0.75rem;">
    <div style="font-size: 0.7rem; font-weight: 700; color: #a78bfa; margin-bottom: 0.3rem;">EnsembleLink</div>
    <div style="font-size: 0.7rem; line-height: 1.5; color: #8b949e;">Zero-shot record matching. <strong style="color: #e6edf3;">No training data or API calls.</strong> Handles nicknames, abbreviations, acronyms from pretrained knowledge.</div>
  </div>
  <div style="background: rgba(0, 212, 255, 0.05); border: 1px solid rgba(0, 212, 255, 0.2); border-radius: 8px; padding: 0.6rem 0.75rem;">
    <div style="font-size: 0.7rem; font-weight: 700; color: #00d4ff; margin-bottom: 0.3rem;">AWS Entity Resolution</div>
    <div style="font-size: 0.7rem; line-height: 1.5; color: #8b949e;">Managed service. $0.25/1K records. ML or rule-based modes. Black box but zero infra.</div>
  </div>
  <div style="background: rgba(0, 212, 255, 0.05); border: 1px solid rgba(0, 212, 255, 0.2); border-radius: 8px; padding: 0.6rem 0.75rem;">
    <div style="font-size: 0.7rem; font-weight: 700; color: #00d4ff; margin-bottom: 0.3rem;">Phonetic Matching</div>
    <div style="font-size: 0.7rem; line-height: 1.5; color: #8b949e;">Double Metaphone, Beider-Morse. Handles name variations across origins. Use as a Splink comparison level.</div>
  </div>
  <div style="background: rgba(0, 212, 255, 0.05); border: 1px solid rgba(0, 212, 255, 0.2); border-radius: 8px; padding: 0.6rem 0.75rem;">
    <div style="font-size: 0.7rem; font-weight: 700; color: #00d4ff; margin-bottom: 0.3rem;">DITTO</div>
    <div style="font-size: 0.7rem; line-height: 1.5; color: #8b949e;">Deep learning entity matching. Serializes records as text for BERT. SOTA on benchmarks. Needs labeled data.</div>
  </div>
</div>

<div style="margin-top: 0.5rem; padding: 0.4rem 0.75rem; background: rgba(124, 58, 237, 0.1); border-left: 3px solid #7c3aed; border-radius: 0 6px 6px 0; font-size: 0.75rem;">
  💬 Alternative pipeline: <strong>Splink</strong> (probabilistic, no labels) + <strong>Double Metaphone</strong> (name variations) + <strong>blocking</strong> on employer/location. Zero LLM cost.
</div>

---

# Case Association

<div style="font-size: 0.95rem; color: #8b949e; margin: -0.5rem 0 0.75rem;">Group findings into potential cases — same person, different sources.</div>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
  <div style="background: var(--gp-bg-surface); border: 1px solid var(--gp-border); border-radius: 8px; padding: 0.75rem 1rem;">
    <div style="font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: #00d4ff; margin-bottom: 0.4rem;">The Challenge</div>
    <div style="font-size: 0.8rem; line-height: 1.6; color: #8b949e;">
      ▸ Findings arrive over time, not all at once<br/>
      ▸ Same matter across TPB → ASIC → AFR<br/>
      ▸ Cases go dormant then reactivate<br/>
      ▸ Depends heavily on matcher quality
    </div>
  </div>
  <div style="background: var(--gp-bg-surface); border: 1px solid var(--gp-border); border-radius: 8px; padding: 0.75rem 1rem;">
    <div style="font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: #a78bfa; margin-bottom: 0.4rem;">The Options</div>
    <div style="font-size: 0.8rem; line-height: 1.6; color: #8b949e;">
      ▸ <strong style="color: #e6edf3;">LLMs</strong> — reason about connections<br/>
      ▸ <strong style="color: #e6edf3;">Community detection</strong> — Leiden, graphs<br/>
      ▸ <strong style="color: #e6edf3;">Incremental clustering</strong> — BIRCH, HDBSCAN<br/>
      ▸ <strong style="color: #e6edf3;">Rules</strong> — GROUP BY match ID
    </div>
  </div>
</div>

<div style="margin-top: 0.75rem; padding: 0.4rem 0.75rem; background: rgba(124, 58, 237, 0.1); border-left: 3px solid #7c3aed; border-radius: 0 6px 6px 0; font-size: 0.8rem;">
  <strong>Key insight:</strong> If matching resolves identities well, association is mostly <code>GROUP BY sf_match_id</code>
</div>

---

# The Non-LLM Association Landscape

<div style="font-size: 0.95rem; color: #8b949e; margin: -0.5rem 0 0.5rem;">25+ years of research on this exact problem — Topic Detection & Tracking.</div>

<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.6rem;">
  <div style="background: rgba(124, 58, 237, 0.08); border: 1px solid rgba(124, 58, 237, 0.3); border-radius: 8px; padding: 0.6rem 0.75rem;">
    <div style="font-size: 0.7rem; font-weight: 700; color: #a78bfa; margin-bottom: 0.3rem;">Leiden Algorithm</div>
    <div style="font-size: 0.7rem; line-height: 1.5; color: #8b949e;">Community detection on entity co-occurrence graphs. <strong style="color: #e6edf3;">Best-in-class</strong> for finding clusters in bipartite entity→document networks.</div>
  </div>
  <div style="background: rgba(124, 58, 237, 0.08); border: 1px solid rgba(124, 58, 237, 0.3); border-radius: 8px; padding: 0.6rem 0.75rem;">
    <div style="font-size: 0.7rem; font-weight: 700; color: #a78bfa; margin-bottom: 0.3rem;">HDBSCAN Soft Clustering</div>
    <div style="font-size: 0.7rem; line-height: 1.5; color: #8b949e;">Probability vectors for ambiguous findings. <strong style="color: #e6edf3;">Partial incremental support.</strong> Surfaces uncertainty rather than forcing hard assignments.</div>
  </div>
  <div style="background: rgba(124, 58, 237, 0.08); border: 1px solid rgba(124, 58, 237, 0.3); border-radius: 8px; padding: 0.6rem 0.75rem;">
    <div style="font-size: 0.7rem; font-weight: 700; color: #a78bfa; margin-bottom: 0.3rem;">Correlation Clustering</div>
    <div style="font-size: 0.7rem; line-height: 1.5; color: #8b949e;">Pairwise same/different labels. Streaming variants exist. <strong style="color: #e6edf3;">Supports analyst feedback</strong> via must-link/cannot-link constraints.</div>
  </div>
  <div style="background: rgba(0, 212, 255, 0.05); border: 1px solid rgba(0, 212, 255, 0.2); border-radius: 8px; padding: 0.6rem 0.75rem;">
    <div style="font-size: 0.7rem; font-weight: 700; color: #00d4ff; margin-bottom: 0.3rem;">BIRCH</div>
    <div style="font-size: 0.7rem; line-height: 1.5; color: #8b949e;">Only truly incremental hierarchical clustering in scikit-learn. <strong style="color: #e6edf3;">Single-pass, memory-bounded.</strong> Ideal for streaming findings.</div>
  </div>
  <div style="background: rgba(0, 212, 255, 0.05); border: 1px solid rgba(0, 212, 255, 0.2); border-radius: 8px; padding: 0.6rem 0.75rem;">
    <div style="font-size: 0.7rem; font-weight: 700; color: #00d4ff; margin-bottom: 0.3rem;">Energy Micro-Clusters</div>
    <div style="font-size: 0.7rem; line-height: 1.5; color: #8b949e;">Handles temporal gaps — dormancy + reactivation. <strong style="color: #e6edf3;">Cases that go quiet then resurface</strong> are the hard problem here.</div>
  </div>
  <div style="background: rgba(0, 212, 255, 0.05); border: 1px solid rgba(0, 212, 255, 0.2); border-radius: 8px; padding: 0.6rem 0.75rem;">
    <div style="font-size: 0.7rem; font-weight: 700; color: #00d4ff; margin-bottom: 0.3rem;">TDT (Topic Detection)</div>
    <div style="font-size: 0.7rem; line-height: 1.5; color: #8b949e;">25+ years of NIST research. <strong style="color: #e6edf3;">Maps exactly to our problem:</strong> first story detection + story linking across streaming news.</div>
  </div>
</div>

<div style="margin-top: 0.5rem; padding: 0.4rem 0.75rem; background: rgba(124, 58, 237, 0.1); border-left: 3px solid #7c3aed; border-radius: 0 6px 6px 0; font-size: 0.75rem;">
  💬 Simple path: <strong>GROUP BY sf_match_id</strong> (if matcher is good) + <strong>BIRCH</strong> (incremental) + <strong>analyst feedback</strong> (correlation clustering). No LLM needed.
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

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; margin-top: 0.25rem;">
  <div style="padding: 0.5rem 0.75rem; background: var(--gp-bg-surface); border: 1px solid var(--gp-border); border-radius: 6px; font-size: 0.8rem; line-height: 1.5;">
    <strong style="color: #a78bfa;">Extraction</strong><br/>
    <span style="color: #8b949e;">LLM for everything, or per-source extractors?</span>
  </div>
  <div style="padding: 0.5rem 0.75rem; background: var(--gp-bg-surface); border: 1px solid var(--gp-border); border-radius: 6px; font-size: 0.8rem; line-height: 1.5;">
    <strong style="color: #a78bfa;">Matching</strong><br/>
    <span style="color: #8b949e;">Two-stage pipeline (fuzzy → LLM) to cut cost?</span>
  </div>
  <div style="padding: 0.5rem 0.75rem; background: var(--gp-bg-surface); border: 1px solid var(--gp-border); border-radius: 6px; font-size: 0.8rem; line-height: 1.5;">
    <strong style="color: #a78bfa;">Association</strong><br/>
    <span style="color: #8b949e;">Does this even need AI? Rules + embeddings?</span>
  </div>
  <div style="padding: 0.5rem 0.75rem; background: var(--gp-bg-surface); border: 1px solid var(--gp-border); border-radius: 6px; font-size: 0.8rem; line-height: 1.5;">
    <strong style="color: #00d4ff;">Model choice</strong><br/>
    <span style="color: #8b949e;">Same model for all 3 tasks? Haiku vs Sonnet?</span>
  </div>
  <div style="padding: 0.5rem 0.75rem; background: var(--gp-bg-surface); border: 1px solid var(--gp-border); border-radius: 6px; font-size: 0.8rem; line-height: 1.5;">
    <strong style="color: #00d4ff;">Evaluation</strong><br/>
    <span style="color: #8b949e;">How to measure quality? Need a labeled test set?</span>
  </div>
  <div style="padding: 0.5rem 0.75rem; background: var(--gp-bg-surface); border: 1px solid var(--gp-border); border-radius: 6px; font-size: 0.8rem; line-height: 1.5;">
    <strong style="color: #00d4ff;">Cost at scale</strong><br/>
    <span style="color: #8b949e;">When does training a custom model pay off?</span>
  </div>
</div>
