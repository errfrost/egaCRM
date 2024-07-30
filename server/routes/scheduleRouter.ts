import { Router } from 'express';
import {
    addTimeRecord,
    deleteSchedule,
    deleteTimeRecord,
    getSchedule,
    getTimeRecord,
    setScheduleFromTemplate,
    updateTimeRecord,
} from '../controllers/scheduleController.js';

const router = Router();

router.get('/:date/:month/:year', getSchedule);
router.delete('/:date/:month/:year', deleteSchedule);
router.post('/:date/:month/:year', setScheduleFromTemplate);
router.get('/:scheduleID', getTimeRecord);
router.put('/:scheduleID', updateTimeRecord);
router.delete('/:scheduleID', deleteTimeRecord);
router.post('/add', addTimeRecord);

export default router;
