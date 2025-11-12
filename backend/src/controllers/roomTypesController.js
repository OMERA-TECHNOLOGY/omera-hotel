import RoomTypesService from "../services/roomTypesService.js";

class RoomTypesController {
  static async list(req, res) {
    try {
      const room_types = await RoomTypesService.list();
      res.json({ success: true, data: { room_types } });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const rt = await RoomTypesService.find(req.params.id);
      if (!rt)
        return res
          .status(404)
          .json({ success: false, error: "Room type not found" });
      res.json({ success: true, data: { room_type: rt } });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

export default RoomTypesController;
