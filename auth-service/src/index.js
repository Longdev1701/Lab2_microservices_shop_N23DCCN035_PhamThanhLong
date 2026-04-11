const app = require("./app");

const PORT = process.env.AUTH_SERVICE_PORT || process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});
