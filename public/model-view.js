var thumbnailsContainer = document.getElementById('thumbnails-container');
var images = document.getElementsByClassName('photo');
var thumbnails = thumbnailsContainer.getElementsByClassName('thumbnail');



function thumbnailClickHandler(event) {
    var target = event.target;
    // If not a thumbnail, or already selected do nothing
    if (!target.classList.contains('thumbnail') || target.classList.contains('selected')) {
        return;
    }
    var selected = thumbnailsContainer.getElementsByClassName('selected');
    // Deselect all thumbnails
    for (var i = 0; i < selected.length; i++) {
        selected[i].classList.remove('selected');
    }

    // Select the clicked pic
    event.target.classList.add('selected');

    // Get the selected thumbanil's index
    // Probably better ways to do this, but this works
    var selectedIndex = 0;
    for (var i = 0; i < thumbnails.length; i++) {
        if (thumbnails[i].classList.contains('selected')) {
            selectedIndex = i;
            break;
        }
    }

    // Clear active image
    for (var i = 0; i < images.length; ++i) {
        images[i].classList.remove('active');
    }

    // Set new active image
    images[selectedIndex].classList.add('active');

}

thumbnailsContainer.addEventListener('click', thumbnailClickHandler);
