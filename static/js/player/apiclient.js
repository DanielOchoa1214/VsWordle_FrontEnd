let apiclient = (function (){
    // Atributos
    let _publicFunctions = {};
    let _server = enviroment.local;

    // Funciones privadas

    // Funciones publicas
    _publicFunctions.getWord = function (round) {
        return $.ajax({
            url: `${_server}/palabras/${round}`,
            type: 'GET',
        });
    };

    _publicFunctions.checkWord = function (palabra, round, nickname) {
        return $.ajax({
            url: `${_server}/palabras/`,
            type: 'GET',
            data: {
                palabra: palabra,
                round: round,
                nickname: nickname,
            },
            contentType: "application/json",
        });
    };

    _publicFunctions.joinGame = function (nickname) {
        return $.ajax({
            url: `${_server}/lobbies`,
            type: 'POST',
            data: JSON.stringify({
                nickname: nickname,
            }),
            contentType: "application/json"
        });
    }

    _publicFunctions.missingPlayers = function (host) {
        return $.ajax({
            url: `${_server}/lobbies/players/missing`,
            type: 'GET',
            data: {
                host: host,
            },
            contentType: "application/json"
        });
    }
    return _publicFunctions;
})();