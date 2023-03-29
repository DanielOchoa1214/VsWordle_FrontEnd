let ending = (function () {

    let _resetMainInput = () => {
        let _wordInput = $("#word-input");
        _wordInput.addClass("not-in-screen");
        _wordInput.val("");
        _wordInput.off("keydown");
        _wordInput.off("input");
        $("#joystick").addClass("not-in-screen");
    };

    let _resetMainPlayerView = () => {
        $(".word").text("ESPERANDO");
        $("#start-game").removeClass("not-in-screen");
        $("#game-screen").addClass("not-in-screen");
        $(".side-player-panel .player").addClass("available");
    };

    let _showWinner = (winner) => {
        $("#winner").text(winner.nickname);
        $("#end-game-screen").removeClass("not-in-screen");
    };

    let _endGame = (winner) => {
        _resetMainInput();
        player.endGame();
        _resetMainPlayerView();
        _showWinner(winner);
    };

    let _publicFunctions = {};

    _publicFunctions.endGame = function (winner) {
        _endGame(winner);
    }

    return _publicFunctions;
})();