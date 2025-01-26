import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import Admin from "../models/Admin.js"
import Loan from "../models/Loan.js"

const router = express.Router()

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    const admin = await Admin.findOne({ email })
    if (!admin) {
      return res.status(400).json({ msg: "Invalid credentials" })
    }

    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" })
    }

    const payload = {
      admin: {
        id: admin.id,
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

router.get("/loans", async (req, res) => {
  try {
    const loans = await Loan.find().sort({ createdAt: -1 })
    res.json(loans)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

export default router
