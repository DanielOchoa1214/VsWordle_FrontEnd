let player = (function (api) {
    // Atributos
    let _publicFunctions = {};
    let _wordInput = $("#word-input");
    let _round = 3;
    let _nickname = "";
    let _previousMistake = false;

    // Funciones privadas
    let _renderWord = (round) => {
        let currentWord = api.getWord(round);
        let markup = "";
        let letterPos = 0;
        [...currentWord].forEach(letter => {
            markup = markup.concat(`<span data-letter-pos="${letterPos}">${letter}</span>\n`)
            letterPos++;
        });
        $("#word").html(markup);
    };

    let _checkLetter = () => {
        console.log( _wordInput.val());
        let letterPos = _wordInput.val().length - 1;
        let letter = _wordInput.val().slice(-1);
        if(api.checkLetter(letterPos, _round, letter, _nickname)){
            $(`#word span[data-letter-pos='${letterPos}']`).removeClass("incorrect-letter");
            $(`#word span[data-letter-pos='${letterPos}']`).addClass("correct-letter");
            _previousMistake = false;
        } else  {
            $(`#word span[data-letter-pos='${letterPos}']`).removeClass("correct-letter");
            $(`#word span[data-letter-pos='${letterPos}']`).addClass("incorrect-letter");
            _previousMistake = true;
        }
        
    };

    let _deleteLetter = (event) => {
        let letterPos = _wordInput.val().length - 1;
        var key = event.keyCode || event.charCode;
        if( key == 8 || key == 46 ){
            $(`#word span[data-letter-pos='${letterPos}']`).removeClass("correct-letter");
            $(`#word span[data-letter-pos='${letterPos}']`).removeClass("incorrect-letter");
        }
    }

    // Funciones publicas
    _publicFunctions.init = function () {  
        _renderWord(3);
        _wordInput.on("input", _checkLetter);
        _wordInput.on("keydown", _deleteLetter);
    };


    return _publicFunctions;
})(apimock);