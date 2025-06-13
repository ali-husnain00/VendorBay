import user from "../models/user.js";

const verifyAdmin = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const admin = await user.findById(userId);

    if (admin && admin.role === "admin") {
      next();
    } else {
      res.status(403).send("Access denied. Admins only.");
    }
  } catch (err) {
    res.status(500).send("Server error");
  }
};

export default verifyAdmin
