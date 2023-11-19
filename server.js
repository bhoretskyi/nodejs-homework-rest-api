const app = require("./app");
const mongoose = require("mongoose");
const DB_HOST =
  "mongodb+srv://Bohdan:wBImOG9XQAyzVKz9@cluster0.ambzzpa.mongodb.net/db-contacts?retryWrites=true&w=majority";
// wBImOG9XQAyzVKz9
mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(3000, () => {
      console.log(
        "Database connection successful. Server running. Use our API on port: 3000"
      );
    });
  })
  .catch((error) => {
    
    console.log(error.message);
    process.exit(1)
  });
