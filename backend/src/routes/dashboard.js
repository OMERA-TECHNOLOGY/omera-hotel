import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import DashboardController from '../controllers/dashboardController.js';

const router = Router();

router.get('/metrics', authenticateToken, DashboardController.getMetrics);
router.get('/vip-arrivals', authenticateToken, DashboardController.getVipArrivals);
router.get('/room-status', authenticateToken, DashboardController.getRoomStatus);
router.get('/revenue', authenticateToken, DashboardController.getRevenueAnalytics);

export default router;
