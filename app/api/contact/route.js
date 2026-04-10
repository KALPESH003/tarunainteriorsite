import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Inquiry from "@/models/Inquiry";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    // 1. Connect and Parse
    await dbConnect();
    const body = await req.json();
    
    // 2. Destructure and Standardize
    const { name, email, phone, service, message, projectVision } = body;
    const finalVision = message || projectVision;

    // 3. Validation
    if (!name || !email || !finalVision) {
      return NextResponse.json(
        { message: "Name, email, and message are required." }, 
        { status: 400 }
      );
    }

    // 4. Save to MongoDB 
    let newInquiry;
    try {
      newInquiry = await Inquiry.create({
          name,
          email,
          phone: phone || "Not provided",
          service: service || "Not specified",
          projectVision: finalVision 
      });
    } catch (dbError) {
      console.error("Database Save Failed:", dbError);
      return NextResponse.json({ message: "Failed to save inquiry to database." }, { status: 500 });
    }

    // 5. Send Email via Resend API (Lightning Fast)
    try {
      await resend.emails.send({
        // Resend's free tier requires you to use this specific 'from' address
        from: 'Taruna Bot <onboarding@resend.dev>', 
        // Resend's free tier only lets you send to the email you signed up with
        to: 'sutharkamlesh003@gmail.com', 
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
    } catch (emailError) {
      console.error("Resend API Error:", emailError);
    }
    
    return NextResponse.json({ message: "Inquiry saved successfully." }, { status: 201 });

  } catch (error) {
    console.error("CRITICAL BACKEND ERROR:", error);
    return NextResponse.json({ message: "Internal Error", error: error.message }, { status: 500 });
  }
}


// import { NextResponse } from "next/server";
// import dbConnect from "@/lib/dbConnect";
// import Inquiry from "@/models/Inquiry";
// import nodemailer from "nodemailer";

// export async function POST(req) {
//   try {
//     // 1. Connect and Parse
//     await dbConnect();
//     const body = await req.json();
// <<<<<<< HEAD
// =======
    
//     // 1. Destructure and standardize the incoming data
//     // We look for 'message' (from frontend) but fallback to 'projectVision'
//     const { name, email, phone, service, message, projectVision } = body;
//     const finalVision = message || projectVision;

//     // 2. Basic Server-Side Validation
//     if (!name || !email || !finalVision) {
//       return NextResponse.json(
//         { message: "Name, email, and message are required." }, 
//         { status: 400 }
//       );
//     }

//     // 3. Save to MongoDB
//     const newInquiry = await Inquiry.create({
//         name,
//         email,
//         phone: phone || "Not provided",
//         service: service || "Not specified",
//         projectVision: finalVision 
//     });

//     // 4. Set up Nodemailer Transporter
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS, 
//       },
//     });

//     // 5. Send Email to Admin
//     await transporter.sendMail({
//       from: `"Taruna Interiors Bot" <${process.env.EMAIL_USER}>`,
//       to: "sutharkamelsh20402@gmail.com", 
//       subject: `New Luxury Design Inquiry: ${name}`,
//       html: `
//         <div style="background-color: #0a0a0a; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #ffffff;">
//           <div style="max-width: 600px; margin: 0 auto; background-color: #111111; border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.4);">
              
//               <div style="padding: 40px 40px 20px 40px; border-bottom: 1px solid rgba(255,255,255,0.05);">
//                 <h1 style="font-size: 28px; font-weight: 300; margin: 0; letter-spacing: 2px; text-transform: uppercase; color: #ffffff;">
//                     Taruna <span style="color: #4318FF; font-weight: 700;">Interiors</span>
//                 </h1>
//                 <p style="color: #888888; font-size: 14px; margin-top: 10px; text-transform: uppercase; letter-spacing: 1px;">New Design Inquiry Received</p>
//               </div>

//               <div style="padding: 40px;">
//                 <div style="margin-bottom: 30px;">
//                     <p style="color: #888888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Client Details</p>
//                     <div style="background-color: rgba(255,255,255,0.03); border-radius: 12px; padding: 20px;">
//                       <p style="margin: 0 0 15px 0; font-size: 16px;"><strong style="color: #4318FF; width: 80px; display: inline-block;">Name:</strong> <span style="color: #ffffff;">${name}</span></p>
//                       <p style="margin: 0 0 15px 0; font-size: 16px;"><strong style="color: #4318FF; width: 80px; display: inline-block;">Email:</strong> <span style="color: #ffffff;">${email}</span></p>
//                       <p style="margin: 0 0 15px 0; font-size: 16px;"><strong style="color: #4318FF; width: 80px; display: inline-block;">Phone:</strong> <span style="color: #ffffff;">${phone || "N/A"}</span></p>
//                       <p style="margin: 0; font-size: 16px;"><strong style="color: #4318FF; width: 80px; display: inline-block;">Service:</strong> <span style="color: #ffffff; text-transform: capitalize;">${service || "General"}</span></p>
//                     </div>
//                 </div>

//                 <div style="margin-bottom: 30px;">
//                     <p style="color: #888888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Project Vision</p>
//                     <div style="background-color: rgba(255,255,255,0.03); border-radius: 12px; padding: 20px; line-height: 1.6; color: #dddddd; font-style: italic;">
//                       "${finalVision}"
//                     </div>
//                 </div>

//                 <a href="mailto:${email}" style="display: inline-block; background-color: #4318FF; color: #ffffff; padding: 16px 32px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
//                     Reply to Client
//                 </a>
//               </div>

