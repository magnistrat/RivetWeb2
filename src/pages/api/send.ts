/**
 * Send Email API Route
 *
 * POST /api/send
 */
import type { APIRoute } from 'astro';
import { randomUUID } from 'node:crypto';
import { resend } from '../../lib/resend';
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { mode, name, from, email, subject, message, preventThreading } = body;
    if (!from || !subject) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: name, email' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Missing message content' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }
    //== send send up for correct page
    var mailto = "" as string;
    var msg = message as string;
    if (mode == "CTA") {
        mailto = email;
        msg = message;
    } else {
      mailto = 'cchinner@rivetrisk.com.au';
      msg = `<p>From: ${name} - ${from}</p><p>${message}</p>`;
    }

    const emailOptions: Parameters<typeof resend.emails.send>[0] = {
      from: import.meta.env.EMAIL_FROM || 'Rivet web <admin@rivetrisk.com.au>',
      to: mailto,
      subject: subject,
      html: msg,
    };

    if (preventThreading) {
      emailOptions.headers = {
        'X-Entity-Ref-ID': randomUUID(),
      };
    }
    const { data, error } = await resend.emails.send(emailOptions);

    if (error) {
      console.error('Resend error:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        id: data?.id,
        message: 'Thanks for your email. We will be in touch soon.',
        preventedThreading: preventThreading || false,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('Unexpected error:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to send email' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
