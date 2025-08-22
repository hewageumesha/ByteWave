const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    role: {
        type: String,
        enum: ['admin', 'staff', 'customer'],
        default: 'customer'
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    },
    phone: {
        type: String,
        trim: true,
        match: [/^\+?[\d\s-()]+$/, 'Please enter a valid phone number']
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    profilePicture: {
        type: String,
        default: null
    },
    lastLogin: {
        type: Date,
        default: null
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    phoneVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
    return `${this.name}`;
});

// Method to check if user is active
userSchema.methods.isActive = function() {
    return this.status === 'active';
};

// Method to check if user has role
userSchema.methods.hasRole = function(role) {
    return this.role === role;
};

// Method to check if user has any of the specified roles
userSchema.methods.hasAnyRole = function(roles) {
    return roles.includes(this.role);
};

// Static method to find active users
userSchema.statics.findActive = function() {
    return this.find({ status: 'active' });
};

// Static method to find users by role
userSchema.statics.findByRole = function(role) {
    return this.find({ role: role });
};

// Pre-save middleware to hash password (you'll need to implement this)
userSchema.pre('save', function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();
    
    // TODO: Hash password here using bcrypt
    // this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Pre-save middleware to ensure email is lowercase
userSchema.pre('save', function(next) {
    if (this.email) {
        this.email = this.email.toLowerCase();
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
