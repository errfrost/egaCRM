import { Router } from 'express';
import { addClientToScheduleLog } from '../controllers/scheduleLogController.js';

const router = Router();

// router.get('/:date/:month/:year', getSchedule);
// router.delete('/:date/:month/:year', deleteSchedule);
router.post('/:scheduleID', addClientToScheduleLog);
// router.get('/:scheduleID', getTimeRecord);
// router.put('/:scheduleID', updateTimeRecord);
// router.delete('/:scheduleID', deleteTimeRecord);
// router.post('/add', addTimeRecord);

export default router;
