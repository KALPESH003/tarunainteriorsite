"use server";
import dbConnect from "@/lib/dbConnect"; // Ensure you have a db connection utility
import Inquiry from "@/models/Inquiry";

export async function submitContactForm(formData) {
  try {
    await dbConnect();

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      projectVision: formData.get("projectVision"),
    };

    // Save to MongoDB
    const newInquiry = await Inquiry.create(data);

    return { success: true, message: "Inquiry sent successfully!" };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, message: "Something went wrong. Please try again." };
  }
}