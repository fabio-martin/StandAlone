'use strict'

const Cinema = require('../model/cinema')
const Sessao = require('../model/sessao')
const Sala = require('../model/sala')
const getMovie = require('./movieService')
const express = require('express')



module.exports = function(repo){
    const app = express()
    const path = require('path')
    const hbs = require('hbs')
    
    app.set('view engine', 'hbs')
    app.set('views', path.join(__dirname, '/../views'))

    app.use(express.urlencoded({ extended: true }))

    app.get('/', (req, res) => {
        res.redirect(303, '/cinemas')
    })

    //Get the movie if doesn't exist or obtain the move from repo and send it.
    app.get('/movies/:id', (req, res) => {
        const id = Number(req.params.id)
        if (Number.isNaN(id))
            return res.sendStatus(400)

        repo.getMovie(id, (err, movie) => {
            if (err){
                getMovie(id, (err, movie) => {
                    if (err)
                        throw err;
                    repo.addMovie(movie)
                    res.format({
                        html: () => res.render('movie.hbs', {movie: movie}),
                        json: () => res.json(movie)
                    })
                })
            }
            else res.render('movie.hbs', {movie: movie})
        })
    })

    //create a cinema 
    app.post('/cinema', (req, res) => {
        const nome = req.body.name
        const cidade = req.body.city
        if (!nome || !cidade)
            return res.sendStatus(400)
        const cinema = new Cinema(nome, cidade)
        repo.addCinema(cinema)
        res.redirect(303, `${req.originalUrl}s`)
    })

    app.get('/cinemas', (req, res) => {
        repo.getCinemas((err, cinemas) => {
            if (err)
                throw err
                
            res.format({
                html: () => res.render('home.hbs', {cinemas: cinemas}),
                json: () => res.json(cinemas)
            })
        })
    })

    app.get('/cinema/:id/rooms', (req, res) => {
        const idCinema = Number(req.params.id)
        if (Number.isNaN(idCinema))
            return res.sendStatus(400)
        
        repo.getRooms(idCinema, (err, rooms) => {
            if (err)
                throw err
            if (rooms)
                rooms.forEach(element => element.idCine = idCinema);
            res.format({
                html: () => res.render('rooms.hbs', {rooms: rooms}),
                json: () => res.json(rooms)
            })
        })
    })

    app.post('/cinema/:id/room', (req, res) => {
        const idCinema = Number(req.params.id)
        const nome = req.body.name
        const nrdeFilas = Number(req.body.nrOfRows)
        const nrLugaresFila = Number(req.body.nrOfseatsRow)

        if (!idCinema || !nome || Number.isNaN(nrdeFilas) || Number.isNaN(nrLugaresFila) )
            return res.sendStatus(400)

        repo.getCinema(idCinema, (err, cinema) => {
            if (err)
                return res.sendStatus(400)
            const sala = new Sala(nome, nrdeFilas, nrLugaresFila)
            repo.addRoom(cinema, sala)
            res.redirect(303, `${req.originalUrl}s`)
        })
    })

    app.post('/cinema/:idCinema/room/:idRoom/session', (req, res) => {
        const idRoom = Number(req.params.idRoom)
        const idCinema = Number(req.params.idCinema)
        const idMovie = Number(req.body.idMovie)
        const date = new Date(req.body.date)

        if (!idRoom || !idCinema || Number.isNaN(idMovie) || !date)
            return res.sendStatus(400)

        repo.getRoom(idCinema, idRoom, (err, room) => {
            if (err)
                throw err
            repo.getMovie(idMovie, (err, movie) => {
                if (err)
                    throw err
                const session = new Sessao(movie, date)
                repo.addSession(room, session, (err) => {
                    if (err)
                        return res.sendStatus(400)
                    res.redirect(303, `${req.originalUrl}s`)
                }) 
            })
        })    
    })

    app.get('/cinema/:idCinema/room/:idRoom/sessions', (req, res) => {
        const idRoom = Number(req.params.idRoom)
        const idCinema = Number(req.params.idCinema)
        if (!idRoom || !idCinema)
            return res.sendStatus(400)

        repo.getSessions(idCinema, idRoom, (err, sessions) => {
            if (err)
                return res.sendStatus(400)

            res.format({
                html: () => res.render('session.hbs', {sessions: sessions}),
                json: () => res.json(sessions)
            })
        })
    })
    
    return app
}