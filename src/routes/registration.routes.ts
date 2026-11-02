import { Router } from 'express';
import {
  createRegistration,
  getAllRegistrations,
  getRegistrationById,
  updateRegistrationFull,
  updateRegistrationPartial,
  deleteRegistration,
} from '../controllers/registration.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();

// Public route to register for a workshop
router.post('/', createRegistration);

// JWT Protected administrative routes
router.get('/', authenticateJWT, getAllRegistrations);
router.get('/:id', authenticateJWT, getRegistrationById);
router.put('/:id', authenticateJWT, updateRegistrationFull);
router.patch('/:id', authenticateJWT, updateRegistrationPartial);
router.delete('/:id', authenticateJWT, deleteRegistration);

export default router;
