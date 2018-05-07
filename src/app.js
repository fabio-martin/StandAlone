'use strict'

/**
 * Entry point that starts the server at a given port.
 * 
 * @module app
 */
main(process.argv[2])

/**
 * The application's entry point.
 * @param {string?} port - Optionaly, the port where the server will accept requests
 */


 function main(port) {

    port = 8080
    const movieRoute = require('./routes/routes')
    const repo = require('./repo/repository')()
    const path = require('path')
  //  const dbFile = 'db.json'
    const usersDbFile = '../users_db.json'
    const usersRepo = require('./repo/users_repo')(path.join(__dirname, usersDbFile))
   // repo.setRepo(dbFile);

    
    movieRoute(repo, usersRepo, __dirname).listen(port)
    console.log(`Server is listening on port ${port}`)

 }
