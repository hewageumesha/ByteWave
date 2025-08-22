import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        mealId: { type: mongoose.Schema.Types.ObjectId, ref: "Meal", required: true },
        quantity: { type: Number, required: true, min: 1 }
      }
    ],
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ["pending", "preparing", "ready", "delivered", "cancelled"], default: "pending" }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
