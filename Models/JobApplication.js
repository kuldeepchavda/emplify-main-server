const mongoose = require("mongoose"); 
require("dotenv").config();

const JobApplication = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },


    jobTitle: { type: String, required: true },
    companyName: { type: String, required: true },

    applicantName: { type: String, required: true },
    applicantEmail: { type: String, required: true },
    applicantPhone:{type:String, required:true},

    education: [{ type: mongoose.Schema.Types.ObjectId, ref: "Education", required: true }],
    experience: [{ type: mongoose.Schema.Types.ObjectId, ref: "Experience", required: true }],

    status: {
        type: String,
        enum: ["Pending", "Under Review", "Accepted", "Rejected", "Withdrawn"],
        default: "Pending"
    },
    appliedAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() }
},

    { timestamps: true })

module.exports = mongoose.model(process.env.JOB_APPLICATION_DATABASE, JobApplication)