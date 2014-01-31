var config = require('./config');

var twitter = require('ntwitter');	
var mongodb = require('mongodb');

require('./lib/priority_queue');

var twit = new twitter(config.twitter_auth);
var me;
var my_friends = [];
var checked_tweets = [];
var retweeted = [];
var rt_threshold = config.app.retweet_threshold;;
var tweet_queue = PriorityQueue();
var interval_timeout = config.app.tweet_interval;
//var interval_timeout = 12000;
var col_tweets;
var mongo_client;
var start_date = new Date(config.app.start);

var start_retweeting = function(){
	console.log('beginning stream');
	
	twit.stream('statuses/filter', {'follow': my_friends}, function(stream) {
		stream.on('data', function (data) {
			console.log('****	Stream Data received	****');
	//	    console.log(data);

			var tweet = data;
			
			if ('retweeted_status' in tweet){
				var focus_tweet = tweet.retweeted_status;
				console.log("	@"+focus_tweet.user.screen_name + ": ");
				console.log("	" + focus_tweet.text);
				if (focus_tweet.retweeted || retweeted.indexOf(focus_tweet.id_str) != -1){
					console.log('	already retweeted');
				}else{
					console.log('	have not retweeted yet...');
					if (focus_tweet.retweet_count > rt_threshold){
						console.log('	retweets high enough: ' + focus_tweet.retweet_count);
						var tweet_date = new Date(focus_tweet.created_at);
						console.log("	From time: " + focus_tweet.created_at);
						
						if (tweet_date > start_date){
							console.log("	After starting");
							date_val = ((new Date()) - tweet_date) / 600000;
							if (date_val < 1) date_val = 1;
							var rank = parseInt(focus_tweet.retweet_count / date_val, 10);
							if (rank > config.app.ratio_limit){
								console.log("	Adding to queue: "+ focus_tweet.id_str +"	|	rank: " + rank + "	|	(" + focus_tweet.retweet_count + " / " + date_val + ")");
								tweet_queue.push(focus_tweet.id_str, rank);
							}else{
								console.log("	Skipping, not enough rank");
							}
						}else{
							console.log("	Before starting, skipping...");
						}
						
					}else{
						console.log('	not high enough retweet count: ' + focus_tweet.retweet_count);
					}
				}				
		
			}else{
				console.log('	Has not been retweeted');
			}		
		});

		stream.on('end', function(resp){
			console.log("END");
			start_retweeting();
		});
		stream.on('destroy', function(resp){
			console.log("DESTROY");
			start_retweeting();
		});

	});
	
	var tweet_function = function(){
		console.log('****    Tweet function    ****');
		var id = tweet_queue.pop();
		while (id && (retweeted.indexOf(id) != -1 )){
			console.log('	already tweeted ' + id);
			id = tweet_queue.pop();
		}
		
		if (id){
			console.log('	retweeting ' + id);
			retweeted.push(id);
			if (config.app.tweet){
				twit.retweetStatus(id, function(err, resp){
					console.log('Retweeted: ' + id);
					if (err){
						console.log(err);
						tweet_function();
					}else{
						col_tweets.insert(resp);
						console.log(resp);
					}
				});
			}else{
				console.log('skipping tweet as per configuration');
			}

		}else{
			console.log('	not tweeting this loop');
		}
	};
	setTimeout(function(){
		tweet_function();
		var tweet_loop = setInterval(tweet_function, interval_timeout);
	},500);
};

var get_friends = function(cb){
	twit.getFriendsIds(parseInt(me.id_str, 10), function(err, data){
		console.log('****    Get friends    ****');
		if (err) console.log(err);
//		console.log(data);
		my_friends = data;
		console.log("Friends: " + my_friends.length);
		if (typeof cb === 'function') cb();
	});
};

var get_retweets = function(cb){
	col_tweets.find({}, {id_str : 1}).toArray(function(err, docs) {
		console.log("****    Get retweets    ****");
		if (err){
			console.log(err);
			throw "Get RT error";
		}
		console.log("Found retweets: " + docs.length);
		for (i in docs){
			retweeted.push(docs[i].id_str);
		//	console.log(docs[i]);
		}
		console.log(retweeted);
		if (typeof cb === 'function') cb();
		
		
	});
};

var server = new mongodb.Server(config.mongo.host, config.mongo.port, {});
new mongodb.Db(config.mongo.db, server, {}).open(function (error, client) {
	if (error){
		console.log(error);
		throw "Unable to connect to Mongo";
	}
	
	console.log("Conected to DB");
	col_tweets = new mongodb.Collection(client, 'tweets');
	mongo_client = client;
	
	twit.verifyCredentials(function (err, data) {
			console.log("****    credentials    ****");
			if (err) console.log(err);
			console.log(data);
			me = data;
			get_friends(function(){
				get_retweets(function(){
					start_retweeting();
				});
			});
		});
	
});
	
