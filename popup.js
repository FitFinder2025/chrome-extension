document.getElementById("findImages").onclick = getImages;

async function getImages() {
    const [tab] = await chrome.tabs.query(
        { active: true, lastFocusedWindow: true }
    );
    
    const response = await chrome.tabs.sendMessage(tab.id, 
        { type: "GET_IMAGES" }
    );

    if (response === undefined) {
        alert("ERROR (ext): No response given");
        return;
    }

    const container = document.getElementById("image-container");

    response.images.forEach(src => {
        const imgElement = document.createElement("img");
        imgElement.src = src;
        imgElement.alt = 'Image from ' + response.location;
        imgElement.onclick = function() {
            selectImage(imgElement);
        };
        
        const listItem = document.createElement("div");
        listItem.classList.add("image-item");
        listItem.appendChild(imgElement);
        container.appendChild(listItem);
    })

}
  
  function callApi(image) {
    const controller = new AbortController();
    const signal = controller.signal;

    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0);

    const base64Image = canvas.toDataURL('image/png');

    alert("Trying...");
    fetch("http://localhost:5000/search", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query_image: base64Image
        })
    })
    .then((response) => {
        return response.json();
    })
    .then((response) => {
        url = "http://localhost:5000/?id=";
        if (!response.success) {
            alert("Failure: API exception: " + JSON.stringify(response));
            chrome.tabs.create({url});
            return;
        }
        
        if (!response.id) {
            alert("Failure: No id in response from API: " + JSON.stringify(response));
            return;
        }   

        url = url + response.id;
        chrome.tabs.create({url});
    })
    .catch(error => {
        if (error.name === 'AbortError') {
            alert("Failure: request timed out: " + error);
            return;
        }
        alert("Failure: " + error);
    })
  }

function selectImage(image) {
    this.callApi(image);
}