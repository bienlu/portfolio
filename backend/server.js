// Load environment variables from .env file (for local development)
require('dotenv').config({ path: './backend/.env' });

// Import required modules
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

// Initialize the Express app
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)
app.use(express.json()); // Parse JSON request bodies

// Define the port (use process.env.PORT for Vercel compatibility)
const PORT = process.env.PORT || 5000;

// Route to handle form submissions
app.post('/send', (req, res) => {
  const { name, email, message } = req.body;

  // Validate input
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required!' });
  }

  // Create a transporter for sending emails
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Gmail address
      pass: process.env.EMAIL_PASS, // App Password
    },
  });

  // Email options
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address
    to: process.env.EMAIL_USER,   // Recipient address (can be the same as sender)
    subject: `New Contact Form Submission from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Failed to send email' });
    }
    console.log('Email sent:', info.response);
    res.status(200).json({ message: 'Email sent successfully!' });
  });
});

// Default route (for testing purposes)
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// Start the server (only for local testing)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export the app for Vercel deployment
module.exports = app;