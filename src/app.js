'use strict'

const port = 8080
const movieRoute = require('./routes/routes')
const repo = require('./repo/repository')()

movieRoute(repo).listen(port)
console.log(`Server is listening on port ${port}`)
