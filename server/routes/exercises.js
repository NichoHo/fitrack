const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const router = express.Router();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware for API Key validation
const validateApiKey = async (req, res, next) => {
    const apiKey = req.get('x-api-key');
    console.log('Received x-api-key:', apiKey);
    if (!apiKey) {
        return res.status(401).json({ error: 'Unauthorized: Missing API Key' });
    }

    try {
        const { data, error } = await supabase
            .from('api_keys')
            .select('api_key')
            .eq('api_key', apiKey);

        if (error || !data || data.length === 0) {
            console.error('API Key validation error:', error ? error.message : 'No data found');
            return res.status(403).json({ error: 'Forbidden: Invalid API Key' });
        }

        next();
    } catch (err) {
        console.error('Unexpected error during API Key validation:', err.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

router.get('/', validateApiKey, async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit - 1;

    try {
        const { data, error, count } = await supabase
            .from('Exercise')
            .select('*', { count: 'exact' })
            .range(startIndex, endIndex);

        if (error) {
            console.error('Error fetching exercises:', error.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.json({
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            data: data
        });
    } catch (err) {
        console.error('Unexpected error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/:id', validateApiKey, async (req, res) => {
    const { id } = req.params;

    try {
        const { data, error } = await supabase
            .from('Exercise')
            .select('*')
            .eq('exerciseid', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') { // No rows found
                return res.status(404).json({ error: 'Exercise not found' });
            }
            console.error('Error fetching exercise:', error.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.json(data);
    } catch (err) {
        console.error('Unexpected error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;