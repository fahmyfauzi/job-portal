import mongoose from "mongoose";
import Job from "../models/jobModel.js";
import moment from "moment";
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
  // const jobs = await Job.find({ createdBy: req.user.userId });

  // Deklarasi variabel yang menyimpan query parameters dari request
  const { status, workType, search, sort } = req.query;

  // Objek query awal dengan createdBy dari pengguna terotentikasi
  const queryObject = {
    createdBy: req.user.userId,
  };
  //logic filter
  if (status && status !== "all") {
    queryObject.status = status;
  }

  if (workType && workType !== "all") {
    queryObject.workType = workType;
  }
  if (search) {
    queryObject.position = {
      $regex: search,
      $options: "i",
    };
  }
  let queryResult = Job.find(queryObject);
  //sorting
  if (sort == "latest") {
    queryResult = queryResult.sort("-createdAt");
  }
  if (sort == "oldest") {
    queryResult = queryResult.sort("createdAt");
  }
  if (sort == "a-z") {
    queryResult = queryResult.sort("position");
  }
  if (sort == "z-a") {
    queryResult = queryResult.sort("-position");
  }

  //pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  queryResult = queryResult.skip(skip).limit(limit);
  //jobs count
  const totalJobs = await Job.countDocuments(queryResult);
  const numOfPage = Math.ceil(totalJobs / limit);

  // Eksekusi query dan simpan hasilnya dalam variabel jobs
  const jobs = await queryResult;

  //response
  res.status(200).json({
    totalJobs,
    page,
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

//stats and filter
const jobStatesController = async (req, res, next) => {
  // Ambil statistik pekerjaan berdasarkan status
  const stats = await Job.aggregate([
    //search by user
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  // Statistik default untuk status yang mungkin tidak ada dalam hasil pencarian
  const defaultStats = {
    pending: stats.find((stat) => stat._id === "pending")?.count || 0,
    reject: stats.find((stat) => stat._id === "reject")?.count || 0,
    interview: stats.find((stat) => stat._id === "interview")?.count || 0,
  };

  // Ambil statistik aplikasi bulanan
  let monthlyApplication = await Job.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
      },
    },
    {
      $group: {
        _id: {
          year: {
            $year: "$createdAt",
          },
          month: {
            $month: "$createdAt",
          },
        },
        count: {
          $sum: 1,
        },
      },
    },
  ]);

  // Ubah format statistik aplikasi bulanan
  monthlyApplication = monthlyApplication
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      // Format tanggal ke dalam "MMM Y" (Jan 2022)
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");
      return { date, count };
    })
    .reverse(); // Balik urutan bulan

  res.status(200).json({
    totalJobs: stats.length,
    stats,
    defaultStats,
    monthlyApplication,
  });
};
export {
  createJobController,
  getJobsControoler,
  updateJobController,
  deleteJobController,
  jobStatesController,
};
