import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    name: {
        type: String,
        required: false,
        trim: true,
    },
    status: {
        type: String,
        enum: ['active', 'unsubscribed', 'bounced'],
        default: 'active',
    },
    source: {
        type: String,
        enum: ['website', 'admin', 'import'],
        default: 'website',
    },
    subscribedAt: {
        type: Date,
        default: Date.now,
    },
    unsubscribedAt: {
        type: Date,
        required: false,
    },
    tags: [{
        type: String,
        trim: true,
    }],
    preferences: {
        productUpdates: {
            type: Boolean,
            default: true,
        },
        promotions: {
            type: Boolean,
            default: true,
        },
        healthTips: {
            type: Boolean,
            default: true,
        },
        weeklyNewsletter: {
            type: Boolean,
            default: true,
        },
    },
    metadata: {
        ipAddress: String,
        userAgent: String,
        referrer: String,
    },
}, {
    timestamps: true,
});

// Create indexes for better performance
// Note: email index is already created by unique: true
newsletterSchema.index({ status: 1 });
newsletterSchema.index({ subscribedAt: -1 });

const Newsletter = mongoose.models.Newsletter || mongoose.model('Newsletter', newsletterSchema);

export default Newsletter;