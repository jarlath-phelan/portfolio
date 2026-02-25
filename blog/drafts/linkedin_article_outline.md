# LinkedIn Article Outline
## "What Changes When Your A/B Test Results Go to Court"

**Target length:** 1,200–1,500 words (5-7 min read)
**Publish on:** LinkedIn
**Tone:** Practitioner sharing hard-won lessons. Analytical but accessible. No jargon gatekeeping.

---

### Hook (2-3 sentences)

Most A/B tests are designed to convince a product manager. Mine had to convince a judge. For several years, I ran an experimentation program that became central evidence in antitrust proceedings across the EU, Japan, and South Korea — proceedings that ultimately resulted in a €1.84 billion fine. Here's what I learned about what "rigorous" actually means when the stakes go beyond a dashboard metric.

---

### Section 1: The Standard Bar vs. the Legal Bar

**Key point:** In product experimentation, "statistically significant at p < 0.05" is usually enough. In a legal setting, it's the starting line.

- In product work, you run an experiment, get a result, ship or don't ship. Nobody cross-examines your methodology.
- In a legal case, opposing counsel's job is to find every flaw in your design, every assumption you didn't justify, every alternative explanation you didn't rule out.
- The bar isn't "is this result probably real?" It's "can you defend every methodological choice under hostile questioning?"

**What changed in practice:**
- Pre-registration became non-negotiable (can't move the goalposts after seeing results)
- Every design decision needed a written rationale *before* data collection
- We had to document what we *didn't* do and why (e.g., why this control group, why not that one)

---

### Section 2: Persistence Testing — The Question Nobody Asks in Product

**Key point:** Product teams care about "did it work?" Legal teams care about "did it keep working, and can you prove it wasn't a fluke?"

- Most product experiments run for 2-4 weeks. Ours ran for years.
- The core finding — a 20% conversion decline — had to be shown as persistent, not a temporary artifact of novelty effects, seasonal variation, or market shifts.
- This required a different analytical framework: not just "before vs. after" but "sustained causal impact over time with controls for confounding trends."
- We used approaches from causal inference (mentioning synthetic control, difference-in-differences) that are standard in economics but rare in product data science.

**The lesson for product teams:** Even if you're not going to court, asking "does this effect persist?" is one of the most underrated questions in experimentation. Most teams declare victory on week-2 results and never look back.

---

### Section 3: Multi-Jurisdiction Complexity

**Key point:** Running the same experiment across 40+ markets and 3 legal jurisdictions forces you to think about external validity in a way that single-market A/B tests never do.

- What works in Sweden doesn't necessarily replicate in Japan. Regulatory environments, user behavior, payment infrastructure — all different.
- We had to demonstrate that the effect was robust across countries, not just in the aggregate.
- This meant designing experiments that could be analyzed both pooled and per-market, with appropriate corrections for multiple comparisons (Hochberg's step-up procedure across experimental phases).
- The multi-jurisdiction angle also meant coordinating with legal teams in three different regulatory frameworks, each with different evidentiary standards.

**The lesson:** If your experiment only runs in one market, you're measuring a local effect, not a generalizable one. Cross-market replication is the strongest form of validation — and it's almost never done in product experimentation.

---

### Section 4: Third-Party Validation and What It Taught Me

**Key point:** Having your methodology reviewed by PhD statisticians and an economic consultancy (Compass Lexecon) changes how you think about your own work.

- Compass Lexecon independently estimated the revenue impact at approximately $100 million in missed revenue from the restrictions we measured.
- Their review wasn't "does this look right?" It was "show us every assumption, every sensitivity analysis, every robustness check."
- This experience permanently raised my personal standard for what "rigorous" means. I can't unsee the gaps that most product experimentation leaves open.

**The lesson:** If you've never had your methodology reviewed by someone whose job is to find holes in it, you probably have blind spots you don't know about. Seek out adversarial review — it makes your work better.

---

### Section 5: What I'd Bring Back to Product Work

**Key point:** You don't need to be going to court to apply these principles. Three things every product experimentation program should steal from the legal standard:

1. **Pre-register your hypotheses and analysis plan.** Not because a judge will ask, but because future-you will thank past-you for not being able to cherry-pick results.

2. **Test for persistence.** Run follow-up analyses at 3 months, 6 months, a year after launch. If the effect decayed, you need to know.

3. **Seek adversarial review.** Find the most skeptical person on your team and ask them to break your methodology before you present results. If they can't, you're in good shape. If they can, you just avoided a bad decision.

---

### Closing (2-3 sentences)

The €1.84 billion fine got the headlines. But for me, the lasting impact was learning what rigor actually looks like when the consequences are real. Most of us in data science will never have our work tested in court — but we'd all do better work if we designed experiments as if it might be.

---

## Notes for Jarlath

**What to keep vague:**
- Don't name Spotify (even though it's public record). Let readers connect the dots. This keeps it professional and avoids any employer sensitivity.
- Don't name Apple either — say "a major platform" or "the platform in question." The €1.84B and "EU antitrust" will make it obvious.
- Don't share any actual data, methodology details that could be proprietary, or internal Spotify tooling.

**What to make specific:**
- The €1.84B figure is public record (European Commission press release, March 2024). You can cite it.
- Compass Lexecon's involvement is public (they're named in court filings). You can reference them.
- The jurisdictions (EU, Japan, South Korea) are public.
- Hochberg's step-up correction and synthetic control are standard methods — fine to mention.

**Before publishing:**
- Consider whether Spotify has any social media / public communications guidelines that apply to former employees. Most companies don't restrict discussion of publicly available case outcomes, but worth checking.
- Keep it focused on methodology, not on Spotify vs. Apple specifics. You're writing about *what you learned about experimentation*, not relitigating the case.

**Potential reach:**
- This sits at the intersection of data science + legal + antitrust, which is a niche that very few people write about from first-hand experience. The €1.84B number will get clicks. The methodology content will earn respect.
- Good hashtags: #DataScience #Experimentation #CausalInference #ABTesting #Antitrust

*Last updated: February 13, 2026*
