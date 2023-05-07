const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
// const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");
const Vendor = require("../models/vendorModel");
const Order = require("../models/orderModel0");
const Product = require("../models/productModel");

// Register a User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  //   const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
  //     folder: "avatars",
  //     width: 150,
  //     crop: "scale",
  //   });

  const { name, email, password, description, phone, address, tags, orders } =
    req.body;

  const vendor = await Vendor.create({
    name,
    email,
    password,
    description,
    phone,
    address,
    tags,
    avatar: {
      public_id: "sample id",
      url: "sampleurl",
    },
    // avatar: {
    //   public_id: myCloud.public_id,
    //   url: myCloud.secure_url,
    // },
  });

  sendToken(vendor, 201, res);
});

// Login User
exports.loginVendor = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  // checking if user has given password and email both
  if (!email || !password) {
    return next(new ErrorHander("Please Enter Email & Password", 400));
  }
  const user = await Vendor.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHander("Invalid email or password", 401));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHander("Invalid email or password", 401));
  }
  sendToken(user, 200, res);
});

// Logout User
exports.vendorLogout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});
// Forgot Password
exports.vendorForgotPassword = catchAsyncErrors(async (req, res, next) => {
  const vendor = await Vendor.findOne({ email: req.body.email });
  if (!vendor) {
    return next(new ErrorHander("User not found", 404));
  }
  // Get ResetPassword Token
  const resetToken = vendor.getResetPasswordToken();
  await vendor.save({ validateBeforeSave: false });
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/vendor/password/reset/${resetToken}`;
  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;
  try {
    await sendEmail({
      email: vendor.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${vendor.email} successfully`,
    });
  } catch (error) {
    vendor.resetPasswordToken = undefined;
    vendor.resetPasswordExpires = undefined;
    await vendor.save({ validateBeforeSave: false });
    return next(new ErrorHander(error.message, 500));
  }
});

// Reset Password
exports.vendorResetPassword = catchAsyncErrors(async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const vendor = await Vendor.findOne({
    resetPasswordToken,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!vendor) {
    return next(
      new ErrorHander(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHander("Password does not password", 400));
  }
  vendor.password = req.body.password;
  vendor.resetPasswordToken = undefined;
  vendor.resetPasswordExpires = undefined;
  await vendor.save();
  sendToken(vendor, 200, res);
});

// Get Vendor Detail
exports.getVendorDetails = catchAsyncErrors(async (req, res, next) => {
  const vendor = await Vendor.findById(req.vendor.id);
  res.status(200).json({
    success: true,
    vendor,
  });
});

exports.getProdVendor = catchAsyncErrors(async (req, res, next) => {
  const vendor = await Vendor.findById(req.params.id);
  res.status(200).json({
    success: true,
    vendor,
  });
});
// update Vendor password
exports.vendorUpdatePassword = catchAsyncErrors(async (req, res, next) => {
  const vendor = await Vendor.findById(req.vendor.id).select("+password");
  const isPasswordMatched = await vendor.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHander("Old password is incorrect", 400));
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHander("password does not match", 400));
  }
  vendor.password = req.body.newPassword;
  await vendor.save();
  sendToken(vendor, 200, res);
});

// update Vendor Profile
exports.vendorUpdateProfile = catchAsyncErrors(async (req, res, next) => {
  const newVendorData = {
    name: req.body.name,
    email: req.body.email,
    description: req.body.description,
    phone: req.body.phone,
    address: req.body.address,
    tags: req.body.tags,
  };
  if (req.body.avatar !== "") {
    const vendor = await Vendor.findById(req.vendor.id);
    const imageId = vendor.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });
    newVendorData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }
  const vendor = await Vendor.findByIdAndUpdate(req.vendor.id, newVendorData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
  });
});

// get logged in vendor  Orders
exports.vendorOrders = catchAsyncErrors(async (req, res, next) => {
  // const vendor = req.vendor.id;
  // const products = await Product.find({ vendor: req.vendor.id });
  // // Extract the product ids from the products array
  // const productIds = products.map((product) => product._id);
  // const orders = await Order.find({
  //   "orderItems.product": { $in: productIds },
  // });
  // const vendorOrders = orders.map((order) => {
  //   let items = order.orderItems;
  //   let gg = items;
  //   console.log(gg);
  // });

  // const vendor = req.vendor.id;
  // const products = await Product.find({ vendor: req.vendor.id });
  // // Extract the product ids from the products array
  // const productIds = products.map((product) => product._id);
  // const orders = await Order.find({
  //   "orderItems.product": { $in: productIds },
  // });

  // const filteredOrders = orders.map((order) => {
  //   const filteredOrderItems = order.orderItems.filter(
  //     (orderItem) => orderItem.vendor === vendor
  //   );

  //   return { ...order, orderItems: filteredOrderItems };
  // });

  // console.log(filteredOrders);

  const orders = await Order.find(
    { "orderItems.vendor": req.vendor.id },
    { "orderItems.$": 1 }
  ).select(
    "shippingInfo paymentInfo user paidAt itemsPrice taxPrice shippingPrice totalPrice orderStatus createdAt __v"
  );

  // console.log(filteredItems);

  // console.log(filteredOrders);

  res.status(200).json({
    success: true,
    orders,
  });
});

// // Get all users(admin)
// exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
//   const users = await User.find();

//   res.status(200).json({
//     success: true,
//     users,
//   });
// });

// // Get single user (admin)
// exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
//   const user = await User.findById(req.params.id);

//   if (!user) {
//     return next(
//       new ErrorHander(`User does not exist with Id: ${req.params.id}`)
//     );
//   }

//   res.status(200).json({
//     success: true,
//     user,
//   });
// });

// // update User Role -- Admin
// exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
//   const newUserData = {
//     name: req.body.name,
//     email: req.body.email,
//     role: req.body.role,
//   };

//   await User.findByIdAndUpdate(req.params.id, newUserData, {
//     new: true,
//     runValidators: true,
//     useFindAndModify: false,
//   });

//   res.status(200).json({
//     success: true,
//   });
// });

// // Delete User --Admin
// exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
//   const user = await User.findById(req.params.id);

//   if (!user) {
//     return next(
//       new ErrorHander(`User does not exist with Id: ${req.params.id}`, 400)
//     );
//   }

//   const imageId = user.avatar.public_id;

//   await cloudinary.v2.uploader.destroy(imageId);

//   await user.remove();

//   res.status(200).json({
//     success: true,
//     message: "User Deleted Successfully",
//   });
// });
