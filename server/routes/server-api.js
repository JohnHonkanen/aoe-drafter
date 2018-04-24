const express = require('express');
const router = express.Router();
const civsJson = require('../../resources/civ');
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

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

router.post('/rooms/create/random/:number', (req, res) => {
	const number = req.params.number;
	var civsList = civsJson.civList;
	shuffleArray(civsList);
	civsList = civsList.slice(0,number);

	Room.remove({}, function(err) { 
		if(err) throw err;
	});
	var newRoom = Room({
		civs: civsList,
		bans: [],
		team_1: [],
		team_2: [],
		created_at: "",
		updated_at: "",
	});

	newRoom.save(function(err){
		if(err) throw err;

		console.log("Room Created: " + newRoom._id);
		res.send(newRoom._id);
	});
});

router.post('/rooms/:id/ban/:civ', (req,res) => {
	const id = req.params.id;

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

router.post('/rooms/:id/unban/:civ', (req, res) => {
	const id = req.params.id;

	Room.findByIdAndUpdate(id, 
		{$pull: { "bans" : req.params.civ}},
		(err, model) =>{
			if(err) throw err;

			console.log("Updated Bans");
		}
	);

	Room.findByIdAndUpdate(id, 
		{$addToSet: { "civs" : req.params.civ}},
		(err, model) =>{
			if(err) throw err;

			console.log("Updated civs");
		}
	);

	res.send("Banned and Updated");
});

router.post('/rooms/:id/pick/:team/:civ', (req,res) => {
	const id = req.params.id;
	const team = req.params.team;
	console.log(team);
	Room.findByIdAndUpdate(id, 
		{$pull: { "civs" : req.params.civ}},
		(err, model) =>{
			if(err) throw err;

			console.log("Updated Bans");
		}
	);
	if(team == 'team_1'){
		Room.findByIdAndUpdate(id, 
			{$addToSet: { "team_1" : req.params.civ}},
			(err, model) =>{
				if(err) throw err;

				console.log("Updated civs");
			}
		);
	}
	else{
		Room.findByIdAndUpdate(id, 
			{$addToSet: { "team_2" : req.params.civ}},
			(err, model) =>{
				if(err) throw err;

				console.log("Updated civs");
			}
		);
	}
	

	res.send(team + " picked " + req.params.civ);

});

router.post('/rooms/:id/unpick/:team/:civ', (req,res) => {
	const id = req.params.id;
	const team = req.params.team;

	if(team == 'team_1'){
		Room.findByIdAndUpdate(id, 
			{$pull: { "team_1" : req.params.civ}},
			(err, model) =>{
				if(err) throw err;

				console.log("Updated civs");
			}
		);
	}
	else{
		Room.findByIdAndUpdate(id, 
			{$pull: { "team_2" : req.params.civ}},
			(err, model) =>{
				if(err) throw err;

				console.log("Updated civs");
			}
		);
	}

	Room.findByIdAndUpdate(id, 
		{$addToSet: { "civs" : req.params.civ}},
		(err, model) =>{
			if(err) throw err;

			console.log("Updated Bans");
		}
	);

	
	res.send(team + " picked " + req.params.civ);

});

module.exports = router;