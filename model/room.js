const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var roomSchema = new Schema({
	civs: Object,
  bans: Object,
  team_1: Object,
  team_2: Object,
	created_at: Date,
	updated_at: Date
});

// on every save, add the date
roomSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();

  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

var room = mongoose.model('Room', roomSchema);

module.exports = room;