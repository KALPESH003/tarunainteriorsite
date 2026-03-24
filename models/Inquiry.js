// actions/contactAction.js
'use server';

import { connectToDatabase } from '@/lib/mongodb';
import Inquiry from '@/models/Inquiry';
import nodemailer from 'nodemailer';

export async function submitInquiry(prevState, formData) {
  try {
    await connectToDatabase();

    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      projectType: formData.get('projectType'),
      message: formData.get('message'),
    };

    // 1. Save to MongoDB
    await Inquiry.create(data);

    // 2. Configure Email Transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 3. Send the Email Alert to the Firm
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'info@tarunainteriors.com', // The firm's actual email
      subject: `New Lead: ${data.projectType} Project from ${data.name}`,
      html: `
        <h2>New Project Inquiry</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Project Type:</strong> ${data.projectType}</p>
        <p><strong>Message:</strong><br/> ${data.message}</p>
      `,
    });

    return { success: true, message: 'Inquiry sent successfully!' };
  } catch (error) {
    console.error('Submission Error:', error);
    return { success: false, message: 'Failed to send inquiry.' };
  }
}