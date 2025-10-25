import { Resend } from "resend";
import "dotenv/config";

const resend = new Resend(process.env.RESEND_API);

// Helper function to escape HTML special characters
const escapeHtml = (text) => {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
};

export const sendTitles = async (oldTitles, newTitles, email) => {
  if (!process.env.RESEND_API) {
    throw new Error("RESEND_API environment variable is not defined");
  }
  try {
    // Build table rows comparing old and new titles
    const maxLength = Math.max(oldTitles.length, newTitles.length);
    let tableRows = "";

    for (let i = 0; i < maxLength; i++) {
      const oldTitle = oldTitles[i] || "N/A";
      const newTitle = newTitles[i] || "N/A";

      tableRows += `
        <tr>
          <td style="padding: 16px; border-bottom: 1px solid #f0f0f0; color: #6b7280; font-size: 14px; line-height: 1.5;">
            ${escapeHtml(oldTitle)}
          </td>
          <td style="padding: 16px; border-bottom: 1px solid #f0f0f0; color: #111827; font-size: 14px; font-weight: 500; line-height: 1.5;">
            ${escapeHtml(newTitle)}
          </td>
        </tr>`;
    }

    const titleCount = maxLength === 1 ? "1 title" : `${maxLength} titles`;

    const message = await resend.emails.send({
      from: "Title Forge <no-reply@pawpick.store>",
      subject: `Your ${titleCount} enhanced and ready`,
      to: email,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Title Enhancement Complete</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="display: inline-block; padding: 8px 16px; background-color: #111827; border-radius: 6px; margin-bottom: 24px;">
        <span style="color: #ffffff; font-size: 18px; font-weight: 600; letter-spacing: 0.5px;">Title Forge</span>
      </div>
    </div>
    
    <!-- Main Content Card -->
    <div style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); overflow: hidden;">
      
      <!-- Content Section -->
      <div style="padding: 40px 32px;">
        <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 600; color: #111827; line-height: 1.3;">
          Your titles have been enhanced
        </h1>
        
        <p style="margin: 0 0 24px 0; font-size: 15px; color: #6b7280; line-height: 1.6;">
          We've analyzed and optimized your video titles for better engagement and discoverability. Here's what we've improved:
        </p>
        
        <!-- Stats Badge -->
        <div style="display: inline-block; padding: 8px 16px; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; margin-bottom: 32px;">
          <span style="color: #16a34a; font-size: 14px; font-weight: 500;">${titleCount} optimized</span>
        </div>
        
        <!-- Comparison Table -->
        <div style="border: 1px solid #f0f0f0; border-radius: 8px; overflow: hidden; margin-bottom: 32px;">
          <table style="width: 100%; border-collapse: collapse; background-color: #ffffff;">
            <thead>
              <tr style="background-color: #f9fafb;">
                <th style="padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #f0f0f0;">
                  Original
                </th>
                <th style="padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #f0f0f0;">
                  Enhanced
                </th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </div>
        
        <!-- Info Box -->
        <div style="padding: 16px; background-color: #f9fafb; border-radius: 8px; margin-bottom: 24px;">
          <p style="margin: 0; font-size: 13px; color: #6b7280; line-height: 1.5;">
            <strong style="color: #111827;">What's improved:</strong> Enhanced titles include relevant keywords, optimal length, and engaging hooks to increase click-through rates and platform visibility.
          </p>
        </div>
        
        <!-- CTA Button -->
        <div style="text-align: center; margin-top: 32px;">
          <a href="https://pawpick.store" style="display: inline-block; padding: 12px 32px; background-color: #111827; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500; transition: background-color 0.2s;">
            View Dashboard
          </a>
        </div>
      </div>
      
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; margin-top: 32px; padding: 0 20px;">
      <p style="margin: 0 0 8px 0; font-size: 13px; color: #9ca3af;">
        Questions? We're here to help.
      </p>
      <p style="margin: 0 0 16px 0; font-size: 13px;">
        <a href="mailto:support@pawpick.store" style="color: #6b7280; text-decoration: none;">Contact Support</a>
      </p>
      <p style="margin: 0; font-size: 12px; color: #9ca3af; line-height: 1.5;">
        © 2025 Title Forge. All rights reserved.
      </p>
    </div>
    
  </div>
</body>
</html>
      `,
    });

    return { success: true, message };
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    return { success: false, error: error.message };
  }
};