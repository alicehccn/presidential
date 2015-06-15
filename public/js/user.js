$(document).ready(function(){
  /********************************************
                Flash Notice
  *********************************************/
  setTimeout(
    function() {
      $('.alert-box').fadeOut();
    },
    3 * 1000
  );

  /********************************************
            User Button on Homepage
  *********************************************/
  
  // $("header").on("mouseover", ".user", function() {
  //   $(this).children("li").show();
  // })

  // $("header").on("mouseleave", ".user", function() {
  //   $(this).children("li").hide();
  // })
})