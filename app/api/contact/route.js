import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Inquiry from "@/models/Inquiry";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // 1. Destructure and standardize the incoming data
    // We look for 'message' (from frontend) but fallback to 'projectVision'
    const { name, email, phone, service, message, projectVision } = body;
    const finalVision = message || projectVision;

    // 2. Basic Server-Side Validation
    if (!name || !email || !finalVision) {
      return NextResponse.json(
        { message: "Name, email, and message are required." }, 
        { status: 400 }
      );
    }

    // 3. Save to MongoDB
    const newInquiry = await Inquiry.create({
        name,
        email,
        phone: phone || "Not provided",
        service: service || "Not specified",
        projectVision: finalVision 
    });

    // 4. Set up Nodemailer Transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, 
      },
    });

    // 5. Send Email to Admin
    await transporter.sendMail({
      from: `"Taruna Interiors Bot" <${process.env.EMAIL_USER}>`,
      to: "sutharkamelsh20402@gmail.com", 
      subject: `New Luxury Design Inquiry: ${name}`,
      html: `
        <div style="background-color: #0a0a0a; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #ffffff;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #111111; border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.4);">
              
              <div style="padding: 40px 40px 20px 40px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                <h1 style="font-size: 28px; font-weight: 300; margin: 0; letter-spacing: 2px; text-transform: uppercase; color: #ffffff;">
                    Taruna <span style="color: #4318FF; font-weight: 700;">Interiors</span>
                </h1>
                <p style="color: #888888; font-size: 14px; margin-top: 10px; text-transform: uppercase; letter-spacing: 1px;">New Design Inquiry Received</p>
              </div>

              <div style="padding: 40px;">
                <div style="margin-bottom: 30px;">
                    <p style="color: #888888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Client Details</p>
                    <div style="background-color: rgba(255,255,255,0.03); border-radius: 12px; padding: 20px;">
                      <p style="margin: 0 0 15px 0; font-size: 16px;"><strong style="color: #4318FF; width: 80px; display: inline-block;">Name:</strong> <span style="color: #ffffff;">${name}</span></p>
                      <p style="margin: 0 0 15px 0; font-size: 16px;"><strong style="color: #4318FF; width: 80px; display: inline-block;">Email:</strong> <span style="color: #ffffff;">${email}</span></p>
                      <p style="margin: 0 0 15px 0; font-size: 16px;"><strong style="color: #4318FF; width: 80px; display: inline-block;">Phone:</strong> <span style="color: #ffffff;">${phone || "N/A"}</span></p>
                      <p style="margin: 0; font-size: 16px;"><strong style="color: #4318FF; width: 80px; display: inline-block;">Service:</strong> <span style="color: #ffffff; text-transform: capitalize;">${service || "General"}</span></p>
                    </div>
                </div>

                <div style="margin-bottom: 30px;">
                    <p style="color: #888888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Project Vision</p>
                    <div style="background-color: rgba(255,255,255,0.03); border-radius: 12px; padding: 20px; line-height: 1.6; color: #dddddd; font-style: italic;">
                      "${finalVision}"
                    </div>
                </div>

                <a href="mailto:${email}" style="display: inline-block; background-color: #4318FF; color: #ffffff; padding: 16px 32px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                    Reply to Client
                </a>
              </div>

              <div style="padding: 20px 40px; background-color: rgba(255,255,255,0.02); border-top: 1px solid rgba(255,255,255,0.05); text-align: center;">
                <p style="font-size: 10px; color: #555555; margin: 0;">
                    Reference ID: ${newInquiry._id} • Logged at ${new Date().toLocaleString()}
                </p>
              </div>
          </div>
        </div>
      `,
    });
    
    return NextResponse.json({ message: "Inquiry saved and email sent" }, { status: 201 });

  } catch (error) {
    console.error("BACKEND ERROR:", error);
    return NextResponse.json({ message: "Internal Error", error: error.message }, { status: 500 });
  }
}

// import { NextResponse } from "next/server";
// import dbConnect from "@/lib/dbConnect";
// import Inquiry from "@/models/Inquiry";
// import nodemailer from "nodemailer";

// export async function POST(req) {
//   try {
//     await dbConnect();
//     const body = await req.json();
    
//     // 1. Map the data safely. If the frontend sends 'message', we capture it.
//     const safeProjectVision = body.projectVision || body.message;

//     if (!safeProjectVision) {
//       return NextResponse.json({ message: "Project Vision/Message is required" }, { status: 400 });
//     }

//     // 2. Save to MongoDB
//     const newInquiry = await Inquiry.create({
//       name: body.name,
//       email: body.email,
//       phone: body.phone,
//       service: body.service,
//       projectVision: safeProjectVision, // Safely mapped here
//     });

//     // 3. Set up Nodemailer Transporter
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     // 4. Send Email to Admin
//     await transporter.sendMail({
//       from: `"Taruna Interiors Bot" <${process.env.EMAIL_USER}>`,
//       to: "your-personal-email@gmail.com", // Ensure your email is here
//       subject: `✨ New Luxury Inquiry: ${body.name}`,
//       html: `
//         <div style="font-family: serif; padding: 20px;">
//           <h2>New Inquiry</h2>
//           <p><strong>Name:</strong> ${body.name}</p>
//           <p><strong>Email:</strong> ${body.email}</p>
//           <p><strong>Message:</strong> ${safeProjectVision}</p>
//         </div>
//       `, // (You can paste back the full luxury HTML design I gave you here)
//     });

//     return NextResponse.json({ message: "Inquiry saved and email sent" }, { status: 201 });

//   } catch (error) {
//     console.error("BACKEND ERROR:", error);
//     return NextResponse.json({ message: "Internal Error", error: error.message }, { status: 500 });
//   }
// }