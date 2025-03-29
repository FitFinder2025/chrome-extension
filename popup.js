document.getElementById("searchMode").onclick = enterSearchMode;

async function enterSearchMode() {

    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true});
    const response = await chrome.tabs.sendMessage(tab.id, {type: "SELECTOR", selector: true});
    if (response === undefined) {
        alert("No response");
        return;
    }
    alert("Response: " + response);
    document.getElementById("title").title = response;
}   