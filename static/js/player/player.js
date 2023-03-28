let player = (function (api) {
    // Atributos
    let _publicFunctions = {};
    let _wordInput = $("#word-input");
    let _round = -1;
    let _nickname = "DANO";
    let _mistakes = [];
    let _currentWord = "";

    // Funciones privadas
    let _announceWinner = (imTheWinner) => {
        if(_round !== 0){
            console.log(imTheWinner);
            if(imTheWinner) {
                console.log("PUTOOOO");
                $("#correct-word")[0].play();
            } else  {
                console.log("PUTAAAA");
                $("#incorrect-word")[0].play();
            }
        }
    };

    let _renderWord = (player, winner) => {
        api.getWord(_round).then((res) => {
            _currentWord = res; 
            let markup = "";
            let letterPos = 0;
            [..._currentWord].forEach(letter => {
                markup = markup.concat(`<span data-letter-pos="${letterPos}">${letter}</span>`);
                letterPos++;
            });
            $(`#${player} .word`).first().html(markup);
        });
        
    };

    let _correctLetter = (letterPos, nickname) => {
        $(`#${nickname} .word span[data-letter-pos='${letterPos}']`).removeClass("incorrect-letter");
        $(`#${nickname} .word span[data-letter-pos='${letterPos}']`).addClass("correct-letter");
        _publicFunctions.runIfItsMe(nickname, () => _mistakes = _mistakes.filter(x => x !== letterPos));
    };

    let _incorrectLetter = (letterPos, nickname) => {
        $(`#${nickname} .word span[data-letter-pos='${letterPos}']`).removeClass("correct-letter");
        $(`#${nickname} .word span[data-letter-pos='${letterPos}']`).addClass("incorrect-letter");
        _publicFunctions.runIfItsMe(nickname, () => {_mistakes.push(letterPos)});
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

    let _sendLetter = (isDelete) => {
        let letterPos = _wordInput.val().length - 1;
        let letter = _wordInput.val().slice(-1);
        let data = {
            nickname: _nickname,
            isDelete: isDelete,
            letterPos: letterPos,
            correct: _checkLetter(letterPos, letter),
        }
        stompClient.send("/topic/sendLetter", {}, JSON.stringify(data));
    };

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
        _publicFunctions.runIfItsMe(nickname, () => {
            _mistakes = _mistakes.filter(x => x !== letterPos);
            _wordInput.val(_wordInput.val().slice(0, -1));
        })
    };

    let _renderPlayer = (element) => {
        $(".available").first().attr("id", element);
        $(`#${element} h3`).text(element);
        $(`#${element}`).removeClass("available");
    };

    let _join = (playerBody) => {
        _publicFunctions.runIfItsMe(playerBody.nickname, () => {
            $(".player-1").first().attr("id", _nickname);
            $("#main-player-nick").text(_nickname);
            playerclient.missingPlayers(_nickname).then((res) => {
                res.forEach(element => {
                    player.renderPlayer(element);
                });
            });
        }, (x) => {
            player.renderPlayer(x.nickname);
        }, [playerBody]);
    };

    // Funciones publicas
    _publicFunctions.init = function () {
        _wordInput.on("keydown", (event) => {
            let key = event.keyCode || event.charCode;
            if(key == 8 || key == 46){
                event.preventDefault();
                _sendLetter(true);
            }
        });
        _wordInput.on("input", (event) => {
            _sendLetter(false);
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

    _publicFunctions.renderWord = function (player, winner) {  
        _renderWord(player, winner)
    };

    _publicFunctions.endRound = function () {  
        _round++;
        _mistakes = [];
    };

    _publicFunctions.startGame = function () {
        stompClient.send("/topic/requestNext", {}, JSON.stringify({nickname: _nickname}));
    };

    _publicFunctions.join = function (playerBody) {  
        _join(playerBody);
    };

    _publicFunctions.roundWonLost = function (imTheWinner) {  
        _announceWinner(imTheWinner);
    };

    _publicFunctions.runIfItsMe = function (nickname, itsMe, itsNotMe=()=>{}, extraParams=[]) {  
        if(nickname === _nickname) {
            itsMe();
        } else {
            itsNotMe(...extraParams);
        }
    };

    return _publicFunctions;

})(playerclient);