import { Resend } from 'resend';

// Only instantiate if we have an API key, otherwise mock it for development
const resendApiKey = process.env.RESEND_API_KEY;
export const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendEmail({
  to,
  subject,
  react
}: {
  to: string | string[];
  subject: string;
  react: React.ReactElement;
}) {
  if (!resend) {
    console.log('📧 Email sending skipped (No RESEND_API_KEY set)');
    console.log('To:', to);
    console.log('Subject:', subject);
    return { success: true, mocked: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'My Chicken Addis <hello@mychickenaddis.com>',
      to,
      subject,
      react,
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}
