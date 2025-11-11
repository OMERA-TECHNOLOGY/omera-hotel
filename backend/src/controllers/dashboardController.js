import supabase from '../config/supabase.js';
import logger from '../middleware/logger.js';

class DashboardController {
  static async getMetrics(req, res) {
    try {
      const { data, error } = await supabase.from('dashboard_metrics').select('*').single();
      if (error) throw error;
      res.success(data);
    } catch (err) {
      logger.error(err);
      res.fail(500, 'Failed to fetch metrics', err.message);
    }
  }

  static async getVipArrivals(req, res) {
    try {
      const { data, error } = await supabase.from('vip_arrivals_today').select('*');
      if (error) throw error;
      res.success(data);
    } catch (err) {
      logger.error(err);
      res.fail(500, 'Failed to fetch VIP arrivals', err.message);
    }
  }

  static async getRoomStatus(req, res) {
    try {
      const { data, error } = await supabase.from('room_status_overview').select('*');
      if (error) throw error;
      res.success(data);
    } catch (err) {
      logger.error(err);
      res.fail(500, 'Failed to fetch room status', err.message);
    }
  }

  static async getRevenueAnalytics(req, res) {
    try {
      const { data, error } = await supabase.from('revenue_analytics').select('*').order('revenue_date', { ascending: false }).limit(30);
      if (error) throw error;
      res.success(data);
    } catch (err) {
      logger.error(err);
      res.fail(500, 'Failed to fetch revenue analytics', err.message);
    }
  }
}

export default DashboardController;
