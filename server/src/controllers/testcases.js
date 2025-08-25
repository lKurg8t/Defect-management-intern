import { dbPool } from '../index.js';

export async function list(req,res){
  try {
    const projectId = req.query.projectId;
    if(!projectId) return res.json({ items: [] });
    const [rows] = await dbPool.query(`
      SELECT 
        tc.id,
        COALESCE(NULLIF(tc.ref, ''), CONCAT('TC-', tc.id)) AS ref,
        tc.title,
        tc.description,
        tc.workstream,
        tc.type,
        tc.status,
        tc.planned_date,
        tc.actual_date,
        u.full_name AS tester
      FROM test_cases tc
      LEFT JOIN users u ON u.id = tc.tester_user_id
      WHERE tc.project_id = ?
      ORDER BY tc.created_at DESC
      LIMIT 500
    `, [projectId]);

    // Last execution result per test case
    const ids = rows.map(r=>r.id);
    let execMap = new Map();
    if(ids.length){
      const [execRows] = await dbPool.query(`
        SELECT e.test_case_id, e.result
        FROM executions e
        WHERE e.project_id = ? AND e.test_case_id IN (${ids.map(()=>'?').join(',')})
        ORDER BY e.executed_at DESC
      `, [projectId, ...ids]);
      for(const r of execRows){ if(!execMap.has(r.test_case_id)) execMap.set(r.test_case_id, r.result); }
    }

    const items = rows.map(r=>({
      id: r.ref,
      tcId: r.id,
      name: r.title,
      description: r.description,
      workstream: r.workstream,
      type: r.type,
      executionStatus: (execMap.get(r.id) || 'NOT_EXECUTED')
        .replace('PASSED','Passed').replace('FAILED','Failed').replace('BLOCKED','Blocked').replace('SKIPPED','Not Executed').replace('NOT_EXECUTED','Not Executed'),
      tester: r.tester || 'Unassigned',
      plannedDate: r.planned_date || null,
      actualDate: r.actual_date || null,
      steps: [],
      expectedResults: ''
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

export async function steps(req,res){
  try {
    const id = req.params.id;
    const [rows] = await dbPool.query(
      `SELECT step_no, action_text, expected_result
       FROM test_case_steps WHERE test_case_id = ? ORDER BY step_no ASC`, [id]
    );
    const steps = rows.map(r=>r.action_text);
    const expectedResults = rows.length ? rows.map(r=>r.expected_result).join('; ') : '';
    res.json({ steps, expectedResults });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
