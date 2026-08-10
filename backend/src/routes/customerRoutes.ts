import { Router } from 'express';
import { getRiwayat, getKendaraan } from '../controllers/customerController';

const router = Router();

router.get('/history/:userId', getRiwayat);
router.get('/vehicles/:userId', getKendaraan);

export default router;
