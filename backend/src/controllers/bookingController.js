import { validationResult } from "express-validator";
import BookingsService from "../services/bookingsService.js";
import RoomsService from "../services/roomsService.js";

class BookingController {
  static async createBooking(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({
            success: false,
            error: "Validation failed",
            details: errors.array(),
          });
      }
      const payload = { ...req.body };
      const booking = await BookingsService.create(payload);
      res.status(201).json({ success: true, data: { booking } });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getAllBookings(req, res) {
    try {
      const bookings = await BookingsService.list(req.query || {});
      res.json({ success: true, data: { bookings } });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getBookingById(req, res) {
    try {
      const booking = await BookingsService.find(req.params.id);
      if (!booking)
        return res
          .status(404)
          .json({ success: false, error: "Booking not found" });
      res.json({ success: true, data: { booking } });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async updateBooking(req, res) {
    try {
      const booking = await BookingsService.update(req.params.id, req.body);
      res.json({ success: true, data: { booking } });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async deleteBooking(req, res) {
    try {
      await BookingsService.remove(req.params.id);
      res.json({
        success: true,
        data: { message: "Booking deleted successfully" },
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async checkIn(req, res) {
    try {
      const booking = await BookingsService.update(req.params.id, {
        status: "active",
        actual_check_in: new Date().toISOString(),
      });
      if (booking?.room_id)
        await RoomsService.update(booking.room_id, { status: "occupied" });
      res.json({ success: true, data: { booking } });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async checkOut(req, res) {
    try {
      const booking = await BookingsService.find(req.params.id);
      if (!booking)
        return res
          .status(404)
          .json({ success: false, error: "Booking not found" });
      const updated = await BookingsService.update(req.params.id, {
        status: "completed",
        actual_check_out: new Date().toISOString(),
      });
      if (booking?.room_id)
        await RoomsService.update(booking.room_id, { status: "vacant" });
      res.json({ success: true, data: { booking: updated } });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

export default BookingController;
