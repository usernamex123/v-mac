import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Root route for UptimeRobot health check
app.get('/', (req, res) => {
  res.status(200).send('V-Mac Backend is live and running!');
});

// Initialize Supabase with Service Key (for backend operations)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Repair Booking Endpoint with Instant Email Notification
app.post('/api/repairs', async (req, res) => {
  try {
    const { 
      customer_id, 
      name, 
      email, 
      phone, 
      address,          // 1. Added address here
      device_type, 
      issue_description, 
      image_url         // 2. Added image_url here
    } = req.body;

    // 3. Insert repair request into Supabase database (including address and image_url)
    const { data, error } = await supabase
      .from('repairs')
      .insert([
        {
          customer_id,
          name,
          email,
          phone,
          address,          // 4. Passed to database
          device_type,
          issue_description,
          image_url,        // 5. Passed to database
          status: 'Submitted'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase Error:', error);
      return res.status(400).json({ success: false, error: error.message });
    }

    // 6. Send Professional Confirmation Email via Resend
    if (email) {
      try {
        await resend.emails.send({
          from: 'V-Mac Repairs <onboarding@resend.dev>',
          to: [email],
          subject: 'We’ve Received Your Repair Request! 🛠️ | V-Mac',
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FBFBFD; padding: 40px 20px; color: #1D1D1F;">
              <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; padding: 40px; border: 1px solid #E5E5EA; box-shadow: 0 10px 30px rgba(0,0,0,0.02);">
                
                <div style="margin-bottom: 30px;">
                  <span style="font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">
                    <span style="color: #0066CC;">V-</span>Mac
                  </span>
                </div>

                <h1 style="font-size: 24px; font-weight: 600; letter-spacing: -0.5px; margin-bottom: 12px; color: #1D1D1F;">
                  Request Received Successfully
                </h1>
                
                <p style="font-size: 14px; line-height: 1.6; color: #6E6E73; margin-bottom: 24px;">
                  Hello <strong>${name || 'Valued Customer'}</strong>,<br>
                  Thank you for trusting V-Mac with your device. We have successfully received your repair request, and our expert technicians are reviewing the details.
                </p>

                <div style="background: #F5F5F7; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
                  <p style="font-size: 12px; font-weight: 600; text-transform: uppercase; color: #86868B; margin-bottom: 12px; letter-spacing: 0.5px;">Request Summary</p>
                  <table style="width: 100%; font-size: 13px; color: #1D1D1F; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 6px 0; color: #6E6E73;">Device:</td>
                      <td style="padding: 6px 0; font-weight: 600; text-align: right;">${device_type}
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; color: #6E6E73;">Service Type:</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; color: #6E6E73;">Address:</td>
                      <td style="padding: 6px 0; font-weight: 600; text-align: right;">${address || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; color: #6E6E73;">Issue:</td>
                      <td style="padding: 6px 0; font-weight: 600; text-align: right; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${issue_description || 'N/A'}</td>
                    </tr>
                  </table>
                </div>

                <p style="font-size: 14px; line-height: 1.6; color: #6E6E73; margin-bottom: 30px;">
                  Our team will get in touch with you at your earliest convenience via phone or email to coordinate next steps and provide an estimated timeline.
                </p>

                <div style="border-top: 1px solid #E5E5EA; margin-top: 30px; padding-top: 20px; font-size: 12px; color: #86868B; text-align: center;">
                  &copy; ${new Date().getFullYear()} V-Mac Repair Portal. All rights reserved.
                </div>

              </div>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send email via Resend:', emailError);
      }
    }

    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});