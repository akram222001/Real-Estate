// import jwt from 'jsonwebtoken';
// import { errorHandler } from './error.js';

// export const verifyToken = (req, res, next) => {
//   const token = req.cookies.access_token;

//   if (!token) return next(errorHandler(401, 'Unauthorized'));

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) return next(errorHandler(403, 'Forbidden'));

//     req.user = user;
//     next();
//   });
// };



import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
  console.log('🔐 verifyToken middleware called');
  
  let token = null;
  
  // 1. Pehle Authorization header check karein
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
    console.log('✅ Token from Authorization header');
  }
  
  // 2. Agar nahi mila to cookies check karein
  if (!token && req.cookies.access_token) {
    token = req.cookies.access_token;
    console.log('✅ Token from cookies');
  }
  
  if (!token) {
    console.log('❌ No token found in headers or cookies');
    return next(errorHandler(401, 'Unauthorized'));
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('❌ Token verification failed:', err.message);
      return next(errorHandler(403, 'Forbidden'));
    }
    
    console.log('✅ Token verified successfully. User ID:', user.id);
    req.user = user;
    next();
  });
};