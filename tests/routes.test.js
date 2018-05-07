'use strict'

const test = require('tape')
const request = require('supertest')

const routes = require('../src/routes/routes')
const Cinema = require('../src/model/cinema')
const Filme = require('../src/model/filme')
const Sala = require('../src/model/sala')
const Sessao = require('../src/model/sessao')
const repoFactory = require('../src/repo/repository')
const fakeRepos = require('./fakes/fake_repos')
const fakeUsersRepo = fakeRepos.createUsersRepo()

test('routes test: GET /movies/:id expecting 200', function(assert) {
    const repository = repoFactory()
    const path = __dirname;
    const app = routes(repository, fakeUsersRepo, __dirname)
    const movieId = 269149
    assert.plan(2)
    request(app)
        .get(`/movies/${movieId}`)
        .accept('application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
            assert.error(err, 'Assert that no errors occured.')
            const result = res.body
            assert.equal(result.id, movieId, 'The result is the expected.')
            assert.end()
        })
    
})

test('routes test: GET /movies/:id without query string', function(assert) {
    const repository = repoFactory()
    const app = routes(repository, fakeUsersRepo, __dirname)
    assert.plan(1)
    request(app)
        .get('/movies/moviesId')
        .expect(400)
        .end(function (err, res) {
            assert.error(err, 'Assert that no errors occured')
            assert.end()
        })
})

test('routes test: POST /cinema with invalid body', function(assert) {
    const repository = repoFactory()
    const app = routes(repository, fakeUsersRepo, __dirname)

    assert.plan(1)
    request(app)
        .post('/cinema')
        .expect(400)
        .end(function (err, res) {
            assert.error(err, 'Assert that no errors occured')
            assert.end()
        })
})

test('routes test: POST /cinema for new cinema (redirect)', function(assert) {
    const repository = repoFactory()
    const app = routes(repository, fakeUsersRepo, __dirname)

    const id = repository.__cinemas__.size + 1
    const cinName = 'Amenic'
    const cinCity = 'ytic'

    assert.plan(5)
    request(app)
        .post('/cinema')
        .type('form')
        .send({
            nome: cinName,
            cidade: cinCity
        })
        .expect(303)
        .redirects(0)
        .expect('Location', '/cinemas')
        .end(function (err, res) {
            assert.error(err, 'Assert that no errors occured.')
            repository.getCinema(id, (err, data) => {
                assert.error(err, 'Cinema info obtained.')
                assert.equal(data.id,  id, 'The Name is correct.')
                assert.equal(data.nome, cinName, 'The Name is correct.')
                assert.equal(data.cidade, cinCity, 'The City is correct.')
                assert.end()
            })
        })
})

test('routes test: GET /cinemas expecting 200', function(assert) {
    const repository = repoFactory()
    const app = routes(repository, fakeUsersRepo, __dirname)

    const cinema = new Cinema('Cinema Test', 'Cidade Test')
    repository.addCinema(cinema)

    assert.plan(4)
    request(app)
        .get('/cinemas')
        .accept('application/json')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end(function (err, res) {
            assert.error(err, 'Assert that no errors occured.')
            const arrayCine = res.body
            const cinemaRes = arrayCine[0]
            assert.equal(cinemaRes.id, cinema.id, 'The Id is the expected.')
            assert.equal(cinemaRes.name, cinema.name, 'The Name is the expected.')
            assert.equal(cinemaRes.cidade, cinema.cidade, 'The City is the expected.')
            assert.end()
        })
    
})

test('routes test: GET /cinema/:id/rooms without query string', function(assert) {
    const repository = repoFactory()
    const app = routes(repository, fakeUsersRepo, __dirname)

    assert.plan(1)
    request(app)
        .get('/cinema/:id/rooms')
        .expect(400)
        .end(function (err, res) {
            assert.error(err, 'Assert that no errors occured')
            assert.end()
        })
})

test('routes test: GET /cinema/:id/rooms expecting 200', function(assert) {
    const repository = repoFactory()
    const app = routes(repository, fakeUsersRepo, __dirname)

    const cinema = new Cinema('Cinema Test', 'City Test')
    const room = new Sala('Sala Test', 999, 999)
    repository.addCinema(cinema)
    repository.addRoom(cinema, room)

    assert.plan(5)
    request(app)
        .get(`/cinema/${cinema.id}/rooms`)
        .accept('application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end(function (err, res) {
            assert.error(err, 'Assert that no errors occured.')
            const roomsList = res.body
            const theRoom = roomsList[0]
            assert.equal(room.id, theRoom.id, 'The Id is the expected.')
            assert.equal(room.nome, theRoom.nome, 'The Name is the expected.')
            assert.equal(room.nrFila, theRoom.nrFila, 'The Number of Rows is the expected.')
            assert.equal(room.numLugaresFila, theRoom.numLugaresFila, 'The Number Of Seats per Row is the expected.')
            assert.end()
        })
})

