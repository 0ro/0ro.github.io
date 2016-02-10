/*! script.js */
$(document).ready(function() {
  $('.hamburger').click(function(event) {
    $('.nav ul').toggle();
  });

  var cart = document.querySelector('.cart');
  var origOffsetY = cart.offsetTop + 553;
  function onScroll(e) {
    window.scrollY >= origOffsetY ? cart.classList.add('cart_fixed') : cart.classList.remove('cart_fixed');
  }
  document.addEventListener('scroll', onScroll);

  $('.modal-trigger').leanModal();

  $('.products').slick({
    dots: true,
    arrows: false,
    infinite: true,
    speed: 300,
    slidesToShow: 2,
    centerMode: true,
    variableWidth: true
  });
});