// import mongoose from "mongoose"


// const LoanSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   loanDetails: {
//     category: String,
//     subcategory: String,
//     amount: Number,
//     period: Number,
//   },
//   guarantors: [
//     {
//       name: String,
//       email: String,
//       location: String,
//       cnic: String,
//     },
//   ],
//   statement: String,
//   salarySheet: String,
//   address: String,
//   phoneNumber: String,
//   status: {
//     type: String,
//     enum: ["pending", "submitted", "approved", "rejected"],
//     default: "pending",
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// })
// const LoanModel = mongoose.model("Loan", LoanSchema)
// export default LoanModel

import mongoose from "mongoose";

const LoanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  loanDetails: {
    category: {
      type: String,
      required: [false, "Loan category is required"],
      trim: true,
    },
    subcategory: {
      type: String,
      trim: true,
    },
    amount: {
      type: Number,
      required: [false, "Loan amount is required"],
      min: [0, "Loan amount must be a positive number"],
    },
    period: {
      type: Number,
      required: [false, "Loan period is required"],
      min: [1, "Loan period must be at least 1 month"],
    },
  },
  
  address: String,
  phoneNumber: String,

//   status: {
//     type: String,
//     enum: ["pending", "submitted", "approved", "rejected"],
//     default: "pending",
//   },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const LoanModel = mongoose.model("Loan", LoanSchema);
export default LoanModel;

