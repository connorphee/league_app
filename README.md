# League of Legends stat tracker!


> A simple, but an Amazing and very Useful website to track League of Legends stats. — https://league-stat-tracker.herokuapp.com/

This application is intended to allow League of Legends players to track statistics for their gameplay, allowing them to improve their level of play by understanding at a deeper level what helps them succeed or causes them to fail. While there are some sites out there that allow for this already, this project is intended to be very user driven, to offer whatever is requested, and reasonable.

If there is something this app does not currently support that you would like to see, please submit an issue and we will see what can be done!

Please remember that the eventual goal of this app is to become approved by Riot games, the creator of League of Legends, so that we can leverage their APIs with granted keys, rather than temporary ones. When implementing any feature, try to remain aware of these [policies and regulations](https://developer.riotgames.com/policies.html).


## Current Features

* Match Tracking
* Single opponent matchups (i.e. The champion you played vs. your lane opponent, including KDA, and Win rate in that matchup)

## How to install

To install and run this app locally, follow these steps:
* Install MongoDB locally ([installing guide](https://docs.mongodb.com/manual/installation/))
* Fork the project
* Clone the repository to your computer
	 `git clone <your-github-account>/league-app`
* Move directories into your local copy of the project 
	`cd league-app`
* Install dependencies 
	`npm i`
* In the app.js file there is a line of code:
	`mongoose.connect(process.env.DB_URL);`
  This is how the project establishes a connection with a DB. You must create a file named `.env` at the
  root of the project and create a variable named process.env.DB_URL and assign it a value:
  `DB_URL=mongodb://<your-local-mongo-uri>/league-app`
* Run `node app.js` and find the project in your browser at localhost:8000

## How to contribute
Thank you for considering contributing to the League of Legends stat tracker, Please read our [contributing guide](CONTRIBUTING.md).

If you think anything is missing from this doc, or would like to add something, please create an issue and let us know! We want to make contributing as easy and painless as possible!

## License

League of Legends stat tracker is open-sourced software licensed under the [MIT License](LICENSE).
