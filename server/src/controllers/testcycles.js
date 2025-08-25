import { dbPool } from '../index.js';

export async function list(req,res){
  try {
    const projectId = req.query.projectId;
    if(!projectId) return res.json({ items: [] });
    const [rows] = await dbPool.query(`
      SELECT c.id, c.name, c.description, c.start_date, c.end_date, c.status,
             (SELECT COUNT(*) FROM cycle_test_cases x WHERE x.cycle_id = c.id) AS testCaseCount,
             (SELECT ROUND(100 * SUM(CASE WHEN e.result='PASSED' THEN 1 ELSE 0 END) / NULLIF(COUNT(*),0))
              FROM executions e WHERE e.cycle_id = c.id) AS executionPct
      FROM test_cycles c
      WHERE c.project_id = ?
      ORDER BY c.start_date DESC
    `, [projectId]);

    const items = rows.map(r=>({
      id: r.id,
      name: r.name,
      description: r.description,
      startDate: r.start_date,
      endDate: r.end_date,
      testCaseCount: Number(r.testCaseCount || 0),
      executionPct: Number(r.executionPct || 0),
      durationDays: r.start_date && r.end_date ? Math.max(1, Math.round((new Date(r.end_date) - new Date(r.start_date))/(1000*60*60*24))) : 0
    }));
    res.json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
export async function get(req,res){ res.json({'id':req.params.id}); }
export async function create(req,res){ res.status(201).json(req.body); }
export async function update(req,res){ res.json({'id':req.params.id, ...req.body}); }
export async function remove(req,res){ res.status(204).end(); }
