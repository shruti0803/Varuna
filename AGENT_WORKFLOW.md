# AI Agent Workflow Log

## Agents Used
- **ChatGPT (GPT-5 mini)** – Main agent for coding, troubleshooting, and generating documentation.
- **Claude Code** – Assisted with refactoring complex React components.
- **Copilot / VS Code inline completions** – Used for boilerplate React + Tailwind patterns.
- **MakerSuite (Gemini)** – Generated MCQs dynamically for helpers.

## Prompts & Outputs






### Example 1: Prisma backend adjustments
**Prompt:**  
> "Fix BankingRecord fetch error with Prisma in Postgres without changing schema."

**Generated Output:**  
- Corrected Prisma import and model usage.
- Verified `BankingRecord` table name and column names matched schema.

## Validation / Corrections
- Verified React component state updates correctly with dummy data.
- Checked Axios POST requests for banking/apply return correct simulated values.
- Confirmed Prisma schema aligns with backend controllers (`BankingRecord`, `BankEntry`).
- Fixed console errors (`Cannot read properties of undefined`).

## Observations
- **Saved time:** Generating full React components with fallback logic and API integration.
- **Failures / hallucinations:** Initial suggestions assumed schema changes, which were not allowed.
- **Tool combination:** Used ChatGPT for logic + Claude for component refactor + Copilot for repetitive Tailwind code.

## Best Practices Followed
- Always preserve API calls, fallback to dummy data.
- Used `useMemo` and `useEffect` properly for derived calculations.
- Checked async/await API calls with try/catch.
- Proper button disable logic based on computed CB values.
- Logs included for debugging API responses and fallback behavior.
