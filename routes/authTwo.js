import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User.js"

import  sendEmail from "../utils/email.js"

const router = express.Router()

router.post("/register", async (req, res) => {
  try {
    const { name, email, cnic } = req.body

    // Check if user already exists
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ msg: "User already exists" })
    }

    // Generate random password
    const password = Math.random().toString(36).slice(-8)

    // Create new user
    user = new User({
      name,
      email,
      cnic,
      password,
    })

    // Hash password
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)

    await user.save()

    // Send email with password
    await sendEmail(email, "Your Account Password", `Your temporary password is: ${password}`)

    res.status(201).json({ msg: "User registered successfully. Check your email for the password." })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" })
    }

    const payload = {
      user: {
        id: user.id,
      },
    }

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
      if (err) throw err
      res.json({ token })
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

router.post("/change-password", async (req, res) => {
  try {
    const { newPassword } = req.body
    const userId = req.user.id // Assuming you have middleware to extract user from token

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ msg: "User not found" })
    }

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(newPassword, salt)
    await user.save()

    res.json({ msg: "Password changed successfully" })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

export default router


