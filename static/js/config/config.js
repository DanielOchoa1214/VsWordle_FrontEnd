let config = (function () {  
    let _publicFunctions = {};

    let _configBtn = () => {
        $("#config-btn").on("click", () => {
            $("#main-menu-screen").addClass("not-in-screen");
            $("#config-screen").removeClass("not-in-screen");
        });
    };

    let _backgroundMusicVolume = () => {
        let volumeInput = $("#music-volume")
        volumeInput.val($("#background-music")[0].volume *100);
        volumeInput.on("input", () => {
            $("#background-music")[0].volume = volumeInput.val() / 100
        });
    };

    let _sfxVolume = () => {
        let volumeInput = $("#sfx-volume")
        volumeInput.val($("#correct-word")[0].volume * 100);
        volumeInput.on("input", () => {
            $("#correct-word")[0].volume = volumeInput.val() / 100;
            $("#incorrect-word")[0].volume = volumeInput.val() / 100;
            $("#game-over")[0].volume = volumeInput.val() / 100;
            $("#happy-wheels")[0].volume = volumeInput.val() / 100;
        });
        volumeInput.on("mouseup", () => {
            $("#correct-word")[0].play();
        });
    };

    _publicFunctions.init = function () {  
        _configBtn();
        _backgroundMusicVolume();
        _sfxVolume();
    };

    return _publicFunctions;
})();