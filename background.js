/*var addresses = {};
var selectedAddress = null;
var selectedId = null;

function updateAddress(tabId) {
    chrome.tabs.sendRequest(tabId, {}, function(address) {
        addresses[tabId] = address;
        if (!address) {
            chrome.pageAction.hide(tabId);
        } else {
            chrome.pageAction.show(tabId);
            if (selectedId === tabId) {
                updateSelected(tabId);
            }
        }
    });
}

function updateSelected(tabId) {
    selectedAddress = addresses[tabId];
    if (selectedAddress) {
        chrome.pageAction.setTitle({tabId:tabId, title:selectedAddress});
    }
}

chrome.tabs.onUpdated.addListener(function(tabId, change, tab) {
    if (change.status == "complete") {
        updateAddress(tabId);
    }
});

chrome.tabs.onSelectionChanged.addListener(function(tabId, info) {
    selectedId = tabId;
    updateSelected(tabId);
});

// Ensure the current selected tab is set up.
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    updateAddress(tabs[0].id);
});*/
