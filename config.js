//	Twitter auth information
this.twitter_auth = {
		consumer_key: 'MY_CONSUMER_KEY',
		consumer_secret: 'MY_CONSUMER_SECRET',
		access_token_key: 'MY_ACCESS_TOKEN_KEY',
		access_token_secret: 'MY_ACCESS_TOKEN_KEY'
	};
//	Mongo DB info
this.mongo = {
		host: '127.0.0.1',	// Your Mongo DB Hostname
		port: 27017,	// Your Mongo DB Port
		db: 'mybot' // Your Mongo DB Name
	};
//	App Info
this.app = {
	friend: false,	// Whether or not to follow when running follow.js
	term: "olympics",	// The Term to use when deciding who to follow if doing auto-follow with rollow.js
	tweet: false,	// Whether or not to tweet when running retweet.js
	start: "Fri Aug 5  00:00:00 +0000 2012",	//	Date before which nothing should be tweeted
	ratio_limit: 1,	//	If tweeting too much stupid stuff, raise this. Ratio of retweets to how old it is
	tweet_interval: 300000, // checks to see if it should tweet every this many miliseconds
	retweet_threshold: 25 // how many retweets before it's considered
}
