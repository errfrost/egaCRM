import { Router } from 'express';
import {
    addClientToScheduleLog,
    updateClientVisitInScheduleRecord,
    getScheduleLog,
    removeClientFromScheduleLog,
} from '../controllers/scheduleLogController.js';

const router = Router();

// router.get('/:date/:month/:year', getSchedule);
// router.delete('/:date/:month/:year', deleteSchedule);
router.post('/add', addClientToScheduleLog);
router.get('/:scheduleID', getScheduleLog);
// router.put('/:scheduleID', updateTimeRecord);
router.delete('/:scheduleLogID', removeClientFromScheduleLog);
router.put('/:scheduleLogID', updateClientVisitInScheduleRecord);

export default router;
