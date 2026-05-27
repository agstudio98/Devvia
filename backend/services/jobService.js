const Job = require('../models/Job');

/**
 * SERVICIO DE EMPLEOS
 */
const getAllJobs = async () => {
  return await Job.find({ active: true }).sort({ createdAt: -1 });
};

const getJobById = async (id) => {
  const job = await Job.findById(id);
  if (!job) throw new Error('Job not found');
  return job;
};

module.exports = { getAllJobs, getJobById };
