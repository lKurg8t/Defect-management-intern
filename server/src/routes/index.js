import { Router } from 'express';
import projects from './projects.js';
import testers from './testers.js';
import testcases from './testcases.js';
import testcycles from './testcycles.js';
import executions from './executions.js';
import defects from './defects.js';
import reports from './reports.js';
import parameters from './parameters.js';
import auth from './auth.js';
import requireAuth from '../middleware/auth.js';

const r = Router();
r.use('/auth', auth);
r.use('/projects', requireAuth, projects);
r.use('/testers', requireAuth, testers);
r.use('/test-cases', requireAuth, testcases);
r.use('/test-cycles', requireAuth, testcycles);
r.use('/executions', requireAuth, executions);
r.use('/defects', requireAuth, defects);
r.use('/reports', requireAuth, reports);
r.use('/parameters', requireAuth, parameters);

export default r;
