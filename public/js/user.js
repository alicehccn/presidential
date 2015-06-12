$(document).ready(function(){
  $("header").on("click", ".user", function() {
    $(this).children("li").toggle();
  })

  $("header").on("mouseleave", ".user", function() {
    $(this).children("li").hide();
  })
})