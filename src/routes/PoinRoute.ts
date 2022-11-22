import { Router } from 'express';
import PoinController from '../controllers/PoinController';

const router = Router();

router.get('/:kode_pertemuan', PoinController.getByKodePertemuan);

module.exports = router;
