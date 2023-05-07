const express = require("express");
const {
  registerUser,
  loginVendor,
  vendorForgotPassword,
  vendorResetPassword,
  getVendorDetails,
  vendorUpdatePassword,
  vendorLogout,
  vendorUpdateProfile,
  vendorOrders,
  getProdVendor,
  //   getAllUser,
  //   getSingleUser,
  //   updateUserRole,
  //   deleteUser,
} = require("../controllers/vendorController");
const { isAuthenticatedVendor, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/vendor/register").post(registerUser);

router.route("/vendor/login").post(loginVendor);
router.route("/vendor/password/forgot").post(vendorForgotPassword);
router.route("/vendor/password/reset/:token").put(vendorResetPassword);
router.route("/vendor/logout").get(vendorLogout);

router.route("/vendor/me").get(isAuthenticatedVendor, getVendorDetails);
router.route("/vendor/:id").get(getProdVendor);

router
  .route("/password/update")
  .put(isAuthenticatedVendor, vendorUpdatePassword);

router
  .route("/vendor/me/update")
  .put(isAuthenticatedVendor, vendorUpdateProfile);

router.route("/vendor/orders/me").get(isAuthenticatedVendor, vendorOrders);

// router
//   .route("/admin/users")
//   .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUser);

// router
//   .route("/admin/user/:id")
//   .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
//   .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
//   .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

module.exports = router;
