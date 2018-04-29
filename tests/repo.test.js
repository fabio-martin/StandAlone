'use strict'

const test = require('tape')
const repoFactory = require('../src/repo/repository')
const Cinema = require('../src/model/cinema')
const Sala = require('../src/model/sala')
const Filme = require('../src/model/filme')
const Sessao = require('../src/model/sessao')


test('repo test: test AddMovie', (assert) => {
    const planned = new Filme(1, 'ok', 2005, 50)
    const repository = repoFactory()
    repository.addMovie(planned)
    assert.plan(5)
    repository.getMovie(planned.id, (err, movie) => {
        assert.error(err, 'ok')
        assert.equal(planned.id, movie.id, 'Id Igual')
        assert.equal(planned.title, movie.title)
        assert.equal(planned.releaseYear, movie.releaseYear)
        assert.equal(planned.duration, movie.duration)
    })
})
test('repo test: test GetMovie with Invalid ID', (assert) => {
    const planned = new Filme(1, 'ok', 2005, 50)
    const repository = repoFactory()
    repository.addMovie(planned)
    assert.plan(1)
    repository.getMovie(planned.id+1, (err, movie) => {
        assert.ok(err)
    })
})

test('repo test: test AddCinema', (assert) => {
    const planned = new Cinema('cinema1', 'Lisboa')
    const repository = repoFactory()
    repository.addCinema(planned)
    assert.plan(5)
    repository.getCinema(planned.id, (err, cinema) => {
        assert.error(err, 'ok')
        assert.equal(planned.id, cinema.id, 'Id Igual')
        assert.equal(planned.nome, cinema.nome)
        assert.equal(planned.cidade, cinema.cidade)
        assert.equal(planned.salas, cinema.salas)
    })
})
test('repo test: test GetCinema with Invalid ID', (assert) => {
    const planned = new Cinema('cinema1', 'Lisboa')
    const repository = repoFactory()
    repository.addCinema(planned)
    assert.plan(1)
    repository.getCinema(planned.id+1, (err, cinema) => {
        assert.ok(err)
    })
})

test('repo test: test AddRooms without Sessions', (assert) => {
    const plannedC = new Cinema('cinema1', 'Lisboa')
    const plannedR = new Sala('Sala1', 3, 4)
    const repository = repoFactory()
    repository.addCinema(plannedC)
    repository.addRoom(plannedC, plannedR)
    assert.plan(6)
    repository.getRoom(plannedC.id, plannedR.id, (err, room) => {
        assert.error(err, 'ok')
        assert.equal(plannedR.id, room.id)
        assert.equal(plannedR.nome, room.nome)
        assert.equal(plannedR.nrFila, room.nrFila)
        assert.equal(plannedR.numLugaresFila, room.numLugaresFila)
        assert.equal(plannedR.sessoes, room.sessoes)
    })
})
test('repo test: test GetRoom with InvalidCinemaID', (assert) => {
    const plannedC = new Cinema('cinema1', 'Lisboa')
    const plannedR = new Sala('Sala1', 3, 4)
    const repository = repoFactory()
    repository.addCinema(plannedC)
    repository.addRoom(plannedC, plannedR)
    assert.plan(1)
    repository.getRoom(plannedC.id+1, plannedR.id, (err, room) => {
        assert.ok(err)
    })
})
test('repo test: test GetRoom with InvalidRoomID', (assert) => {
    const plannedC = new Cinema('cinema1', 'Lisboa')
    const plannedR = new Sala('Sala1', 3, 4)
    const repository = repoFactory()
    repository.addCinema(plannedC)
    repository.addRoom(plannedC, plannedR)
    assert.plan(1)
    repository.getRoom(plannedC.id, plannedR.id+1, (err, room) => {
        assert.ok(err)
    })
})

