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

function preventLinkNavigation(event) {
    // Prevent the default action (following the link)
    event.preventDefault();
    // Stop the event from propagating further (optional but good practice)
    event.stopPropagation();
    console.log("Link click prevented for:", event.currentTarget.href || "non-href element");
  }

function interactiveImages(active) {
    if (!active) {
        return;
    }

    // Select all anchor tags (links) on the page
    const allLinks = document.querySelectorAll('a');
    
    // Add the click listener to every link found
    allLinks.forEach(link => {
        // We use the 'capture' phase (true) to catch the event early
        link.addEventListener('click', preventLinkNavigation, true);
    });

    // don't redirect pls
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            // Check if the added node is an element node
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Find any 'a' tags within the added node or if the node itself is 'a'
              let linksToAddListener = [];
              if (node.matches('a')) {
                linksToAddListener.push(node);
              } else {
                linksToAddListener = Array.from(node.querySelectorAll('a'));
              }
      
              linksToAddListener.forEach(link => {
                // Check if it's an image link if using the optional code above
                // if (link.querySelector('img')) { // Uncomment if using optional image-only code
                   link.removeEventListener('click', preventLinkNavigation, true); // Remove first to avoid duplicates
                   link.addEventListener('click', preventLinkNavigation, true);
                // } // Uncomment if using optional image-only code
              });
            }
          });
        });
      });
      
      // Start observing the document body for added nodes
      observer.observe(document.body, { childList: true, subtree: true });

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