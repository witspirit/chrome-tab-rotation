// Main entry point for my chrome extension

// These values are transient and only live as long as my page is active.
// Hence, should store this type of data in some form of storage.
var toggleValue = false;
var toggleCount = 0;

function toggleRotation(tab) {
    if (toggleValue) {
        window.alert("Disabling toggle (count="+toggleCount+")");
    } else {
        window.alert("Enabling toggle (count="+toggleCount+")");
    }
    toggleValue = !toggleValue;
    toggleCount++;
}

chrome.browserAction.onClicked.addListener(toggleRotation);
