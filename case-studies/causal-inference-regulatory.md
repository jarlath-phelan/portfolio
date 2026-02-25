# Case Study: Causal Inference Under Legal Scrutiny

## Subtitle
When your A/B test results go to court — experimentation methodology at the highest stakes

## Status
Outline — needs full write-up (see blog/drafts/linkedin_article_outline.md for article version)

---

## Context

A major platform faced antitrust proceedings across the EU, Japan, and South Korea. The core question: did restrictions imposed by a third-party marketplace cause measurable harm to the platform's revenue and user acquisition? The analysis needed to quantify economic impact over multiple years, across multiple countries, and withstand adversarial scrutiny from opposing legal counsel and their retained PhD statisticians.

## Role

Led the causal analysis measuring the impact of marketplace restrictions on conversion rates, revenue, and user acquisition. Worked with legal teams, external economics consultants, and cross-functional product teams.

## Approach

### The Standard Bar vs. the Legal Bar
- In product experimentation, p < 0.05 is usually enough. In legal proceedings, it's the starting line.
- Opposing counsel's job was to find every flaw in the design, every unjustified assumption, every alternative explanation not ruled out.
- Pre-registration became non-negotiable. Every design decision needed written rationale before data collection.
- Had to document what we *didn't* do and why.

### Persistence Testing
- Most product experiments run for 2–4 weeks. This analysis covered years.
- The core finding — a ~20% conversion decline — had to be shown as persistent, not a temporary artifact of novelty effects, seasonal variation, or market shifts.
- Required causal inference frameworks from economics (synthetic control, difference-in-differences) that are standard in academic settings but rare in product data science.

### Multi-Jurisdiction Complexity
- Effect sizes varied by country due to regulatory environments, market maturity, and platform penetration.
- Couldn't simply pool all data — had to demonstrate the effect held across distinct markets while explaining legitimate variation.
- Country-level analysis required careful handling of small-sample markets without cherry-picking favorable results.

### Third-Party Validation
- A leading economics consulting firm independently validated the methodology.
- Opposing counsel retained their own PhD statisticians to challenge the analysis — it survived their scrutiny.

## Impact

- Estimated ~$100M in missed revenue with sustained ~20% conversion decline
- Analysis directly contributed to a regulatory fine of €1.84 billion
- Established a measurement framework that continues to be used

## Techniques Used

Quasi-experimental design, synthetic control, difference-in-differences, counterfactual estimation, multi-jurisdiction analysis, persistence testing over multi-year timeframes

## Lessons Learned

- "Does this effect persist?" is one of the most underrated questions in experimentation — most teams declare victory on week-2 results and never look back
- The rigor demanded by legal scrutiny (pre-registration, assumption documentation, alternative explanation testing) should be the standard for all high-stakes product decisions
- Cross-country analysis requires respecting heterogeneity, not assuming a single global effect
- Having your methodology independently validated is uncomfortable but makes the work stronger

---

*Note: Company names omitted. Based on real work in public regulatory proceedings; all outcomes are matters of public record.*
