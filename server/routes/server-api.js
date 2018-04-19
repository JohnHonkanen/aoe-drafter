const express = require('express');
const router = express.Router();
var Room = require('./../../model/room');

router.get('/rooms', (req, res) => {
	Room.find({}, (err, rooms) => {
		if(err) throw err;

		res.send(rooms);
	});
});

router.get('/rooms/:id', (req, res) => {
Room.find({_id : req.params.id}, (err, room) =>{
	if(err) throw err;

	res.send(room);
});
})

router.post('/rooms/create', (req, res) => {
	Room.remove({}, function(err) { 
		if(err) throw err;
	});
	var newRoom = Room({
		civs: req.body.civs,
		bans: [],
		team_1: [],
		team_2: [],
		created_at: "",
		updated_at: "",
	});

	newRoom.save(function(err){
		if(err) throw err;

		console.log("Room Created");
	});

	res.send("Created room");
});

router.post('/rooms/:id/ban/:civ', (req,res) => {
	var id = req.params.id;

	Room.findByIdAndUpdate(id, 
		{$addToSet: { "bans" : req.params.civ}},
		(err, model) =>{
			if(err) throw err;

			console.log("Updated Bans");
		}
	);

	Room.findByIdAndUpdate(id, 
		{$pull: { "civs" : req.params.civ}},
		(err, model) =>{
			if(err) throw err;

			console.log("Updated civs");
		}
	);

	res.send("Banned and Updated");
});

router.post('rooms/:id/pick/:team/:civ', (req,res) => {

});

module.exports = router;