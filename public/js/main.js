$(document).ready(function(){
  var $startShow = $('<img src="/img/play.png" class="start-show" title="Start Slide Show">');
  var currentSlide = null;

  // Add slide to DOM
  function addNewSlide(slideContent) {
    var $slide = $('<div class="slide"></div>');    
    var $toolbar = $('<div class="toolbar"></div>');
    var $zoomIcon = $('<img src="/img/zoom_in.png" class="zoom" title="Zoom In">');
    var $swapIcon = $('<img src="/img/link.png" class="swap" title="Swap Slide">');
    var $toggleBgImg = $('<img src="/img/image.png" class="toggle-bg-img" title="Background Image">');
    var $deleteSlide = $('<img src="/img/delete.png" class="delete-slide" title="Delete Slide">');
    var $fullScreen = $('<img src="/img/slider.png" class="full-screen" title="Full Screen">');
    var $prevArrow = $('<img src="/img/prev.png" class="prev-arrow arrows" title="Next Slide">');
    var $nextArrow = $('<img src="/img/next.png" class="next-arrow arrows" title="Previous Slide">');

    $slide.append(slideContent);
    $toolbar.
      prepend($zoomIcon).
      prepend($toggleBgImg).
      prepend($swapIcon).
      prepend($deleteSlide).
      prepend($fullScreen);
    $slide.
      append($toolbar).
      append($prevArrow).
      append($nextArrow);

    $('.slide-container').append($slide);
    $('.slide').eq(0).append($startShow);
  }

  // Append share buttons to slide container
  function appendShareButtons() {
    var $shareButtons = $('<div class="share-buttons"></div>');
    var $facebook = $('<a><img class="facebook" src="/img/facebook.png" title="Share on Facebook"></a>');
    var $twitter = $('<a><img class="twitter" src="/img/twitter.png" title="Share on Twitter"></a>');
    var $emailto = $('<img class="emailto" src="/img/mail.png" title="Send by Email">');

    $shareButtons.
      prepend($emailto).
      prepend($twitter).
      prepend($facebook);

    $('.slide-container').append($shareButtons);
  }

  // Apply image styles to slide
  function applyImageStyles() {
    var hasLargeImageOnLeft = $('img[alt="large-l"]');
    var hasLargeImageOnRight = $('img[alt="large-r"]');
    var hasSmallImageOnLeft = $('img[alt="small-l"]');
    var hasSmallImageOnRight = $('img[alt="small-r"]');
    var hasMediumImageOnLeft = $('img[alt="medium-l"]');
    var hasMediumImageOnRight = $('img[alt="medium-r"]');
    var hasFullWidthImage = $('img[alt="full"]');
    var hasBackgroundImage = $('img[alt="background"]');

    hasLargeImageOnLeft.addClass("large-img float-left");
    hasLargeImageOnRight.addClass("large-img float-right");
    hasSmallImageOnLeft.addClass("small-img float-left");
    hasSmallImageOnRight.addClass("small-img float-right");
    hasMediumImageOnLeft.addClass("medium-img float-left");
    hasSmallImageOnRight.addClass("medium-img float-right");
    hasFullWidthImage.addClass("full");
    hasBackgroundImage.addClass("background");
    hasBackgroundImage.eq(0).prependTo($('.slide'))
    hasBackgroundImage.parent('p').remove();
  }

  function removeEmptyElement() {
    var textboxElements = $('.textbox').children();
    for (var i = 0; i < textboxElements.length; i++) {
      if (textboxElements.eq(i).is(':empty')) {
        textboxElements.eq(i).remove();
      }
    }
  }
  function removeSlideWithEmptyNode() {
    for (var i = 0; i < $('.textbox').length; i++) {
      if ($('.textbox').eq(i).children().length === 0) {
        $('.textbox').eq(i).parent('.slide').remove();
        $startShow.appendTo($('.slide').eq(0));
      }
    }
  }
  function assignSlideId() {
    for (var i = 0; i < $('.slide').length; i++) {
      $('.slide').eq(i).attr("id", "s" + (i+1));
    }
  }

  /********************************************
          Fetch data from Markdown
  *********************************************/

  function renderHTMLSlides(slides) {
    // Start a new slide 
    function startNewSlide() {
      layoutTextboxElements.eq(layoutTextboxElementCount).remove();
      finishedTextboxes.push(layoutTextbox.clone());
      layoutTextbox.empty();
      layoutTextbox.append(domElement);
    }
    
    $('.slide').remove();
    $('.share-buttons').remove();

    // define textbox height according to viewport
    var allowedHeight;
    switch (screen.width) {
      case 1440:
      allowedHeight = 115;
      break;

      case 1024:
      allowedHeight = 115;
      break;

      case 414:
      allowedHeight = 218;
      break;

      case 375:
      allowedHeight = 205;
      break;

      case 360:
      allowedHeight = 190;
      break;

      case 320:
      allowedHeight = 175;
      break;

      default: return;
    }
    var finishedTextboxes = [];
    var slideElements = $(slides).filter(function(index, element) {
      if (element.nodeType === 1)
      return true;
    });

    // Convert UL and OL to P
    var newElements = [];
    slideElements.each(function(index, element) {
      if (element.nodeName.toLowerCase() === 'ol' || element.nodeName.toLowerCase() === 'ul') {
        var tempList = [];
        for (var i = 0; i < element.childNodes.length; i++) {
          var li = element.childNodes[i];
          var tempElement = document.createElement('p');
          tempElement.innerHTML = li.innerHTML;
          if (tempElement.textContent !== 'undefined') {
            tempElement.style.listStyle = 'disc'
            tempElement.setAttribute('class','list-item')
            tempList.push(tempElement);
          }
        }
        newElements = newElements.concat(tempList);
      } else {
        newElements.push(element);
      }
    });
    slideElements = newElements;

    var slideElementCount = slideElements.length;
    var layoutSlideContainer = $('<div class="slide-container"></div>');
    var layoutSlide = $('<div class="slide"></div>');
    var layoutTextbox = $('<div class="textbox"></div>')

    layoutSlide.append(layoutTextbox);
    layoutSlideContainer.append(layoutSlide);
    layoutSlideContainer.css('visibility', 'hidden');
    $('body').append(layoutSlideContainer);

    for (var i = 0; i < slideElementCount; i++) {
      var domElement = slideElements[i];
      if (domElement.nodeType === 1) {
        layoutTextbox.append(domElement);

        var layoutTextboxElements = layoutTextbox.children();
        var layoutTextboxElementCount = layoutTextboxElements.length - 1;
        var textboxHeight = layoutTextbox.height();

        // Start new slide with only H1
        if (layoutTextbox.children('h1').length > 0) {
          startNewSlide();
        }
        // Start new slide with H2 and following elements
        if (domElement.nodeName.toLowerCase() === 'h2') {
          startNewSlide();
        }
        // Start new slide if domElement exceed allowed height
        if (textboxHeight > allowedHeight) {
          startNewSlide();
        }
      }
    }
    finishedTextboxes.push(layoutTextbox.clone());

    for (var i = 0; i < finishedTextboxes.length; i++) {
      addNewSlide(finishedTextboxes[i]);
    }
    appendShareButtons();
    applyImageStyles();
    removeEmptyElement(); 
    removeSlideWithEmptyNode();
    assignSlideId();
  }

  function getMarkdown(url, preventHashUpdate) {
    if (url.length > 0) {
      var presentationUrl = '/presentation?url=' + encodeURIComponent(url);
      $.get(presentationUrl, function (data) {
        renderHTMLSlides(data.slides);
        clearUrlInput();
        if (!preventHashUpdate) {
          document.location.hash = encodeURIComponent(url);
        }
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

  // Show demo slides on load
  function getInstructionSlide() {
    var demo = 'https://gist.githubusercontent.com/alicehccn/ec09248285c24a49316a/raw';
    getMarkdown(demo, true);
  }

  // Load markdown from URL
  function setupPresidential() {
    var hash = decodeURIComponent(document.location.hash);
    if (hash.length > 0) {
      if (hash.charAt(0) === "#") {
        hash = hash.substring(1);
      }
      getMarkdown(hash);
    } else {
      getInstructionSlide();
      $('#presentation-url').focus();
    }
  }
  setupPresidential();

  /********************************************
              Toolbar Features
  *********************************************/

  // Toggle background image
  $('.slide-container').on('click', '.toggle-bg-img', function() {
    currentSlide = $(this).parents(".slide");
    currentSlide.children('.background').toggle();
  })
  

  // Enable and disable swap and delete
  function enableSwapDeleteFullScreen() {
    $('.swap').prop("disabled", false);
    $('.delete-slide').prop("disabled", false);
    $('.full-screen').prop("disabled", false);
  }
  function disableSwapDeleteFullScreen() {
    $('.swap').prop("disabled", true);
    $('.delete-slide').prop("disabled", true);
    $('.full-screen').prop("disabled", true);
  }

  // Check presenting mode
  function isPresentingMode() {
    if ($('.slide-container').hasClass("presenting")) {
      return true;
    } else {
      return false;
    }
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
    $('.share-buttons').hide();
    $('.arrows').show();
    centerSlideWhenZoomedIn();
    disableSwapDeleteFullScreen();
  }

  // Zoom out slide
  function zoomOutSlide() {
    $('.slide-container').removeClass("presenting");
    $('.zoom').attr("src", "/img/zoom_in.png");
    $('.slide').removeClass("active");
    $(".arrows").hide();
    $('.share-buttons').show();
    decenterSlide();
    enableSwapDeleteFullScreen();
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
      $('.start-show').remove();
      $('.slide').eq(0).append($startShow);
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
    $("header").hide();
    $(".fetch-presentation").hide();
    $("footer").hide();
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
    $('.share-buttons').show();
    zoomOutSlide();
  }
  // Detect window screen change (exit)
  // Make sure the slide styles are restored in case the user
  // presses ESC instead of clicking our custom button.
  $(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange', function() {
    if (!isFullScreen()) {
      exitFullScreen();
    }
  })

  // Toggle full screen mode on click
  $('.slide-container').on("click", ".full-screen", function() {
    currentSlide = $(this).parents(".slide");
    currentSlide.addClass("active slide-fullscreen");
    enterFullScreen();
  });

  // Start slide show from the beginning
  $('.slide-container').on("click", ".start-show", function() {
    $('.slide').eq(0).addClass("active slide-fullscreen");
    enterFullScreen();
  });

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
    if (currentSlide.next().hasClass("slide") && currentSlide.hasClass("slide-fullscreen")) {
      currentSlide.next().addClass("active");
      currentSlide.next().addClass("slide-fullscreen");
      currentSlide.removeClass("active");
      currentSlide.removeClass("slide-fullscreen");
      decenterSlide();
    } else if (currentSlide.next().hasClass("slide") && !currentSlide.hasClass("slide-fullscreen")) {
      currentSlide.next().addClass("active");
      currentSlide.removeClass("active");
      centerSlideWhenZoomedIn();
    }
  }

  function goToPrevSlide() {
    currentSlide = $('.active');
    if (currentSlide.prev().hasClass("slide") && currentSlide.hasClass("slide-fullscreen")) {
      currentSlide.prev().addClass("active");
      currentSlide.prev().addClass("slide-fullscreen");
      currentSlide.removeClass("active");
      currentSlide.removeClass("slide-fullscreen");
      decenterSlide();
    } else if (currentSlide.prev().hasClass("slide") && !currentSlide.hasClass("slide-fullscreen")) {
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
