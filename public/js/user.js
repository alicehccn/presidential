$(document).ready(function(){
  setTimeout(
    function() {
      $('.alert-box').fadeOut();
    },
    3 * 1000
  );

  $(".description").text(function(index, currentText) {
    if (screen.width > 1024) {
      return currentText.substr(0, 75);
    } else if (screen.width <= 1024 && screen.width > 768) {
      return currentText.substr(0, 50);
    } else if (screen.width <= 768 && screen.width > 640) {
      return currentText.substr(0, 45);
    } else if (screen.width <= 640 && screen.width > 414) {
      return currentText.substr(0, 35);
    } else if (screen.width <= 414 && screen.width > 375) {
      return currentText.substr(0, 75);
    } else if (screen.width <= 375 && screen.width > 320) {
      return currentText.substr(0, 65);
    } else if (screen.width <= 320) {
      return currentText.substr(0, 55);
    }
  });
})