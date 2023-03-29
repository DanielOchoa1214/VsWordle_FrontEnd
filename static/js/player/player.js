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
                $("#correct-word")[0].play();
                $("#correct-word")[0].volume = 0.05;
            } else  {
                $("#incorrect-word")[0].play();
                $("#incorrect-word")[0].volume = 0.05;
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
        if(_currentWord.length === letterPos + 1 && _round !== 9) {
            let word = _wordInput.val();
            api.checkWord(word, _round, _nickname).then((res) => {
                if(res){
                    stompClient.send("/topic/requestNext", {}, JSON.stringify({nickname: _nickname}));
                }
            });
        }
    };

    let _sendDeletion = () => {
        let letterPos = _wordInput.val().length - 1;
        let data = {
            nickname: _nickname,
            letterPos: letterPos,
        }
        stompClient.send("/topic/deleteLetter", {}, JSON.stringify(data));
    }

    let _sendLetter = () => {
        let letterPos = _wordInput.val().length - 1;
        let letter = _wordInput.val().slice(-1);
        let data = {
            nickname: _nickname,
            letterPos: letterPos,
            correct: _checkLetter(letterPos, letter),
        }
        stompClient.send("/topic/sendLetter", {}, JSON.stringify(data));
    };

    let _tryEndGame = (letterPos) => {
        if(_round === 9 && _currentWord.length === letterPos + 1) {
            stompClient.send("/app/endGame", {}, {});
        }
    };

    let _endGame = (winner) => {
        console.log("GANESTEEE: " + JSON.stringify(winner));
        $("#winner").text(winner.nickname);
        $("#end-game-screen").removeClass("not-in-screen");
        $("#game-screen").addClass("not-in-screen");
        $(".word").text("ESPERANDO");
        $("#start-game").removeClass("not-in-screen");
        _wordInput.addClass("not-in-screen");
        _wordInput.val("");
        $("#joystick").addClass("not-in-screen");
        $(".side-player-panel .player").addClass("available");
        _round = -1;
        _wordInput.off("keydown");
        _wordInput.off("input");
    };

    let _renderLetter = (event) => {
        if(event.correct){
            _correctLetter(event.letterPos, event.nickname);
            _tryGetNextWord(event.letterPos);
            _tryEndGame(event.letterPos);
        } else  {
            _incorrectLetter(event.letterPos, event.nickname);
        }
    };

    let _renderDelete = (letterPos, nickname) => {
        $(`#${nickname} .word span[data-letter-pos='${letterPos}']`).removeClass("correct-letter");
        $(`#${nickname} .word span[data-letter-pos='${letterPos}']`).removeClass("incorrect-letter");
        _publicFunctions.runIfItsMe(nickname, () => {
            _mistakes = _mistakes.filter(x => x !== letterPos);
            _wordInput.val(_wordInput.val().slice(0, -1));
        });
    };

    let _renderPlayer = (element) => {
        $(".available").first().attr("id", element);
        $(`#${element} h3`).text(element);
        $(`#${element}`).removeClass("available");
    };

    let _join = (playerBody) => {
        console.log(JSON.stringify(playerBody));
        console.log(_nickname);
        _publicFunctions.runIfItsMe(playerBody.nickname, () => {
            $(".player-1").first().attr("id", _nickname);
            $("#main-player-nick").text(_nickname);
            playerclient.missingPlayers(_nickname).then((res) => {
                console.log(res);
                res.forEach(element => {

                    _renderPlayer(element);
                });
            });
        }, (x) => {
            _renderPlayer(x.nickname);
        }, [playerBody]);
    };

    // Funciones publicas
    _publicFunctions.init = function () {
        _wordInput.on("keydown", (event) => {
            let key = event.keyCode || event.charCode;
            if(key == 8 || key == 46){
                event.preventDefault();
                _sendDeletion();
            }
        });
        _wordInput.on("input", (event) => {
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

    _publicFunctions.deleteLetter = function (input) {  
        _renderDelete(input.letterPos, input.nickname);
    };

    _publicFunctions.endGame = function (winner) {  
        _endGame(winner);
    };

    _publicFunctions.backToLobby = () => {
        $("#set-nickname").click();
        $("#end-game-screen").addClass("not-in-screen");
    }

    _publicFunctions.runIfItsMe = function (nickname, itsMe, itsNotMe=()=>{}, extraParams=[]) {  
        if(nickname === _nickname) {
            itsMe();
        } else {
            itsNotMe(...extraParams);
        }
    };

    return _publicFunctions;

})(playerclient);