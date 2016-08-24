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

function onSchedule() {
    // Still on, so reschedule
    if (load().toggleValue) {
        console.log("onSchedule");
        schedule();
    } else {
        console.log("No action, no longer active");
    }
}

function schedule() {
    // Using window.setTimeout, since I want to support a high frequency.
    // The alarms API will not schedule faster than 1 minute
    // This might be an issue in combination with en Event page. Perhaps
    // I will need to switch to a persistent background page again for this.
    window.setTimeout(onSchedule, 3000);
}

function toggleRotation(tab) {
    console.log("toggleRotation...");
    var state = load();

    console.log("Inside my callback...");
    if (state.toggleValue) {
        window.alert("Disabling toggle (count="+state.toggleCount+")");
    } else {
        window.alert("Enabling toggle (count="+state.toggleCount+")");
        schedule();
    }
    state.toggleValue = !state.toggleValue;
    state.toggleCount++;

    save(state);
}

chrome.runtime.onInstalled.addListener(initState);
chrome.browserAction.onClicked.addListener(toggleRotation);
