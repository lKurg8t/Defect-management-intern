import { dbPool } from '../index.js';

export async function list(req,res){
  try {
    const projectId = req.query.projectId;
    if(!projectId) return res.json({ items: [] });
    const [rows] = await dbPool.query(`
      SELECT d.id, d.title, d.severity, d.priority, d.status,
             u.full_name AS owner,
             d.created_at, d.updated_at,
             tc.ref AS relatedTestCaseId
      FROM defects d
      LEFT JOIN users u ON u.id = d.assigned_to
      LEFT JOIN test_cases tc ON tc.id = d.test_case_id
      WHERE d.project_id = ?
      ORDER BY d.created_at DESC
      LIMIT 500
    `, [projectId]);
    const cap = (s)=> s ? s.toString().toUpperCase().charAt(0) + s.toString().slice(1).toLowerCase() : s;
    const mapRow = (r)=>({
      id: r.id,
      title: r.title,
      severity: cap(r.severity),
      status: r.status === 'TO_DEPLOY' ? 'To Deploy' : cap(r.status),
      owner: r.owner,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
      relatedTestCaseId: r.relatedTestCaseId || null
    });
    res.json({ items: rows.map(mapRow) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
export async function get(req,res){ res.json({'id':req.params.id}); }
export async function create(req,res){ res.status(201).json(req.body); }
export async function update(req,res){ res.json({'id':req.params.id, ...req.body}); }
export async function remove(req,res){ res.status(204).end(); }
