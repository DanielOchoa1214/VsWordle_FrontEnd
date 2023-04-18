let playerclient = (function (){
    // Atributos
    let _publicFunctions = {};
    let _server = enviroment.local;

    // Funciones privadas

    // Funciones publicas
    _publicFunctions.getWord = function (round, lobbyId) {
        return $.ajax({
            url: `${_server}/lobbies/${lobbyId}/palabras/${round}`,
            type: 'GET',
        });
    };

    _publicFunctions.checkWord = function (palabra, round, nickname, lobbyId) {
        return $.ajax({
            url: `${_server}/lobbies/${lobbyId}/palabras/`,
            type: 'GET',
            data: {
                palabra: palabra,
                round: round,
                nickname: nickname,
            },
            contentType: "application/json",
        });
    };

    _publicFunctions.missingPlayers = function (host, lobbyId) {
        return $.ajax({
            url: `${_server}/lobbies/${lobbyId}/players/missing`,
            type: 'GET',
            data: {
                host: host,
            },
            contentType: "application/json",
        });
    };

    _publicFunctions.getPlayers = function (lobbyId) {  
        return $.ajax({
            url: `${_server}/lobbies/${lobbyId}/players`,
            type: 'GET',
        });
    };

    
    _publicFunctions.startGame = function (lobbyId) {
        return $.ajax({
            url: `${_server}/lobbies/${lobbyId}/startGame`,
            type: 'PUT',
        });
    };

    _publicFunctions.getHost = function (lobbyId) {  
        return $.ajax({
            url: `${_server}/lobbies/${lobbyId}/host`,
            type: 'GET',
        })
    };

    return _publicFunctions;
})();