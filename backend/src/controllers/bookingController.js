// src/controllers/bookingController.ts
import BookingModel from "../models/Booking";
import RoomModel from "../models/Room";
// Note: Plain JS version (removed TypeScript types)

class BookingController {
  static async createBooking(req, res) {
    try {
      const bookingData = {
        ...req.body,
        created_by: req.user && req.user.id,
      };

      const booking = await BookingModel.create(bookingData);

      await RoomModel.update(bookingData.room_id, { status: "occupied" });

      res.status(201).json({
        message: "Booking created successfully",
        booking,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAllBookings(req, res) {
    try {
      const bookings = await BookingModel.getAll();
      res.json({ bookings });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getBookingById(req, res) {
    try {
      const booking = await BookingModel.findById(parseInt(req.params.id));
      if (!booking) {
        res.status(404).json({ error: "Booking not found" });
        return;
      }
      res.json({ booking });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateBooking(req, res) {
    try {
      const booking = await BookingModel.update(
        parseInt(req.params.id),
        req.body
      );
      res.json({
        message: "Booking updated successfully",
        booking,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteBooking(req, res) {
    try {
      const booking = await BookingModel.findById(parseInt(req.params.id));
      if (!booking) {
        res.status(404).json({ error: "Booking not found" });
        return;
      }

      await BookingModel.delete(parseInt(req.params.id));
      await RoomModel.update(booking.room_id, { status: "available" });

      res.json({ message: "Booking deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async checkIn(req, res) {
    try {
      const booking = await BookingModel.update(parseInt(req.params.id), {
        booking_status: "checked_in",
      });
      res.json({
        message: "Check-in successful",
        booking,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async checkOut(req, res) {
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
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default BookingController;