//               <div style="padding: 20px 40px; background-color: rgba(255,255,255,0.02); border-top: 1px solid rgba(255,255,255,0.05); text-align: center;">
//                 <p style="font-size: 10px; color: #555555; margin: 0;">
//                     Reference ID: ${newInquiry._id} • Logged at ${new Date().toLocaleString()}
//                 </p>
//               </div>
//           </div>
//         </div>
//       `,
//     });
// >>>>>>> 990ff5aa9bfa94fcb30610c2e0b60d00636e3f24
    
//     // 2. Destructure and Standardize
//     const { name, email, phone, service, message, projectVision } = body;
//     const finalVision = message || projectVision;

//     // 3. Validation
//     if (!name || !email || !finalVision) {
//       return NextResponse.json(
//         { message: "Name, email, and message are required." }, 
//         { status: 400 }
//       );
//     }

//     // 4. Save to MongoDB (Critical Step)
//     let newInquiry;
//     try {
//       newInquiry = await Inquiry.create({
//           name,
//           email,
//           phone: phone || "Not provided",
//           service: service || "Not specified",
//           projectVision: finalVision 
//       });
//       console.log("Database save successful:", newInquiry._id);
//     } catch (dbError) {
//       console.error("Database Save Failed:", dbError);
//       return NextResponse.json({ message: "Failed to save inquiry to database." }, { status: 500 });
//     }

//     // 5. Send Email to Admin (Non-Critical Step - Allowed to fail gracefully)
//     try {
//       const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//           user: process.env.EMAIL_USER,
//           pass: process.env.EMAIL_PASS, 
//         },
//         connectionTimeout: 5000, // Fails quickly if port is blocked by campus Wi-Fi
//       });

//       await transporter.sendMail({
//         from: `"Taruna Interiors Bot" <${process.env.EMAIL_USER}>`,
//         to: "sutharkamelsh20402@gmail.com", 
//         subject: `New Luxury Design Inquiry: ${name}`,
//         html: `
//           <div style="background-color: #0a0a0a; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #ffffff;">
//             <div style="max-width: 600px; margin: 0 auto; background-color: #111111; border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.4);">
                
//                 <div style="padding: 40px 40px 20px 40px; border-bottom: 1px solid rgba(255,255,255,0.05);">
//                   <h1 style="font-size: 28px; font-weight: 300; margin: 0; letter-spacing: 2px; text-transform: uppercase; color: #ffffff;">
//                       Taruna <span style="color: #4318FF; font-weight: 700;">Interiors</span>
//                   </h1>
//                   <p style="color: #888888; font-size: 14px; margin-top: 10px; text-transform: uppercase; letter-spacing: 1px;">New Design Inquiry Received</p>
//                 </div>

//                 <div style="padding: 40px;">
//                   <div style="margin-bottom: 30px;">
//                       <p style="color: #888888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Client Details</p>
//                       <div style="background-color: rgba(255,255,255,0.03); border-radius: 12px; padding: 20px;">
//                         <p style="margin: 0 0 15px 0; font-size: 16px;"><strong style="color: #4318FF; width: 80px; display: inline-block;">Name:</strong> <span style="color: #ffffff;">${name}</span></p>
//                         <p style="margin: 0 0 15px 0; font-size: 16px;"><strong style="color: #4318FF; width: 80px; display: inline-block;">Email:</strong> <span style="color: #ffffff;">${email}</span></p>
//                         <p style="margin: 0 0 15px 0; font-size: 16px;"><strong style="color: #4318FF; width: 80px; display: inline-block;">Phone:</strong> <span style="color: #ffffff;">${phone || "N/A"}</span></p>
//                         <p style="margin: 0; font-size: 16px;"><strong style="color: #4318FF; width: 80px; display: inline-block;">Service:</strong> <span style="color: #ffffff; text-transform: capitalize;">${service || "General"}</span></p>
//                       </div>
//                   </div>

//                   <div style="margin-bottom: 30px;">
//                       <p style="color: #888888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Project Vision</p>
//                       <div style="background-color: rgba(255,255,255,0.03); border-radius: 12px; padding: 20px; line-height: 1.6; color: #dddddd; font-style: italic;">
//                         "${finalVision}"
//                       </div>
//                   </div>

//                   <a href="mailto:${email}" style="display: inline-block; background-color: #4318FF; color: #ffffff; padding: 16px 32px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
//                       Reply to Client
//                   </a>
//                 </div>

//                 <div style="padding: 20px 40px; background-color: rgba(255,255,255,0.02); border-top: 1px solid rgba(255,255,255,0.05); text-align: center;">
//                   <p style="font-size: 10px; color: #555555; margin: 0;">
//                       Reference ID: ${newInquiry._id} • Logged at ${new Date().toLocaleString()}
//                   </p>
//                 </div>
//             </div>
//           </div>
//         `,
//       });
//       console.log("Email sent successfully.");
//     } catch (emailError) {
//       // We log the error, but DO NOT return a 500 status here.
//       // The user's data is safe in the DB, so we still want to show them a success message.
//       console.error("Email Delivery Failed (Likely Firewall Block):", emailError);
//     }
    
//     // 6. Final Success Response (Sent even if email fails, as long as DB saved)
//     return NextResponse.json({ message: "Inquiry saved successfully." }, { status: 201 });

//   } catch (error) {
//     // This catches fatal errors at the very start (e.g., body parsing failed)
//     console.error("CRITICAL BACKEND ERROR:", error);
//     return NextResponse.json({ message: "Internal Error", error: error.message }, { status: 500 });
//   }
// }
