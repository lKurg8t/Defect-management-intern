import { dbPool } from '../index.js';

export async function list(req,res){
  try {
    const limit = Math.min(parseInt(req.query.limit || '50', 10), 200);
    const offset = Math.max(parseInt(req.query.offset || '0', 10), 0);
    const [rows] = await dbPool.query(
      `SELECT 
         id,
         code,
         name,
         description,
         status,
         progress,
         teamSize,
         bugs,
         testCases,
         start_date AS startDate,
         end_date AS endDate,
         created_at,
         updated_at
       FROM v_project_summary_ui
       ORDER BY updated_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    res.json({ items: rows, limit, offset });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function get(req,res){
  try {
    const id = req.params.id;
    const [[base]] = await dbPool.query(
      `SELECT 
         p.id, p.code, p.name, p.description, p.status,
         p.progress_pct AS progress,
         p.start_date AS startDate,
         p.end_date AS endDate
       FROM projects p WHERE p.id = ? LIMIT 1`, [id]
    );
    if(!base) return res.status(404).json({ error: 'Not found' });

    const [[summary]] = await dbPool.query(
      `SELECT 
         s.team_size AS teamSize,
         s.bug_count AS bugs,
         s.test_case_count AS testCases
       FROM v_project_summary s WHERE s.project_id = ? LIMIT 1`, [id]
    );

    const [[counts]] = await dbPool.query(
      `SELECT 
         (SELECT COUNT(*) FROM test_cycles c WHERE c.project_id = ?) AS testCycles,
         (SELECT COUNT(*) FROM executions e WHERE e.project_id = ?) AS executions,
         (SELECT COUNT(DISTINCT e.test_case_id) FROM executions e WHERE e.project_id = ?) AS executedCases,
         (SELECT COUNT(*) FROM test_cases tc WHERE tc.project_id = ?) AS totalCases,
         (SELECT COUNT(*) FROM executions e WHERE e.project_id = ? AND e.result = 'PASSED') AS passedExec
       `, [id, id, id, id, id]
    );

    const coverage = counts.totalCases > 0 ? Math.round((counts.executedCases / counts.totalCases) * 100) : 0;
    const successRate = counts.executions > 0 ? Math.round((counts.passedExec / counts.executions) * 100) : 0;

    const [parameters] = await dbPool.query('SELECT param_key, param_type, param_value FROM project_parameters WHERE project_id = ?', [id]);
    const [members] = await dbPool.query('SELECT pm.user_id, pm.role, pm.is_active, pm.joined_at FROM project_members pm WHERE pm.project_id = ?', [id]);

    const project = { ...base, ...(summary || {}) };
    const stats = { testCycles: counts.testCycles || 0, executions: counts.executions || 0, coverage, successRate };
    res.json({ project, parameters, members, stats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function create(req,res){
  try {
    const { code, name, description = null, status = 'ACTIVE', progress_pct = 0, owner_user_id = null, start_date = null, end_date = null } = req.body || {};
    const created_by = req.user?.uid || req.body.created_by || 0;
    const [result] = await dbPool.query(
      'INSERT INTO projects (uuid, code, name, description, status, progress_pct, owner_user_id, start_date, end_date, created_by, updated_by) VALUES (UUID(),?,?,?,?,?,?,?,?,?,NULL)',
      [code, name, description, status, progress_pct, owner_user_id, start_date, end_date, created_by]
    );
    const [[created]] = await dbPool.query('SELECT * FROM projects WHERE id = ?', [result.insertId]);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function update(req,res){
  try {
    const id = req.params.id;
    const { code, name, description, status, progress_pct, owner_user_id, start_date, end_date } = req.body || {};
    const updated_by = req.user?.uid || req.body.updated_by || null;
    await dbPool.query(
      'UPDATE projects SET code = COALESCE(?, code), name = COALESCE(?, name), description = COALESCE(?, description), status = COALESCE(?, status), progress_pct = COALESCE(?, progress_pct), owner_user_id = COALESCE(?, owner_user_id), start_date = COALESCE(?, start_date), end_date = COALESCE(?, end_date), updated_by = COALESCE(?, updated_by) WHERE id = ?',
      [code, name, description, status, progress_pct, owner_user_id, start_date, end_date, updated_by, id]
    );
    const [[updated]] = await dbPool.query('SELECT * FROM projects WHERE id = ?', [id]);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function remove(req,res){
  try {
    const id = req.params.id;
    await dbPool.query('DELETE FROM projects WHERE id = ?', [id]);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
