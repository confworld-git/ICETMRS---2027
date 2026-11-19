import mongoose from "mongoose";
import Registration from "../Schema/registration.schema.js";
import nodemailer from "nodemailer";
import Coupon from "../Schema/coupon.schema.js";
import { getId50CouponValidation, ID50_CODE } from "./coupon.controller.js";
import razorpay from "../config/payment-gateway.config.js";

const REGISTRATION_FEES = {
  "Physical (Onsite) Participants": {
    "Academicians/Delegates/Research Scholars/PhD candidates": [450, 500, 600],
    "UG/PG Students": [400, 450, 550],
    "Non-Presenter/Attendee/Listener": [280, 300, 400],
  },
  "Virtual (Online) Participants": {
    "Academicians/Delegates/Research Scholars/PhD candidates": [125, 150],
    "UG/PG Students": [100, 125],
    "Non-Presenter/Attendee/Listener": [75, 100],
  },
};

const isKnownRegistrationFee = ({ title, category, registrationBase }) =>
  REGISTRATION_FEES[title]?.[category]?.includes(Number(registrationBase));

export const calculateRegistrationAmount = (
  selectedFee,
  participantCategory,
  coupon,
) => {
  const registrationBase = Number(selectedFee.registrationBase);
  const journalAmount = Number(selectedFee.journalAmount) || 0;
  const addonsAmount = Number(selectedFee.addonsAmount) || 0;
  const membershipFee = selectedFee.membershipSelected
    ? String(participantCategory || "")
        .toLowerCase()
        .includes("student")
      ? 15
      : 20
    : 0;
  const membershipDiscount = selectedFee.membershipSelected
    ? registrationBase * 0.05
    : 0;
  const amountAfterMembership = Math.max(
    0,
    registrationBase - membershipDiscount,
  );
  const safeCouponDiscount = coupon
    ? Math.min(coupon.discountAmount, Math.max(0, amountAfterMembership))
    : 0;
  const couponDiscountAmount = safeCouponDiscount;
  const finalRegistrationFee = Math.max(
    0,
    amountAfterMembership - couponDiscountAmount,
  );
  const finalAmount =
    finalRegistrationFee + journalAmount + addonsAmount + membershipFee;
  const bankTax = Number((finalAmount * 0.06).toFixed(2));

  return {
    registrationBase,
    membershipDiscount: Number(membershipDiscount.toFixed(2)),
    couponDiscountAmount,
    finalRegistrationFee: Number(finalRegistrationFee.toFixed(2)),
    membershipFee,
    journalAmount,
    addonsAmount,
    finalAmount: Number(finalAmount.toFixed(2)),
    bankTax,
    total: Number((finalAmount + bankTax).toFixed(2)),
  };
};

export const registration_GetAll = async (req, res) => {
  try {
    const result = await Registration.find();
    console.log(result);
    res
      .status(200)
      .json({ message: "Get all registrations successfully", data: result });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        message: "Failed to get all registrations",
        error: error.message,
      });
  }
};

export const registration_GetById = async (req, res) => {
  try {
    const result = await Registration.findById(req.params.id);
    if (!result)
      return res.status(404).json({ message: "Registration not found" });
    res
      .status(200)
      .json({ message: "Get registration by id successfully", data: result });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        message: "Failed to get registration by id",
        error: error.message,
      });
  }
};

