'use strict'

var id = 1

module.exports = function Sala(nome, nrFila, numLugaresFila, sessoes){
    this.id = id++
    this.nome = nome
    this.nrFila = nrFila
    this.numLugaresFila = numLugaresFila
    if (!sessoes)
        this.sessoes = new Map()
    else this.sessoes = sessoes
}