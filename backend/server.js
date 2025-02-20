require('dotenv').config({ path: './backend/.env' }); // Explicitly load .env from /backend
console.log("Debugging: Checking Environment Variables...");
console.log("Email User:", process.env.EMAIL_USER || "Not Found");
console.log("Email Pass:", process.env.EMAIL_PASS ? "Loaded" : "Not Loaded");

// Import required modules
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Route
app.post("/api/send", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required!" });
  }
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Missing environment variables");
    }
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Email Sending Error:", error);
    res.status(500).json({ message: "Error sending email", error: error.message });
  }
});

// Start the server only for local testing
if (process.env.NODE_ENV !== "production") {
  app.listen(5000, () => console.log("Server running on http://localhost:5000"));
}

// Export for Vercel
module.exports = app;