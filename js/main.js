(function(window) {
  var slider = new IdealImageSlider.Slider({
    selector: '#slider',
    height: 400, // Required but can be set by CSS
    interval: 4000,
  });
  console.log('hello', slider);
  slider.start();
}(window))
