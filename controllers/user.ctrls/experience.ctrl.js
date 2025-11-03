const dbUtils = require("../../config/DatabaseConfig")
const Experience = dbUtils.getCollection(process.env.EXPERIENCE_DATABASE);

/**
 * Create a new experience
 */
const createExperience = async (req, res) => {
  try {
    const userId = req.user._id;
    const { company, position, startDate, endDate, description } = req.body;

    const experience = await Experience.create({
      userId,
      company,
      position,
      startDate,
      endDate,
      description,
    });

    res.status(201).json(experience);
  } catch (error) {
    res.status(500).json({ message: "Error creating experience", error: error.message });
  }
};

/**
 * Get all experiences of current user
 */
const getExperiences = async (req, res) => {
  try {
    const userId = req.user._id;
    const experiences = await Experience.find({ userId });

    res.json(experiences);
  } catch (error) {
    res.status(500).json({ message: "Error fetching experiences", error: error.message });
  }
};

const getExperiencesById =async(req,res)=>{
   try {
    const userId = req.user._id;
    const {id}  = req.params;
    const experiences = await Experience.findOne({ _id:id });
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ message: "Error fetching experiences", error: error.message });
  }
}

/**
 * Update an experience
 */
 const updateExperience = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params; // experienceId
    const updates = req.body;

    const experience = await Experience.findOneAndUpdate(
      { _id: id, userId },
      updates,
      { new: true }
    );

    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    res.json(experience);
  } catch (error) { 
    res.status(500).json({ message: "Error updating experience", error: error.message });
  }
};

/**
 * Delete an experience
 */
  const deleteExperience = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params; // experienceId

    const experience = await Experience.findOneAndDelete({ _id: id, userId });

    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    res.json({ message: "Experience deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting experience", error: error.message });
  }
};

/**
 * Insert many experiences at once
 */
  const insertManyExperiences = async (req, res) => {
  try {
    const userId = req.user._id;
    const experiences = req.body.map(exp => ({ ...exp, userId }));

    const result = await Experience.insertMany(experiences, { ordered: false });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error inserting many experiences", error: error.message });
  }
};


module.exports =  {
  createExperience,
  getExperiences,
  updateExperience,
  deleteExperience,
  getExperiencesById,
  insertManyExperiences,
}