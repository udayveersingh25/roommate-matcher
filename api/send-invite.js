export default async function handler(req, res) {
    // 1. Strictly enforce POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    // 2. Destructure arguments from frontend
    const { to, toName } = req.body;

    // 3. Load the secure Environment Variable automatically injected by Vercel
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ message: 'Missing RESEND_API_KEY environment variable on server.' });
    }

    try {
        // 4. Securely execute the fetch directly to Resend's API endpoints natively.
        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                // Note: Unless you paid for a domain on Resend, you MUST use their testing domain 'onboarding@resend.dev'
                // and you can ONLY send emails to the email address registered to your Resend account.
                from: "Roommate Matcher <onboarding@resend.dev>",
                to: [to],
                subject: "You've been invited to connect! 🤝",
                html: `
                    <h2>Hello ${toName || "there"}!</h2>
                    <p>Someone on Roommate Matcher just sent you an invitation to connect because you had a great compatibility score!</p>
                    <p>Log in to view your networking matches: <a href="https://roommate-matcher-mu-roan.vercel.app/connections">View Connections</a></p>
                `,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            return res.status(200).json({ success: true, data });
        } else {
            console.error("Resend API Error:", data);
            return res.status(400).json({ success: false, error: data });
        }
    } catch (error) {
        console.error("Network Fetch Error:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
}
