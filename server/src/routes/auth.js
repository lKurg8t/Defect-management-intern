import { Router } from 'express';
import { login, me, logout, seedAdmin } from '../controllers/authController.js';

const r = Router();

r.post('/login', login);
r.get('/me', me);
r.post('/logout', logout);
r.post('/seed-admin', seedAdmin);

r.post('/logout', logout);

export default r;
