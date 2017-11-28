var mongoose = require("mongoose");
var Schema = mongoose.Schema;
let retailerSchema = new Schema({
  country: String,
  region: String,
  store: Array
});

module.exports = mongoose.model("stores", retailerSchema);
