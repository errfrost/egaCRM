import { Router } from 'express';
import {
    addTimeRecord,
    getScheduleLessons,
    getScheduleTemplate,
} from '../controllers/scheduleTemplateController.js';

const router = Router();

router.get('/', getScheduleTemplate);
router.get('/lessons', getScheduleLessons);
router.post('/add', addTimeRecord);

export default router;
