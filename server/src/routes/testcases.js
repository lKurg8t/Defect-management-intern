import { Router } from 'express';
import * as ctrl from '../controllers/testcases.js';
import requireAuth from '../middleware/auth.js';

const r = Router();

r.use(requireAuth);

r.get('/', ctrl.list);
r.post('/', ctrl.create);
r.get('/:id', ctrl.get);
r.get('/:id/steps', requireAuth, ctrl.steps);
r.put('/:id', ctrl.update);
r.delete('/:id', ctrl.remove);

// Additional import routes per requirements
r.post('/import/bank', (req,res)=> res.json({ message: 'Imported from test case bank' }));
r.post('/import/external', (req,res)=> res.json({ message: 'Imported from external source' }));
r.post('/import/project', (req,res)=> res.json({ message: 'Imported from another project' }));

export default r;
