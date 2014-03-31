
var Match = require('../models/match');

exports.createMatch = function(req, res){

		var mat = new Match({
			city: req.body.city,
			club: req.body.club,
			price: req.body.price,
			cat: req.body.cat
		});

		mat.save(function(err){
			if(!err){
				console.log('Created');
				res.redirect('/home');
			}
			else
				console.log('Error: ' + err);
		})
	
};


exports.playMatch = function(req, res, user){
	Match.findById(req.params.id, function(err, match){
		if(!err){
			console.log('Found ');
			if(match.players.length<4){
				match.players.push(user.local.email);
				match.save();
				console.log(match);
			}
			res.redirect('/home');
		}
		else{
			res.send(400);
			console.log('Error: '+err);}
	});


};

exports.removeMatch = function(req, res, user){

};