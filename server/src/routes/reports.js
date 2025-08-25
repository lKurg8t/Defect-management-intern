import { Router } from 'express';
import requireAuth from '../middleware/auth.js';
import { dbPool } from '../index.js';

const r = Router();
r.use(requireAuth);

// example: GET /api/reports/client-status
r.get('/client-status', (req,res)=>{
  res.json({ rows: [
    { status: 'OPEN', count: 10 },
    { status: 'RETEST', count: 5 },
    { status: 'REOPEN', count: 2 },
    { status: 'CLOSED', count: 30 },
  ]});
});

// example: GET /api/reports/sg-status
r.get('/sg-status', (req,res)=>{
  res.json({ rows: [
    { status: 'OPEN', count: 8 },
    { status: 'ASSIGNED', count: 6 },
    { status: 'ESCALATED', count: 1 },
    { status: 'RETEST', count: 4 },
    { status: 'TO DEPLOY', count: 3 },
    { status: 'REOPEN', count: 1 },
    { status: 'CLOSED', count: 24 },
  ]});
});

// example: GET /api/reports/issue-type
r.get('/issue-type', (req,res)=>{
  res.json({ rows: [
    { type: 'Awaiting Analysis', count: 3 },
    { type: 'Defect', count: 22 },
    { type: 'New Requirement', count: 4 },
    { type: 'Training Issue', count: 2 },
    { type: 'Change', count: 3 },
    { type: 'Out of Scope', count: 2 },
  ]});
});

export default r;

// KPIs for dashboard from v_dashboard_kpis
r.get('/kpis', async (req,res)=>{
  try {
    const [[row]] = await dbPool.query('SELECT * FROM v_dashboard_kpis LIMIT 1');
    const kpis = {
      totalProjects: { value: row?.total_projects ?? 0, subtitle: `${row?.active_projects ?? 0} active` },
      testsCompleted: { value: row?.tests_completed ?? 0, subtitle: '+0% this week' },
      pendingBugs: { value: row?.pending_bugs ?? 0, subtitle: 'Need attention' },
      teamMembers: { value: row?.team_members ?? 0, subtitle: 'Active contributors' },
    };
    res.json(kpis);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Weekly activity: executions per weekday over last 7 days
r.get('/weekly-activity', async (req,res)=>{
  try {
    const [rows] = await dbPool.query(`
      SELECT DATE_FORMAT(executed_at, '%a') AS day, COUNT(*) AS tests
      FROM executions
      WHERE executed_at >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY)
      GROUP BY DAYOFWEEK(executed_at)
      ORDER BY DAYOFWEEK(executed_at)
    `);
    res.json(rows.map(r=>({ day: r.day, tests: Number(r.tests) })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Bug distribution by severity
r.get('/bug-distribution', async (req,res)=>{
  try {
    const [rows] = await dbPool.query(`
      SELECT severity, COUNT(*) AS count
      FROM defects
      GROUP BY severity
    `);
    const by = Object.fromEntries(rows.map(r=>[r.severity, Number(r.count)]));
    const result = {
      critical: { count: by.CRITICAL || 0, percentage: 0 },
      high: { count: by.HIGH || 0, percentage: 0 },
      medium: { count: by.MEDIUM || 0, percentage: 0 }
    };
    const total = result.critical.count + result.high.count + result.medium.count;
    if(total > 0){
      result.critical.percentage = Math.round((result.critical.count/total)*100);
      result.high.percentage = Math.round((result.high.count/total)*100);
      result.medium.percentage = Math.round((result.medium.count/total)*100);
    }
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
