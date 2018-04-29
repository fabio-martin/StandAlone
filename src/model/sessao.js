'use strict'

var id = 1

module.exports = function Sessao(filme, data){
    this.id = id++
    this.filme = filme
    this.data = data
}