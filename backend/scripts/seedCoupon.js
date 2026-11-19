import mongoose from "mongoose";
import "dotenv/config.js";
import Coupon from "../src/Schema/coupon.schema.js";

const seedCoupon = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");

    // Check if ID50 already exists
    const existing = await Coupon.findOne({ code: "ID50" });
    if (existing) {
      console.log("✅ ID50 coupon already exists");
      console.log(existing);
      await mongoose.disconnect();
      return;
    }

    // Create ID50 coupon
    const id50Coupon = await Coupon.create({
      code: "ID50",
      discountPercent: 0, // Not used for ID50 (flat $50 discount handled in backend)
      isActive: true,
      usageLimit: null, // Unlimited usage
      usedCount: 0,
      expiresAt: new Date("2026-08-31T23:59:59.999Z"),
      description:
        "Promotional coupon: $50 USD flat discount on registration fee. Valid until 31 August 2026.",
    });

    console.log("✅ ID50 coupon created successfully:");
    console.log(id50Coupon);

    await mongoose.disconnect();
    console.log("✅ Database connection closed");
  } catch (error) {
    console.error("❌ Error seeding coupon:", error.message);
    process.exit(1);
  }
};

seedCoupon();
