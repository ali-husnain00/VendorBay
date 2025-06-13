import express from "express";
const app = express();
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cors from "cors";
import user from "./models/user.js";
import verifyToken from "./middlewares/verifyToken.js";
import upload from "./middlewares/multer.js";
import sellerApplication from "./models/sellerApplication.js";
import product from "./models/product.js";
import order from "./models/order.js";
import compressImage from "./middlewares/sharp.js";
import verifyAdmin from "./middlewares/verifyAdmin.js";

dotenv.config();
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("App is working...");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already registered with this email");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await user.create({
      username: name,
      email: email,
      password: hashedPassword,
    });

    res.status(200).send("User created successfully!");
  } catch (error) {
    res
      .status(500)
      .send("An error occurred while registering user: " + error.message);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await user.findOne({ email });
    if (!existingUser) {
      return res.status(404).send("User not found");
    }

    const isMatched = await bcrypt.compare(password, existingUser.password);

    if (!isMatched) {
      return res.status(400).send("Wrong Credentials!");
    }

    const token = jwt.sign({ id: existingUser._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("token", token, { httpOnly: true });
    res.status(200).send("User Logged In Successfully!");
  } catch (error) {
    res.status(500).send("An error occured while login " + error);
  }
});

app.get("/getLoggedInUser", verifyToken, async (req, res) => {
  const id = req.user.id;

  try {
    const existingUser = await user.findById(id).select("-password");
    if (!existingUser) {
      return res.status(404).send("User not found: Unauthorized");
    }

    res.status(200).send(existingUser);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("token", { httpOnly: true, sameSite: "strict" });
  res.status(200).send("User Logged out successfully!");
});

app.put(
  "/changeProfileImage",
  verifyToken,
  upload.single("image"),
  compressImage,
  async (req, res) => {
    const id = req.user.id;

    try {
      const existingUser = await user.findById(id);

      if (!existingUser) {
        return res.status(404).send("User not found");
      }

      const profilePic = req.file.filename;

      await user.findByIdAndUpdate(
        id,
        {
          profilePic: profilePic,
        },
        { new: true }
      );

      res.status(200).send("User updated Succeesfully!");
    } catch (error) {
      res.status(500).send("An error occured while updating image of user");
      console.log(error);
    }
  }
);

app.put("/updateUser", verifyToken, async (req, res) => {
  const id = req.user.id;
  const { name, email } = req.body;

  try {
    const existingUser = await user.findById(id);

    if (!existingUser) {
      return res.status(404).send("User not found");
    }

    await user.findByIdAndUpdate(
      id,
      {
        username: name,
        email: email,
      },
      { new: true }
    );

    res.status(200).send("User updated Succeesfully!");
  } catch (error) {
    res.status(500).send("An error occured while updating user");
    console.log(error);
  }
});

app.post(
  "/becomeSeller",
  verifyToken,
  upload.single("storeBanner"),
  compressImage,
  async (req, res) => {
    const id = req.user.id;
    const { storeName, contactNumber, storeAddress, storeDescription } =
      req.body;

    try {
      const existingUser = await user.findById(id);
      if (!existingUser) {
        return res.status(404).send("User not found");
      }

      if (!req.file) {
        return res.status(400).send("Store banner image is required");
      }

      const storeBanner = req.file.filename;
      const alreadyApplied = await sellerApplication.findOne({
        userId: existingUser._id,
      });
      if (alreadyApplied) {
        return res
          .status(400)
          .send("You have already submitted a seller application.");
      }

      await sellerApplication.create({
        userId: existingUser._id,
        storeName,
        contactNumber,
        storeAddress,
        storeDescription,
        storeBanner,
      });

      res.status(200).send("Application submitted successfully!");
    } catch (error) {
      console.error("Error while submitting seller application:", error);
      res
        .status(500)
        .send("An error occurred while submitting the application");
    }
  }
);

app.get("/getSellerInfo", verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const application = await sellerApplication.findOne({ userId });

    if (!application) {
      return res.status(404).send("Seller not found");
    }

    res.status(200).send(application);
  } catch (error) {
    res.status(500).send("An error occured while getting seller info");
    console.log(error);
  }
});

app.post(
  "/seller/addProduct",
  verifyToken,
  upload.single("image"),
  compressImage,
  async (req, res) => {
    const userId = req.user.id;
    const { title, desc, category, price, stock } = req.body;

    try {
      const existingUser = await user.findById(userId);

      if (!existingUser || existingUser.role !== "seller") {
        return res
          .status(403)
          .send("Unauthorized: Only sellers can add products");
      }

      const image = req.file.filename;

      await product.create({
        title,
        desc,
        image,
        price,
        category,
        stock,
        seller: existingUser._id,
      });

      res.status(200).send("Product added successfully!");
    } catch (error) {
      res.status(500).send("An error occurred while adding the product");
      console.log(error);
    }
  }
);

