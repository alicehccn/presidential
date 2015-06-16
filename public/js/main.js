$(document).ready(function(){
  var $shareButtons = $('<div class="share-buttons"></div>');

  var $facebook = $('<a><img class="facebook" src="/img/facebook.png" title="Share on Facebook"></a>');
  var $twitter = $('<a><img class="twitter" src="/img/twitter.png" title="Share on Twitter"></a>');
  var $emailto = $('<img class="emailto" src="/img/mail.png" title="Send by Email">');
  var $github = $('<img src="/img/github.png" class="github" title="Save as Gist">');

  var currentSlide = null;
  window.slideCount = 0;

  // Append add-slide and share buttons
  $shareButtons.
    prepend($github).
    prepend($emailto).
    prepend($twitter).
    prepend($facebook);

  $('.slide-container').
    append($shareButtons);


  // Add slide to DOM on mouse click
  function addNewSlide(slideContent) {
    window.slideCount++;
    var $slide = $('<div class="slide"></div>');
    var $textbox = $('<div class="textbox"></div>')
    var $slideHeader = $('<h1 class="slide-header">Slide header</h1>');
    var $newContent = $('<p>New Slide</p>');
    var $toolbar = $('<div class="toolbar" contenteditable="false"></div>');
    var $zoomIcon = $('<img src="/img/zoom_in.png" class="zoom" title="Zoom In">');
    var $editIcon = $('<img src="/img/edit.png" class="edit" title="Edit Slide">');
    var $swapIcon = $('<img src="/img/link.png" class="swap" title="Swap Slide">');
    var $deleteSlide = $('<img src="/img/delete.png" class="delete-slide" title="Delete Slide">');
    var $fullScreen = $('<img src="/img/slider.png" class="full-screen" title="Full Screen">');
    var $slideNumber = $('<span class="slide-number" contenteditable="false">' + window.slideCount + "</span>")
    var $prevArrow = $('<img src="/img/prev.png" class="prev-arrow arrows" title="Next Slide">');
    var $nextArrow = $('<img src="/img/next.png" class="next-arrow arrows" title="Previous Slide">');

    $slide.attr("id", "s" + window.slideCount);
    $('.slide-container').append($slide);

    $toolbar.
      prepend($zoomIcon).
      prepend($editIcon).
      prepend($swapIcon).
      prepend($deleteSlide).
      prepend($fullScreen);

    if (slideContent) {
      $textbox.append(slideContent);
    } else {
      $textbox.
        append($slideHeader).
        append($newContent);
    }

    $slide.
      append($textbox).
      append($toolbar).
      append($prevArrow).
      append($nextArrow).
      append($slideNumber);

    $shareButtons.remove();
    $('.arrows').hide();
    $('.slide-container').append($shareButtons);
  }

  function applyImageStyles() {
    var hasLargeImageOnLeft = $('img[alt="large-left"');
    var hasLargeImageOnRight = $('img[alt="large-right"');
    var hasSmallImageOnLeft = $('img[alt="small-left"');
    var hasSmallImageOnRight = $('img[alt="small-right"');
    var hasMediumImageOnLeft = $('img[alt="medium-left"');
    var hasMediumImageOnRight = $('img[alt="medium-right"');
    var hasFullWidthImage = $('img[alt="full-width"]');

    hasLargeImageOnLeft.addClass("big-img float-left");
    hasLargeImageOnRight.addClass("big-img float-right");
    hasSmallImageOnLeft.addClass("small-img float-left");
    hasSmallImageOnRight.addClass("small-img float-right");
    hasMediumImageOnLeft.addClass("medium-img float-left");
    hasSmallImageOnRight.addClass("medium-img float-right");
    hasFullWidthImage.addClass("full-width");
  }

  // Check presenting mode
  function isPresentingMode() {
    if ($('.slide-container').hasClass("presenting")) {
      return true;
    } else {
      return false;
    }
  }

  // Enable and disable swap and delete
  function enableSwapDeleteFullScreenAddSlide() {
    $('.swap').prop("disabled", false);
    $('.delete-slide').prop("disabled", false);
    $('.full-screen').prop("disabled", false);
    $('.add-slide').prop("disabled", false);
  }
  function disableSwapDeleteFullScreenAddSlide() {
    $('.swap').prop("disabled", true);
    $('.delete-slide').prop("disabled", true);
    $('.full-screen').prop("disabled", true);
    $('.add-slide').prop("disabled", true);
  }

  // Reposition slide when zoomed in and out
  function centerSlideWhenZoomedIn() {
    $('.active').css({
      "top": ($(window).height() - $('.active').outerHeight()) / 2,
      "left": calculateEdgeWidth()
    });
  }

  function decenterSlide() {
    $('.slide').css({
      "top": "0",
      "left": "0"
    });
  }

  // Zoom in slide
  function zoomInSlide() {
    $('.slide-container').addClass("presenting");
    $('.zoom').attr("src", "/img/zoom_out.png");
    $('.slide-number').hide();
    $('.share-buttons').hide();
    $('.arrows').show();
    centerSlideWhenZoomedIn();
    disableSwapDeleteFullScreenAddSlide();
  }

  // Zoom out slide
  function zoomOutSlide() {
    $('.slide-container').removeClass("presenting");
    $('.zoom').attr("src", "/img/zoom_in.png");
    $('.slide').removeClass("active");
    $(".arrows").hide();
    $('.share-buttons').show();
    $('.slide-number').show();
    decenterSlide();
    enableSwapDeleteFullScreenAddSlide();
  }

  // Toggle slide zooming on mouse click
  $('.slide-container').on("click", ".zoom", function() {
    currentSlide = $(this).parents(".slide");
    if (isPresentingMode()) {
      currentSlide.removeClass("active");
      zoomOutSlide();
    } else {
      currentSlide.addClass("active");
      zoomInSlide();
    }   
  })
  
  // Slide to be editted
  function editSlide() {
    currentSlide = $('.editable');
    currentSlide.attr("contenteditable", "true");
    currentSlide.siblings(".slide").attr("contenteditable", "false");
    currentSlide.siblings().children(".toolbar").hide();
    currentSlide.focus();
    disableSwapDeleteFullScreenAddSlide();
  }

  // Make slide edittable on mouse click
  $('.slide-container').on("click", ".edit", function() {
    currentSlide = $(this).parents(".slide");
    if (!currentSlide.hasClass("editable")) {
      currentSlide.addClass("editable");
      currentSlide.siblings(".slide").removeClass("editable");
      currentSlide.find(".slide-number").hide();
      $(this).attr("src", "/img/editing.png");
      editSlide();
    } else {
      currentSlide.attr("contenteditable", "false");
      currentSlide.removeClass("editable");
      currentSlide.find(".slide-number").show();
      $(this).attr("src", "/img/edit.png");
      enableSwapDeleteFullScreenAddSlide();
      currentSlide.siblings().children(".toolbar").show();
    }
  })

  // Slide to be swappped
  function swapSlides() {
    var swappingSlide = $('.swapping');
    if (swappingSlide.length === 2) {
      var slideTextA = swappingSlide.eq(0).html();
      var slideTextB = swappingSlide.eq(1).html();
      var slideStyleA = swappingSlide.eq(0).css("font-size");
      var slideStyleB = swappingSlide.eq(1).css("font-size");
      swappingSlide.eq(0).html(slideTextB);
      swappingSlide.eq(1).html(slideTextA);
      swappingSlide.eq(0).css("font-size", slideStyleB);
      swappingSlide.eq(1).css("font-size", slideStyleA);
      swappingSlide.removeClass("swapping");
      $('.swap').siblings("img").prop("disabled", false);
    }
  }

  // Swap slides on mouse click
  $('.slide-container').on("click", ".swap", function() {
    currentSlide = $(this).parents(".slide");
    if (currentSlide.hasClass("swapping")) {
      currentSlide.removeClass("swapping");
      $('.swap').siblings("img").prop("disabled", false);
    } else {
      currentSlide.addClass("swapping");
      $('.swap').siblings("img").prop("disabled", true);
      swapSlides();
    }
  })

  // Slide to be deleted
  function deleteSlide() {
    var slideToDelete = $('.to-delete');
    slideToDelete.remove();
  }

  // Delete slide on mouse click
  $('.slide-container').on("click", ".delete-slide", function() {
    currentSlide = $(this).parents(".slide");
    if (!confirm("Do you really want to delete slide?")) {
      return false;
    } else {
      currentSlide.addClass("to-delete");
      deleteSlide();
    }
  })

  // Check window screen mode
  function isFullScreen() {
    return document.fullscreenElement ||
           document.webkitFullscreenElement ||
           document.mozFullScreenElement;
  }

  // Enter full screen
  function enterFullScreen() {
    var slideId = $(".slide-fullscreen").attr("id");
    currentSlide = document.getElementById(slideId);
    var requestFullScreen = 
      currentSlide.webkitRequestFullScreen ||
      currentSlide.requestFullScreen ||
      currentSlide.mozRequestFullScreen;
    requestFullScreen.call(currentSlide);
    $('.slide-container').addClass("presenting");
    $('.toolbar').hide();
    $("header").hide();
    $(".fetch-presentation").hide();
    $("footer").hide();
    $('.slide-number').hide();
    $('.share-buttons').hide();
  }

  // Exit full screen mode
  function exitFullScreen() {
    var cancelFullScreen = 
        document.exitFullscreen ||
        document.webkitExitFullscreen ||
        document.mozCancelFullScreen;
    cancelFullScreen.call(document);
    $(".slide").removeClass("active slide-fullscreen");
    $("header").show();
    $(".fetch-presentation").show();
    $("footer").show();
    $('.slide-number').show()
    $('.share-buttons').show();
    $('.toolbar').show();
    zoomOutSlide();
  }

  // Toggle full screen mode on click
  $('.slide-container').on("click", ".full-screen", function() {
    currentSlide = $(this).parents(".slide");
    if (isFullScreen()) {
      exitFullScreen();
    } else {
      currentSlide.addClass("active slide-fullscreen");
      enterFullScreen();
    }
  });

  // Detect window screen change (exit)
  // Make sure the slide styles are restored in case the user
  // presses ESC instead of clicking our custom button.
  $(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange', function() {
    if (!isFullScreen()) {
      exitFullScreen();
    }
  })

  // Calculate mouse position in relation to the active slide
  function calculateEdgeWidth() {
    var windowWidth = $(window).width();
    var slideWidth = $('.slide.active').outerWidth();
    return (windowWidth - slideWidth) / 2;
  }
  function mouseIsInLeftEdge(pageX) {
    var edgeWidth = calculateEdgeWidth();
    if (pageX < edgeWidth) {
      return true;
    }
  }
  function mouseIsInRightEdge(pageX) {
    var edgeWidth = calculateEdgeWidth();
    if (pageX >= $(window).width() - edgeWidth) {
      return true;
    }
  }

  // Show previous and next arrows
  $('.slide-container').on("mousemove", function(e) {
    if (isPresentingMode() && mouseIsInRightEdge(e.pageX)) {
      $('.next-arrow').show();
      $('.prev-arrow').hide();
    } else if (isPresentingMode() && mouseIsInLeftEdge(e.pageX)) {
      $('.prev-arrow').show();
      $('.next-arrow').hide();
    } else {
      $('.arrows').hide();
    }
  }) 
  
  // Slide back and forth in presenting mode on mouse click
  function goToNextSlide() {
    currentSlide = $('.active');
    var isEdittingSlide = $('.editable').length;
    if (currentSlide.next().hasClass("slide") && currentSlide.hasClass("slide-fullscreen")) {
      currentSlide.next().addClass("active");
      currentSlide.next().addClass("slide-fullscreen");
      currentSlide.removeClass("active");
      currentSlide.removeClass("slide-fullscreen");
      decenterSlide();
    } else if (currentSlide.next().hasClass("slide") && !currentSlide.hasClass("slide-fullscreen") && !isEdittingSlide) {
      currentSlide.next().addClass("active");
      currentSlide.removeClass("active");
      centerSlideWhenZoomedIn();
    }
  }

  function goToPrevSlide() {
    currentSlide = $('.active');
    var isEdittingSlide = $('.editable').length;
    if (currentSlide.prev().hasClass("slide") && currentSlide.hasClass("slide-fullscreen")) {
      currentSlide.prev().addClass("active");
      currentSlide.prev().addClass("slide-fullscreen");
      currentSlide.removeClass("active");
      currentSlide.removeClass("slide-fullscreen");
      decenterSlide();
    } else if (currentSlide.prev().hasClass("slide") && !currentSlide.hasClass("slide-fullscreen") && !isEdittingSlide) {
      currentSlide.prev().addClass("active");
      currentSlide.removeClass("active");
      centerSlideWhenZoomedIn();
    }   
  }

  $('.slide-container').on("click", ".prev-arrow", function() {
    currentSlide = $(this).parent(".slide");
    goToPrevSlide();
  })

  $('.slide-container').on("click", ".next-arrow", function() {
    currentSlide = $(this).parent(".slide");
    goToNextSlide();
  })

  $(window).on('swipe', function() {
    console.log("swipe");
  })

  /********************************************
          Fetch data from Markdown
  *********************************************/

  function renderHTMLSlides(slides) {
    $('.slide-container').children('.slide').remove();
    window.slideCount = 0;
    for (var i = 0; i < slides.length; i++) {
      addNewSlide(slides[i]);
    }
    applyImageStyles();
  }

  function getMarkdown(url) {
    if (url.length > 0) {
      var presentationUrl = '/presentation?url=' + encodeURIComponent(url);
      $.get(presentationUrl, function (data) {
        renderHTMLSlides(data.slides);
        document.location.hash = encodeURIComponent(url);
        clearUrlInput();
      }).fail(function() {
        alert("An error has occured and your file could not be loaded. Please try again.");
      });
    }
  }
    
  function getMarkdownIfUrl() {
    var url = $('#presentation-url').val();
    if (url.length > 0) {
      getMarkdown(url);
    }
  }

  function clearUrlInput() {
    $('#presentation-url').val("").blur();
  }

  $('#get-markdown').on('click', getMarkdownIfUrl);

  // Load markdown from URL
  function setupPresidential() {
    var hash = decodeURIComponent(document.location.hash);
    if (hash.length > 0) {
      if (hash.charAt(0) === "#") {
        hash = hash.substring(1);
      }
      getMarkdown(hash);
    } else {
      $('#presentation-url').focus()
    }
  }
  setupPresidential();

  /********************************************
                Share buttons
  *********************************************/

  $(".slide-container").on("click", ".emailto", function() {
    var subject = "Check out this presentation I just created online";
    var body_message = "Hi! I just use Presidential to create an online presentation. Check it out on:";
    var url = window.location.href;
    document.location.href = "mailto:" + '?subject=' + subject + '&body=' + body_message + " " +url;
  })

  function getUrlWithoutHash() {
    var url = window.location.href;
    return url.toString().replace("#", "%23");
  }

  $(".slide-container").on("click", ".twitter", function() {
    window.open("https://twitter.com/intent/tweet?text=Check out the presentation I just created Presidential&url="  + getUrlWithoutHash());
  })

  $(".slide-container").on("click", ".facebook", function() {
    window.open("http://www.facebook.com/sharer/sharer.php?u=" + getUrlWithoutHash());
  })

  /********************************************
                Keyboard Event
  *********************************************/

  // Toggle next and previous slides
  $(document).keydown(function(e) {
    switch(e.which) {
      case 37: // left
      goToPrevSlide();
      break;

      case 39: // right
      goToNextSlide();
      break;

      case 27: // esc
      exitFullScreen();
      break;

      case 13: // enter
      getMarkdownIfUrl();
      break;

      default: return;
    }
  })

})//JQuery ends
