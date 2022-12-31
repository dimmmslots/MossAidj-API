import { Router } from 'express';
import PertemuanController from '../controllers/PertemuanController';

const router = Router();

router.post('/', PertemuanController.createPertemuan);

router.put('/label/:kode_pertemuan', PertemuanController.editQuizLabelPertemuan);

router.post('/delquiz/:kode_pertemuan', PertemuanController.deleteQuizPertemuan);

router.post('/addquiz/:kode_pertemuan', PertemuanController.addQuizPertemuan);

module.exports = router;