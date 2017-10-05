# Contributing (WIP)

When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change. 

## Setup

To set this project up locally:
* Fork the project
* `git clone <your github username>/league-app`
* `cd league-app`
* `npm i`

You must also have a local MongoDB instance, the directions to install this can be found here:

https://docs.mongodb.com/manual/installation/

Once you have a local MongoDB instance, you must then either replace the

`process.env.DB_URL`

parameter with your DB url, or create a .env file in the root of your project and place your DB url there like this:


`DB_URL=mongodb://<your-local-connection-here>`

Once this is done, you should be able to run 

`node app.js`

and see the project at localhost:8000 in your browser.

*** This is a very raw WIP and will be improved very soon, hopefully by end of day (10/5)!! ***