import mongoose from "mongoose";

/**
 * type: "quick" or "custom"
 * category: vegetable | egg | chicken | fish | other
 * ingredients: optional deduction mapping for stock [{item: ObjectId(StockItem), qty: number, uom: "kg|g|L|pcs"}]
 */
const mealSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ["quick", "custom"], default: "quick" },
    category: { type: String, enum: ["vegetable", "egg", "chicken", "fish", "other"], default: "other" },
    price: { type: Number, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ingredients: [
      {
        item: { type: mongoose.Schema.Types.ObjectId, ref: "StockItem" },
        qty: Number,
        uom: String
      }
    ],
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Meal", mealSchema);
