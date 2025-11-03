const dbUtils = require("../config/DatabaseConfig")

// const Education = dbUtils.getCollection("Education");
const Job = dbUtils.getCollection(process.env.JOBS_DATABASE);
const User =  dbUtils.getCollection(process.env.USERS_DATABASE);
const Education =  dbUtils.getCollection(process.env.EDUCATION_DATABASE);
const Experience =  dbUtils.getCollection(process.env.EXPERIENCE_DATABASE);
const Application =  dbUtils.getCollection(process.env.JOB_APPLICATION_DATABASE);


exports.applyForJob = async (req, res) => {
    try {
        const { jobId } = req.body;
        const userId = req.user._id; // assuming JWT middleware sets req.user
        console.log(req.user._id);
        const job = await Job.findById(jobId);
        const user = await User.findById(userId);
        // console.log(job, user);

        if (!user.email || !user.fullName || !user.phone){
            console.log("not completed profile");
            return res.status(404).json({ msg: "Please complete profile creation." });
        }

        if (!job || !user) {
            return res.status(404).json({ msg: "Job or User not found" });
        }
        // res.send({job, user})

        let application = await Application.findOne({ jobId, userId });

        if (application) {
            if (application.status === "Withdrawn") {
                application.status = "Pending";
                application.updatedAt = Date.now();
                await application.save();
                return res.json({ msg: "Re-applied successfully", application });
            } else {
                return res.status(400).json({ msg: "You already applied for this job" });
            }
        }
        const education = await Education.find({ userId });
        const experience = await Experience.find({ userId });

        const newApplication = new Application({
            userId,
            jobId,
            jobTitle: job.jobTitle,
            companyName: job.companyName,
            applicantName: user.fullName,
            applicantEmail: user.email,
            applicantPhone: user.phone,
            education: education.map((e) => e._id),
            experience: experience.map((ex) => ex._id),
        });

        await newApplication.save();

        res.status(201).json({ msg: "Applied successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getApplies = async (req, res) => {
    try {
        const userId = req.user._id;
        const applications = await Application.find({ userId })
        res.json(applications)
    } catch (error) {
        res.json({ "mes": "Error" })

    }
}

exports.undoApplication = async (req, res) => {
    try {
        const { applicationId } = req.body;
        const userId = req.user._id;

        const application = await Application.findOne({ _id: applicationId, userId });

        if (!application) {
            return res.status(404).json({ msg: "Application not found" });
        }

        application.status = "Withdrawn";
        application.updatedAt = Date.now();
        await application.save();

        res.json({ msg: "Application withdrawn successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



exports.updateApplicationStatus = async (req, res) => {
    try {
        const { applicationId, status } = req.body;

        const allowedStatuses = ["Pending", "Under Review", "Accepted", "Rejected"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ msg: "Invalid status" });
        }

        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({ msg: "Application not found" });
        }

        application.status = status;
        application.updatedAt = Date.now();
        await application.save();

        res.json({ msg: "Application status updated", application });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getApplications = async (req,res) => {
    try {
        const data = await Application.find();
        res.json(data)
    } catch (error) {
        res.json({ err: error.message })
    }
}