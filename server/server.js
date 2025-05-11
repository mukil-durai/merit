const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587, // Use port 587 for TLS
  secure: false, // Set to false for TLS
  auth: {
    user: 'your-gmail@gmail.com', // Your Gmail address
    pass: 'your-app-password' // Gmail App Password (not your regular password)
  }
});

app.post('/send-email', async (req, res) => {
  const { fullName, email, phone, subject, message } = req.body;

  const mailOptions = {
    from: 'your-gmail@gmail.com',
    to: 'mukild.22it@kongu.edu',
    subject: `New Contact Form Message: ${subject}`,
    html: `
      <h3>New Contact Form Submission</h3>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
