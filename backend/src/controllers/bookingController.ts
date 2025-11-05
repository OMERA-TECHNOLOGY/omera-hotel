// src/controllers/bookingController.ts
const BookingModel = require("../models/Booking");
const RoomModel = require("../models/Room");
import { Response } from "express";
import { AuthRequest } from "../types";

class BookingController {
  static async createBooking(req: AuthRequest, res: Response): Promise<void> {
    try {
      const bookingData = {
        ...req.body,
        created_by: req.user!.id,
      };

      const booking = await BookingModel.create(bookingData);

      await RoomModel.update(bookingData.room_id, { status: "occupied" });

      res.status(201).json({
        message: "Booking created successfully",
        booking,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAllBookings(req: AuthRequest, res: Response): Promise<void> {
    try {
      const bookings = await BookingModel.getAll();
      res.json({ bookings });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getBookingById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const booking = await BookingModel.findById(parseInt(req.params.id));
      if (!booking) {
        res.status(404).json({ error: "Booking not found" });
        return;
      }
      res.json({ booking });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateBooking(req: AuthRequest, res: Response): Promise<void> {
    try {
      const booking = await BookingModel.update(
        parseInt(req.params.id),
        req.body
      );
      res.json({
        message: "Booking updated successfully",
        booking,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteBooking(req: AuthRequest, res: Response): Promise<void> {
    try {
      const booking = await BookingModel.findById(parseInt(req.params.id));
      if (!booking) {
        res.status(404).json({ error: "Booking not found" });
        return;
      }

      await BookingModel.delete(parseInt(req.params.id));
      await RoomModel.update(booking.room_id, { status: "available" });

      res.json({ message: "Booking deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async checkIn(req: AuthRequest, res: Response): Promise<void> {
    try {
      const booking = await BookingModel.update(parseInt(req.params.id), {
        booking_status: "checked_in",
      });
      res.json({
        message: "Check-in successful",
        booking,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async checkOut(req: AuthRequest, res: Response): Promise<void> {
    try {
      const booking = await BookingModel.findById(parseInt(req.params.id));
      if (!booking) {
        res.status(404).json({ error: "Booking not found" });
        return;
      }

      const updatedBooking = await BookingModel.update(
        parseInt(req.params.id),
        {
          booking_status: "checked_out",
          payment_status: "paid",
        }
      );

      await RoomModel.update(booking.room_id, { status: "available" });

      res.json({
        message: "Check-out successful",
        booking: updatedBooking,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = BookingController;
