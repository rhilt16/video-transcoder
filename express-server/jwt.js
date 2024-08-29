const jwt = require("jsonwebtoken");

// Generate secret token

const tokenSecret = "replacewithactualtoken";

const generateToken = (username) => {
   let token = jwt.sign(username, tokenSecret, {expiresIn: "300m"});
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
         `authToken verified for: ${user.username} at the URL: ${req.url}`
      );

      // Add user info to the request for the next handler
      req.user = user;
      next();
   } catch (err) {
      console.log(
         `JWT verification failed at URL ${req.url}`,
         err.name,
         err.message
      );
      return res.sendStatus(401);
   }


}
