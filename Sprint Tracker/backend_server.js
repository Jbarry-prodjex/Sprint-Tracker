const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// JIRA Configuration
const JIRA_CONFIG = {
    baseURL: 'https://adapthealth.atlassian.net',
    email: 'joe.barry@adapthealth.com',
    apiToken: 'ATATT3xFfGF0RhEtvPgm0Ofls86GSObPT_zBItqSw3EAIom75TMxUpmIcdyBajwmihEECByy6_UyF5U_0FDzZ84fy-JoWwRIaTHAncP3MOAXh4mIEZ5h4cGn-4tI0sngi6QPbzZBaDAz0dvLPyjUNZDLZEOQBAmn_Vz-6O5N3XdNZU0hUfniLWU=55C6988F',
    jql: `issuetype in (Story, Bug, MuleSoft, myAPP, OTL, Sub-Bug) AND sprint in openSprints() AND project in (ORW, RDCA, myAPP, OTL, "AppDev - Run Work", "Update Patient", "Digital Intake Form", "Billing edit - Run Work ", "Inventory Dashboard", "CarePort Intake", EligibilityMatrix) AND project = PPDV ORDER BY project`
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize SQLite Database
const db = new sqlite3.Database('./sprint_tracker.db');

// Create tables
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            issue_key TEXT NOT NULL,
            column_name TEXT NOT NULL,
            note_content TEXT,
            last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(issue_key, column_name)
        )
    `);
});

// JIRA API Helper
async function fetchJIRAIssues() {
    try {
        const auth = Buffer.from(`${JIRA_CONFIG.email}:${JIRA_CONFIG.apiToken}`).toString('base64');
        
        const response = await axios.get(`${JIRA_CONFIG.baseURL}/rest/api/3/search`, {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Accept': 'application/json'
            },
            params: {
                jql: JIRA_CONFIG.jql,
                maxResults: 100,
                fields: 'key,summary,assignee,status,creator,priority,issuetype'
            }
        });

        return response.data.issues.map(issue => ({
            key: issue.key,
            summary: issue.fields.summary,
            assignee: issue.fields.assignee?.displayName || 'Unassigned',
            status: issue.fields.status?.name || 'Unknown',
            creator: issue.fields.creator?.displayName || 'Unknown',
            priority: issue.fields.priority?.name || 'Medium',
            issueType: issue.fields.issuetype?.name || 'Story'
        }));
    } catch (error) {
        console.error('Error fetching JIRA issues:', error.response?.data || error.message);
        throw new Error('Failed to fetch JIRA issues');
    }
}

// API Routes

// Get all JIRA issues with notes
app.get('/api/issues', async (req, res) => {
    try {
        const issues = await fetchJIRAIssues();
        
        // Get all notes from database
        db.all('SELECT * FROM notes', (err, notes) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            // Organize notes by issue key
            const notesByIssue = {};
            notes.forEach(note => {
                if (!notesByIssue[note.issue_key]) {
                    notesByIssue[note.issue_key] = {};
                }
                notesByIssue[note.issue_key][note.column_name] = note.note_content;
            });

            // Attach notes to issues
            const issuesWithNotes = issues.map(issue => ({
                ...issue,
                notes: notesByIssue[issue.key] || {}
            }));

            res.json(issuesWithNotes);
        });
    } catch (error) {
        console.error('Error in /api/issues:', error);
        res.status(500).json({ error: error.message });
    }
});

// Save or update a note
app.post('/api/notes', (req, res) => {
    const { issueKey, columnName, noteContent } = req.body;

    if (!issueKey || !columnName) {
        return res.status(400).json({ error: 'Issue key and column name are required' });
    }

    db.run(`
        INSERT OR REPLACE INTO notes (issue_key, column_name, note_content, last_updated)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    `, [issueKey, columnName, noteContent], function(err) {
        if (err) {
            console.error('Error saving note:', err);
            return res.status(500).json({ error: 'Failed to save note' });
        }
        res.json({ success: true, id: this.lastID });
    });
});

// Get all notes for an issue
app.get('/api/notes/:issueKey', (req, res) => {
    const { issueKey } = req.params;
    
    db.all('SELECT * FROM notes WHERE issue_key = ?', [issueKey], (err, notes) => {
        if (err) {
            console.error('Error fetching notes:', err);
            return res.status(500).json({ error: 'Failed to fetch notes' });
        }
        
        const notesByColumn = {};
        notes.forEach(note => {
            notesByColumn[note.column_name] = note.note_content;
        });
        
        res.json(notesByColumn);
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve the main application
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 JIRA Sprint Tracker running on port ${PORT}`);
    console.log(`📊 Access your tracker at: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('📦 Database connection closed.');
        }
        process.exit(0);
    });
});