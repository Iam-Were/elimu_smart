Check if a backend Cloud Function exists and show its location.

Usage: `/check-backend <functionName>`

Examples:
- `/check-backend getRiasecQuestions`
- `/check-backend calculateCareerReadinessScore`
- `/check-backend exploreCareers`

Returns:
- File location (e.g., backend/cloud/assessmentFunctions.js)
- Line number if in main.js
- Integration status (integrated or available)
- Frontend component that uses it (if integrated)

Read from: `.claude/quick-reference.json`
