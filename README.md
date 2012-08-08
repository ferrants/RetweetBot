RetweetBot
==========

Twitter Bot that follows based on a search and retweets important things said by its friends.

Uses nTwitter and MongoDB

You must have mongodb running somewhere (locally recommended)
Make a twitter account for your bot and go to https://dev.twitter.com/apps/new to make a new app
Fill in the config.js with the right information
	Be sure to add a term you like for the bot
Run `sh install.sh` to install the npm packages
Manually follow people or run the follow.js script with `node follow.js`, which will follow people based on the term used in app.term in config.js
Run retweet.js with `node retweet.js` to retweet popular things from the people you follow