test('repo test: test AddSession', (assert) => {
    const plannedC = new Cinema('cinema1', 'Lisboa')
    const plannedR = new Sala('Sala1', 3, 4)
    const plannedF = new Filme(1, 'TITULO1', 2005, 120)
    const plannedS = new Sessao(plannedF, new Date())
    const repository = repoFactory()
    repository.addCinema(plannedC)
    repository.addRoom(plannedC, plannedR)
    repository.addSession(plannedR, plannedS, (error) => {
        assert.plan(5)
        assert.error(error, 'ok')
        repository.getSession(plannedC.id, plannedR.id, plannedS.id, (err, sessao) => {
            assert.error(err, 'ok')
            assert.equal(plannedS.id, sessao.id)
            assert.equal(plannedS.filme, sessao.filme)
            assert.equal(plannedS.data, sessao.data)
        })
    })
})
test('repo test: test GetSession with InvalidCinemaID', (assert) => {
    const plannedC = new Cinema('cinema1', 'Lisboa')
    const plannedR = new Sala('Sala1', 3, 4)
    const plannedF = new Filme(1, 'TITULO1', 2005, 120)
    const plannedS = new Sessao(plannedF, new Date())
    const repository = repoFactory()
    repository.addCinema(plannedC)
    repository.addRoom(plannedC, plannedR)
    repository.addSession(plannedR, plannedS, (error) => {
        assert.plan(2)
        assert.error(error, 'ok')
        repository.getSession(plannedC.id+1, plannedR.id, plannedS.id, (err, sessao) => {
            assert.ok(err)
        })
    })
})
test('repo test: test GetSession with InvalidRoomID', (assert) => {
    const plannedC = new Cinema('cinema1', 'Lisboa')
    const plannedR = new Sala('Sala1', 3, 4)
    const plannedF = new Filme(1, 'TITULO1', 2005, 120)
    const plannedS = new Sessao(plannedF, new Date())
    const repository = repoFactory()
    repository.addCinema(plannedC)
    repository.addRoom(plannedC, plannedR)
    repository.addSession(plannedR, plannedS, (error) => {
        assert.plan(2)
        assert.error(error, 'ok')
        repository.getSession(plannedC.id, plannedR.id+1, plannedS.id, (err, sessao) => {
            assert.ok(err)
        })
    })
})
test('repo test: test GetSession with InvalidSessionID', (assert) => {
    const plannedC = new Cinema('cinema1', 'Lisboa')
    const plannedR = new Sala('Sala1', 3, 4)
    const plannedF = new Filme(1, 'TITULO1', 2005, 120)
    const plannedS = new Sessao(plannedF, new Date())
    const repository = repoFactory()
    repository.addCinema(plannedC)
    repository.addRoom(plannedC, plannedR)
    repository.addSession(plannedR, plannedS, (error) => {
        assert.plan(2)
        assert.error(error, 'ok')
        repository.getSession(plannedC.id, plannedR.id, plannedS.id+1, (err, sessao) => {
            assert.ok(err)
        })
    })
})

test('repo test: test GetCinema with empty repo', (assert) => {
    assert.plan(1)
    const repository = repoFactory()
    repository.getCinema(1, (err, date) => assert.ok(err))
})
test('repo test: test GetMovie with empty repo', (assert) => {
    assert.plan(1)
    const repository = repoFactory()
    repository.getMovie(1, (err, date) => assert.ok(err))
})
test('repo test: test GetRoom with empty repo', (assert) => {
    assert.plan(1)
    const repository = repoFactory()
    repository.getRoom(1, 1, (err, date) => assert.ok(err))
})

test('repo test: test GetSession with empty repo', (assert) => {
    assert.plan(1)
    const repository = repoFactory()
    repository.getSession(1, 1, 1, (err, date) => assert.ok(err))
})

test('repo test: test GetCinemas', (assert) => {
    const planned = [new Cinema('cinema1', 'chelas'), new Cinema('cinema2', 'lisboa'), new Cinema('cinema3', 'porto')]
    const repository = repoFactory()
    planned.forEach(it => repository.addCinema(it))
    repository.getCinemas((err, cinemas) => {
        assert.error(err)
        assert.equals(planned.length, cinemas.length)
        for (let index = 0; index < planned.length; index++) {
            const e1 = planned[index];
            const e2 = cinemas[index];
            assert.equals(e1.id, e2.id)
            assert.equals(e1.cidade, e2.cidade)
            assert.equals(e1.nome, e2.nome)
            assert.equals(e1.salas, e2.salas)
        }
        assert.end()
    })
})

