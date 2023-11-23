import mongoose from "mongoose";
import Job from "../models/jobModel.js";
// create job
const createJobController = async (req, res, next) => {
  // Ambil data perusahaan dan posisi dari permintaan body
  const { company, position } = req.body;
  // Periksa apakah data perusahaan dan posisi tersedia
  if (!company || !position) {
    next("Please provide all fields");
  }
  // Tambahkan informasi pembuat pekerjaan (createdBy) dari pengguna yang telah terotentikasi
  req.body.createdBy = req.user.userId;

  // Buat pekerjaan menggunakan model Job
  const job = await Job.create(req.body);

  // response
  res.status(201).json({
    job,
  });
};

//get job
const getJobsControoler = async (req, res, next) => {
  // Ambil pekerjaan yang dimiliki oleh pengguna dengan ID yang terotentikasi
  const jobs = await Job.find({ createdBy: req.user.userId });

  //response
  res.status(200).json({
    totalJobs: jobs.length,
    jobs,
  });
};

export { createJobController, getJobsControoler };
