import { Router } from 'express';
import { getLayanan, createBooking, getBookingById, payBooking } from '../controllers/bookingController';

const router = Router();

router.get('/layanan', getLayanan);
router.post('/', createBooking);
router.get('/:id', getBookingById);
router.post('/:id/pay', payBooking);

export default router;
