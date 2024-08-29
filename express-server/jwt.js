const jwt = require("jsonwebtoken");

// Generate secret token

const tokenSecret = "replacewithactualtoken";

const generateToken = (email) => {
   let token = jwt.sign(email, tokenSecret, {expiresIn: "300m"});
   return token;
}

const authenticateToken = (req, res, next) => {

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(' ')[1];

  if(!token) {
    console.log("Web token missing");
    return res.sendStatus(401);
  }

  try {
      const user = jwt.verify(token, tokenSecret);

      console.log(
         `authToken verified for: ${user.email}`
      );

      // Add user info to the request for the next handler
      req.user = user;
      next();
   } catch (err) {
      console.log(
         `JWT verification failed`,
         err.name,
         err.message
      );
      return res.sendStatus(401);
   }


}
module.exports = {tokenSecret, generateToken, authenticateToken}
