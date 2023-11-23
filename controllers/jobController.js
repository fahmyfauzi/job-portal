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

const updateJobController = async (req, res, next) => {
  // Ambil ID pekerjaan dari parameter permintaan
  const { id } = req.params;

  // Ambil data perusahaan dan posisi dari permintaan body
  const { company, position } = req.body;

  // Periksa apakah data perusahaan dan posisi tersedia
  if (!company || !position) {
    next("Please provide all fields");
  }

  // Temukan pekerjaan berdasarkan ID
  const job = await Job.findOne({ _id: id });
  // Validasi apakah pekerjaan ditemukan
  if (!job) {
    next(`No jobs found with id ${id}`);
  }
  // Validasi apakah pengguna memiliki izin untuk mengupdate pekerjaan
  if (!req.user.userId == job.createdBy.toString()) {
    next("Your not authorized to update this job");
    return;
  }
  // Lakukan update pada pekerjaan berdasarkan ID
  const updateJob = await Job.findOneAndUpdate({ _id: id }, req.body, {
    new: true, //akan mengembalikan versi dokumen setelah pembaruan
    runValidator: true, // menentukan apakah validasi skema (validator) harus dijalankan ketika melakukan operasi pembaruan.
  });
  res.status(200).json({ updateJob });
};

const deleteJobController = async (req, res, next) => {
  // Ambil ID pekerjaan dari parameter permintaan
  const { id } = req.params;

  // Temukan pekerjaan berdasarkan ID
  const job = await Job.findOne({ _id: id });

  // Validasi apakah pekerjaan ditemukan
  if (!job) {
    next(`No jobs found with id ${id}`);
  }
  // Validasi apakah pengguna memiliki izin untuk menghapus pekerjaan
  if (!req.user.userId === job.createdBy.toString()) {
    next("Your not authorized to update this job");
    return;
  }
  // Hapus pekerjaan berdasarkan ID
  await Job.deleteOne();
  res.status(200).json({ message: "Success, job deleted!" });
};
export {
  createJobController,
  getJobsControoler,
  updateJobController,
  deleteJobController,
};
