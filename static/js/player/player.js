let player = (function (api) {
    // Atributos
    let _publicFunctions = {};
    let _wordInput = $("#word-input");
    let _round = -1;
    let _nickname = "DANO";
    let _mistakes = [];
    let _currentWord = "";
    let _lobbyId = "";

    // Funciones privadas
    let _announceWinner = (imTheWinner) => {
        if(_round !== 0){
            if(imTheWinner) {
                $("#correct-word")[0].play();
            } else  {
                $("#incorrect-word")[0].play();
            }
        }
    };

    let _renderWord = (player) => {
        api.getWord(_round, _lobbyId).then((res) => {
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
    };

    let _incorrectLetter = (letterPos, nickname) => {
        $(`#${nickname} .word span[data-letter-pos='${letterPos}']`).removeClass("correct-letter");
        $(`#${nickname} .word span[data-letter-pos='${letterPos}']`).addClass("incorrect-letter");
    };

    let _checkLetter = (letterPos, letter) => {
        return _currentWord[letterPos] === letter && _mistakes.length === 0;
    };

    let _tryGetNextWord = (letterPos, correct) => {
        if(_currentWord.length === letterPos + 1 && correct) {
            let word = _wordInput.val().toLowerCase();
            api.checkWord(word, _round, _nickname, _lobbyId).then((res) => {
                if (res) {
                    _round !== 9 ? socketSetUp.getStompClient().send(`/topic/requestNext.${_lobbyId}`, {}, JSON.stringify({nickname: _nickname})) : _endGame();
                }
            });
        }
    };

    let _sendDeletion = (letterPos) => {
        let data = {
            nickname: _nickname,
            letterPos: letterPos,
        }
        _mistakes.pop();
        socketSetUp.getStompClient().send(`/topic/deleteLetter.${_lobbyId}`, {}, JSON.stringify(data));
    }

    let _sendLetter = () => {
        let letterPos = _wordInput.val().length - 1;
        let letter = _wordInput.val().toLowerCase().slice(-1);
        let data = {
            nickname: _nickname,
            letterPos: letterPos,
            correct: _checkLetter(letterPos, letter),
        }
        data.correct ? _mistakes.pop() : _mistakes.push(letterPos);
        socketSetUp.getStompClient().send(`/topic/sendLetter.${_lobbyId}`, {}, JSON.stringify(data));
        _tryGetNextWord(data.letterPos, data.correct);
        _sendStatistics(data.correct);
    };

    let _sendStatistics = (correct) => {
        if (correct) {
            socketSetUp.getStompClient().send(`/app/correctLetter.${_lobbyId}`, {}, JSON.stringify({nickname: _nickname}));
        } else {
            socketSetUp.getStompClient().send(`/app/wrongLetter.${_lobbyId}`, {}, JSON.stringify({nickname: _nickname}));
        }
    }

    let _endGame = () => {
        socketSetUp.getStompClient().send(`/app/endGame.${_lobbyId}`, {}, {});
    };

    let _renderLetter = (event) => {
        if(event.correct){
            _correctLetter(event.letterPos, event.nickname);
        } else  {
            _incorrectLetter(event.letterPos, event.nickname);
        }
    };

    let _renderDelete = (letterPos, nickname) => {
        $(`#${nickname} .word span[data-letter-pos='${letterPos}']`).removeClass("correct-letter");
        $(`#${nickname} .word span[data-letter-pos='${letterPos}']`).removeClass("incorrect-letter");
    };

    let _renderPlayer = (element) => {
        $(".available").first().attr("id", element);
        $(`#${element} h3`).text(element);
        $(`#${element}`).removeClass("available");
    };

    let _playerLeft = (player) => {
        $(`.side-player-panel #${player.nickname}`).addClass("available");
        $(`#${player.nickname} h3`).text("");
        $(`#${player.nickname} .word`).text("ESPERANDO");
        $(`#${player.nickname}`).attr("id", "");
        if(_round === -1){
            _checkHost();
        }
    };

    let _checkHost = () => {
        api.getHost(_lobbyId).then((res) => {
            _publicFunctions.runIfItsMe(res.nickname, () => {
                $("#start-game").removeClass("not-in-screen");
            });
        });
    };

    let _renderOtherPlayers = () => {
        api.missingPlayers(_nickname, _lobbyId).then((res) => {
            res.forEach(element => {
                _renderPlayer(element);
            });
        });
    };

    let _join = (playerBody) => {
        $("#display-lobby-id").text(`#${_lobbyId}`);
        _publicFunctions.runIfItsMe(playerBody.nickname, () => {
            $(".player-1").first().attr("id", _nickname);
            $("#main-player-nick").text(_nickname);
            _checkHost();
            _renderOtherPlayers()
        }, (x) => {
            _renderPlayer(x.nickname);
        }, [playerBody]);
    };

    //  Funciones publicas
    _publicFunctions.init = function () {
        _wordInput.off("keydown").on("keydown", (event) => {
            let key = event.keyCode || event.charCode;
            if(key == 8 || key == 46){
                event.preventDefault();
                let letterPos = _wordInput.val().length - 1;
                _wordInput.val(_wordInput.val().slice(0, -1));
                _sendDeletion(letterPos);
            }
        });
        _wordInput.off("input").on("input", () => {
            _sendLetter();
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
        _renderWord(player)
    };

    _publicFunctions.endRound = function () {  
        _round++;
        _mistakes = [];
    };

    _publicFunctions.startGame = function () {
        socketSetUp.getStompClient().send(`/app/startGame.${_lobbyId}`, {}, JSON.stringify({}));
        socketSetUp.getStompClient().send(`/topic/requestNext.${_lobbyId}`, {}, JSON.stringify({nickname: _nickname}));
    };

    _publicFunctions.endGame = function () {
        _round = -1;
        _mistakes = [];
    }

    _publicFunctions.join = function (playerBody) {  
        _join(playerBody);
    };

    _publicFunctions.roundWonLost = function (imTheWinner) {  
        _announceWinner(imTheWinner);
    };

    _publicFunctions.deleteLetter = function (input) {  
        _renderDelete(input.letterPos, input.nickname);
    };

    _publicFunctions.backToLobby = () => {
        register.joinGame(_nickname, _lobbyId);
    };

    _publicFunctions.playerLeft = (player) => {
        _playerLeft(player)
    };

    _publicFunctions.runIfItsMe = function (nickname, itsMe, itsNotMe=()=>{}, extraParams=[]) {  
        if(nickname === _nickname) {
            itsMe();
        } else {
            itsNotMe(...extraParams);
        }
    };

    _publicFunctions.getLobbyId = function () {  
        return _lobbyId;
    };

    _publicFunctions.setLobbyId = function (newLobbyId) {  
        _lobbyId = newLobbyId;
    };

    return _publicFunctions;

})(playerclient);