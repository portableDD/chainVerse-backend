// services/careerService.js
const Career = require('../models/Careers');
const slugify = require('../utils/slugify');

const createCareerTrack = async (data) => {
  const { title, description, image, requirements, outcomes } = data;
  const slug = slugify(title);

  const newCareer = new Career({
    title,
    slug,
    description,
    image,
    requirements,
    outcomes,
  });

  await newCareer.save();
  return newCareer;
};

const updateCareerTrack = async (id, data) => {
  return Career.findByIdAndUpdate(id, data, { new: true });
};

const deleteCareerTrack = async (id) => {
  return Career.findByIdAndDelete(id);
};

const getAllCareerTracks = async () => {
  return Career.find();
};

const getCareerTrackById = async (id) => {
  return Career.findById(id);
};

module.exports = {
  createCareerTrack,
  updateCareerTrack,
  deleteCareerTrack,
  getAllCareerTracks,
  getCareerTrackById,
};