export const registration_Create = async (req, res) => {
  try {
    const selectedFee = req.body.selectedFee || {};
    if (!isKnownRegistrationFee(selectedFee)) {
      return res
        .status(400)
        .json({ message: "Invalid registration fee selection." });
    }

    const requestedCoupon = String(selectedFee.couponCode || "").trim();
    let coupon = null;
    if (requestedCoupon) {
      if (requestedCoupon.toUpperCase() !== ID50_CODE) {
        return res.status(400).json({ message: "Invalid coupon code." });
      }
      coupon = getId50CouponValidation(requestedCoupon);
      if (!coupon.valid) {
        return res.status(400).json({ message: coupon.message });
      }
    }

    const calculated = calculateRegistrationAmount(
      selectedFee,
      req.body.participant_category,
      coupon,
    );
    if (calculated.total <= 0) {
      return res
        .status(400)
        .json({ message: "Registration total must be greater than zero." });
    }

    const Amount = Math.round(calculated.total * 100);

    const order = await razorpay.orders.create({
      amount: Amount,
      currency: "USD",
      payment_capture: 1,
      receipt: `receipt_${new mongoose.Types.ObjectId()}`,
    });

    const registration = new Registration({
      ...req.body,
      selectedFee: {
        ...selectedFee,
        registrationBase: calculated.registrationBase,
        membershipFee: calculated.membershipFee,
        couponCode: coupon?.code || null,
        couponDiscountAmount: calculated.couponDiscountAmount,
        convenience_price: calculated.bankTax,
        total: calculated.finalAmount,
        finalTotal: calculated.total,
      },
      Razorpay_amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: order.status,
      id: order.id,
    });

    await registration.save();

    // Increment coupon usage if a coupon was applied
    if (coupon?.code && coupon.code !== ID50_CODE) {
      await Coupon.findOneAndUpdate(
        { code: req.body.selectedFee.couponCode.toUpperCase() },
        { $inc: { usedCount: 1 } },
      );
    }

    // ── Build journal section for email ───────────────────────────────────────
    const sf = registration.selectedFee;

    const journalRow = sf.journalSupport?.tier
      ? `
        <div style="height:1px;background:#e0e0e0;margin:20px 0;"></div>
        <h3 style="color:#4f46e5;font-size:22px;">Journal Publication Support</h3>
        <p style="color:#333;font-size:16px;line-height:1.6;margin-bottom:10px;">
          <span style="font-weight:bold;">Tier:</span> ${sf.journalSupport.tier}
        </p>
        <p style="color:#333;font-size:16px;line-height:1.6;margin-bottom:10px;">
          <span style="font-weight:bold;">Package:</span> ${sf.journalSupport.package}
        </p>
        <p style="color:#333;font-size:16px;line-height:1.6;margin-bottom:10px;">
          <span style="font-weight:bold;">Amount:</span> $${sf.journalSupport.amount}
        </p>
      `
      : "";

    // ── Build addons section for email ────────────────────────────────────────
    const addonsRows =
      sf.addons?.length > 0
        ? `
        <div style="height:1px;background:#e0e0e0;margin:20px 0;"></div>
        <h3 style="color:#4f46e5;font-size:22px;">Add-ons</h3>
        ${sf.addons
          .map(
            (
              a,
            ) => `<p style="color:#333;font-size:16px;line-height:1.6;margin-bottom:6px;">
                      • ${a.label}${a.sublabel ? ` (${a.sublabel})` : ""}: <strong>$${a.amount}</strong>
                    </p>`,
          )
          .join("")}
        <p style="color:#333;font-size:16px;margin-top:8px;">
          <span style="font-weight:bold;">Add-ons Total:</span> $${sf.addonsAmount}
        </p>
      `
        : "";

    const HtmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#f7f9fc;margin:0;padding:20px;">
  <div style="background:#fff;border-radius:10px;box-shadow:0 8px 20px rgba(0,0,0,0.1);padding:40px;max-width:600px;margin:auto;border-top:5px solid #4f46e5;">
    <h2 style="color:#4f46e5;font-size:26px;margin-bottom:15px;">New Registration from ICETMRS-2026</h2>

    <p style="color:#333;font-size:16px;line-height:1.6;margin-bottom:10px;"><span style="font-weight:bold;">Title:</span> ${registration.Title}</p>
    <p style="color:#333;font-size:16px;line-height:1.6;margin-bottom:10px;"><span style="font-weight:bold;">Full Name:</span> ${registration.first_name} ${registration.last_name}</p>
    <p style="color:#333;font-size:16px;line-height:1.6;margin-bottom:10px;"><span style="font-weight:bold;">Payment Status:</span> ${order.status}</p>
    <p style="color:#333;font-size:16px;line-height:1.6;margin-bottom:10px;"><span style="font-weight:bold;">Certificate Name:</span> ${registration.certificate_name}</p>
    <p style="color:#333;font-size:16px;line-height:1.6;margin-bottom:10px;"><span style="font-weight:bold;">Date of Birth:</span> ${new Date(registration.DOB).toLocaleDateString()}</p>
    <p style="color:#333;font-size:16px;line-height:1.6;margin-bottom:10px;"><span style="font-weight:bold;">Nationality:</span> ${registration.nationality}</p>
    <p style="color:#333;font-size:16px;line-height:1.6;margin-bottom:10px;"><span style="font-weight:bold;">Department:</span> ${registration.department}</p>
    <p style="color:#333;font-size:16px;line-height:1.6;margin-bottom:10px;"><span style="font-weight:bold;">Institution:</span> ${registration.institution}</p>
    <p style="color:#333;font-size:16px;line-height:1.6;margin-bottom:10px;"><span style="font-weight:bold;">Mobile Number:</span> ${registration.number}</p>
    <p style="color:#333;font-size:16px;line-height:1.6;margin-bottom:10px;"><span style="font-weight:bold;">Email:</span> <a href="mailto:${registration.email}" style="color:#4f46e5;">${registration.email}</a></p>
    <p style="color:#333;font-size:16px;line-height:1.6;margin-bottom:10px;"><span style="font-weight:bold;">Participant Category:</span> ${registration.participant_category}</p>
    <p style="color:#333;font-size:16px;line-height:1.6;margin-bottom:10px;"><span style="font-weight:bold;">Presentation Category:</span> ${registration.presentation_Category}</p>
    <p style="color:#333;font-size:16px;line-height:1.6;margin-bottom:10px;"><span style="font-weight:bold;">Presentation Type:</span> ${registration.presentation_Type}</p>

    <div style="height:1px;background:#e0e0e0;margin:20px 0;"></div>
    <h3 style="color:#4f46e5;font-size:22px;">Selected Fee Details</h3>
    <p style="color:#333;font-size:16px;line-height:1.6;margin-bottom:10px;"><span style="font-weight:bold;">Fee Category:</span> ${sf.category}</p>
    <p style="color:#333;font-size:16px;line-height:1.6;margin-bottom:10px;"><span style="font-weight:bold;">Title:</span> ${sf.title}</p>
    <p style="color:#333;font-size:16px;line-height:1.6;margin-bottom:10px;"><span style="font-weight:bold;">Base Registration Fee:</span> $${sf.registrationBase || sf.value}</p>

    ${journalRow}
    ${addonsRows}

    <div style="height:1px;background:#e0e0e0;margin:20px 0;"></div>
    <h3 style="color:#4f46e5;font-size:22px;">Pricing Summary</h3>
    <p style="color:#333;font-size:16px;line-height:1.6;margin-bottom:10px;"><span style="font-weight:bold;">Membership:</span> ${sf.membershipSelected ? `Yes (+$${sf.membershipFee})` : "No"}</p>
    <p style="color:#333;font-size:16px;line-height:1.6;margin-bottom:10px;"><span style="font-weight:bold;">Coupon:</span> ${sf.couponCode || "None"}</p>
    <p style="color:#333;font-size:16px;line-height:1.6;margin-bottom:10px;"><span style="font-weight:bold;">Coupon Discount:</span> $${sf.couponDiscountAmount || 0}</p>
    <p style="color:#333;font-size:16px;line-height:1.6;margin-bottom:10px;"><span style="font-weight:bold;">Bank Convenience Charge:</span> $${sf.convenience_price}</p>
    <p style="color:#333;font-size:18px;font-weight:bold;line-height:1.6;margin-bottom:10px;">Total Charged: $${sf.finalTotal}</p>

    <a href="mailto:${registration.email}" style="display:inline-block;padding:12px 20px;margin-top:20px;background:#4f46e5;color:#fff;border-radius:5px;text-decoration:none;">Reply to Participant</a>
  </div>
</body>
</html>
`;

    res.status(201).send({
      message: "Registration data saved successfully",
      order_id: order.id,
      amount: order.amount,
    });

    sendEmailToAdmin("New Registration from ICETMRS-2026", HtmlTemplate);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({
        message: "Error saving registration data",
        error: error.message,
      });
  }
};

const sendEmailToAdmin = async (subject, htmlContent, attachment) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.ADMIN_MAIL,
        pass: process.env.ADMIN_PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.ADMIN_MAIL,
      to: process.env.ADMIN_MAIL,
      subject,
      html: htmlContent,
      attachments: attachment,
    });
    console.log("Email sent to admin:", process.env.ADMIN_MAIL);
  } catch (error) {
    console.error("Error sending email to admin:", error);
  }
};

const sendEmailToUser = async (subject, htmlContent, Email) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.ADMIN_MAIL,
        pass: process.env.ADMIN_PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.ADMIN_MAIL,
      to: Email,
      subject,
      html: htmlContent,
    });
    console.log("Email sent to User:", Email);
  } catch (error) {
    console.error("Error sending email to User:", error);
  }
};
