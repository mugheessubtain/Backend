import mongoose from "mongoose";
const guarantorSchema = new mongoose.Schema({
    guarantors: [
        {
          name: String,
          email: String,
          location: String,
          cnic: String,
        },
      ],
    address: String,
    phoneNumber: String,
});
const guarantorModel = mongoose.model("Guarantor", guarantorSchema);
export default guarantorModel;