const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const nodemailer = require("nodemailer");

main().catch((err) => console.error(err));

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MY_MAIL,
    pass: process.env.PASSWORD,
  },
});

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

app.use(express.json());

app.use("/users", userRoutes.router);

app.post("/mail", async (req, res) => {
  const { to } = req.body;

  let info = await transporter.sendMail({
    from: `ByteBridge" ${process.env.MY_MAIL}`,
    to,

    subject: "Welcome To ByteBridge 123",
    text: "Hello world?",
    html: `Getting Started with Create React App
    This project was bootstrapped with Create React App.
    
    Available Scripts
    In the project directory, you can run:
    
    npm start
    Runs the app in the development mode.
    Open http://localhost:3000 to view it in your browser.
    
    The page will reload when you make changes.
    You may also see any lint errors in the console.
    
    npm test
    Launches the test runner in the interactive watch mode.
    See the section about running tests for more information.
    
    npm run build`,
  });

  res.json(info);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
