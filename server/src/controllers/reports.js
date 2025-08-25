import { dbPool } from '../index.js';

export async function list(req,res){
  try {
    const [rows] = await dbPool.query('SELECT * FROM reports ORDER BY created_at DESC LIMIT 100');
    res.json({ items: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
export async function get(req,res){
  try {
    const id = req.params.id;
    const [[report]] = await dbPool.query('SELECT * FROM reports WHERE id = ? LIMIT 1', [id]);
    if(!report) return res.status(404).json({ error: 'Not found' });
    const [runs] = await dbPool.query('SELECT * FROM report_runs WHERE report_id = ? ORDER BY run_at DESC', [id]);
    res.json({ report, runs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
export async function create(req,res){
  try {
    const { project_id, title, type = 'CUSTOM', params_json = null } = req.body || {};
    const created_by = req.user?.uid || req.body.created_by || 0;
    const [result] = await dbPool.query(
      'INSERT INTO reports (uuid, project_id, title, type, params_json, created_by) VALUES (UUID(),?,?,?,?,?)',
      [project_id, title, type, params_json, created_by]
    );
    const [[report]] = await dbPool.query('SELECT * FROM reports WHERE id = ?', [result.insertId]);
    res.status(201).json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
export async function update(req,res){
  try {
    const id = req.params.id;
    const { title, type, params_json, generated_url } = req.body || {};
    const updated_by = req.user?.uid || req.body.updated_by || null;
    await dbPool.query(
      'UPDATE reports SET title = COALESCE(?, title), type = COALESCE(?, type), params_json = COALESCE(?, params_json), generated_url = COALESCE(?, generated_url), updated_by = COALESCE(?, updated_by) WHERE id = ?',
      [title, type, params_json, generated_url, updated_by, id]
    );
    const [[report]] = await dbPool.query('SELECT * FROM reports WHERE id = ?', [id]);
    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
export async function remove(req,res){
  try {
    const id = req.params.id;
    await dbPool.query('DELETE FROM reports WHERE id = ?', [id]);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
