const getCollection = require("../../config/DatabaseConfig");
const mongoose = require("mongoose")
const educationSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        school: { type: String, required: true },
        degree: { type: String, required: true },
        field: { type: String },
        startYear: { type: Date },
        endDateYear: { type: Date },
        completed: { type: Boolean },
        description:{type:String}
    },
    { timestamps: true }
);

module.exports = mongoose.model("Education", educationSchema);