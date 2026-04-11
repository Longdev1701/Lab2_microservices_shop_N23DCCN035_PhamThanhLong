const app = require("./app");
const connectDatabase = require("./config/database");

const PORT = process.env.ORDER_SERVICE_PORT || process.env.PORT || 3002;

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Order Service running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start Order Service:", error);
    process.exit(1);
  });
