const router = require("express").Router();
const {
  register,
  login,
  refresh,
  me,
} = require("../controller/authenController");
const authenticate = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.get("/me", authenticate, me);

module.exports = router;
