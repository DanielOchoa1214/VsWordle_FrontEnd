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

    return _publicFunctions;
})();