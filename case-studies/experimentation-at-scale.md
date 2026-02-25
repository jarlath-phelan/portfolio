# Case Study: Experimentation at Scale

## Subtitle
Building and scaling an experimentation culture across a global consumer product

## Status
Outline — needs full write-up

---

## Context

At a major music streaming platform (200M+ users, 40+ markets), the experimentation culture was fragmented. Individual teams ran tests independently, with no shared standards for hypothesis development, metric selection, or result communication. The experimentation platform existed but adoption was uneven.

## Role

Invited to join the experimentation platform advisory panel. Charged with standardizing how experiments were designed and measured across business units.

## Key Contributions

### 1. Experimentation Standards
- Defined best practices for hypothesis development, metric selection, test structure, and results communication
- Created a framework that enabled consistent experimentation across very different product contexts (conversion funnels, retention, content ranking, pricing)

### 2. Platform Integration
- Bridged the marketing campaign platform and the experimentation platform
- When a marketer configured a landing page, the system automatically created an experiment with the right metrics, configuration, and cross-system links
- Enabled non-technical marketers to run data-driven tests without requiring a data scientist for each one

### 3. Multi-Market Phased Rollouts
- Designed rollout strategy for a major recommendation system change across 40+ markets
- Clustered countries by statistical power to create meaningful test groups
- Applied multiple comparison corrections (Hochberg step-up) across 6 experimental phases
- Leading indicator: Week 2 retention significant across all markets
- North Star outcome: 2M incremental monthly active users

### 4. Component-Level Testing
- Ran 30+ experiments on conversion funnels, including ablation tests isolating individual component contributions
- Discovered counterintuitive platform-specific behavior (engagement elements on iOS increasing conversion despite no in-app checkout — users left app to convert externally)

## Impact

- Experimentation velocity increased across the organization
- Non-technical teams gained self-service experimentation capability
- Major product launches used the standardized framework for measurement
- 2M incremental MAU from the recommendation system rollout alone

## Techniques Used

Randomized controlled trials, ablation testing, phased global rollouts with statistical power clustering, Hochberg step-up correction for multiple comparisons, smokescreen experiments, holdout control groups

## Lessons Learned

- Scaling experimentation is more about systems and standards than individual test design
- Enabling non-technical teams to run tests multiplies the organization's learning rate
- Multi-market rollouts need statistical sophistication beyond simple A/B testing
- Counterintuitive results (like the iOS carousel) are only found when you test at the component level

---

*Note: Company and product details de-identified. Based on real work; all outcomes are factual.*
