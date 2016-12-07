var slideshow;

function makeSlideshow(slides) {
    var currentSlide = 0;
    var numSlides = slides.length;
    return function() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % numSlides;
        slides[currentSlide].classList.add('active');
    }
}

function hoverStart(event) {
    var nextSlide = makeSlideshow(event.currentTarget.getElementsByClassName('photo'));
    nextslide();
    slideshow = setInterval(nextSlide, 2000);
}

function hoverEnd(event) {
    clearInterval(slideshow);
    var photos = event.currentTarget.getElementsByClassName('photo');
    for (var i = 1; i < photos.length; i++) {
            photos[i].classList.remove('active');
    }
    photos[0].classList.add('active');
}

var linkFrames = document.getElementsByClassName('link-frame');
for (var i = 0; i < linkFrames.length; i++) {
    linkFrames[i].addEventListener('mouseenter', hoverStart);
    linkFrames[i].addEventListener('mouseleave', hoverEnd);
}
