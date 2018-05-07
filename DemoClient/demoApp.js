'use strict'

/**
 * Entry point creates a set of cinemas according to the info contained in the given config file.
 * The full path of the configuration file is specified as a command line argument. The configuration
 * is specified using JSON as literal of @type {PatientConfig[]}
 * The second comand line argument is the endpoint of the cinema app   (e.g. http://localhost:8080)
 *
 * @module demoApp.main
 */

main(process.argv[2], process.argv[3])


function setCinemas(configInfo, cinemaAppUrl) { 

    const request = require('request-promise')
    const Cinema = require('../src/model/cinema')
    const Sala = require('../src/model/sala')
    const Filme = require('../src/model/filme')
    const Sessao = require('../src/model/sessao')

    const cinemas = configInfo.Cinemas.map( element => new Cinema(element.Nome, element.Cidade))
    const salas = configInfo.Salas.map(element => new Sala(element.nome, element.nrFila, element.numLugaresFila)) 
    const sessoes = configInfo.Sessoes.map(element => new Sessao(element.filme, element.data)) 
    const filmes = configInfo.Filmes.map(element => 
        new Filme(element.id, element.titulo,element.anoPublicacao, element.duracao,element.poster_path))
    
    filmes.forEach( function(filme, index)  { 
           sessoes[index].filme = filme
    })
    
    cinemas.forEach( (cinema) => { 
         postCinema(cinemaAppUrl,cinema)
         postSalas(cinemaAppUrl, cinema, salas)
         postSessoes(cinemaAppUrl, cinema, salas, sessoes)
    })

    filmes.forEach( filme => postFilme(cinemaAppUrl, filme))
}

function postFilme(cinemaAppUrl, filme) { 
    const request = require('request')

    const options = { 
        url: cinemaAppUrl + `/movies/${filme.id}`,
        method : 'GET',
        headers : { 
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8',
        }

    }
    request.get(options, function(err, res, body) {
        if(err)
            return err   
    })
}

function postCinema(cinemaAppUrl,  cinema) { 
    post({
        url: cinemaAppUrl + '/cinema',
        form:
            {
                nome: cinema.nome,
                cidade: cinema.cidade
            }
    })
}

function postSalas(cinemaAppUrl,  cinema, salas) { 
    salas.forEach( sala => {
        post({
            url: cinemaAppUrl + `/cinema/${cinema.id}/room`,    
            form:
                {
                    nome: sala.nome,
                    idCinema: cinema.id,
                    nrFila: sala.nrFila,
                    numLugaresFila: sala.numLugaresFila
                }
        })
    })

}

function postSessoes(cinemaAppUrl,cinema, salas, sessoes) { 
    
    const request = require('request')
    const Sala = require('../src/model/sala')

    const options = { 
        url: cinemaAppUrl + `/cinema/${cinema.id}/rooms`,
        method : 'GET',
        headers : { 
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8',
        }

    }
    function getSalasInCinema(cb) {
        request(options, function(err, res, body) {
            if(err)
                return err
            cb(null, JSON.parse(body))       
        })
    }

    function setSalas (err,  salas)  { 
        if(err)
            return err
        
        salas.forEach( sala => { 
            sessoes.forEach( sessao => { 
                postSessao(cinemaAppUrl, cinema, sala, sessao)
            })
        })
    }

    getSalasInCinema(setSalas);
}

function postSessao(cinemaAppUrl, cinema, sala, sessao) { 
    post({ 
        url: cinemaAppUrl + `/cinema/${cinema.id}/room/${sala.id}/session`,
        form: { 
            filme: sessao.filme,
            data: sessao.data
        }
    })
}

function post(options) { 
    const request = require('request')
    request.post(options)
}


/**
 * The application's entry point.
 * @param {string} configFilePath - The fully qualified name of the configuration file.
 * @param {string} cinemaAppUrl - The absolute URL to where heartbeats will be sent.
 */
function main (configFilePath, cinemaAppUrl) {
    const fs = require('fs')
  
    if (!configFilePath || !fs.existsSync(configFilePath)) {
      console.error(`Could not find file ${configFilePath}`)
      console.error('Usage: node app <configFilePath>')
      return
    }
  
    const configInfo = require(configFilePath)
    setCinemas(configInfo, cinemaAppUrl)
}