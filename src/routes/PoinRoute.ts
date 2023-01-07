import { Router } from 'express';
import PoinController from '../controllers/PoinController';

const router = Router();

router.get('/:kode_pertemuan', PoinController.getByKodePertemuan);

router.post('/:kode_pertemuan', PoinController.createPoint);

router.put('/:kode_pertemuan/:nim', PoinController.editPoint);

router.get('/generate/:kode_pertemuan', PoinController.generatePoinByKodePertemuan);

router.delete('/:kode_pertemuan/:nim', PoinController.deletePoint);

module.exports = router;