app.get("/seller/allProducts", verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const existingUser = await user.findById(userId);
    if (!existingUser || existingUser.role !== "seller") {
      return res.status(403).send("Unauthorized: Only sellers can access this");
    }

    const sellerId = existingUser._id;
    const products = await product.find({ seller: sellerId });

    res.status(200).send(products);
  } catch (error) {
    res.status(500).send("An error occured while getting seller products");
    console.log(error);
  }
});

app.get("/seller/dashboard-stats", verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const seller = await user.findById(userId);
    if (!seller || seller.role !== "seller") {
      return res.status(403).send("Unauthorized: Only sellers can access this");
    }

    const totalProducts = await product.countDocuments({ seller: seller._id });
    const productsInStock = await product.countDocuments({
      seller: seller._id,
      stock: { $gt: 0 },
    });

    let totalSale = 0;
    const sellerOrders = await order
      .find({
        "products.seller": seller._id,
        paymentMethod: { $in: ["Cash on delivery", "paid"] },
      })
      .populate("products.product");

    sellerOrders.forEach((order) => {
      order.products.forEach((p) => {
        if (p.seller.toString() === seller._id.toString()) {
          const productPrice = p.product?.price || 0;
          totalSale += productPrice * p.quantity;
        }
      });
    });

    const pendingOrders = sellerOrders.filter(
      (order) => order.orderStatus === "processing"
    );

    const recentOrders = sellerOrders.slice(0, 3).map((order) => {
      const matchingProducts = order.products.filter(
        (p) => p.seller.toString() === seller._id.toString()
      );

      return {
        id: order._id,
        prod: matchingProducts.map((p) => ({
          title: p.product.title,
          quantity: p.quantity,
          price: p.product.price,
        })),
        status: order.orderStatus,
        date: new Date(order.orderedAt).toISOString().split("T")[0],
      };
    });

    res.status(200).send({
      totalProducts,
      productsInStock,
      totalSale,
      pendOrders: pendingOrders.length,
      recentOrders,
    });
  } catch (error) {
    res.status(500).send("An error occurred while getting the stats of seller");
    console.log(error);
  }
});


app.get("/latestProducts", async (req, res) => {
  try {
    const latestProducts = await product.find({}).limit(6);
    res.status(200).send(latestProducts);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while getting latest products");
  }
});

app.get("/featuredProducts", async (req, res) => {
  try {
    const featuredProducts = await product.find({ isFeatured: true }).limit(6);
    res.status(200).send(featuredProducts);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while getting featured products");
  }
});

app.get("/getProducts", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;

  try {
    const totProd = await product.countDocuments();
    const allProd = await product
      .find({})
      .skip((page - 1) * limit)
      .limit(limit);
    const totalPages = Math.ceil(totProd / limit);

    res.status(200).send({
      page,
      allProd,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/product/:id", async (req, res) => {
  try {
    const prod = await product.findById(req.params.id);
    res.status(200).send(prod);
  } catch (error) {
    res.status(500).send("Error fetching product");
  }
});

app.post("/addtocart/product/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;
  const { qty } = req.body;

  try {
    const existingUser = await user.findById(userId);
    if (!existingUser) {
      return res
        .status(403)
        .send({ message: "User not logged in! Please login." });
    }

    const prod = await product.findById(id);
    if (!prod) {
      return res.status(404).send({ message: "Product not found" });
    }

    const isAlreadyInCart = existingUser.cart.find(
      (p) => p.product.toString() === id
    );
    if (isAlreadyInCart) {
      return res.status(400).send({ message: "Product is already in cart" });
    }

    await existingUser.cart.push({ product: prod, quantity: parseInt(qty) });
    await existingUser.save();

    res.status(200).send({ message: "Product added to cart successfully!" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "An error occurred while adding product to cart" });
  }
});

app.get("/getCartProducts", verifyToken, async (req, res) => {
  const id = req.user.id;
  try {
    const existingUser = await user.findById(id).populate({path: "cart.product"});
    if (!existingUser) {
      return res.status(404).send("Please login to get your cart products");
    }
    res.status(200).send(existingUser.cart);
  } catch (error) {
    res.status(500).send("An error occured while getting cart products");
  }
});

app.delete("/product/removefromcart/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;
  try {
    const existingUser = await user.findById(userId);
    if (!existingUser) {
      return res.status(404).send("User not found!");
    }

    const prod = await product.findById(id);
    if (!prod) {
      return res.status(404).send("Product not found");
    }

    existingUser.cart = existingUser.cart.filter(
      (item) => item.product._id.toString() !== id
    );
    existingUser.save();

    res.status(200).send("Product removed from cart successfully!");
  } catch (error) {
    res.status(500).send("An error occured while removing product from cart!");
    console.log(error);
  }
});

