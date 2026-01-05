// server.js
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public')); // Serve your HTML file from 'public' folder

// Your Discord webhook URL (store this in environment variables in production!)
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1457745725503963228/yhAkda2dNMvJGv1HB-IipptbneMFqmgVqZYxZrtbEi83zFj5g7O4aHfgr5epd0kMCLN3';

// Endpoint to handle IP logging
app.post('/log-ip', async (req, res) => {
    try {
        const { ip, city, region, country, userAgent, timestamp, page } = req.body;
        
        // Create Discord embed message
        const embed = {
            title: "📡 New IP Logged",
            color: 0x5865F2, // Discord blurple
            fields: [
                {
                    name: "🌐 IP Address",
                    value: `\`${ip}\``,
                    inline: true
                },
                {
                    name: "📍 Location",
                    value: `${city}, ${region}, ${country}`,
                    inline: true
                },
                {
                    name: "🕐 Timestamp",
                    value: new Date(timestamp).toLocaleString(),
                    inline: true
                },
                {
                    name: "🔗 Page",
                    value: page || 'Unknown',
                    inline: false
                },
                {
                    name: "🖥️ User Agent",
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
            username: "IP Logger",
            avatar_url: "https://cdn-icons-png.flaticon.com/512/484/484167.png"
        });

        res.json({ success: true, message: "Logged successfully" });
        
    } catch (error) {
        console.error('Error sending to Discord:', error);
        res.status(500).json({ success: false, error: "Failed to log IP" });
    }
});

// Alternative: Direct frontend to Discord (not recommended due to exposing webhook)
app.post('/log-ip-direct', async (req, res) => {
    // This endpoint would proxy the request to hide your webhook URL
    // Implementation similar to above
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
