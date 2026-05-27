const jobService = require('../services/jobService');
const catchAsync = require('../utils/catchAsync');
const responseHandler = require('../utils/responseHandler');

/**
 * CONTROLADOR DE EMPLEOS
 */

const getJobs = catchAsync(async (req, res) => {
  const jobs = await jobService.getAllJobs();
  responseHandler.success(res, jobs);
});

const getJobDetails = catchAsync(async (req, res) => {
  const job = await jobService.getJobById(req.params.id);
  responseHandler.success(res, job);
});

module.exports = { getJobs, getJobDetails };
