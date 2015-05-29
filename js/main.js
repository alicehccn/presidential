$(document).ready(function(){
  // Append slide menu icons
  var $addSlide = $('<img src="img/plus.png" class="add-slide" title="New Slide">');

  var slideWidth = 162, slideHeight = 95;
  var currentSlide = null;
  window.slideCount = 0;

  // Append add-slide button
  $('.slide-container').append($addSlide);

  // New slide style on non-presenting mode 
  function newSlideStyle() {
    currentSlide = $('.slide');
    currentSlide.width(slideWidth)
                .height(slideHeight);
    currentSlide.css({
      "top": "0",
      "left": "0",
      "padding": "25px"
    });
    currentSlide.children("p").css(
      "font-size", "9px",
      "font-weight", "normal"
    );
    currentSlide.children("h6").css(
      "font-size", "12px"
    );
  }
  // Active slide style on presenting mode
  function activeSlideStyle() {
    currentSlide = $('.active');
    currentSlide.width(slideWidth * 4)
                .height(slideHeight * 4);
    currentSlide.css({
      "padding": "80px"
    }).css({
      "top": ($(window).height() - currentSlide.outerHeight()) / 2,
      "left": calculateEdgeWidth()
    });
    currentSlide.children("p").css(
      "font-size", "35px"
    );
    currentSlide.children("h6").css(
      "font-size", "44px"
    );
  }
  // Slide style on full screen
  function fullScreenSlideStyle() {
    currentSlide = $('.slide-fullscreen');
    currentSlide.width(slideWidth * 8)
                .height(slideHeight  * 8);
    currentSlide.css({
      "padding": "80px"
    }).css({
      "top": "0",
      "left": "0"
    });
    currentSlide.children("p").css(
      "font-size", "66px"
    );
    currentSlide.children("h6").css(
      "font-size", "80px"
    );
  }

  // Add slide to DOM on mouse click
  $('.slide-container').on("click", ".add-slide", function() {
    window.slideCount++;
    var $slide = $('<div class="slide"></div>');
    var $slideHeader = $('<h6 class="slide-header">Slide header</h6>');
    var $newContent = $('<p class="normal-font">New Slide</p>');
    var $toolbar = $('<div class="toolbar" contenteditable="false"></div>');
    var $zoomIcon = $('<img src="img/zoom_in.png" class="zoom" title="Zoom In">');
    var $editIcon = $('<img src="img/edit.png" class="edit" title="Edit Slide">');
    var $font = $('<img src="img/alphabet.png" class="font" title="Font Size">');
    var $addHeader = $('<img src="img/add.png" class="add-header" title="Add Header">')
    var $swapIcon = $('<img src="img/link.png" class="swap" title="Swap Slide">');
    var $deleteSlide = $('<img src="img/delete.png" class="delete-slide" title="Delete Slide">');
    var $fullScreen = $('<img src="img/slider.png" class="full-screen" title="Full Screen">');
    var $prevArrow = $('<img src="img/prev.png" class="prev-arrow arrows" title="Next Slide">');
    var $nextArrow = $('<img src="img/next.png" class="next-arrow arrows" title="Previous Slide">');

    $slide.attr("id", "s" + window.slideCount);
    $('.slide-container').append($slide);

    $toolbar.
      append($zoomIcon).
      append($editIcon).
      append($font).
      append($addHeader).
      append($swapIcon).
      append($deleteSlide).
      append($fullScreen);

    $slide.
      append($slideHeader).
      append($newContent).
      append($toolbar).
      append($prevArrow).
      append($nextArrow);

    newSlideStyle();
    $('.add-slide').remove();
    $slideHeader.hide();
    $('.arrows').hide();
    $('.slide-container').append($addSlide);
    $nextArrow.after('<span class="slide-number" contenteditable="false">' + window.slideCount + "</span>");

    // Fetch data with ajax and add to blank slide
    // $.get( "slides/3.html", function(d) {
    //   $newContent.append(d);
    //   $newContent.append(d);
    // })
  })

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

  // Zoom in slide
  function zoomInSlide() {
    $('.slide-container').addClass("presenting");
    $('.zoom').attr("src", "img/zoom_out.png");
    $("header").hide();
    $("footer").hide();
    $('.add-slide').hide();
    $('.arrows').show();
    activeSlideStyle();
    disableSwapDeleteFullScreenAddSlide();
  }

  // Zoom out slide
  function zoomOutSlide() {
    $('.slide-container').removeClass("presenting");
    $('.zoom').attr("src", "img/zoom_in.png");
    $('.slide').removeClass("active");
    $(".arrows").hide();
    $("header").show();
    $("footer").show();
    $('.add-slide').show();
    $('.slide-number').show();
    newSlideStyle();
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
      $(this).attr("src", "img/editing.png");
      editSlide();
    } else {
      currentSlide.attr("contenteditable", "false");
      currentSlide.removeClass("editable");
      currentSlide.find(".slide-number").show();
      $(this).attr("src", "img/edit.png");
      enableSwapDeleteFullScreenAddSlide();
      currentSlide.siblings().children(".toolbar").show();
    }
  })

  // Customize 3 types of font sizes
  function normalFont() { 
    // default font-size
    currentSlide = $('.normal-font')
    currentSlide.css("font-weight", "normal");
  }
  function lightFont() {
    currentSlide = $('.light-font');
    currentSlide.css("font-weight", "lighter");
  }
  function boldFont() {
    currentSlide = $('.bold-font')
    currentSlide.css("font-weight", "bold");
  }

  // Switching font size on mouse click
  $('.slide-container').on("click", ".font", function() {
    currentSlide = $(":focus").find("p").last();
    if (currentSlide.hasClass("normal-font")) {
      currentSlide.removeClass("normal-font");
      currentSlide.removeClass("light-font");
      currentSlide.addClass("bold-font");
      boldFont();
    } else if (currentSlide.hasClass("bold-font")) {
      currentSlide.removeClass("bold-font");
      currentSlide.removeClass("normal-font");
      currentSlide.addClass("light-font");
      lightFont();
    } else if (currentSlide.hasClass("light-font")) {
      currentSlide.removeClass("light-font");
      currentSlide.removeClass("bold-font");
      currentSlide.addClass("normal-font");
      normalFont();
    }
  })

  // Add content to current slide
  $('.slide-container').on("click", ".add-header", function() {
    currentSlide = $(this).parents(".slide");
    currentSlide.children(".slide-header").toggle();
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
    $("footer").hide();
    $('.slide-number').hide();
    $('.add-slide').hide();
  }

  // Exit full screen mode
  function exitFullScreen() {
    var cancelFullScreen = 
        document.exitFullscreen ||
        document.webkitExitFullscreen ||
        document.mozCancelFullScreen;
    cancelFullScreen.call(document);
    $(".slide").removeClass("active slide-fullscreen");
    $('.toolbar').show();
    newSlideStyle();
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
      fullScreenSlideStyle();
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
    if (currentSlide.next().hasClass("slide") && currentSlide.hasClass("slide-fullscreen")) {
      currentSlide.next().addClass("active");
      currentSlide.next().addClass("slide-fullscreen");
      currentSlide.removeClass("active");
      currentSlide.removeClass("slide-fullscreen");
      fullScreenSlideStyle();
    } else if (currentSlide.next().hasClass("slide") && !currentSlide.hasClass("slide-fullscreen")) {
      currentSlide.next().addClass("active");
      currentSlide.removeClass("active");
      activeSlideStyle();
    }
  }

  function goToPrevSlide() {
    currentSlide = $('.active');
    if (currentSlide.prev().hasClass("slide") && currentSlide.hasClass("slide-fullscreen")) {
      currentSlide.prev().addClass("active");
      currentSlide.prev().addClass("slide-fullscreen");
      currentSlide.removeClass("active");
      currentSlide.removeClass("slide-fullscreen");
      fullScreenSlideStyle();
    } else if (currentSlide.prev().hasClass("slide") && !currentSlide.hasClass("slide-fullscreen")) {
      currentSlide.prev().addClass("active");
      currentSlide.removeClass("active");
      activeSlideStyle();
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

      default: return;
    }
  })

})//JQuery ends
