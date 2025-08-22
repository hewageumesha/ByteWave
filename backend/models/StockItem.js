import mongoose from "mongoose";

const stockItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    uom: { type: String, required: true },            // kg, g, L, pcs
    onHand: { type: Number, default: 0 },
    minQty: { type: Number, default: 0 },
    maxQty: { type: Number, default: 0 },
    expiryDate: { type: Date },                       // optional per-lot for MVP
    category: { type: String },                       // produce, meat, dry, beverage
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" }
  },
  { timestamps: true }
);

export default mongoose.model("StockItem", stockItemSchema);
