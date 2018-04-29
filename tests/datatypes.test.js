'use strict'

const test = require('tape')
const cinema = require('../src/model/cinema')
const filme = require('../src/model/filme')
const sala = require('../src/model/sala')
const sessao = require('../src/model/sessao')

test('datatypes.cinema test: constructor function called with all parameters \
initializes instances correctly', (assert) => {
    
    const expectedId = 1
    const expectedName = 'The name'
    const expectedCity = 'City'
    

    const sut = new cinema(expectedName, expectedCity)

    assert.equal(sut.id, expectedId)
    assert.equal(sut.nome, expectedName)
    assert.equal(sut.cidade, expectedCity)
    assert.end()
})


test('datatypes.filme test: constructor function called with all parameters \
initializes instances correctly', (assert) => {
    
    const expectedId = 1
    const expectedTitle = 'The Title'
    const expectedReleaseYear = 'The year'
    const expectedDuration = 60

    const sut = new filme(expectedId, expectedTitle, expectedReleaseYear, expectedDuration)

    assert.equal(sut.id, expectedId)
    assert.equal(sut.titulo, expectedTitle)
    assert.equal(sut.anoPublicacao, expectedReleaseYear)
    assert.equal(sut.duracao, expectedDuration)
    assert.end()
})

test('datatypes.sala test: constructor function called with all parameters \
initializes instances correctly', (assert) => {
    
    const expectedId = 1
    const expectedName = "The Name"
    const expectedNrRows = 3
    const expectedNrOfSeatsPerRow = 3

    const sut = new sala(expectedName, expectedNrRows, expectedNrOfSeatsPerRow)

    assert.equal(sut.id, expectedId)
    assert.equal(sut.nome, expectedName)
    assert.equal(sut.nrFila, expectedNrRows)
    assert.equal(sut.numLugaresFila, expectedNrOfSeatsPerRow)
    assert.end()

})

test('datatypes.sessao test: constructor function called with all parameters \
initializes instances correctly', (assert) => {
    
    const expectedId = 1
    const expectedMovie = "The Movie"
    const expectedDate = "10-10-2017"
    
    const sut = new sessao(expectedMovie, expectedDate)

    assert.equal(sut.id, expectedId)
    assert.equal(sut.filme, expectedMovie)
    assert.equal(sut.data, expectedDate)
    assert.end()

})
