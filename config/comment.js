
var Comment = require('../models/comment');

exports.newComment = function(req, res, user, type){


		var comm = new Comment({
			thread: req.params.id,
			author: user.local.name + ' ' + user.local.lastName,
			content: req.body.commentContent,
			created: Date.now(),
			authorEmail: user.local.email,
			type: type
		});

		comm.save(function(err){
			if(!err) {
				console.log(req.params.id);
				res.redirect('/match/'+req.params.id);
			}
			else
				console.log('ADDING COMMENT ERROR: '+err);
		});
};


//Delete comment
//You need to be the owner or be admin.
exports.deleteComment = function(req, res, user){
	Comment.findById(req.params.id, function(err, comment){
		if(!err){
			var thread = comment.thread;
			if(comment.authorEmail == user.local.email){
				comment.remove(function(err, comment){
					if(!err){
						res.redirect('/match/'+thread);
					}
					else
						console.log('Error deleting comment: '+err);
				});
			}
			else{
				console.log('Author not the same');
				res.redirect('/home');
			}

		}
		else{
			console.log('Error searching for a comment: '+err);
			res.redirect('/home');
		}

	});
};
