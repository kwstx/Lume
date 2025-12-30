import sgMail from '@sendgrid/mail';

const apiKey = process.env.SENDGRID_API_KEY;

if (apiKey) {
    sgMail.setApiKey(apiKey);
} else {
    console.warn("SENDGRID_API_KEY is not set. Email sending will be disabled.");
}

interface SendEmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
    from?: string;
}

export async function sendEmail({ to, subject, html, text, from }: SendEmailOptions) {
    if (!apiKey) {
        console.log("Mock sending email:", { to, subject });
        return { success: true, messageId: "mock-id" };
    }

    const fromEmail = from || process.env.SENDGRID_FROM_EMAIL || 'noreply@stackly.app';

    try {
        const [response] = await sgMail.send({
            to,
            from: fromEmail,
            subject,
            html,
            text: text || html.replace(/<[^>]*>?/gm, ''), // Basic strip HTML for text fallback
        });

        return { success: true, messageId: response.headers['x-message-id'] };
    } catch (error: any) {
        console.error("SendGrid error:", error);
        if (error.response) {
            console.error(error.response.body);
        }
        return { success: false, error: error.message };
    }
}
