let player = (function (api) {
    // Atributos
    let _publicFunctions = {};
    let _wordInput = $("#word-input");
    let _round = -1;
    let _nickname = "DANO";
    let _mistakes = [];
    let _currentWord = "";

    // Funciones privadas
    let _renderWord = (player) => {
        api.getWord(_round).then((res) => {
            _currentWord = res; 
            let markup = "";
            let letterPos = 0;
            [..._currentWord].forEach(letter => {
                markup = markup.concat(`<span data-letter-pos="${letterPos}">${letter}</span>\n`);
                letterPos++;
            });
            $(`#${player} .word`).first().html(markup);
        });
        
    };

    let _correctLetter = (letterPos, nickname) => {
        $(`#${nickname} .word span[data-letter-pos='${letterPos}']`).removeClass("incorrect-letter");
        $(`#${nickname} .word span[data-letter-pos='${letterPos}']`).addClass("correct-letter");
        if(nickname === _nickname) {
            _mistakes = _mistakes.filter(x => x !== letterPos);
        }
    };

    let _incorrectLetter = (letterPos, nickname) => {
        $(`#${nickname} .word span[data-letter-pos='${letterPos}']`).removeClass("correct-letter");
        $(`#${nickname} .word span[data-letter-pos='${letterPos}']`).addClass("incorrect-letter");
        if(nickname === _nickname){
            _mistakes.push(letterPos);
        }
    };

    let _checkLetter = (letterPos, letter) => {
        return [..._currentWord][letterPos] === letter && _mistakes.length === 0;
    };

    let _tryGetNextWord = (letterPos) => {
        if(_currentWord.length === letterPos + 1) {
            let word = _wordInput.val();
            api.checkWord(word, _round, _nickname).then((res) => {
                if(res){
                    stompClient.send("/topic/requestNext", {}, JSON.stringify({nickname: _nickname}));
                }
            });
        }
    };

    let _sendLetter = (event, isDelete) => {
        let letterPos = _wordInput.val().length - 1;
        let letter = _wordInput.val().slice(-1);
        let data = {
            nickname: _nickname,
            isDelete: isDelete,
            letterPos: letterPos,
            correct: _checkLetter(letterPos, letter),
        }
        stompClient.send("/topic/sendLetter", {}, JSON.stringify(data));
    }

    let _renderLetter = (event) => {
        if(event.isDelete){
            _renderDelete(event.letterPos, event.nickname);
            return;
        } else {
            if(event.correct){
                _correctLetter(event.letterPos, event.nickname);
                _tryGetNextWord(event.letterPos);
            } else  {
                _incorrectLetter(event.letterPos, event.nickname);
            }
        }
    };

    let _renderDelete = (letterPos, nickname) => {
        $(`#${nickname} .word span[data-letter-pos='${letterPos}']`).removeClass("correct-letter");
        $(`#${nickname} .word span[data-letter-pos='${letterPos}']`).removeClass("incorrect-letter");
        if(nickname === _nickname){
            _mistakes = _mistakes.filter(x => x !== letterPos);
            _wordInput.val(_wordInput.val().slice(0, -1));
        }
    };

    let _renderPlayer = (element) => {
        $(".available").first().attr("id", element);
        $(`#${element} h3`).text(element);
        $(`#${element}`).removeClass("available");
    };
    // Funciones publicas
    _publicFunctions.init = function () {
        _wordInput.on("keydown", (event) => {
            let key = event.keyCode || event.charCode;
            if(key == 8 || key == 46){
                event.preventDefault();
                _sendLetter(event, true);
            }
        });
        _wordInput.on("input", (event) => {
            _sendLetter(event, false);
        });
    };

    _publicFunctions.renderLetter = function (event) {  
        _renderLetter(event);
    };

    _publicFunctions.getNickname = function () {  
        return _nickname;
    };

    _publicFunctions.setNickname = function (newNickname) {  
        _nickname = newNickname;
    };

    _publicFunctions.renderPlayer = function (player) {  
        _renderPlayer(player)
    };

    _publicFunctions.renderWord = function (player) {  
        _renderWord(player)
    };

    _publicFunctions.endRound = function () {  
        _round++;
        _mistakes = [];
    };

    _publicFunctions.startGame = () => {
        stompClient.send("/topic/requestNext", {}, JSON.stringify({nickname: _nickname}));
    };

    return _publicFunctions;

})(playerclient);