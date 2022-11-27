import { Router } from 'express';
import PoinController from '../controllers/PoinController';

const router = Router();

router.get('/:kode_pertemuan', PoinController.getByKodePertemuan);

router.post('/:kode_pertemuan', PoinController.createPoint);

router.put('/:kode_pertemuan/:nim', PoinController.editPoint);

module.exports = router;
