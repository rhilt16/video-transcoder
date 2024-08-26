var express = require('express');
var router = express.Router();
const asyncHandler = require("express-async-handler");
const user_controller = require("../controllers/userController")


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


// GET request for creating Author. NOTE This must come before route for id (i.e. display author).
router.get("/create", user_controller.user_create_get);

// POST request for creating Author.
router.post("/create", user_controller.user_create_post);

// GET request to delete Author.
router.get("/:id/delete", user_controller.user_delete_get);

// POST request to delete Author.
router.post("/:id/delete", user_controller.user_delete_post);

// GET request to update Author.
router.get("/:id/update", user_controller.user_update_get);

// POST request to update Author.
router.post("/:id/update", user_controller.user_update_post);

// GET request for one Author.
router.get("/:id", user_controller.user_select);




module.exports = router;
