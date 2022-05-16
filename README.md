# NestJS Election API

A demo simple election api, dockerized and ready to run.

## Language and Framework

The api was developed with NestJS using TypeScript.

## Database

MySQL database.

## Description of Features

Features 
* All APIs were developed and tested on localhost:3000.
* Implemented APIs as listed below:
  * GET Candidates
  * GET Candidate Detail
  * POST create a New Candidate
  * PUT Update a Candidate
  * DELETE Delete a Candidate
  * POST Check Vote Status
  * POST Vote (including real-time vote count stream with socket.io)
    * Socket emit event was tested using postman's websocket request feature, connects at http://localhost:3030.  
  * POST Toggle Election
  * GET Election Result
  * GET Exported Result (download a .csv file)
* All APIs, except for signup and login are authenticated via Bearer token.
* Unit tests were done using NestJS generated .spec files.

## Setup and Installation

With Docker
* To make setting up and running the project easy, it has been dockerized with the .env, Dockerfile and docker-compose.yaml configured and ready.
* Using a terminal, cd to docker-nestjs-election-api directory.
* Type the command ``docker compose up`` and docker should get everything up and running.

Without Docker
* In case docker is not available or the above method did not work, the project can be set up manually:
* Using a terminal, cd to docker-nestjs-election-api directory.
* ``npm install`` to install the dependencies
* If MySQL is not installed, please follow the instructions on [MySQL Documentation](https://dev.mysql.com/doc/mysql-installation-excerpt/5.7/en/) to install it.
* Restore initial database with ``initial-election-database.sql`` which can be found in the sql folder at the project root directory.
* Change .env file's ``DB_NAME``, ``DB_PORT``, ``DB_USERNAME`` and, ``DB_PASSWORD`` to reflect the locally install MySQL configurations. 
* Run the project with ``npm run start`` command.