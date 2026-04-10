'use server';

import { connectToDatabase } from '@/lib/mongodb';
import Inquiry from '@/models/Inquiry';
import nodemailer from 'nodemailer';

export async function submitInquiry(formData) {
  try {
    // 1. Establish Database Connection
    await connectToDatabase();

    // 2. Extract data - using names that match your Form AND your Model
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const service = formData.get('service'); 
    const message = formData.get('message');

    // Validation
    if (!name || !email || !message) {
      return { success: false, message: 'Please fill out all required fields.' };
    }

    // 3. Save to MongoDB 
    // MAKE SURE your models/Inquiry.js has 'service' as a field!
    await Inquiry.create({
      name,
      email,
      phone,
      service, 
      message
    });

    // 4. Email Logic
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'tarunainteriorgallary@gmail.com',
      subject: `New Project Inquiry: ${name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; border: 1px solid #eee;">
          <h2 style="color: #232a8b;">New Website Inquiry</h2>
          <hr />
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <p><strong>Service:</strong> ${service || 'Not Selected'}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f4f4f4; padding: 15px; border-radius: 5px;">${message}</div>
        </div>
      `,
    });

    return { success: true, message: 'Inquiry sent successfully!' };

  } catch (error) {
    // This helps you see the REAL error in your terminal
    console.error('SERVER ACTION ERROR:', error);
    
    return { 
      success: false, 
      message: 'Network Error: Connection to database refused. Please try a different Wi-Fi/Hotspot.' 
    };
  }
}