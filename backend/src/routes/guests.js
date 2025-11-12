import { Router } from "express";
import { body, param } from "express-validator";
import GuestsController from "../controllers/guestsController.js";
import { authenticateToken, authorize } from "../middleware/auth.js";

const router = Router();

// Some guest operations should be allowed for receptionists and admins
router.use(authenticateToken);

router.get(
  "/",
  authorize("admin", "receptionist", "manager"),
  GuestsController.listGuests
);
router.get("/:id", [param("id").isUUID()], GuestsController.getGuestById);
router.post(
  "/",
  authorize("admin", "receptionist", "manager"),
  [
    body("first_name").optional().isString(),
    body("last_name").optional().isString(),
    body("email").optional().isEmail(),
    body("phone").optional().isString(),
  ],
  GuestsController.createGuest
);
router.put(
  "/:id",
  authorize("admin", "receptionist"),
  [param("id").isUUID()],
  GuestsController.updateGuest
);
router.delete(
  "/:id",
  authorize("admin"),
  [param("id").isUUID()],
  GuestsController.deleteGuest
);

export default router;
