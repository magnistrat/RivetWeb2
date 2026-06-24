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
    const { name, from, message, preventThreading } = body;

    if (!name || !from) {
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

    const emailOptions: Parameters<typeof resend.emails.send>[0] = {
      from: import.meta.env.EMAIL_FROM || 'Rivet web <admin@rivetrisk.com.au>',
      to: 'cchinner@rivetrisk.com.au',
      subject: 'Web Contact Form',
      html: `<p>From: ${from}</p><p>${message}</p>`,
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