test('repo test: test GetRooms', (assert) => {
    const plannedC = new Cinema('cinema1', 'chelas')
    const planned = [new Sala('sala1',3,4),new Sala('sala1',3,4),new Sala('sala1',3,4)]
    const repository = repoFactory()
    repository.addCinema(plannedC)
    planned.forEach(it => repository.addRoom(plannedC,it))
    repository.getRooms(plannedC.id,(err, rooms) => {
        assert.error(err)
        assert.equals(planned.length, rooms.length)
        for (let index = 0; index < planned.length; index++) {
            const e1 = planned[index];
            const e2 = rooms[index];
            assert.equals(e1.id,e2.id)
            assert.equals(e1.nome,e2.nome)
            assert.equals(e1.nrFila,e2.nrFila)
            assert.equals(e1.numLugaresFila,e2.numLugaresFila)
            assert.equals(e1.sessoes,e2.sessoes)
        }
        assert.end()
    })
})
test('repo test: test GetRooms with invalid CinemaID', (assert) => {
    const plannedC = new Cinema('cinema1', 'chelas')
    const planned = [new Sala('sala1',3,4),new Sala('sala1',3,4),new Sala('sala1',3,4)]
    const repository = repoFactory()
    repository.addCinema(plannedC)
    planned.forEach(it => repository.addRoom(plannedC,it))
    repository.getRooms(plannedC.id+1,(err, rooms) => {
        assert.ok(err)
        assert.end()
    })
})

test('repo test: test GetSessions', (assert) => {
    const plannedC = new Cinema('cinema1', 'chelas')
    const plannedR = new Sala('sala1',3,4)
    const planned = [new Sessao(null,new Date()),new Sessao(null,new Date()),new Sessao(null,new Date())]
    const repository = repoFactory()
    repository.addCinema(plannedC)
    repository.addRoom(plannedC,plannedR)
    planned.forEach(it => repository.addSession(plannedR,it,(err)=>{assert.error(err)}))
    repository.getSessions(plannedC.id,plannedR.id,(err, sessions) => {
        assert.error(err)
        assert.equals(planned.length, sessions.length)
        for (let index = 0; index < planned.length; index++) {
            const e1 = planned[index];
            const e2 = sessions[index];
            assert.equals(e1.id,e2.id)
            assert.equals(e1.filme,e2.filme)
            assert.equals(e1.data,e2.data)
        }
        assert.end()
    })
})

test('repo test: test GetSessions with invalid CinemaID', (assert) => {
    const plannedC = new Cinema('cinema1', 'chelas')
    const plannedR = new Sala('sala1',3,4)
    const planned = [new Sessao(null,new Date()),new Sessao(null,new Date()),new Sessao(null,new Date())]
    const repository = repoFactory()
    repository.addCinema(plannedC)
    repository.addRoom(plannedC,plannedR)
    planned.forEach(it => repository.addSession(plannedR,it,(err)=>{assert.error(err)}))
    repository.getSessions(plannedC.id+1,plannedR.id,(err, sessions) => {
        assert.ok(err)
        assert.end()
    })
})
test('repo test: test GetSessions with invalid roomID', (assert) => {
    const plannedC = new Cinema('cinema1', 'chelas')
    const plannedR = new Sala('sala1',3,4)
    const planned = [new Sessao(null,new Date()),new Sessao(null,new Date()),new Sessao(null,new Date())]
    const repository = repoFactory()
    repository.addCinema(plannedC)
    repository.addRoom(plannedC,plannedR)
    planned.forEach(it => repository.addSession(plannedR,it,(err)=>{assert.error(err)}))
    repository.getSessions(plannedC.id,plannedR.id+1,(err, sessions) => {
        assert.ok(err)
        assert.end()
    })
})

test('repo test: test GetMovies', (assert) => {
    
    const planned = [new Filme(1,'titulo1',2001,120),new Filme(2,'titulo2',2008,180),new Filme(3,'titulo3',2005,100)]
    const repository = repoFactory()
    planned.forEach(it => repository.addMovie(it))
    repository.getMovies((err, filmes) => {
        assert.error(err)
        assert.equals(planned.length, filmes.length)
        for (let index = 0; index < planned.length; index++) {
            const e1 = planned[index];
            const e2 = filmes[index];
            assert.equals(e1.id,e2.id)
            assert.equals(e1.titulo,e2.titulo)
            assert.equals(e1.anoPublicacao,e1.anoPublicacao)
            assert.equals( e1.duracao,e2.duracao)
        }
        assert.end()
    })
})