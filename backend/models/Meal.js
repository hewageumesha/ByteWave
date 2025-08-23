// models/Meal.js
import mongoose from "mongoose";

const mealSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true,
      maxlength: 100
    },
    description: { 
      type: String, 
      required: true, 
      trim: true,
      maxlength: 500
    },
    price: { 
      type: Number, 
      required: true, 
      min: 0,
      validate: {
        validator: function(v) {
          return v >= 0;
        },
        message: 'Price must be a positive number'
      }
    },
    category: { 
      type: String, 
      required: true,
      enum: ['breakfast', 'lunch', 'dinner', 'snack', 'beverage', 'dessert'],
      lowercase: true
    },
    ingredients: [{ 
      type: String, 
      trim: true 
    }],
    allergens: [{ 
      type: String, 
      enum: ['dairy', 'eggs', 'fish', 'shellfish', 'nuts', 'peanuts', 'wheat', 'soy'],
      lowercase: true
    }],
    nutritionalInfo: {
      calories: { type: Number, min: 0 },
      protein: { type: Number, min: 0 },
      carbs: { type: Number, min: 0 },
      fat: { type: Number, min: 0 },
      fiber: { type: Number, min: 0 }
    },
    isAvailable: { 
      type: Boolean, 
      default: true 
    },
    isVegetarian: { 
      type: Boolean, 
      default: false 
    },
    isVegan: { 
      type: Boolean, 
      default: false 
    },
    spicyLevel: { 
      type: Number, 
      min: 0, 
      max: 5, 
      default: 0 
    },
    preparationTime: { 
      type: Number, 
      min: 1,
      required: true,
      validate: {
        validator: function(v) {
          return v > 0;
        },
        message: 'Preparation time must be greater than 0 minutes'
      }
    }, // in minutes
    imageUrl: { 
      type: String, 
      trim: true 
    },
    tags: [{ 
      type: String, 
      trim: true,
      lowercase: true
    }]
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
mealSchema.index({ category: 1 });
mealSchema.index({ isAvailable: 1 });
mealSchema.index({ name: 'text', description: 'text' });
mealSchema.index({ price: 1 });

// Virtual for formatted price
mealSchema.virtual('formattedPrice').get(function() {
  return `$${this.price.toFixed(2)}`;
});

// Method to check if meal is available
mealSchema.methods.checkAvailability = function() {
  return this.isAvailable;
};

// Static method to find meals by category
mealSchema.statics.findByCategory = function(category) {
  return this.find({ category: category, isAvailable: true });
};

// Static method to find available meals
mealSchema.statics.findAvailable = function() {
  return this.find({ isAvailable: true });
};

// Pre-save middleware
mealSchema.pre('save', function(next) {
  // Ensure price has max 2 decimal places
  if (this.price) {
    this.price = Math.round(this.price * 100) / 100;
  }
  next();
});

export default mongoose.model("Meal", mealSchema);