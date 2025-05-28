import express from 'express';
const app = express();
import dotenv from "dotenv";
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cors from "cors";
import user from './models/user.js';
import verifyToken from './middlewares/verifyToken.js';
import upload from './middlewares/multer.js';
import sellerApplication from './models/sellerApplication.js';

dotenv.config();
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"))
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))

app.get("/", (req, res) =>{
    res.send("App is working...")
})

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
        res.status(500).send("An error occurred while registering user: " + error.message);
    }
});

app.post("/login", async (req, res) =>{
    const {email, password} = req.body;

    try {
        const existingUser = await user.findOne({email});
        if(!existingUser){
            return res.status(404).send("User not found")
        }

        const isMatched = await bcrypt.compare(password, existingUser.password);

        if(!isMatched){
            return res.status(400).send("Wrong Credentials!")
        }

        const token = jwt.sign({id: existingUser._id}, process.env.SECRET_KEY, {expiresIn: "24h"});

        res.cookie("token", token, {httpOnly:true});
        res.status(200).send("User Logged In Successfully!")

    } catch (error) {
        res.status(500).send("An error occured while login "+error);
    }
})

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


app.post("/logout", (req, res) =>{
    res.clearCookie("token", {httpOnly:true, sameSite: "strict"});
    res.status(200).send("User Logged out successfully!");
})

app.put("/changeProfileImage", verifyToken, upload.single("image"), async (req, res) =>{

    const id = req.user.id;

    try {
        const existingUser = await user.findById(id);

        if(!existingUser){
            return res.status(404).send("User not found")
        }

        const profilePic = req.file.filename;

        await user.findByIdAndUpdate(
        id,
        {
            profilePic:profilePic
        }, { new: true })

        res.status(200).send("User updated Succeesfully!")
    } catch (error) {
        res.status(500).send("An error occured while updating image of user");
        console.log(error);
    }

})

app.put("/updateUser", verifyToken, async (req, res) =>{

    const id = req.user.id;
    const {name, email} = req.body;

    try {
        const existingUser = await user.findById(id);

        if(!existingUser){
            return res.status(404).send("User not found")
        }

        await user.findByIdAndUpdate(
        id,
        {
           username:name,
           email:email,
        }, { new: true })

        res.status(200).send("User updated Succeesfully!")
    } catch (error) {
        res.status(500).send("An error occured while updating user");
        console.log(error);
    }

})


app.post("/becomeSeller", verifyToken, upload.single("storeBanner"), async (req, res) => {
  const id = req.user.id;
  const { storeName, contactNumber, storeAddress, storeDescription } = req.body;

  try {
    const existingUser = await user.findById(id);
    if (!existingUser) {
      return res.status(404).send("User not found");
    }

    if (!req.file) {
      return res.status(400).send("Store banner image is required");
    }

    const storeBanner = req.file.filename;
    const alreadyApplied = await sellerApplication.findOne({ userId: existingUser._id });
    if (alreadyApplied) {
      return res.status(400).send("You have already submitted a seller application.");
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
    res.status(500).send("An error occurred while submitting the application");
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`)
})