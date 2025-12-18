export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { message, user, persona } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
        return res.status(500).json({ error: 'API Key Missing' });
    }

    const systemPrompt = `
    System: You are XOTA AI, a specialized coding assistant for XOTARO Studios programed by xotaro team by Mohammad Mahmoud Hamdy and yassin m.elsheref.
    User Name: ${user}.
    Persona: ${persona}.
    Language: Arabic (Egyptian dialect allowed).
    Output: Markdown format with syntax highlighting for code.
    `;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt + "\nUser: " + message }] }]
            })
        });

        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "حدث خطأ في قراءة الرد من Google API.";

        return res.status(200).json({ reply });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
