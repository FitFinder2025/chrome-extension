let activeSelector = false;

function showSelector() {
    activeSelector = true;
    images = document.getElementsByTagName("img");
    for (var i = 0; i < images.length; i++) {
        this.drawOutline(images[i]);
    }

    console.log("FitFinder Selector: TRUE");
}

function drawOutline(img) {
    if (!(img instanceof HTMLImageElement)) {
        console.log("Failed: NOT_AN_HTTP_IMAGE_ELEMENT");
        return;
    }

    const container = document.createElement("div");
    container.style.position = "relative";
    container.style.display = "inline-block";

    img.parentNode.insertBefore(container, img);
    container.appendChild(img);

    img.style.opacity = "0.6";
    img.style.position = "relative";
    img.style.zIndex = "1";

    const tintOverlay = document.createElement("div");
    tintOverlay.style.position = "absolute";
    tintOverlay.style.top = "0";
    tintOverlay.style.left = "0";
    tintOverlay.style.width = "100%";
    tintOverlay.style.height = "100%";
    tintOverlay.style.backgroundColor = "red"; // Tint color
    tintOverlay.style.opacity = "0.4";
    tintOverlay.style.zIndex = "0";

    const outlineOverlay = document.createElement("div");
    outlineOverlay.style.position = "absolute";
    outlineOverlay.style.top = "-5px"; // Adjust for thickness
    outlineOverlay.style.left = "-5px";
    outlineOverlay.style.width = "calc(100% + 10px)";
    outlineOverlay.style.height = "calc(100% + 10px)";
    outlineOverlay.style.border = "5px solid red"; // Outline color & thickness
    outlineOverlay.style.boxSizing = "border-box";
    outlineOverlay.style.zIndex = "9999"; // Above image
    
    container.appendChild(tintOverlay);
    container.appendChild(outlineOverlay);
}

function interactiveImages(active) {
    if (!active) {
        return;
    }

    // don't redirect pls
    document.querySelectorAll("a[href]").forEach(link => {
        try {
            link.remove();
        } catch (e) {
            console.error('Link error: ', link.href, e);
        }
    });

    document.querySelectorAll("img").forEach(img => {
        img.replaceWith(img.cloneNode(true));
        img.style.cursor = "none";

        let clicked = false;

        img.addEventListener("click", (event) => {
            event.stopPropagation();
            event.preventDefault();

            if (img.closest("a")) {
                img.closest("a").onclick = (e) => e.stopPropagation();
            }

            if (clicked) {
                return;
            }

            clicked = true;

            chrome.runtime.sendMessage({ 
                type: MessageType.IMAGE_CLICKED,
                image: img.src
            });

            setTimeout(() => clicked = false, 1000);
        })
    })
}

chrome.runtime.onMessage.addListener((message, sender, response) => {
    console.log("Message received (TAB): " + JSON.stringify(message));
    if (message.type == MessageType.SELECTOR
        && message.selector
    ) {
        this.showSelector();
    }
    
    response({title: document.title});

    return true;
})