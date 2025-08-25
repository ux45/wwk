document.addEventListener("DOMContentLoaded", function () {
  // Only use updateActiveSlide logic for play button and audio control

  // Add logic to manage .slide.active class and reset play button HTML
  function updateActiveSlide() {
    // Remove .slide-active from all slides
    document.querySelectorAll(".carousel-slider .carousel-slide").forEach(function (slide) {
      slide.classList.remove("slide-active");
    });
    // Add .slide-active to the new center slide (should only be one)
    var centers = document.querySelectorAll(".carousel-slider .slick-center.carousel-slide");
    if (centers.length > 0) {
      centers[0].classList.add("slide-active");
    }
    // Remove .playing from all audio-play-btns and pause all audio
    document.querySelectorAll(".audio-play-btn, .btn.audio-play-btn").forEach(function (btn) {
      btn.classList.remove("playing");
      // Remove any previous click handler by setting onclick to null
      btn.onclick = null;
    });
    document.querySelectorAll("audio").forEach(function (audio) {
      audio.pause();
      audio.currentTime = 0;
    });
    // Always rebind the click handler for all .audio-play-btns (not just visible)
    document.querySelectorAll(".audio-play-btn, .btn.audio-play-btn").forEach(function (btn) {
      var audio = btn.closest(".audio-holder").querySelector("audio");
      btn.onclick = function () {
        // Pause all other audio
        document.querySelectorAll("audio").forEach(function (a) {
          if (a !== audio) {
            a.pause();
            a.currentTime = 0;
          }
        });
        if (audio.paused) {
          audio
            .play()
            .then(function () {
              btn.classList.add("playing");
            })
            .catch(function (e) {
              console.warn("Audio play() interrupted:", e);
            });
        } else {
          audio.pause();
          btn.classList.remove("playing");
        }
      };
    });
  }

  // Initial set
  updateActiveSlide();

  // On slider change
  var $slider = $(".carousel-slider");
  $slider.on("afterChange", function () {
    updateActiveSlide();
  });
  $slider.on("init", function () {
    updateActiveSlide();
  });
});
