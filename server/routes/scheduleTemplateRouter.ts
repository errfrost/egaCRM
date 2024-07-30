import { Router } from 'express';
import {
    addTimeRecord,
    deleteTimeRecord,
    getScheduleLessons,
    getScheduleTemplate,
    getTimeRecord,
    updateTimeRecord,
} from '../controllers/scheduleTemplateController.js';

const router = Router();

router.get('/', getScheduleTemplate);
router.get('/lessons', getScheduleLessons);
router.get('/:scheduleID', getTimeRecord);
router.put('/:scheduleID', updateTimeRecord);
router.delete('/:scheduleID', deleteTimeRecord);
router.post('/add', addTimeRecord);

export default router;
