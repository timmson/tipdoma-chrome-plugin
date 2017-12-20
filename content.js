$(document).ready(function () {
    let address = [];
    $("address > a").each(function() {
        address.push($(this).html());
    });

    address = address.join().split(",");
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        console.debug("Message received");
        if (request.msg === "address") {
            sendResponse({
                city: address[0] + ", " + address[1],
                district: address[2],
                street: address[3],
                building: address[4]
            });
        }
    })
});