// Main entry point for my chrome extension
var config = {
  timeToNextTab : 3000,  // [ms]
  // timeToNextReload : 60 * 60 * 1000 // [ms] Every Hour = 60 minutes = 60 * 60 seconds = 60 * 60 * 1000 ms
  timeToNextReload : 5000
};

var pauseIcon = {
    "19" : "assets/images/RotatePaused-19.png",
    "38" : "assets/images/RotatePaused-38.png"
};

var playIcon = {
    "19" : "assets/images/RotateActive-19.png",
    "38" : "assets/images/RotateActive-38.png"
};


function initState() {
    var initialState = {
        rotationActive: false,
        lastReloadTime: 0
    };

    save(initialState);
}

function save(state) {
    localStorage.state = JSON.stringify(state);
}

function load() {
    // console.log("Loading state...");
    return JSON.parse(localStorage.state);
}

function handleReloadFor(tab) {
    var currentReloadTime = Date.now();
    var state = load();
    var lastReloadTime = state.lastReloadTime;

    console.log("currentTime = "+currentReloadTime+"; lastReloadTime = "+lastReloadTime);

    var performReload = false;
    if (currentReloadTime - lastReloadTime > config.timeToNextReload) {
        state.lastReloadTime = currentReloadTime;
        save(state);
        performReload = true;
    }

    console.log("performReload = "+performReload);

    return function(window) {
        if (performReload) {
            chrome.tabs.reload(tab.id);
        }
    }
}

function moveToNextTab() {
    chrome.tabs.query({currentWindow: true}, function(tabArray) {
        var nextTabIndex = -1;
        for (var i = 0; i < tabArray.length; i++) {
            if (tabArray[i].highlighted) {
                console.log("Found highlighted tab at index " + i);
                if (i+1 >= tabArray.length) {
                    nextTabIndex = 0;
                } else {
                    nextTabIndex = i+1;
                }
            }
        }

        if (nextTabIndex !== -1) {
            var nextTab = tabArray[nextTabIndex];
            console.log("Highlighting tab at "+nextTabIndex);
            chrome.tabs.highlight({ tabs : [ nextTabIndex ] }, handleReloadFor(nextTab));
        } else {
            console.log("Could not determine next tab");
        }
    });
}

function onSchedule() {
    // Still on, so reschedule
    if (load().rotationActive) {
        console.log("onSchedule");
        moveToNextTab();
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
    window.setTimeout(onSchedule, config.timeToNextTab);
}

function toggleRotation(tab) {
    console.log("toggleRotation...");
    var state = load();

    if (state.rotationActive) {
        // window.alert("Stop rotation");
        chrome.browserAction.setIcon({path : pauseIcon});
    } else {
        // window.alert("Start rotation");
        chrome.browserAction.setIcon({path : playIcon});
        schedule();
    }
    state.rotationActive = !state.rotationActive;

    save(state);
}

chrome.runtime.onInstalled.addListener(initState);
chrome.browserAction.onClicked.addListener(toggleRotation);
