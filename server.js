const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const excelRoute = require("./routes/excelRoutes");
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
app.use('/',excelRoute.router)
// app.post("/mail", async (req, res) => {
//   const { to } = req.body;

//   // HTML template for the welcome email
//   const welcomeEmailHtml = `
//     <!DOCTYPE html>
//     <html>
//     <head>
//         <title>Welcome to ByteBridge</title>
//     </head>
//     <body>
//         <div style="text-align: center; background-color: #f5f5f5; padding: 20px;">
//             <h1>Welcome to ByteBridge</h1>
//         </div>
//         <div style="background-color: #ffffff; padding: 20px;">
//             <p>Hello [User's Name],</p>
//             <p>Welcome to ByteBridge! We're excited to have you as a part of our community.</p>
//             <p>Here's what you can expect from ByteBridge:</p>
//             <ul>
//                 <li>Access to a vibrant and supportive community of developers.</li>
//                 <li>Resources and tutorials to help you on your coding journey.</li>
//                 <li>Connect with like-minded individuals and expand your network.</li>
//             </ul>
//             <p>Feel free to explore our website and get started on your coding adventure today.</p>
//             <p>If you have any questions or need assistance, don't hesitate to contact us at [Support Email].</p>
//             <p>Once again, welcome to ByteBridge. We can't wait to see what you'll create!</p>
//             <p>Best regards,</p>
//             <p>The ByteBridge Team</p>
//         </div>
//     </body>
//     </html>
//   `;

//   // Send the email
//   let info = await transporter.sendMail({
//     from: `ByteBridge" ${process.env.MY_MAIL}`,
//     to,
//     subject: "Welcome To ByteBridge",
//     text: "Hello world?",
//     html: welcomeEmailHtml, // Use the HTML template here
//   });

//   res.json(info);
// });


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
