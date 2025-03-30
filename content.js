function findImages() {
    images = document.querySelectorAll("img");
    imageSources = [];
    for (let i = 0; i < images.length; i++) {
      imageSources[i] = images[i].src;
    }
    return imageSources;
}

chrome.runtime.onMessage.addListener((message, sender, response) => {
    console.log("Message received (tab): " + JSON.stringify(message));
    if (message.type == "GET_IMAGES") {
      response({type: "RETURN_IMAGES", images: this.findImages(), location: window.location.href});
    } else {
      response({type: "FAILURE", message: "Type does not exist: " + message.type});
    }

    return true;
})