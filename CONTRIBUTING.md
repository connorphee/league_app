# Contributing (WIP)

Contributions are always welcome! This includes suggestions for new features, changes in the direction
of the app, and anything in between. If you are looking to contribute, and feel something could be done
in a better way using something outside of the stack in this project, feel free to bring it up! We are by no
means tied down to Node/Express/EJS etc.. We just want to create the best stuff we can!

## Before you create a PR…
Please [create an issue](https://github.com/connorphee/league-app/issues) first to discuss your idea with the maintainer(s). After we've chatted things through, go ahead with your work and send over a PR.

## Branches
Please create a feature branch with your changes in the format: `[fix/feature/etc]/[description]` -- this helps to gauge what the branch is for later on.


### How to install

To install and run this app locally, follow these steps:
* Install MongoDB locally https://docs.mongodb.com/manual/installation/
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
and see the project at localhost:8000 in your browser.

If you think anything is missing from this doc, or would like to add something, please create an issue and let us know! We want to make contributing as easy and painless as possible!
