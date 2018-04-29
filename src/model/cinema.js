'use strict'

var id = 1

module.exports = function Cinema(nome, cidade, salas){
    this.id = id++
    this.nome = nome
    this.cidade = cidade
    if (!salas)
        this.salas = new Map()
    else this.salas = salas
}