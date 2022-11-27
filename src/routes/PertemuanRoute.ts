import { Router } from 'express';
import PertemuanController from '../controllers/PertemuanController';

const router = Router();

router.post('/', PertemuanController.createPertemuan);

router.put('/quiz/:kode_pertemuan', PertemuanController.editQuizPertemuan);

module.exports = router;