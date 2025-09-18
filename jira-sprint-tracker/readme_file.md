# JIRA Sprint Tracker

Real-time JIRA Sprint Tracking Application with collaborative notes.

## Features

- Real-time JIRA integration
- Collaborative team notes
- Auto-saving functionality
- Mobile-friendly interface
- No authentication required

## Deployment

### Environment Variables

Set these in your Render dashboard:

- `JIRA_EMAIL`: your-email@adapthealth.com
- `JIRA_TOKEN`: your-jira-api-token
- `JIRA_BASE_URL`: https://adapthealth.atlassian.net

### Render Settings

- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Node Version**: 16 or higher

## Usage

1. Click "Refresh JIRA Data" to load current sprint issues
2. Add notes in the daily columns (Notes 9.15, 9.16, etc.)
3. Notes save automatically and persist between sessions
4. Share the deployment URL with your team for collaborative tracking

## Local Development

```bash
npm install
npm start
```

Visit http://localhost:3000

## File Structure

```
jira-sprint-tracker/
├── server.js          # Backend API server
├── package.json       # Dependencies
├── public/
│   └── index.html     # Frontend interface
└── README.md          # This file
```

## Support

For issues or questions, check the Render logs in your dashboard.