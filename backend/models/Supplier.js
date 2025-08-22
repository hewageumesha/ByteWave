import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    contact: { type: String },
    email: { type: String },
    phone: { type: String },
    leadTimeDays: { type: Number, default: 1 },
    notes: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("Supplier", supplierSchema);

