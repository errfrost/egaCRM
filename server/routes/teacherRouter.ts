import { Router } from 'express';
import {
    addTeacher,
    getTeacher,
    getTeachers,
    updateTeacher,
} from '../controllers/teacherController.js';

const router = Router();

router.post('/add', addTeacher); // Add new Teacher
router.get('/', getTeachers); // Get all Teachers
router.get('/:teacherNumber', getTeacher); // Get teacher by teacherNumber
router.put('/:teacherNumber', updateTeacher); // Update teacher

export default router;
