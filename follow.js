var twitter = require('ntwitter');	
var config = require('./config');

var term = config.app.term;
var users = [];
var already_following = [];
var user_count = 0;
var user_max = 100;
var total_requests = 0;
var max_requests = 10;

var twit = new twitter(config.twitter_auth);
var get_users;
var process_users;
var me;
var my_friends = [];
var get_friends = function(){
	twit.getFriendsIds(parseInt(me.id_str, 10), function(err, data){
		console.log('get friends');
		console.log(err);
		console.log(data);
		my_friends = data;
	})
};
var get_limit = function(){
	twit.rateLimitStatus(function(d){
		console.log('limit');
		console.log(d);
	});
};
twit.verifyCredentials(function (err, data) {
		console.log("credentials **************************");
		console.log(err);
	    console.log(data);
		me = data;
		get_friends();
		get_users();
		
	  });
	
var want_user = function(user){
	var want = (user.verified == true) && (my_friends.indexOf(user.id) == -1);
	return want;
};

get_users = function(){
	twit.get('/users/search.json', {q: 'user', page: total_requests}, function(err, response){
			console.log("search **************************");
			if (err){
				console.log('error on search!')
				console.log(err);
			}else{
				for (i in response){
					user = response[i];
					console.log('\n*******************************\nuser: ' + user.screen_name + '\n');
					console.log(user);
					console.log('\n\nInfo:');
					if (want_user(user)){
						console.log('verified');
						users.push(user.screen_name);
					}
				}
				console.log('\nusers: ' +users.length);
				console.log(users);
				if (users.length < user_max && total_requests < max_requests){
					get_users();
				}else{
					process_users(users);
				}
			}
		});
	total_requests++;
	
};
//get_limit();
process_users = function(users){
	console.log('processing users');
	console.log('found ' + users.length + ' users');
	console.log(users);
	if (config.app.friend){
		var interval = setInterval(function(){
			var user = users.pop();

				console.log('creating friendship to ' + user);

				twit.createFriendship(user, {}, function(err, response){
					console.log('response for creating friendship to ' + user);
					console.log(err);
					console.log(response);

				});

			if (users.length == 0){
				clearInterval(interval);
			}
		},20);
	}else{
		console.log("enable app.friend in config.js to follow");
	}
	
}

console.log('Running...');

