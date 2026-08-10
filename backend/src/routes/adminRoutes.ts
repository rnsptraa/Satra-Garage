import { Router } from 'express';
import { getStats, getBookings, getCustomers, getVehicles, getServices } from '../controllers/adminController';

const router = Router();

router.get('/stats', getStats);
router.get('/bookings', getBookings);
router.get('/customers', getCustomers);
router.get('/vehicles', getVehicles);
router.get('/services', getServices);

export default router;
