import jwt from 'jsonwebtoken';

export default function requireAuth(req,res,next){
  const auth = req.headers.authorization || '';
  if(!auth.startsWith('Bearer ')) return res.status(401).json({error:'Unauthorized'});
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_change_me');
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({error:'Unauthorized'});
  }
}
