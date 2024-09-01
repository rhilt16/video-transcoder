const jwt = require("jsonwebtoken");

// Secret token
const tokenSecret = "93e71c721095b6601e45fa57d4576141e65f8d1c6989543c3f68f2e1c2e7751b";

// Generate a token using the provided payload, secret token, and set it to expire in 30 minutes 
const generateToken = (payload) => {
   let token = jwt.sign(payload, tokenSecret, {expiresIn: "30m"});
   return token;
}

// Authenticate a provided JWT token
const authenticateToken = (req, res, next) => {
  // Retrieve the necessary parts from the request
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(' ')[1];

  // If no token is present, respond with an error
  if(!token) {
    console.log("Web token missing");
    return res.sendStatus(401);
  }
// Verify the JWT token and respond with a verified message if successful, otherwise send an error and Unauthorized message
  try {
      const user = jwt.verify(token, tokenSecret);
      console.log(
         `authToken verified for: ${user._id}`
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
