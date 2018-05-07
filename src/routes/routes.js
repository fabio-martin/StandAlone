'use strict'

const Cinema = require('../model/cinema')
const Sessao = require('../model/sessao')
const Sala = require('../model/sala')
const getMovie = require('./movieService')
const express = require('express')

module.exports = function (repo, usersRepository,  root) {

    const app = express()
    const path = require('path')
    const hbs = require('hbs')
    

    const expressSession = require('express-session')({ secret: 'its a secret', resave: true, saveUninitialized: true })
    const passport = require('passport')
    const LocalStrategy = require('passport-local').Strategy


    app.set('view engine', 'hbs')
    app.set('views', path.join(root, '/views'))
    hbs.registerPartials(path.join(root, 'views', 'partials'))

    app.use('/otra', express.static(path.join(root, 'static')))



    app.use(express.urlencoded({ extended: true }))

    app.use(expressSession)
    app.use(passport.initialize())
    app.use(passport.session())
  
    passport.use(new LocalStrategy(
        function (username, password, done) {
          const user = usersRepository.verifyCredentials(username, password)
          return user ? done(null, user) : done(null, false)
        }
    ))
    
    const signInRoutes = {
        login: '/otra/login',
        logout: '/otra/logout'
      }

    app.get(signInRoutes.login, (req, res) => {
        const loginUrl = `${req.protocol}://${req.headers.host}${req.url}`
        res.render('login.hbs', {
            menuState: { signInRoutes, user: req.user},
            action: signInRoutes.login,
            failedAttempt: loginUrl === req.headers.referer
        })
    })

    app.get(signInRoutes.logout, (req, res) => { req.logout(); res.redirect('/otra/home') })

    app.post(signInRoutes.login,
      passport.authenticate('local', { failureRedirect: signInRoutes.login }),
      (req, res) => res.redirect('/otra/home')
    )
  
    passport.serializeUser((user, done) => { done(null, user) })
    passport.deserializeUser((id, done) => { done(null, id) })

    app.use((req, res, next) => {
        const oldEnd = res.end
        res.end = function (...args) {
            console.log(`Serviced ${req.method} ${req.originalUrl} with status code ${res.statusCode}`)
            return oldEnd.call(this, ...args)
        }
        next()
    })

    // Fazer o test do Repo e da Route 
    app.get('/otra/home', (req, res) => {
        res.render('home.hbs', { menuState: { home: 'active', signInRoutes, user: req.user} })
    })
    
    // Fazer o test do Repo e da Route 
    app.get('/movies', (req, res) => {
        repo.getMovies((err, movies) => {
            if (err)
                throw err

            res.format({
                html: () => res.render('movies.hbs', { movies: movies, 
                    menuState: { status: 'active', signInRoutes, user: req.user }
                }),
                json: () => res.json(movies)
            })
        })
    })

    //Get the movie if doesn't exist or obtain the move from repo and send it.
    app.get('/movies/:id', (req, res) => {
        const id = Number(req.params.id)
        if (Number.isNaN(id))
            return res.sendStatus(400)

        repo.getMovie(id, (err, movie) => {
            if (err) {
                getMovie(id, (err, movie) => {
                    if (err)
                        throw err;
                    repo.addMovie(movie)
                    res.format({
                        html: () => res.render('movie.hbs', { movie: movie,
                            menuState: { status: 'active', signInRoutes, user: req.user }
                         }),
                        json: () => res.json(movie)
                    })
                })
            }
            else res.render('movie.hbs', { 
                movie: movie, 
                menuState: { status: 'active', signInRoutes, user: req.user }
            })
        })
    })

    //create a cinema 
    app.post('/cinema', (req, res) => {

        const nome = req.body.nome
        const cidade = req.body.cidade
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
                html: () => res.render('cinemas.hbs', { 
                    cinemas: cinemas, 
                    menuState: { status: 'active', signInRoutes, user: req.user } 
                }),
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
                html: () => res.render('rooms.hbs', { 
                    rooms: rooms, 
                    menuState: { status: 'active', signInRoutes, user: req.user }
                }),
                json: () => res.json(rooms)
            })
        })
    })

    app.post('/cinema/:id/room', (req, res) => {
        const idCinema = Number(req.params.id)
        const nome = req.body.nome
        const nrdeFilas = Number(req.body.nrFila)
        const nrLugaresFila = Number(req.body.numLugaresFila)

        if (!idCinema || !nome || Number.isNaN(nrdeFilas) || Number.isNaN(nrLugaresFila))
            return res.sendStatus(400)

        repo.getCinema(idCinema, (err, cinema) => {
            if (err)
                return res.sendStatus(400)
            const sala = new Sala(nome, nrdeFilas, nrLugaresFila, null, idCinema)
            repo.addRoom(cinema, sala)
            res.redirect(303, `${req.originalUrl}s`)
        })
    })

    app.post('/cinema/:idCinema/room/:idRoom/session', (req, res) => {
        const idRoom = Number(req.params.idRoom)
        const idCinema = Number(req.params.idCinema)
        const filme = req.body.filme
        const data = new Date(req.body.data)

        if (!idRoom || !idCinema || !filme || !data)
            return res.sendStatus(400)

        repo.getRoom(idCinema, idRoom, (err, room) => {
            if (err)
                throw err

            const session = new Sessao(filme, data)
            repo.addSession(room, session, (err) => {
                if (err)
                    return res.sendStatus(400)
                res.redirect(303, `${req.originalUrl}s`)
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
                html: () => res.render('session.hbs', { sessions: sessions,
                    menuState: { status: 'active', signInRoutes, user: req.user }
                }),
                json: () => res.json(sessions)
            })
        })
    })

    return app
}