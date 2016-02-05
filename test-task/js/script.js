$(document).ready(function() {
  var category = $('.category');

  category.click(function(event) {
    var _this = $(this),
        thisIndex = category.index(_this);

    console.log(thisIndex);
    _this.remove();
  });
});