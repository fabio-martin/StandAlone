'use strict'

const Movie = require('./../model/filme')
const req = require('request')

const key = '8d3a500e709b7e1ff4c80b09bda127c4'

module.exports = {
    getMovie: getMovie,
    getNowPlaying: getNowPlaying
}


function getMovie(id, cb){

    const path = `https://api.themoviedb.org/3/movie/${id}?api_key=${key}`
    
    reqAsJson(path, (err, data) => {
        if (err)
            return cb(err)
        if (data.status_code = 34 && data.status_message){
            return cb(new Error(data.status_message))
        }
        const filme = new Movie(id, data.title, data.release_date, data.runtime, data.poster_path)
        cb(null, filme)
    })
}

function reqAsJson(path,cb) {
    req(path, (err, res, data) => {
        if(err) 
            return cb(err)
        const obj = JSON.parse(data.toString())
        cb(null, obj)
    })
}

function getNowPlaying(cb) {
    const path = `https://api.themoviedb.org/3/movie/now_playing?page=1&language=en-US&api_key=${key}`

    reqAsJson(path, (err, data) => {
        if (err)
            return cb(err)
        if (data.status_code = 34 && data.status_message)
            return cb(new Error(data.status_message))
        
        const result = data.results
        const movies = result.map(elem => new Movie(elem.id, elem.title, elem.release_date, elem.runtime, elem.poster_path))

        cb(null, movies)
    })
} 

function reqAsJson(path,cb) {
    req(path, (err, res, data) => {
        if(err) 
            return cb(err)
        const obj = JSON.parse(data.toString())
        cb(null, obj)
    })
}