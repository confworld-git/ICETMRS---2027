import express from "express";
import cookieParser from "cookie-parser";
import "dotenv/config.js";
import cors from "cors";

import registration from "./routes/registration.route.js";
import payment from "./routes/payment.route.js";
import download from "./routes/download.route.js";
import committee_member from "./routes/committee_member.route.js";
import paper_submission from "./routes/paper_submission.route.js";
import contact from "./routes/contact.route.js";
import enquiry from "./routes/enquiry.route.js";
import connectDB from "./config/db.js";
import { middlelog } from "./middleware/middleware.js";
import admin from "./routes/admin.route.js";
import sponsor from "./routes/sponsor.route.js";
import deadline from "./routes/deadline.route.js";
import image from "./routes/image.route.js";
import Admin from "./Schema/admin.js";
import coupon from "./routes/coupon.route.js";

const server = express();

const allowedOrigins = ["https://icetmrs.confworld.org"];

server.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

// Remove the server.options('*') handler - it's conflicting

await connectDB();

const seedAdmin = async () => {
  try {
    const defaultEmail = "icetmrsconf@gmail.com";
    const defaultPassword = "Sairam@2027$*";

    let admin = await Admin.findOne({ email: defaultEmail });
    if (!admin) {
      admin = new Admin({ email: defaultEmail, password: defaultPassword });
      await admin.save();
      console.log("Default admin created successfully.");
    } else {
      if (admin.password !== defaultPassword) {
        admin.password = defaultPassword;
        await admin.save();
        console.log("Default admin credentials updated.");
      }
    }
  } catch (error) {
    console.error("Error seeding admin:", error);
  }
};
await seedAdmin();
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(middlelog);
server.use(admin);
server.use(sponsor);
server.use(deadline);
server.use(contact);
server.use(download);
server.use(registration);
server.use(paper_submission);
server.use(payment);
server.use(enquiry);
server.use(committee_member);
server.use(image);
server.use(coupon); // ← NEW

server.get("/", (req, res) => {
  res.json({
    message: "Server is running",
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