test('routes test: POST /cinema/:id/room for new Room (redirect) ', function(assert) {
    const repository = repoFactory()
    const app = routes(repository, fakeUsersRepo, __dirname)

    const cinema = new Cinema('XXXX', 'City')
    repository.addCinema(cinema)

    const room = { nome: 'Sessao', nrFila: 20, numLugaresFila: 20 }

    assert.plan(5)
    request(app)
        .post(`/cinema/${cinema.id}/room`)
        .type('form')
        .send(room)
        .redirects(0)
        .expect(303)
        .end(function (err, res) {
            assert.error(err, 'Assert that no errors occured.')
            repository.getRooms(cinema.id, (err, data) => {
                const roomAct = data[0]

                assert.error(err, 'Room info obtained.')
                assert.equal(roomAct.nome,  room.nome, 'The Name is correct.')
                assert.equal(roomAct.nrdeFilas,  room.nrFilas, 'The nrOfRows is correct.')
                assert.equal(roomAct.nrLugaresFila,  room.nrLugaresFila, 'The nrOfseatsRow is correct.')
                assert.end()
            })
        })
})

test('routes test: POST /cinema/:id/room with invalid body', function(assert) {
    const repository = repoFactory()
    const app = routes(repository, fakeUsersRepo, __dirname)

    const cinema = new Cinema('XXXX', 'City')
    repository.addCinema(cinema)
    const cinemaId = 1

    assert.plan(1)
    request(app)
        .post(`/cinema/${cinemaId}/room`)
        .expect(400)
        .end(function (err, res) {
            assert.error(err, 'Assert that no errors occured')
            assert.end()
        })
})

test('routes test: POST /cinema/:id/room without query string', function(assert) {
    const repository = repoFactory()
    const app = routes(repository, fakeUsersRepo,__dirname)

    assert.plan(1)
    request(app)
        .post('/cinema/:id/room')
        .expect(400)
        .end(function (err, res) {
            assert.error(err, 'Assert that no errors occured')
            assert.end()
        })
})

test('routes test: POST /cinema/:idCinema/room/:idRoom/session with invalid body', function(assert) {
    const repository = repoFactory()
    const app = routes(repository, fakeUsersRepo, __dirname)

    const cinemaId = 1
    const roomId = 1

    assert.plan(1)
    request(app)
        .post(`/cinema/${cinemaId}/room/${roomId}/session`)
        .expect(400)
        .end(function (err, res) {
            assert.error(err, 'Assert that no errors occured')
            assert.end()
        })
})

test('routes test: POST /cinema/:idCinema/room/:idRoom/session without query string', function(assert) {
    const repository = repoFactory()
    const app = routes(repository, fakeUsersRepo, __dirname)


    assert.plan(1)
    request(app)
        .post('/cinema/:idCinema/room/:idRoom/session')
        .expect(400)
        .end(function (err, res) {
            assert.error(err, 'Assert that no errors occured')
            assert.end()
        })
})

test('routes test: POST /cinema/:idCinema/room/:idRoom/session for new Session', function(assert) {
    const repository = repoFactory()
    const app = routes(repository, fakeUsersRepo, __dirname)

    const cinema = new Cinema('XXXX', 'City')
    const room = new Sala('X123X', 99, 99)
    const movie = new Filme(99999, 'Sem titulo', '6666', 120)
    repository.addCinema(cinema)
    repository.addRoom(cinema, room)
    repository.addMovie(movie)

    const data = new Date('2018-02-02')
    const obj = {filme: movie,  data: data}

    assert.plan(4)
    request(app)
        .post(`/cinema/${cinema.id}/room/${room.id}/session`)
        .type('form')
        .send(obj)
        .redirects(0)
        .expect(303)
        .end(function (err, res) {
            assert.error(err, 'Assert that no errors occured.')
            repository.getSessions(cinema.id, room.id, (err, sessions) => {
                const sessionAct = sessions[0]
                const dateAct = Date.parse(sessionAct.data)
                const dataEx = Date.parse(data)

                assert.error(err, 'Session info obtained.')
                assert.equal( Number(sessionAct.filme.id), movie.id, 'The movies is correct.')
                assert.equal(dateAct, dataEx, 'The date is correct.')
                assert.end()
            })

        })
})

test('routes test: GET /cinema/:idCinema/room/:idRoom/sessions expecting 200', function(assert) {
    assert.plan(4)
    const repository = repoFactory()
    const app = routes(repository, fakeUsersRepo, __dirname)

    const movieId = 269149
    const movie = new Filme(1, 'Movie Test', '', 190)
    const cinema = new Cinema('Cinema Test', 'City Test')
    const room = new Sala('Sala Test', 999, 999)
    const session = new Sessao(movie, Date.now())
    repository.addCinema(cinema)
    repository.addRoom(cinema, room)
    
    repository.addSession(room, session,(err) => assert.notok(err))

    
    request(app)
        .get(`/cinema/${cinema.id}/room/${room.id}/sessions`)
        .accept('application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end(function (err, res) {
            const arraySessions = res.body
            const sessionExp = arraySessions[0]
            assert.equal(sessionExp.id, session.id, 'The Id is correct.')
            assert.equal(sessionExp.movie, session.movie, 'The Movie is correct.')
            assert.equal(sessionExp.data, session.data, 'The Data is correct.')
        })
})

test('routes test: GET /cinema/:idCinema/room/:idRoom/sessions without query string', function(assert) {
    const repository = repoFactory()
    const app = routes(repository, fakeUsersRepo, __dirname)

    assert.plan(1)
    request(app)
        .post('/cinema/:idCinema/room/:idRoom/session')
        .expect(400)
        .end(function (err, res) {
            assert.error(err, 'Assert that no errors occured')
            assert.end()
        })
})