//This TokenMiddleware implementation was taken from Day 19 Exercise 
const jwt = require('jsonwebtoken');
const TOKEN_COOKIE_NAME = "WIYTOKEN";

const API_SECRET = process.env.API_SECRET_KEY;

exports.TokenMiddleware = (req, res, next) => {
    
  let token = null; 
  if (req.cookies[TOKEN_COOKIE_NAME]) { //We do have a cookie with a token
    token = req.cookies[TOKEN_COOKIE_NAME]; //Get token from cookie
  }
  else { //No cookie, so let's check Authorization header
    const authHeader = req.get('Authorization');
      if(authHeader && authHeader.startsWith("Bearer ")) {
      //Format should be "Bearer token" but we only need the token
      token = authHeader.split(" ")[1].trim();
    }
  }

  if (token === null) {
    res.status(401).json({error: 'Not Authenticated'});
    return; 
  }

  try {
    const payload = jwt.verify(token, API_SECRET);
    req.user = payload.user;
    next();
  } catch(error) {
    res.status(401).json({error: 'Not Authenticated'});
  }
    

}


//---------------------------------------
// might need to adjust expiration times
//---------------------------------------
exports.generateToken = (req, res, user) => {
  let payload = {
    user: user,
    exp: Math.floor(Date.now() / 1000) + (60 * 60)
  };

  console.log("made it to generate token")
  const token = jwt.sign(payload, API_SECRET); 
  res.cookie(TOKEN_COOKIE_NAME, token, {secure: true, httpOnly: true, expires: new Date(Date.now() + 120000)});
};


exports.removeToken = (req, res) => {
  res.cookie(TOKEN_COOKIE_NAME, ' ', {secure: true, httpOnly: true, expires: new Date(-1)});
};