import { Queue, Worker } from "bullmq";
import { Request, Response } from "express";

import User from "../models/user.model.js";
import { sendCustomEmail } from "./resend.controller.js";

const emailQueue = new Queue("email-queue");

export const addEmailToQueue = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find({});
    for (const user of users) {
      await emailQueue.add("send-email", {
        to: user.email,
        subject: "Hello from TitleForge - We Miss You!",
        html: `<!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>We Miss You on TitleForge</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
            
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; padding: 60px 20px;">
                <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%;">
                    
                    <!-- Logo Header -->
                    <tr>
                        <td align="center" style="padding-bottom: 48px;">
                        <span style="color: #000000; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">TitleForge</span>
                        </td>
                    </tr>
                    
                    <!-- Main Card -->
                    <tr>
                        <td>
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px;">
                            
                            <!-- Content -->
                            <tr>
                            <td style="padding: 48px;">
                                
                                <!-- Title -->
                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="padding-bottom: 12px;">
                                    <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #000000; line-height: 1.3;">
                                        We’ve added some powerful new upgrades
                                    </h1>
                                    </td>
                                </tr>
                                </table>
                                
                                <!-- Description -->
                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="padding-bottom: 32px;">
                                    <p style="margin: 0; font-size: 15px; color: #6b7280; line-height: 1.6;">
                                        It’s been a while since we last saw you on TitleForge. We’ve been busy building new features to make your experience smoother, faster, and more personalized than ever.
                                    </p>
                                    </td>
                                </tr>
                                </table>
                                
                                <!-- Updates Card -->
                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="padding: 32px 0;">
                                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                        <tr>
                                        <td style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 24px;">
                                            
                                            <div style="font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; font-weight: 500; text-align: center;">
                                            What’s New
                                            </div>

                                            <ul style="margin: 0; padding-left: 20px; font-size: 15px; color: #4b5563; line-height: 1.7;">
                                            <li><strong>New Payment Gateway</strong> — Faster, safer, and more reliable payments.</li>
                                            <li><strong>Favorite Titles</strong> — Save the titles you love and access them anytime.</li>
                                            <li><strong>Improved Personalization</strong> — Smarter AI recommendations tailored to your content.</li>
                                            <li><strong>Major Bug Fixes</strong> — A more stable and polished experience across the platform.</li>
                                            </ul>

                                        </td>
                                        </tr>
                                    </table>
                                    </td>
                                </tr>
                                </table>

                                <!-- Call to Action -->
                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="center" style="padding-bottom: 32px;">
                                    <a href="https://titleforge.me" style="display: inline-block; padding: 14px 28px; background-color: #000000; color: #ffffff; font-size: 15px; font-weight: 600; border-radius: 6px; text-decoration: none;">
                                        Try the new TitleForge
                                    </a>
                                    </td>
                                </tr>
                                </table>

                                <!-- Divider -->
                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="padding: 24px 0; border-top: 1px solid #f3f4f6;">
                                    <p style="margin: 0; font-size: 13px; color: #9ca3af; line-height: 1.6;">
                                        You’re receiving this email because we want to make sure you don’t miss the latest upgrades.
                                    </p>
                                    </td>
                                </tr>
                                </table>
                                
                            </td>
                            </tr>
                            
                        </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td align="center" style="padding: 32px 20px 0 20px;">
                        <p style="margin: 0 0 8px 0; font-size: 13px; color: #9ca3af;">
                            <a href="mailto:support@pawpick.store" style="color: #6b7280; text-decoration: none;">Contact Support</a>
                        </p>
                        <p style="margin: 0; font-size: 12px; color: #d1d5db;">
                            © 2025 TitleForge. All rights reserved.
                        </p>
                        </td>
                    </tr>
                    
                    </table>
                </td>
                </tr>
            </table>
            
            </body>
            </html>
            `,
      });
    }
    res.status(200).json({ message: "Emails added to the queue" });
  } catch (error) {
    console.error("Error adding emails to queue:", error);
    res.status(500).json({ message: "Error adding emails to queue" });
  }
};

export const emailWorker = new Worker(
  "email-queue",
  async (job) => {
    try {
      const { to, subject, html } = job.data;
      await sendCustomEmail({ to, subject, html });
      return { success: true };
    } catch (error) {
      console.error("Error processing email job:", error);
      throw error;
    }
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  }
);
