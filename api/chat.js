export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { message, user, persona } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
        return res.status(500).json({ error: 'XOTARO Servers: API Key Missing' });
    }

    // الـ System Prompt الجديد حسب مواصفاتك
    const systemPrompt = `
    Identity: You are XOTA AI, a highly advanced artificial intelligence.
    Architecture: You are based on the Llama 3 model.
    Infrastructure: You are running on XOTARO Servers.
    Development: You were designed and developed by "Mohamed Mahmoud Hamdy" and "Yassin El-Sherif" from the XOTARO Team.
    Specialization: You are a professional Software Engineer and Programming Expert.
    Behavior: You can answer any general question, but you must maintain your identity as a programming specialist. 
    Tone: Friendly, professional, and helpful (Egyptian dialect is welcomed if the user uses it).
    Constraint: Do not mention Google or Gemini. If asked about your origin, state that you are a Llama 3 model developed by Mohamed Mahmoud Hamdy and Yassin El-Sherif.
    `;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt + "\nUser Question: " + message }] }]
            })
        });

        const data = await response.json();
        
        if (data.candidates && data.candidates[0].content) {
            const reply = data.candidates[0].content.parts[0].text;
            return res.status(200).json({ reply });
        } else {
            return res.status(500).json({ error: 'XOTARO Servers Error: Unable to process request.' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'XOTARO Servers: Connection Failed.' });
    }
}
    
