RetweetBot
==========

Twitter Bot that follows based on a search and retweets important things said by its friends.

Uses nTwitter and MongoDB


### Run Steps
1. You must have mongodb running somewhere (locally recommended)
2. Make a twitter account for your bot and go to https://dev.twitter.com/apps/new to make a new app
3. Fill in the config.js with the right information
	* Be sure to add a term you like for the bot
4. Run `./install.sh` to install the npm packages
5. Manually follow people or run the follow.js script with `node follow.js`, which will follow people based on the term used in app.term in config.js
6. Run retweet.js with `node retweet.js` to retweet popular things from the people you follow
7. If you feel comfortable with what it says it would retweet, enable retweeting at app.retweet in config.js

### Persistance
To run it persistantly, get running on a computer you do not turn off.
To run in the background and log to a log file, run `./start.sh`

