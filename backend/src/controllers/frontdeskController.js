import FrontDeskService from "../services/frontdeskService.js";

class FrontDeskController {
  static async getStats(req, res) {
    try {
      const data = await FrontDeskService.stats();
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getCurrentGuests(req, res) {
    try {
      // Prefer using a view if exists, fallback to active bookings
      try {
        const data = await FrontDeskService.currentGuestsFromView();
        return res.json({ success: true, data });
      } catch (_) {
        const data = await FrontDeskService.currentGuests();
        return res.json({ success: true, data });
      }
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getArrivals(req, res) {
    try {
      const { date } = req.query;
      const data = await FrontDeskService.arrivals(date);
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getDepartures(req, res) {
    try {
      const { date } = req.query;
      const data = await FrontDeskService.departures(date);
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getAvailability(req, res) {
    try {
      const data = await FrontDeskService.availability();
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

export default FrontDeskController;
