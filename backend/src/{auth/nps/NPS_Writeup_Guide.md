# NPS Project — Write-up Guide

**How to use this:** the left side of each section tells you *what to write about* and
*what question to answer*. The Facts Sheet at the bottom has every number and decision you
produced, so you don't have to dig through the notebook. **Write the actual sentences
yourself, in your own words** — the challenge specifically wants the report to be authored
by you, and a reader can tell the difference between your reasoning and generic text.

Target length: **3–6 pages**. Audience: **a non-technical Customer Experience director**.
Lead with the business story; keep jargon out or explain it in one line.

---

## Part 1 — The structure (what goes in each section)

### Cover page
- Title (e.g. "Predicting Customer NPS for Proactive Retention"), your name, date.
- The uploaded report-structure reading stresses this: don't skip the cover page or the date.

### Executive summary (½ page, write this LAST)
Three short paragraphs a busy director can read alone:
- The problem (only ~15% answer the NPS survey; we want to find unhappy customers among the rest).
- What you built (a model that flags likely Detractors + a simple app for the retention team).
- The honest headline (the signal is weak but usable; you catch ~62% of Detractors; the
  biggest lever is contract type; there are fairness gaps to watch).

### 1. Business problem & how you framed it
- Restate the goal in business terms: prioritise outreach to likely Detractors before they churn.
- Explain the framing choice: NPS is **ordered** (Detractor < Passive < Promoter), so you
  treated it as a 3-class ordered problem and judged models on order-aware metrics — *not* a
  binary or plain multiclass problem. Say why.

### 2. Building the target (and the leakage decision)
- How you turned Satisfaction Score (1–5) into Detractor / Passive / Promoter, and why.
- **The leakage story — your strongest section.** Show the evidence (satisfaction 1–2 = 100%
  churn; Churn Value correlates −0.76). Explain why keeping those columns would make the model
  look great but be useless in production, and that you dropped all of them.
- Explain the inverted class balance (more Detractors than Promoters) and *why* it happens.

### 3. Data preparation & validation
- What you kept / dropped / transformed (schema). Mention dropping ID and location columns.
- Structural missing values (Offer, Internet Type) handled as a real category, not the mode.
- The train/test split and — importantly — the **caveat**: the test set is made of survey
  responders, so the score is optimistic for the silent 85%. Say what you'd do about it.

### 4. Features
- The features you built and the one-line reason for each.
- Keep it short: quality over quantity is the point.

### 5. Modelling & evaluation
- The disciplined baseline first (Logistic Regression), then the stronger model (Gradient Boosting).
- **Why accuracy alone is misleading** here (always guessing "Detractor" gives 0.58).
- The metrics you chose and why: QWK (respects the order), per-class **Detractor recall** (the
  business metric), macro-F1.
- The comparison table (Facts Sheet has it). State the honest trade-off and which model you
  chose and why.
- *(Optional, strong)* cite Kannan et al. as a foil — see Facts Sheet.

### 6. Fairness check
- Detractor recall is not equal across groups. Show the gaps (age, dependents).
- What you'd flag to a CX / Legal team before going live, in plain language.

### 7. Drivers of detraction & recommendation
- Where Detractors concentrate (contract, internet type, new customers; the 85% high-risk segment).
- Actionable vs non-actionable drivers.
- **One clear recommendation:** for a predicted Detractor, the most likely lever is a longer contract.
- The honesty note: these are correlations, not proof (the Online Security counter-example).

### 8. The tool (app)
- One paragraph + a screenshot. Two modes, shows class + probabilities + drivers; handles
  missing inputs gracefully. Built for a retention manager, not a data scientist.

### 9. Limitations & next steps
- Weak signal once leakage removed; test set ≠ silent majority; correlations not causation;
  fairness gaps; small feature set.
- Next steps: collect random-sample surveys from the silent group; test the contract lever with
  a real experiment; revisit the fairness gaps.

### Appendix / References
- Cite the two reference papers. Note your AI usage (required).

---

## Part 2 — Facts Sheet (your verified numbers)

### Dataset
- IBM Telco Customer Churn, **Cognos v11.1.3+**, **7,043 customers**.
- 5 files merged on `Customer ID` (+ population on `Zip Code`) → **7,043 × 51**.
- **Chose the Cognos dataset, not the simple CSV** — only Cognos has the `Satisfaction Score`
  needed to build the NPS target. The simple CSV is a strict subset (same 7,043 customers).

### Target & leakage
- Mapping: **5 → Promoter, 4 → Passive, ≤3 → Detractor**.
- Leakage proof: Satisfaction Score **1 and 2 → 100% churned**; `Churn Value` correlates
  **−0.755** with satisfaction.
- Dropped 7 leaking columns: `Satisfaction Score` (becomes target), `Churn Value`,
  `Churn Score`, `Churn Label`, `Customer Status`, `Churn Category`, `Churn Reason`. → **7,043 × 45**.
- Kept `CLTV` (weak correlation) with a note to watch it.

### Class distribution (inverted vs a typical survey)
| Class | Count | Share |
|---|---|---|
| Detractor | 4,105 | 58.3% |
| Passive | 1,789 | 25.4% |
| Promoter | 1,149 | 16.3% |
- Reason it's detractor-heavy: every churned customer sits at score 1–2, so unhappy customers
  are over-represented in the answered surveys.

### Missing values (structural, not random)
- `Offer` missing 3,877; `Internet Type` missing 1,526.
- Filled as a category: `Offer → "None"`, `Internet Type → "No internet"` (not the mode).

### Features built (each with a reason)
- `num_services`, `charge_per_service`, `is_new_customer`, `is_autopay`.
- Signal check: new customers detract at **67%** vs **54%** for older ones. → **7,043 × 49**.

### Split
- Stratified **75/25**: **5,282 train / 1,761 test**, **39 feature columns**.
- Class balance identical in both sets (58.3 / 25.4 / 16.3).
- Caveat: test set = survey responders → optimistic for the silent 85%.

### Model results (test set)
| Model | Accuracy | Macro-F1 | QWK | Detractor recall |
|---|---|---|---|---|
| Always "Detractor" (naive) | 0.583 | 0.246 | 0.000 | 1.000* |
| Logistic Regression (baseline) | 0.478 | 0.436 | **0.302** | 0.486 |
| Gradient Boosting (chosen) | **0.506** | 0.435 | 0.276 | **0.616** |

\*the naive model "catches" all Detractors only by calling everyone a Detractor — useless, which
is why you look at the other metrics too.

Per-class recall:
- Baseline: Detractor **0.49**, Passive **0.23**, Promoter **0.84**.
- Gradient Boosting: Detractor **0.62**, Passive **0.30**, Promoter **0.43**.

**Decision:** chose Gradient Boosting for the higher **Detractor recall** (the business goal),
noting honestly its QWK is slightly lower than the baseline.

### Top features (permutation importance, no leakage)
Online Security, Contract, Monthly Charge, Internet Service, CLTV, Payment Method,
Number of Referrals, num_services.

### Fairness — Detractor recall by group (overall 0.616)
| Group | Recall |
|---|---|
| Female / Male | 0.61 / 0.62 (ok) |
| No dependents / Has dependents | 0.66 / **0.44** |
| Age 18–35 / 35–50 / 50–65 / 65+ | **0.54** / 0.59 / 0.66 / **0.75** |
| Senior: No / Yes | 0.59 / 0.74 |
| Married: No / Yes | 0.66 / 0.56 |
- Gaps to escalate: **young customers** and **customers with dependents** are caught less well.

### Drivers of detraction (detractor rate by segment; overall 0.583)
- Contract: Month-to-Month **0.683**, One Year 0.493, Two Year **0.465**.
- Internet Type: Fiber 0.674, Cable 0.617, DSL 0.579, No internet 0.386.
- New (≤12 mo) **0.675** vs older 0.541.
- **High-risk crossed segment: new + month-to-month + fiber = 0.846** (n=839) vs tenured +
  two-year = 0.481.
- Biggest **actionable** lever: **Contract** — Month-to-Month vs Two-Year is a **22-point** swing.
- **Recommendation:** for a predicted Detractor, move them to a longer contract (with an incentive).
- **Honesty (correlation ≠ causation):** `Online Security = Yes` shows a *higher* detractor rate
  (0.68 vs 0.54) — likely reverse causation (people add security after problems). The model shows
  *where* detractors are, not *why*. Test the contract idea with a real experiment.

### Reproducibility
- Deterministic pipeline, seed **42** everywhere, raw data → prediction with Restart & Run All.

### References (cite both; the brief lists them)
- TM Forum / Prodapt, "Improving NPS using ML" (2021) — confirms the 15–20% non-response framing.
- Kannan et al., "Prediction of tNPS Using ML" (2022) — **use as a foil**: they report
  F-score 0.876 but binarised NPS and that headline hides a minority-class F-measure of ~0.1–0.2.
  You keep the 3-class ordered target and report per-class Detractor recall, which avoids exactly
  that masking.

### AI usage (required disclosure — put a short note in the report/README)
State plainly what you used AI for (e.g. scaffolding code, structuring the notebook) and that the
analysis decisions, interpretation, and this write-up are your own.

---

## Quick self-check before you submit (from the report-writing reading you have)
- Did you tell the reader, up front, what they gain by reading it?
- Is the aim clear? Is the significance of the contribution explained?
- Did you address practicality / usefulness (the app + the recommendation)?
- Did you identify future developments (next steps)?
- Is it structured clearly and logically?

**Separate reminder:** the *cover letter* for the job (not this report) must include the word
**"curiosité"** — that was the hidden instruction in the job posting.
