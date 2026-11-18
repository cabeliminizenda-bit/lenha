'use server';

import { getContactSettings } from './contactSettings';
import { getTranslations } from 'next-intl/server';
import { escapeHtml } from '@/lib/security';
import crypto from 'crypto';
import { SITE_URL } from '@/lib/site';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export async function submitContactMessage(formData: FormData) {
  try {
    const ip = await getClientIp();
    const rateLimit = await checkRateLimit(`contact_${ip}`, 5, 600); // 5 messages per 10 minutes per IP
    if (!rateLimit.success) {
      return { error: 'Demasiados pedidos. Por favor, aguarde alguns minutos antes de enviar outra mensagem.' };
    }

    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const subject = String(formData.get('subject') || '').trim();
    const message = String(formData.get('message') || '').trim();

    if (!name || !email || !message) {
      const t = await getTranslations('Contact');
      return { error: t('missing_fields') };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { error: 'Por favor, indique um endereço de e-mail válido.' };
    }

    // Limit field lengths to prevent abuse
    if (name.length > 200 || email.length > 254 || (subject && subject.length > 500) || message.length > 5000) {
      const t = await getTranslations('Contact');
      return { error: t('fields_too_long') };
    }

    const { sendEmail, getAdminNotificationEmail } = await import('@/lib/mailer');
    const receiverEmail = await getAdminNotificationEmail();

    // Send email to the configured admin/receiver (HTML échappé)
    try {
      await sendEmail({
        to: receiverEmail,
        replyTo: email,
        subject: subject ? `Nova Mensagem: "${escapeHtml(subject)}"` : `Nova Mensagem de ${escapeHtml(name)}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.5; padding: 20px;">
            <h2 style="color: #1a1a1a; margin-top: 0;">Recebeu uma nova mensagem de contacto no site.</h2>
            <p><strong>De:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
            ${phone ? `<p><strong>Telefone:</strong> ${escapeHtml(phone)}</p>` : ''}
            ${subject ? `<p><strong>Assunto:</strong> ${escapeHtml(subject)}</p>` : ''}
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;"/>
            <p><strong>Mensagem:</strong><br/><br/>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>
            <br/>
            <p style="color: #666; font-size: 13px;"><em>Por favor, responda ao cliente logo que possível.</em></p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error('[CONTACT] Failed to send email:', emailErr);
    }

    return { success: true, message: 'A sua mensagem foi enviada com sucesso!' };
  } catch (error) {
    console.error('Contact submission error:', error);
    const t = await getTranslations('Contact');
    return { error: t('error_sending') };
  }
}

export async function submitNewsletter(formData: FormData) {
  try {
    const ip = await getClientIp();
    const rateLimit = await checkRateLimit(`newsletter_${ip}`, 5, 3600); // 5 subscriptions per hour per IP
    if (!rateLimit.success) {
      return { error: 'Demasiados pedidos. Por favor, tente novamente mais tarde.' };
    }

    const email = String(formData.get('email') || '').trim().toLowerCase();

    if (!email) {
      return { error: 'Por favor, introduza um endereço de e-mail válido.' };
    }

    // Validation format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || email.length > 254) {
      return { error: 'Endereço de e-mail inválido.' };
    }

    const secret = process.env.NEWSLETTER_SECRET || process.env.NEXTAUTH_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.CRON_SECRET || process.env.DATABASE_URL;
    if (!secret) {
      console.error('[NEWSLETTER] Secret key not configured on server');
      return { error: 'Ocorreu um erro na configuração do servidor.' };
    }
    const expiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    const payload = `${email}|${expiry}`;
    const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    const token = Buffer.from(`${payload}|${signature}`).toString('base64');
    const confirmUrl = `${SITE_URL}/api/newsletter/confirm?token=${encodeURIComponent(token)}`;

    try {
      const { sendEmail, sendAdminNewsletterNotification, sendNewsletterWelcomeEmail } = await import('@/lib/mailer');
      
      // 1. Notifica imediatamente o Administrador da nova subscrição
      sendAdminNewsletterNotification(email, ip).catch(err => {
        console.error('[NEWSLETTER] Falha ao notificar admin:', err);
      });

      // 2. Envia o e-mail de boas-vindas com o cupão exclusivo de 10% (WELCOME10)
      sendNewsletterWelcomeEmail(email).catch(err => {
        console.error('[NEWSLETTER] Falha ao enviar cupão de boas-vindas:', err);
      });

      // 3. Envia o e-mail de confirmação / opt-in
      await sendEmail({
        to: email,
        subject: `Confirme a sua subscrição na Newsletter - Lenha & Carvão Silva Dias`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.5; padding: 20px;">
            <h1 style="font-size: 22px; color: #1a1a1a; margin-top: 0; margin-bottom: 15px;">Por favor, confirme a sua subscrição</h1>
            <p style="font-size: 14px; color: #333; margin-bottom: 20px;">Agradecemos o seu interesse na newsletter da <strong>Lenha & Carvão Silva Dias</strong>! Por favor, clique no botão abaixo para confirmar a sua subscrição:</p>
            <p style="text-align: center; margin: 30px 0;">
              <a href="${confirmUrl}" style="background-color: #dc2626; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Confirmar Subscrição</a>
            </p>
            <p style="font-size: 12px; color: #666; margin-top: 25px;">Se não solicitou esta subscrição, por favor ignore esta mensagem.</p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error('[NEWSLETTER] Failed to send opt-in email:', emailErr);
    }

    return { success: true, message: 'Por favor, verifique a sua caixa de correio para confirmar a subscrição.' };
  } catch (error) {
    console.error('Newsletter submission error:', error);
    return { error: 'Ocorreu um erro ao processar a sua subscrição.' };
  }
}
