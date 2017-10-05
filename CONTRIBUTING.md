# Contributing (WIP)

## Setup

To set this project up locally:
* Fork the project
* `git clone [your forked repo url]`
* `cd [new directory]`
* `npm i`

You must also have a local MongoDB instance, the directions to install this can be found here:

https://docs.mongodb.com/manual/installation/

Once you have a local MongoDB instance, you must then either replace the

`process.env.DB_URL`

parameter with your DB url, or create a matching env variable locally.

Once this is done, you should be able to run 

`node app.js`

and see the project at localhost:8000 in your browser.

*** This is a very raw WIP and will be improved very soon, hopefully by end of day (10/5)!! ***