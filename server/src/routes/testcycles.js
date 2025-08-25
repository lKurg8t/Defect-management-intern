import { Router } from 'express';
import * as ctrl from '../controllers/testcycles.js';
import requireAuth from '../middleware/auth.js';

const r = Router();

r.get('/', requireAuth, ctrl.list);
r.post('/', requireAuth, ctrl.create);
r.get('/:id', requireAuth, ctrl.get);
r.put('/:id', requireAuth, ctrl.update);
r.delete('/:id', requireAuth, ctrl.remove);

export default r;
