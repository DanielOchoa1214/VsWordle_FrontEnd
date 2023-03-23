let apiclient = (function (){
    // Atributos
    let _publicFunctions = {};
    let _server = enviroment.local;

    // Funciones privadas

    // Funciones publicas
    _publicFunctions.getWord = function (round) {
        return $.ajax({
            url: `${_server}/word/${round}`,
            type: 'GET',
        });
    };

    return _publicFunctions;
})();