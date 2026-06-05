require("dotenv").config();
const app = require("./app");

// start server
app.listen(app.get("port"), () => {
  console.log(`Server started on port ${app.get("port")}`);
});
