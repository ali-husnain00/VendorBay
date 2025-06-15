import express from "express";
import {
    addToCart,
  adminBlockUser,
  adminDashboardStats,
  adminDeleteProduct,
  adminDeleteUser,
  adminFeatureProduct,
  adminUnblockUser,
  adminUpdateUserRole,
  becomeSeller,
  cancelOrder,
  changeProfileImage,
  clearCart,
  featuredProducts,
  getAdminOrders,
  getAdminProducts,
  getAdminSellers,
  getAdminUser,
  getCartProducts,
  getLoggedInUser,
  getProduct,
  getProducts,
  getSearchedProduct,
  getSellerApplications,
  getSellerInfo,
  getSellerOrders,
  getUserOrders,
  latestProducts,
  login,
  logout,
  orderNow,
  register,
  removeProductFromCart,
  sellerAddProduct,
  sellerAllProducts,
  sellerDashboardStats,
  updateAdminSeller,
  updateOrderStatus,
  updateSellerApplicationStatus,
  updateUser,
} from "../controllers/controllers.js";
import verifyToken from "../middlewares/verifyToken.js";
import compressImage from "../middlewares/sharp.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import upload from "../middlewares/multer.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/getLoggedInUser", verifyToken, getLoggedInUser);
router.post("/logout", logout);
router.put(
  "/changeProfileImage",
  verifyToken,
  upload.single("image"),
  compressImage,
  changeProfileImage
);
router.put("/updateUser", verifyToken, updateUser);
router.post(
  "/becomeSeller",
  verifyToken,
  upload.single("storeBanner"),
  compressImage,
  becomeSeller
);
router.get("/getSellerInfo", verifyToken, getSellerInfo);
router.post("/seller/addProduct",
  verifyToken,
  upload.single("image"),
  compressImage,
  sellerAddProduct
);
router.get("/seller/allProducts", verifyToken, sellerAllProducts);
router.get("/seller/dashboard-stats", verifyToken, sellerDashboardStats);
router.get("/latestProducts", latestProducts);
router.get("/featuredProducts", featuredProducts);
router.get("/getProducts", getProducts);
router.get("/product/:id", getProduct);
router.post("/addtocart/product/:id", verifyToken, addToCart);
router.get("/getCartProducts", verifyToken, getCartProducts);
router.delete("/product/removefromcart/:id", verifyToken,removeProductFromCart);
router.post("/clearCart", verifyToken, clearCart);
router.post("/orderNow", verifyToken,orderNow);
router.get("/getUserOrders", verifyToken,getUserOrders);
router.get("/getSearchedProduct", getSearchedProduct);
router.get("/getSellerOrders", verifyToken,getSellerOrders);
router.put("/updateOrderStatus/:orderId", verifyToken,updateOrderStatus);
router.put("/cancelOrder/:orderId", verifyToken,cancelOrder);
router.get("/admin/dashboard", verifyToken, verifyAdmin,adminDashboardStats);
router.get("/admin/users", verifyToken, verifyAdmin,getAdminUser);
router.put("/admin/block-user/:id", verifyToken, verifyAdmin,adminBlockUser);
router.put("/admin/unblock-user/:id", verifyToken, verifyAdmin,adminUnblockUser);
router.delete("/admin/delete-user/:id", verifyToken, verifyAdmin,adminDeleteUser);
router.put("/admin/update-role/:id", verifyToken, verifyAdmin,adminUpdateUserRole);
router.get("/admin/sellers", verifyToken, verifyAdmin,getAdminSellers);
router.get("/admin/seller-applications", verifyToken, verifyAdmin,getSellerApplications);
router.put("/admin/update-seller/:id", verifyToken, verifyAdmin,updateAdminSeller);
router.put("/admin/update-seller-application-status/:id", verifyToken, verifyAdmin,updateSellerApplicationStatus);
router.get("/admin/products", verifyToken, verifyAdmin,getAdminProducts);
router.delete("/admin/delete/product/:id", verifyToken, verifyAdmin,adminDeleteProduct);
router.put("/admin/products/feature/:id", verifyToken, verifyAdmin,adminFeatureProduct);
router.get("/admin/orders", verifyToken, verifyAdmin,getAdminOrders);

export default router;