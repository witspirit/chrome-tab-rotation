// Main entry point for my chrome extension

function initState() {
    var initialState = {
        toggleValue : false,
        toggleCount : 0
    };

    save(initialState);
}

function save(state) {
    localStorage.state = JSON.stringify(state);
}

function load() {
    console.log("Loading state...");
    return JSON.parse(localStorage.state);
}

function toggleRotation(tab) {
    console.log("toggleRotation...");
    var state = load();

    console.log("Inside my callback...");
    if (state.toggleValue) {
        window.alert("Disabling toggle (count="+state.toggleCount+")");
    } else {
        window.alert("Enabling toggle (count="+state.toggleCount+")");
    }
    state.toggleValue = !state.toggleValue;
    state.toggleCount++;

    save(state);
}

chrome.runtime.onInstalled.addListener(initState);
chrome.browserAction.onClicked.addListener(toggleRotation);
