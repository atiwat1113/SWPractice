const Hospital = require("../models/Hospital");

exports.getHospitals = async (req, res, next) => {
  try {
    let query;
    const reqQuery = { ...req.query };
    const removeFields = ["select", "sort", "page", "limit"];

    removeFields.forEach((param) => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    query = Hospital.find(JSON.parse(queryStr)).populate("appointments");

    // Select
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Hospital.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const hospitals = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      sucess: true,
      count: hospitals.length,
      pagination,
      data: hospitals,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

exports.getHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({
      sucess: true,
      data: hospital,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

exports.createHospital = async (req, res, next) => {
  const hospital = await Hospital.create(req.body);
  res.status(200).json({
    success: true,
    data: hospital,
  });
};

exports.updateHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      data: hospital,
    });

    if (!hospital) {
      return res.status(400).json({ success: false });
    }
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

exports.deleteHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.findById(req.params.id);

    if (!hospital) {
      return res.status(400).json({ success: false });
    }

    hospital.remove();
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    return res.status(400).json({ success: false });
  }
};