app.post("/clearCart", verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const existingUser = await user.findById(userId);
    if (!existingUser) {
      return res.status(404).send("User not found!");
    }
    existingUser.cart = [];
    await existingUser.save();

    res.status(200).send("Cart cleared successfully!");
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).send("An error occurred while clearing the cart.");
  }
});

app.post("/orderNow", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const {
    fullName,
    address,
    phone,
    country,
    postalCode,
    city,
    paymentMethod,
    orderedProducts,
    totalAmount,
  } = req.body;

  try {
    const existingUser = await user.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    if (!orderedProducts || orderedProducts.length <= 0) {
      return res.status(400).json({ message: "No products to order" });
    }

    if (!fullName || !address || !phone || !country || !postalCode || !city) {
      return res.status(400).json({ message: "Incomplete order info!" });
    }

    await order.create({
      user: userId,
      products: orderedProducts.map((item) => ({
        product: item.product._id,
        seller: item.product.seller, 
        quantity: item.quantity,
      })),
      shippingAddress: {
        fullName,
        addressLine: address,
        phone:parseInt(phone),
        country,
        postalCode:parseInt(postalCode),
        city,
      },
      totalAmount: parseInt(totalAmount),
      paymentMethod: paymentMethod === "Cash on delivery" ? "Cash on delivery" : "pending",
      orderStatus: "processing",
    });

    existingUser.cart = [];
    await existingUser.save();

    res.status(200).json({ message: "Order placed successfully!" });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while placing order", error });
  }
});

app.get("/getUserOrders", verifyToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const existingUser = await user.findById(userId);
    if (!existingUser) {
      return res.status(404).send({ message: "Unauthorized: User not found" });
    }

    const userOrders = await order.find({ user: userId }).populate("products.product");
    
    if (userOrders.length === 0) {
      return res.status(404).send({ message: "No orders found" });
    }

    res.status(200).send(userOrders);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "An error occurred while sending user orders from backend" });
  }
});

app.get("/getSearchedProduct", async (req, res) => {
  const search = req.query.search || "";

  try {
    const searchRegex = new RegExp(search, "i");

    const allProd = await product.find({ title: searchRegex });

    res.status(200).send(allProd);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while getting searched products");
  }
});

app.get("/getSellerOrders", verifyToken, async (req, res) => {
  const sellerId = req.user.id;

  try {
    const allOrders = await order.find({ "products.seller": sellerId })
      .populate("products.product");

    const sellerOrders = allOrders.map((ord) => {
      const filteredProducts = ord.products.filter(
        (item) => item.seller.toString() === sellerId
      );

      return {
        _id: ord._id,
        createdAt: ord.createdAt,
        paymentMethod:ord.paymentMethod,
        shippingAddress:ord.shippingAddress,
        status: ord.orderStatus,
        products: filteredProducts,
        total: filteredProducts.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
      };
    });

    res.status(200).send(sellerOrders);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to get seller orders");
  }
});

app.put("/updateOrderStatus/:orderId", verifyToken, async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const foundOrder = await order.findById(orderId);
    if (!foundOrder) return res.status(404).send("Order not found");

    foundOrder.orderStatus = status;
    await foundOrder.save();

    res.status(200).send("Order status updated successfully!");
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).send("Internal server error");
  }
});

app.put("/cancelOrder/:orderId", verifyToken, async (req, res) => {
  const { orderId } = req.params;

  try {
    const foundOrder = await order.findById(orderId);
    if (!foundOrder) return res.status(404).send("Order not found");

    foundOrder.orderStatus = "cancelled";
    await foundOrder.save();

    res.status(200).send("Order cancelled successfully!");
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).send("Internal server error");
  }
});

//Admin routes
app.get("/admin/dashboard", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const totalUsers = await user.countDocuments({ role: "user" });
    const totalSellers = await user.countDocuments({ role: "seller" });
    const totalOrders = await order.countDocuments();
    const totalProducts = await product.countDocuments();
    const totalSalesData = await order.find({ paymentMethod: "Cash on delivery" }).populate("products.product");

    let totalSales = 0;
    totalSalesData.forEach(order => {
      order.products.forEach(p => {
        totalSales += p.product.price * p.quantity;
      });
    });

    const recentOrdersRaw = await order.find({})
      .limit(3)
      .populate("products.product");

    const recentOrders = recentOrdersRaw.map(order => ({
      _id: order._id,
      status: order.orderStatus,
      date: order.createdAt.toISOString().split("T")[0],
      total: order.products.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
      productTitle: order.products[0]?.product?.title || "N/A"
    }));

    res.status(200).send({
      totalUsers,
      totalSellers,
      totalOrders,
      totalSales,
      recentOrders,
      totalProducts,
    });
  } catch (err) {
    console.error("Error in admin dashboard:", err);
    res.status(500).send("Internal Server Error");
  }
});

