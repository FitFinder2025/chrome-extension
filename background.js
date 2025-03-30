async function fetchBase64(url) {
    const response = await fetch(url);

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Failed to read image"));
        reader.readAsDataURL(response.blob);
    })
}

function convertBase64(imgSource, response) {
    base64 = this.fetchBase64(imgSource)
        .then(b64 => this.callApi(b64))
        .catch(error => 
            response(
                {
                    type: MessageType.ERROR, 
                    status: Status.FATAL_ERROR, 
                    reason: error
                }
            )
        )
}

function callApi(image) {
    console.log("image: " + image);
    fetch("localhost:5000/search/ext", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            src: image
        })
    })
}

chrome.runtime.onMessage.addListener((message, sender, response) => {
    console.log("Message received (BACKGROUND): " + JSON.stringify(message));

    if (message.type == MessageType.IMAGE_CLICKED) {
        this.convertBase64(message.image, response);
        return;
    }
});