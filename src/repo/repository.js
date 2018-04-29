'use strict'

const Cinema = require('../model/cinema')
const Sala = require('../model/sala')
const Filme = require('../model/filme')
const Sessao = require('../model/sessao')

module.exports = function createRepo(){
    var repoCinema = new Map()
    var repoMovie = new Map()

    return {

        __cinemas__: repoCinema,
        __movies__: repoMovie,

        addCinema: (cinema) => repoCinema.set(cinema.id, cinema),

        addMovie: (movie) => repoMovie.set(movie.id, movie),

        addRoom: (cinema, sala) => {
            cinema.salas.set(sala.id, sala)
        },

        addSession: (room, sessao, cb) => {
            var error = null
            room.sessoes.forEach(roomSession => {
                if (roomSession.data == sessao.data)
                    error = new Error('Room already has a session for that hour...')
            })
            if(!error)
                room.sessoes.set(sessao.id, sessao)
            cb(error)
        },

        //Get the object with respective Id
        getCinema: (id, cb) => {
            const cinema = repoCinema.get(id)
            if (!cinema)
                return cb(new Error(`Cinema (${id}) doesn't found ...`))
            cb(null, cinema)
        },
        
        getMovie: (id, cb) => {
            const movie = repoMovie.get(id)
            if (!movie)
                return cb(new Error(`Movie (${id}) doesn't found ...`))
            cb(null, movie)
        },

        getRoom: (idCinema, idRoom, cb) => {
            const cinema = repoCinema.get(idCinema)
            if (!cinema)
                return cb(new Error(`Cinema (${idCinema}) doesn't found ...`))
            
            const room = cinema.salas.get(idRoom)
            if (!room)
                return cb(new Error(`Room (${idRoom}) doesn't found ...`))
            cb(null, room)
        },

        getSession: (idCinema, idRoom, idSession, cb) => {
            const cinema = repoCinema.get(idCinema)
            if (!cinema)
                return cb(new Error(`Cinema (${idCinema}) doesn't found ...`))
            
            const room = cinema.salas.get(idRoom)
            if (!room)
                return cb(new Error(`Room (${idRoom}) doesn't found ...`))

            const session = room.sessoes.get(idSession)
            if (!session)
                return cb(new Error(`Session (${idSession}) doesn't found ...`))
            cb(null, session)
        },

        //Get all the objects without restriction
        getMovies: (cb) => cb(null, Array.from(repoMovie.values())),

        getCinemas: (cb) => cb(null, Array.from(repoCinema.values())),

        getRooms: (idCinema, cb) => {
            const cinema = repoCinema.get(idCinema)
            if (!cinema)
                return cb(new Error(`Cinema (${idCinema}) doesn't found ...`))

            cb(null, Array.from(cinema.salas.values()))
        },

        getSessions: (idCinema, idRoom, cb) => {
            const cinema = repoCinema.get(idCinema)
            if (!cinema)
                return cb(new Error(`Cinema (${idCinema}) doesn't found ...`))
            
            const room = cinema.salas.get(idRoom)
            if (!room)
                return cb(new Error(`Room (${idRoom}) doesn't found ...`))

            cb(null, Array.from(room.sessoes.values()))
        }

    }
}
