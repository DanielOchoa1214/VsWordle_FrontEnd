let apimock = (function (){
    // Atributos
    let words = ["hola", "como", "estas", "compañeros"]
    let _publicFunctions = {};

    // Funciones privadas

    // Funciones publicas
    _publicFunctions.getWord = function (round) {
        return words[round];
    }

    _publicFunctions.checkLetter = function (letterPos, round, letter, nickname) {  
        return [...words[round]][letterPos] === letter;
    };

    return _publicFunctions;
})();