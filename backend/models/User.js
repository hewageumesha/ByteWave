// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function(v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Please enter a valid email address'
      }
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return !v || /^[\+]?[1-9][\d]{0,15}$/.test(v);
        },
        message: 'Please enter a valid phone number'
      }
    },
    role: {
      type: String,
      enum: ['customer', 'staff', 'admin'],
      default: 'customer'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    refreshTokens: [{
      token: String,
      createdAt: {
        type: Date,
        default: Date.now,
        expires: '7d' // Automatically delete after 7 days
      }
    }],
    lastLogin: {
      type: Date
    },
    profileImage: {
      type: String,
      trim: true
    }
  },
  { 
    timestamps: true,
    toJSON: { 
      transform: function(doc, ret) {
        delete ret.password;
        delete ret.refreshTokens;
        return ret;
      }
    }
  }
);

// Indexes
// userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Add refresh token
userSchema.methods.addRefreshToken = async function(token) {
  this.refreshTokens.push({ token });
  await this.save();
};

// Remove refresh token
userSchema.methods.removeRefreshToken = async function(token) {
  this.refreshTokens = this.refreshTokens.filter(t => t.token !== token);
  await this.save();
};

// Clean expired tokens (static method)
userSchema.statics.cleanExpiredTokens = async function() {
  const result = await this.updateMany(
    {},
    { $pull: { refreshTokens: { createdAt: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } } }
  );
  return result;
};

// Update last login
userSchema.methods.updateLastLogin = async function() {
  this.lastLogin = new Date();
  await this.save();
};

export default mongoose.model("User", userSchema);