const dbUtils = require("../config/DatabaseConfig")
const Job = dbUtils.getCollection(process.env.JOBS_DATABASE);

exports.createJob = async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json({ success: true, data: job });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getJobs = async (req, res) => {
  try {
    console.log(process.env.JOBS_DATABASE);
    const jobs = await Job.find();
    const jobCounts = await Job.countDocuments();
    res.status(200).json({ success: true, data: { jobs, counts: jobCounts } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    console.log("jobs in ctrl", job);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    res.status(200).json({ success: true, data: job });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    res.status(200).json({ success: true, data: job });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    res.status(200).json({ success: true, message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.createManyJobs = async (req, res) => {
  try {
    const jobsArray = req.body;
    if (!Array.isArray(jobsArray) || jobsArray.length === 0) {
      return res.status(400).json({ success: false, message: "Provide a non-empty array of jobs" });
    }

    const jobs = await Job.insertMany(jobsArray);

    res.status(201).json({ success: true, data: jobs });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


exports.filterJobs = async (req, res) => {
try {
const prms = req.query;
console.log("triggered params", prms); 
const filteredJobs   = await Job.find(prms);

res.status(200).json(filteredJobs);
} catch (error) {
res.status(200).json("Got an error...");
  
}
}