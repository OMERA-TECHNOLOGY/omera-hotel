import { Router } from "express";
import { body } from "express-validator";
import SettingsController from "../controllers/settingsController.js";
import { authenticateToken, authorize } from "../middleware/auth.js";

const router = Router();

router.use(authenticateToken);

router.get("/", authorize("admin", "manager"), SettingsController.get);
router.put(
  "/",
  authorize("admin", "manager"),
  [
    body("hotel_name_english").optional().isString(),
    body("contact_email").optional().isEmail(),
    body("phone_numbers").optional(),
    body("address_english").optional().isString(),
    body("total_rooms").optional().isInt(),
    body("star_rating").optional().isInt({ min: 1, max: 5 }),
    body("vat_rate").optional().isNumeric(),
    body("primary_currency").optional().isString(),
    body("usd_to_etb_rate").optional().isNumeric(),
    body("invoice_prefix").optional().isString(),
    body("default_language").optional().isString(),
    body("supported_languages").optional(),
    body("calendar_system").optional().isString(),
    body("timezone").optional().isString(),
    body("business_hours").optional(),
  ],
  SettingsController.update
);

export default router;
