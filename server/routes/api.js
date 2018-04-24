const express = require('express');
const router = express.Router();

//declare axios for making http request
const axios = require('axios');
const API = process.env.API_LINK ||'http://localhost:3000/server-api'; //API Link


router.get('/', (req, res) => {
	res.send('api works great!');
});

router.get('/rooms', (req, res) => {
	axios.get(`${API}/rooms`)
		.then(rooms => {
			res.status(200).json(rooms.data);
		})
		.catch(error => {
			res.status(500).send(error);
		});
});

router.get('/rooms/:id', (req, res) => {
	const id = req.params.id;
	axios.get(`${API}/rooms/` + id)
		.then(room => {
			res.status(200).json(room.data);
		})
		.catch(error => {
			res.status(500).send(error);
		});
});

router.get('/rooms/create/:number', (req, res) => {
	const number = req.params.number;
	console.log(number);
	axios.post(`${API}/rooms/create/random/` + number)
		.then(result => {
			res.redirect('/rooms/' + result.data);
			res.send("Completed");
		})
		.catch(error => {
			res.status(500).send(error);
		});
});

module.exports = router;