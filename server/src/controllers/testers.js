export async function list(req,res){ res.json({'items':[]}); }
export async function get(req,res){ res.json({'id':req.params.id}); }
export async function create(req,res){ res.status(201).json(req.body); }
export async function update(req,res){ res.json({'id':req.params.id, ...req.body}); }
export async function remove(req,res){ res.status(204).end(); }
