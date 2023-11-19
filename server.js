const app = require("./app");
const mongoose = require("mongoose");
// const{DB_HOST} = require('./config')
const {DB_HOST} = process.env
// console.log(process.env)
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
