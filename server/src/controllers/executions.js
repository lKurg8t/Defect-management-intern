import { dbPool } from '../index.js';

export async function list(req,res){
  try {
    const projectId = req.query.projectId;
    if(!projectId) return res.json({ items: [] });
    const [rows] = await dbPool.query(`
      SELECT e.id, tc.ref AS testCaseId, e.result, u.full_name AS executedBy,
             DATE_FORMAT(e.executed_at, '%Y-%m-%d') AS date, e.notes
      FROM executions e
      JOIN test_cases tc ON tc.id = e.test_case_id
      LEFT JOIN users u ON u.id = e.executed_by
      WHERE e.project_id = ?
      ORDER BY e.executed_at DESC
      LIMIT 500
    `, [projectId]);
    const mapResult = (r)=>{
      const resultMap = { PASSED:'Passed', FAILED:'Failed', BLOCKED:'Blocked', SKIPPED:'Skipped', NOT_EXECUTED:'Not Executed' };
      return { ...r, result: resultMap[r.result] || r.result };
    };
    res.json({ items: rows.map(mapResult) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
export async function get(req,res){ res.json({'id':req.params.id}); }
export async function create(req,res){ res.status(201).json(req.body); }
export async function update(req,res){ res.json({'id':req.params.id, ...req.body}); }
export async function remove(req,res){ res.status(204).end(); }
