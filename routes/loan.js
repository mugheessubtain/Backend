import express from "express";
import nodemailer from "nodemailer";
import LoanApp from "../models/LoanApplication.js";
import 'dotenv/config'
const router = express.Router();

const { senderEmail, senderPassword } = process.env;

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // Update this based on your email provider
  auth: {
    user: senderEmail,
    pass: senderPassword,
  },
});

// Function to generate a random password
function generateRandomPassword() {
  return Math.random().toString(36).slice(-8); // Generates an 8-character alphanumeric password
}

// Function to send email
async function sendEmail(recipientEmail, password) {
  const mailOptions = {
    from: senderEmail,
    to: recipientEmail,
    subject: "Welcome! Your Account Details",
    html: `
      <p>Welcome to our platform! Here are your account details:</p>
      <p><strong>Email:</strong> ${recipientEmail}</p>
      <p><strong>Password:</strong> ${password}</p>
      <p>To change your password, click the link below:</p>
      <a href="https://mmmm-green.vercel.app/changepassword" target="_blank">Change Password</a>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to", recipientEmail);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email.");
  }
}

// Route to handle user addition
router.post("/submit-application", async (req, res) => {
  const { cnic, email, name, loanDetails } = req.body;

  try {
    // Validate required fields
    if (!cnic || !email || !name || !loanDetails) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Generate a random password
    const randomPassword = generateRandomPassword();

    // Create a new loan application (replace this with your user model logic if needed)
    const application = new LoanApp({
      cnic,
      email,
      name,
      password:generateRandomPassword(),
      loanDetails,
    });

    // Save the application to the database
    await application.save();

    // Send email with generated password
    await sendEmail(email, randomPassword);

    res.status(201).json({ message: "User added successfully. Email sent with account details." });
  } catch (error) {
    console.error("Error adding user:", error);

    if (error.code === 11000) {
      return res.status(400).json({ message: "Duplicate CNIC or email found." });
    }

    res.status(500).json({ message: "Failed to add user. Please try again later." });
  }
});
router.post("/change-password", async (req, res) => {
    const { email, newPassword } = req.body;
  
    try {
      // Validate input
      if (!email || !newPassword) {
        return res.status(400).json({ message: "Email and new password are required." });
      }
  
      // Find the user by email
      const user = await LoanApp.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      // Update the user's password
      user.password = newPassword; // Ensure password is hashed if using a real implementation
      await user.save();
  
      res.status(200).json({ message: "Password updated successfully." });
    } catch (error) {
      console.error("Error updating password:", error);
      res.status(500).json({ message: "Failed to update password. Please try again later." });
    }
  });

router.post('/submitLoan', async (req, res) => {
    try {
        const { email, guarantors, address, phoneNumber } = req.body;
    
        // Validate the request
        if (!guarantors || guarantors.length < 1) {
          return res.status(400).json({ message: 'At least one guarantor is required' });
        }
    
        // Find the user based on the provided email
        const user = await LoanApp.findOne({ email });
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        // Embed the guarantors directly into the user document
        user.guarantors = guarantors;
        user.address = address;
        user.phoneNumber = phoneNumber;
    
        // Save the updated loan application
        await user.save();
    
        res.status(200).json({
          message: 'Loan request updated successfully',
          user, // Send the updated loan application
        });
      } catch (error) {
        console.error('Error submitting loan request:', error);
        res.status(500).json({ message: 'Failed to submit loan request. Please try again later.' });
      }
    });


// API route to get loan application by ID
router.get('/:email', async (req, res) => {
    const { email } = req.params; // Extract ID from URL
console.log(email);

    try {
        // Validate if the ID is a valid MongoDB ObjectId
       

        // Fetch the loan application by ID
        const loanApplication = await LoanApp.findOne({ email });
        if (!loanApplication) {
            return res.status(404).json({ message: 'Loan application not found.' });
        }

        // Send the fetched loan application data as the response
        res.status(200).json({ loanApplication });
    } catch (error) {
        console.error('Error fetching loan application:', error);
        res.status(500).json({ message: 'Failed to fetch loan application. Please try again later.' });
    }
});


export default router;
