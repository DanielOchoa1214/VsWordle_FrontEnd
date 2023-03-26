let player = (function (api) {
    // Atributos
    let _publicFunctions = {};
    let _wordInput = $("#word-input");
    let _round = 0;
    let _nickname = "DANO";
    let _mistakes = [];
    let _currentWord = "";

    // Funciones privadas
    let _renderWord = () => {
        api.getWord(_round).then((res) => {
            _currentWord = res; 
            let markup = "";
            let letterPos = 0;
            [..._currentWord].forEach(letter => {
                markup = markup.concat(`<span data-letter-pos="${letterPos}">${letter}</span>\n`);
                letterPos++;
            });
            $("#word").html(markup);
        });
        
    };

    let _correctLetter = (letterPos) => {
        $(`#word span[data-letter-pos='${letterPos}']`).removeClass("incorrect-letter");
        $(`#word span[data-letter-pos='${letterPos}']`).addClass("correct-letter");
        _mistakes = _mistakes.filter(x => x !== letterPos);
    };

    let _incorrectLetter = (letterPos) => {
        $(`#word span[data-letter-pos='${letterPos}']`).removeClass("correct-letter");
        $(`#word span[data-letter-pos='${letterPos}']`).addClass("incorrect-letter");
        _mistakes.push(letterPos);
    };

    let _checkLetter = (letterPos, letter) => {
        return [..._currentWord][letterPos] === letter && _mistakes.length === 0;
    };

    let _tryGetNextWord = (letterPos) => {
        if(_currentWord.length === letterPos + 1) {
            let word = _wordInput.val();
            api.checkWord(word, _round, _nickname).then((res) => {
                if(res){
                    _round++;
                    _renderWord();
                    _wordInput.val("");
                }
            }).catch((err) => {
                // Resar que no pase :(
            });
        }
    };

    let _renderLetter = () => {
        let letterPos = _wordInput.val().length - 1;
        let letter = _wordInput.val().slice(-1);
        if(_checkLetter(letterPos, letter)){
            _correctLetter(letterPos);
            _tryGetNextWord(letterPos);
        } else  {
            _incorrectLetter(letterPos);
        }
    };

    let _renderDelete = () => {
        let letterPos = _wordInput.val().length - 1;
        $(`#word span[data-letter-pos='${letterPos}']`).removeClass("correct-letter");
        $(`#word span[data-letter-pos='${letterPos}']`).removeClass("incorrect-letter");
        _mistakes = _mistakes.filter(x => x !== letterPos);
        _wordInput.val(_wordInput.val().slice(0, -1));
    };

    let _deleteLetter = (event) => {
        var key = event.keyCode || event.charCode;
        if( key == 8 || key == 46 ){
            event.preventDefault();
            _renderDelete();
        }
    };

    let _setNickname = () => {
        _nickname = $("#nickname").val();
    };

    let _joinGame = () => {
        _setNickname();
        api.joinGame(_nickname).then((res)=>{
            if(res) {
                stompClient.send(`/app/joinGame`, {}, JSON.stringify({nickname:_nickname}));
            } else {
                alert("Fuera!!!! Eres el que sobra")
            }
        });
    }

    let _connectAndSubscribe = () => {
        console.info('Connecting to WS...');
        let socket = new SockJS('http://localhost:8080/stompendpoint');
        stompClient = Stomp.over(socket);
        //subscribe to /topic/TOPICXX when connections succeed
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            stompClient.subscribe(`/topic/joinGame`, function (eventbody) {
                let player=JSON.parse(eventbody.body);
                if(player.nickname === _nickname) {
                    $("#main-player-nick").text(_nickname);
                    api.missingPlayers(_nickname).then((res)=>{
                        res.forEach(element => {
                            $(".available").first().attr("id", element);
                            $(`#${element} h3`).text(element);
                            $(`#${element}`).removeClass("available");
                        });
                    });
                } else {
                    $(".available").first().attr("id", player.nickname);
                    $(`#${player.nickname} h3`).text(player.nickname);
                    $(`#${player.nickname}`).removeClass("available");
                    console.log(player.nickname);
                }
            });
        });
    };
    // Funciones publicas
    _publicFunctions.init = function () {
        _connectAndSubscribe()
        $("#set-nickname").click(()=>_joinGame());
        // Cuando se necesite añadir el _setNickname
        _renderWord();
        _wordInput.on("input", _renderLetter);
        _wordInput.on("keydown", _deleteLetter);
    };


    return _publicFunctions;
})(apiclient);