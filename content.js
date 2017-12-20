$(document).ready(function () {
    let address = [];
    $("address > a").each(function() {
        address.push($(this).html());
    });
    console.log(address);
    chrome.runtime.sendMessage({
        msg: "address",
        data: address
    });
});