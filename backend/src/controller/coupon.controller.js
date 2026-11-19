import Coupon from "../Schema/coupon.schema.js";

export const ID50_CODE = "ID50";
export const ID50_DISCOUNT_AMOUNT = 50;
export const ID50_EXPIRES_AT = new Date("2026-08-31T23:59:59.999Z");

const normalizeCouponCode = (value) =>
  String(value ?? "")
    .trim()
    .toUpperCase();

export const getId50CouponValidation = (code, now = new Date()) => {
  const normalizedCode = normalizeCouponCode(code);

  if (!normalizedCode) {
    return { valid: false, message: "Enter a coupon code." };
  }

  if (normalizedCode !== ID50_CODE) {
    return { valid: false, message: "Invalid coupon code." };
  }

  if (now > ID50_EXPIRES_AT) {
    return { valid: false, message: "Coupon ID50 has expired." };
  }

  return {
    valid: true,
    code: ID50_CODE,
    discountAmount: ID50_DISCOUNT_AMOUNT,
  };
};

// ── Public: validate coupon at checkout ──────────────────────────────────────
export const validate_Coupon = async (req, res) => {
  try {
    const { code } = req.body;
    const normalizedCode = String(code ?? "").trim();
    const id50 = getId50CouponValidation(normalizedCode);

    if (normalizedCode && normalizedCode.toUpperCase() === ID50_CODE) {
      if (!id50.valid) {
        return res.status(400).json({ success: false, message: id50.message });
      }
      return res.status(200).json({
        success: true,
        code: id50.code,
        discountAmount: id50.discountAmount,
        message: "Coupon ID50 applied! $50.00 discount.",
      });
    }

    if (!normalizedCode) {
      return res
        .status(400)
        .json({ success: false, message: "Enter a coupon code." });
    }

    const coupon = await Coupon.findOne({
      code: normalizedCode.toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid or inactive coupon code." });
    }
    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return res
        .status(400)
        .json({ success: false, message: "Coupon has expired." });
    }
    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      return res
        .status(400)
        .json({ success: false, message: "Coupon usage limit reached." });
    }

    return res.status(200).json({
      success: true,
      discountPercent: coupon.discountPercent,
      message: `Coupon applied! ${coupon.discountPercent}% discount.`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── Admin CRUD ───────────────────────────────────────────────────────────────
export const coupon_GetAll = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const coupon_Create = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, data: coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const coupon_Update = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!coupon)
      return res
        .status(404)
        .json({ success: false, message: "Coupon not found" });
    res.status(200).json({ success: true, data: coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const coupon_Delete = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Coupon deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
