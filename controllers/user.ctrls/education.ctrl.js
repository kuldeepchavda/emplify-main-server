const dbUtils = require("../../config/DatabaseConfig")
const Education = dbUtils.getCollection(process.env.EDUCATION_DATABASE);

 
const createEducation = async (req, res) => {
  try {
    const userId = req.user._id;
    const { school, degree, field, startDate, endDate, description } = req.body;
    console.log(req.body);
    const education = await Education.create({
      userId,
      school,
      degree,
      field,
      startDate,
      endDate,
      description,
    });

    res.status(201).json(education);
  } catch (error) {
    res.status(500).json({ message: "Error creating education", error: error.message });
  }
};

const getEducationById = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const educations = await Education.findOne({ _id: id });
    res.json(educations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching educations", error: error.message });
  }
};


 
const getEducations = async (req, res) => {
  try {

    const userId = req.user._id;
    const educations = await Education.find({ userId });

    res.json(educations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching educations", error: error.message });
  }
};

const updateEducation = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const updates = req.body;

    const education = await Education.findOneAndUpdate(
      { _id: id, userId },
      updates,
      { new: true }
    );

    if (!education) {
      return res.status(404).json({ message: "Education not found" });
    }

    res.json(education);
  } catch (error) {
    res.status(500).json({ message: "Error updating education", error: error.message });
  }
};

/**
 * Delete an education entry
 */
const deleteEducation = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const education = await Education.findOneAndDelete({ _id: id, userId });

    if (!education) {
      return res.status(404).json({ message: "Education not found" });
    }

    res.json({ message: "Education deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting education", error: error.message });
  }
};

/**
 * Insert many education entries at once
 */
const insertManyEducations = async (req, res) => {
  try {
    const userId = req.user._id;
    const educations = req.body.map(edu => ({ ...edu, userId }));

    const result = await Education.insertMany(educations, { ordered: false });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error inserting many educations", error: error.message });
  }
};


module.exports = {
  createEducation,
  getEducations,
  updateEducation,
  deleteEducation,
  insertManyEducations,
  getEducationById
}