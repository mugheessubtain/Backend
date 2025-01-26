// import mongoose from "mongoose";

// const LoanApplicationSchema = new mongoose.Schema({
//     cnic: {
//         type: String,
//         required: true,
//         unique: true,
//         minlength: 13,
//         maxlength: 13,
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//         match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//     },
//     name: {
//         type: String,
//         required: true,
//     },
//     loanDetails: {
//         category: {
//             type: String,
//             required: true,
//         },
//         subcategory: {
//             type: String,
//             required: true,
//         },
//         amount: {
//             type: Number,
//             required: true,
//             min: 1,
//         },
//         period: {
//             type: Number,
//             required: true,
//             min: 1,
//         },
//     },
//     guarantors: [
//         {
//             name: String,
//             email: String,
//             location: String,
//             cnic: String,
//         },
//     ],
//     address: String,
//     phoneNumber: String,
//     createdAt: {
//         type: Date,
//         default: Date.now,
//     },
//     password: String,
// });

// const LoanApp = mongoose.model("LoanApplication", LoanApplicationSchema);
// export default LoanApp;












import mongoose from "mongoose";

const guarantorSchema = new mongoose.Schema({
    name: { type: String, required: false },
    email: { type: String, required: false },
    location: { type: String, required: false },
    cnic: { type: String, required: false },
    address: { type: String, required: false },
    phoneNumber: { type: String, required: false },
});

const loanApplicationSchema = new mongoose.Schema({
    cnic: {
        type: String,
        required: true,
        match: /^\d{5}-\d{7}-\d{1}$/, // CNIC regex pattern (e.g., 12345-6789012-3)
    },
    email: {
        type: String,
        required: false,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    name: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        required: false,
        enum: ["pending", "submitted", "approved", "rejected"],
    },
    loanDetails: {
        category: { type: String, required: false },
        subcategory: { type: String, required: false },
        amount: { type: Number, required: false, min: 1 },
        period: { type: Number, required: false, min: 1 },
    },
    guarantors: [guarantorSchema], // Embedded Guarantor Schema
    address: { type: String },
    phoneNumber: { type: String },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    password: { type: String },
});

const LoanApp = mongoose.model("LoanApplication", loanApplicationSchema);
export default LoanApp;
