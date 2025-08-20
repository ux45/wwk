function assignSliderVars() {
  var buttonId = $(".carousel-slider .slick-center button").attr("id");
  var playerId = $(".carousel-slider .slick-center audio").attr("id");
  var button = document.getElementById(buttonId);
  var audio = document.getElementById(playerId);
  console.log("button: ", button);
  console.log($(".carousel-slider .slick-center button").attr("id"));
  console.log("slide: ", audio);
  button.addEventListener("click", function () {
    if (audio.paused && $(buttonId).hasClass("playing")) {
      $(buttonId).removeClass("playing");
      button.innerHTML = '<div class="play-button"><span class="visually-hidden" aria-hidden="true">Listen Online!</span></div>';
    } else if (audio.paused) {
      audio.play();
      $(buttonId).addClass("playing");
      button.innerHTML = '<div class="pause-button"><span class="visually-hidden" aria-hidden="true">Listen Online!</span></div>';
    } else {
      audio.pause();
      $(buttonId).removeClass("playing");
      button.innerHTML = '<div class="play-button"><span class="visually-hidden" aria-hidden="true">Listen Online!</span></div>';
    }
  });
}

function initAudio(audioPlayer) {
  audioPlayer.addEventListener(
    "play",
    function () {
      const ratioPlayedInput = $("input:text[name='input-ratioPlayed']").val() || "0";
      let ratioPlayed = parseFloat(ratioPlayedInput);
      let timesPlayed = $("input:text[name='input-timesPlayed']").val();
      timesPlayed = parseInt(timesPlayed, 10) || 0;
      const currTimesPlayed = audioPlayer.played;
      let totalTimePlayed = 0;
      for (let i = 0; i < currTimesPlayed.length; i += 1) {
        totalTimePlayed += currTimesPlayed.end(i) - currTimesPlayed.start(i);
      }
      ratioPlayed += totalTimePlayed / audioPlayer.duration;
      ratioPlayed = parseFloat(ratioPlayed.toFixed(2));
      timesPlayed += currTimesPlayed.length;

      if (totalTimePlayed == 0) {
        $.get("https://utility.librarycall.com/widget/2109/log.php?storyline=10942");
        console.log("sent");
      }
    },
    true
  );
  return true;
}
function preventNavigatingAway() {
  window.onbeforeunload = function () {
    $("#soundPlayer").trigger("ended");
  };
}
document.addEventListener("DOMContentLoaded", function () {
  const audioPlayer = $(".carousel-slider .slick-center audio").attr("id");
  initAudio(audioPlayer);
  preventNavigatingAway();
});
