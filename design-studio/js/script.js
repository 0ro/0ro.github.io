$(document).ready(function() {
  $("#slider").owlCarousel({
    navigation : true, // Show next and prev buttons
    slideSpeed : 300,
    pagination : false,
    paginationSpeed : 400,
    singleItem:true,
    navigationText : ["<i class='arrow-left'></i>","<i class='arrow-right'></i>"]
  });
   $('.slider-for').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    asNavFor: '.slider-nav'
  });
  $('.slider-nav').slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    asNavFor: '.slider-for',
    dots: true,
    focusOnSelect: true,
    prevArrow: "<button type='button' data-role='none' class='slick-prev slick-arrow' aria-label='Next' role='button'></button>",
    nextArrow:"<button type='button' data-role='none' class='slick-next slick-arrow' aria-label='Next' role='button'></button>",
  });

  /*tabs*/
  var tabs = $('.portpholio__navigation-item'),
      tabContent = $('.portpholio__list');
  tabs.click(function() {
    var number = $(this).index();
    tabs.removeClass('portpholio__navigation-item_active');
    $(this).addClass('portpholio__navigation-item_active');
    tabContent.removeClass('portpholio__list_active');
    $(tabContent[number]).addClass('portpholio__list_active');
  });
});