//Get all users on admin panel
app.get("/admin/users", verifyToken, verifyAdmin, async (req, res) => {
  const users = await user.find({ role: "user" });
  res.status(200).send(users);
});

//Block user from admin panel
app.put("/admin/block-user/:id", verifyToken, verifyAdmin, async (req, res) => {
  await user.findByIdAndUpdate(req.params.id, { isBlocked: true });
  res.status(200).send("User blocked");
});

//Unblock user from admin panel
app.put("/admin/unblock-user/:id", verifyToken, verifyAdmin, async (req, res) => {
  await user.findByIdAndUpdate(req.params.id, { isBlocked: false });
  res.status(200).send("User unblocked");
});

//Delete user from admin panel
app.delete("/admin/delete-user/:id", verifyToken, verifyAdmin, async (req, res) => {
  await user.findByIdAndDelete(req.params.id);
  res.status(200).send("User deleted");
});

//Update user role from admin panel
app.put("/admin/update-role/:id", verifyToken, verifyAdmin, async (req, res) =>{
  const {role} = req.body;
  await user.findByIdAndUpdate(req.params.id, {role:role});
  res.status(200).send("User role updated successfully!")
})

//Get all sellers on admin panel
app.get("/admin/sellers", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const sellers = await user.find({ role: "seller" }).select("-password");
    const storeInfos = await sellerApplication.find({});

    const sellersWithStoreInfo = sellers.map((seller) => {
      const matchedStore = storeInfos.find(
        (store) => store.userId.toString() === seller._id.toString()
      );

      return {
        ...seller.toObject(),
        storeInfo: matchedStore || null, 
      };
    });

    res.status(200).json(sellersWithStoreInfo);
  } catch (error) {
    console.error("Error fetching sellers:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/admin/seller-applications", verifyToken, verifyAdmin, async (req, res) =>{
  const sellerApp = await sellerApplication.find({status:"pending"});
  res.status(200).send(sellerApp);
})


app.put("/admin/update-seller/:id", verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;

  try {
    const seller = await user.findById(id);
    if (!seller) return res.status(404).send("Seller not found");

    switch (action) {
      case "block":
        seller.isBlocked = true;
        break;
      case "unblock":
        seller.isBlocked = false;
        break;
      case "make-user":
        seller.role = "user";
        break;
      case "make-admin":
        seller.role = "admin";
        break;
      default:
        return res.status(400).send("Invalid action");
    }

    await seller.save();
    res.status(200).send("Seller updated successfully");
  } catch (err) {
    console.error("Error updating seller:", err);
    res.status(500).send("Internal Server Error");
  }
});


app.put("/admin/update-seller-application-status/:id", verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { action, userId } = req.body;

  try {
    const sellerApp = await sellerApplication.findById(id);
    const seller = await user.findById(userId);
    if (!sellerApp || !seller) return res.status(404).send("Seller application not found");

    switch (action) {
      case "approved":
        sellerApp.status = "approved";
        seller.role = "seller";
        break;
      case "rejected":
        sellerApp.status = "rejected";
        break;
      default:
        return res.status(400).send("Invalid action");
    }

    await sellerApp.save();
    await seller.save();
    res.status(200).send("Seller application status updated successfully");
  } catch (err) {
    console.error("Error updating seller application status:", err);
    res.status(500).send("Internal Server Error");
  }
});

//Products on admin panel
app.get("/admin/products", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const products = await product.find({});
    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching all products:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/admin/delete/product/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const prod = await product.findByIdAndDelete(req.params.id);
    if (!prod) return res.status(404).send("Product not found");

    res.status(200).send("Product deleted successfully");
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/admin/products/feature/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const prod = await product.findById(req.params.id);
    if (!prod) return res.status(404).send("Product not found");

    prod.isFeatured = !prod.isFeatured;
    await prod.save();

    res.status(200).json({ isFeatured: prod.isFeatured });
  } catch (err) {
    console.error("Error toggling featured status:", err);
    res.status(500).send("Internal Server Error");
  }
});

//Get all orders on admin panel
app.get("/admin/orders", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const orders = await order
      .find()
      .sort({ createdAt: -1 })
      .populate("user", "email")
      .populate("products.product", "title price image")
      .populate("products.seller", "email");

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    res.status(500).send("Internal Server Error");
  }
});


const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
