require('dotenv').config();
console.log('--- Supabase Connection Diagnostics ---');
console.log('SUPABASE_URL loaded:', !!process.env.SUPABASE_URL ? 'Yes' : 'No');
console.log('SUPABASE_SERVICE_ROLE_KEY loaded:', !!process.env.SUPABASE_KEY ? 'Yes' : 'No');
console.log('------------------------------------');
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3001;

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error("Supabase URL or Service Role Key is not set in environment variables.");
    process.exit(1); // Exit if essential env variables are missing
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json

// Import and mount event routes
const exercisesRouter = require('./routes/exercises');
app.use('/api/v1/exercises', exercisesRouter);

// Basic route for testing server
app.get('/', (req, res) => {
    res.send('API Server is running!');
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: "error",
        error: {
            code: "internal_server_error",
            message: "Something went wrong!"
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`API Server listening at http://localhost:${port}`);
});