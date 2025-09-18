# JIRA Sprint Tracker - Deployment Guide

## 🚀 Quick Deployment to Railway

### Step 1: Prepare Your Files

Create a new folder on your computer and add these files:

1. **server.js** - The backend server code
2. **package.json** - Dependencies configuration  
3. **railway.json** - Deployment configuration
4. **public/index.html** - The frontend web app (rename the HTML artifact)

### Step 2: Deploy to Railway

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub (recommended)

2. **Create New Project**
   - Click "Deploy from GitHub repo"
   - Or click "Deploy Now" → "Empty Project"

3. **Upload Your Code**
   - If using GitHub: Push your code to a repository and connect it
   - If using Railway CLI: Install Railway CLI and run `railway up`
   - Or drag and drop your project folder into Railway dashboard

4. **Environment Variables**
   - Your JIRA credentials are already in the code, but for security you should set them as environment variables:
   - Go to your Railway project → Variables tab
   - Add these variables:
     - `JIRA_EMAIL`: joe.barry@adapthealth.com
     - `JIRA_TOKEN`: ATATT3xFfGF0mNOaIzuraUpri-PsRmh8goA2nUbZ-3TMlztfxTF3zGH5vwXZ1apbrjdbKHGGB9ARSKYlyMHyEiG0BiiPSHGK3BqpOLb8dxK8lPQLOSuCtFOJDvUkYHBa-B7bJh4tGIUP2BeZyLwPj0RrBMQ0dBdGkznSTMn2zZnnZLRsZ34PmcI=F7849512
     - `JIRA_BASE_URL`: https://adapthealth.atlassian.net

5. **Deploy**
   - Railway will automatically build and deploy your app
   - You'll get a URL like: `https://your-app-name.up.railway.app`

### Step 3: Set Up Project Structure

Your project folder should look like this:
```
jira-sprint-tracker/
├── server.js
├── package.json
├── railway.json
├── public/
│   └── index.html
└── README.md
```

### Step 4: Test Your Deployment

1. Visit your Railway URL
2. Click "Refresh JIRA Data" 
3. Verify it loads your actual JIRA issues
4. Test adding notes to make sure they save

## 🔧 Alternative: Deploy to Render

If you prefer Render over Railway:

1. Go to [render.com](https://render.com)
2. Create account and new Web Service
3. Connect your GitHub repo or upload files
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add the same environment variables

## 📱 Sharing with Your Team

Once deployed, you'll have a public URL like:
`https://your-jira-tracker.up.railway.app`

Simply share this URL with your 5 team members. No login required!

## 🔧 Updating Environment Variables (Security Best Practice)

Update the server.js file to use environment variables instead of hardcoded credentials:

```javascript
const JIRA_CONFIG = {
    baseURL: process.env.JIRA_BASE_URL || 'https://adapthealth.atlassian.net',
    email: process.env.JIRA_EMAIL || 'joe.barry@adapthealth.com',
    apiToken: process.env.JIRA_TOKEN || 'ATATT3xFfGF0mNOaIzuraUpri-PsRmh8goA2nUbZ-3TMlztfxTF3zGH5vwXZ1apbrjdbKHGGB9ARSKYlyMHyEiG0BiiPSHGK3BqpOLb8dxK8lPQLOSuCtFOJDvUkYHBa-B7bJh4tGIUP2BeZyLwPj0RrBMQ0dBdGkznSTMn2zZnnZLRsZ34PmcI=F7849512',
    jql: `issuetype in (Story, Bug, MuleSoft, myAPP, OTL, Sub-Bug) AND sprint in openSprints() AND project in (ORW, RDCA, myAPP, OTL, "AppDev - Run Work", "Update Patient", "Digital Intake Form", "Billing edit - Run Work ", "Inventory Dashboard", "CarePort Intake", EligibilityMatrix) AND project = PPDV ORDER BY project`
};
```

## 🎯 Features Included

✅ **Real-time JIRA Integration** - Pulls live data from your filter
✅ **Persistent Notes** - Team notes saved to SQLite database  
✅ **Collaborative Editing** - Everyone can see and edit all notes
✅ **Auto-save** - Notes save automatically as you type
✅ **On-demand Refresh** - Update JIRA data without losing notes
✅ **Mobile Friendly** - Works on phones and tablets
✅ **No Authentication** - Share URL with team for instant access

## 🔍 Troubleshooting

**"Error fetching JIRA data"**
- Check that your API token is valid
- Verify the JIRA filter URL works in your browser
- Ensure your Railway app has the environment variables set

**Notes not saving**
- Check browser console for errors  
- Verify the database file has write permissions

**App won't load**
- Check Railway logs in the dashboard
- Ensure all files are in the correct structure

## 📊 Usage

1. **Daily Standup**: Open the URL, click refresh to get latest JIRA status
2. **Add Notes**: Click in any Notes column to add your daily updates
3. **Team Collaboration**: Everyone sees real-time updates from teammates
4. **Status Tracking**: JIRA statuses update automatically on refresh

Your team now has a real-time, collaborative JIRA sprint tracker! 🎉