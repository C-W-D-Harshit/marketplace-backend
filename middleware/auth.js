const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const Vendor = require("../models/vendorModel");

exports.isAuthenticatedVendor = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHander("Please Login to access this resource", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.vendor = await Vendor.findById(decodedData.id);

  next();
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.vendor.role)) {
      return next(
        new ErrorHander(
          `Role: ${req.vendor.role} is not allowed to access this resouce `,
          403
        )
      );
    }

    next();
  };
};
