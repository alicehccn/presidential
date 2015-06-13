$(document).ready(function(){
  $("header").on("mouseover", ".user", function() {
    $(this).children("li").show();
  })

  $("header").on("mouseleave", ".user", function() {
    $(this).children("li").hide();
  })
})