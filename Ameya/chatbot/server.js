import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());
app.use(cors());

// Map friendly names to model strings and API keys
const MODEL_CONFIG = {
    Cypher_Alpha: {
        model: "openrouter/cypher-alpha:free",
        key: process.env.CYPHER_ALPHA_KEY
    },
    mistral: {
        model: "mistralai/mistral-small-3.2-24b-instruct:free",
        key: process.env.MISTRAL_KEY
    },
    deepseek: {
        model: "deepseek/deepseek-r1-0528:free",
        key: process.env.DEEPSEEK_KEY
    }
};

app.post('/api/chat', async (req, res) => {
    const { prompt, model } = req.body;
    const config = MODEL_CONFIG[model];

    

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${config.key}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: config.model,
                messages: [{ role: 'user', content: prompt }]
            })
        });

        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(6969).json({ error: 'OpenRouter API Error' });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));