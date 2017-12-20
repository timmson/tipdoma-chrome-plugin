chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
    let activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {msg: "address"}, function (address) {
        $("#house_address").html(address.street + " " + address.building);
        getStreetId(address.street, function (err, streetId) {
            if (err) {
                console.error(err);
            } else {
                getStreetData({
                    id: streetId,
                    name: address.street
                }, function (err, data) {
                    if (err) {
                        console.error(err);
                    } else {
                        $("#house_type").html(data);
                    }
                });
            }
        });
    });
});

function getStreetId(streetName, callback) {
    $.get("http://tipdoma.ru/search_str.php?value=" + decodeURIComponent(streetName), function (data) {
        let str = $("a", data).first().attr("onclick");
        let id = str.split("(")[1].split(",")[0];
        return callback(null, id);
    });
}

function getStreetData(street, callback) {
    $.get("http://tipdoma.ru/search_bld.php?id=" + street.id + "&value=" + decodeURIComponent(street.name), function (data) {
        data = data.replace(/href="series/ig, 'href="http://tipdoma.ru/series');
        $("")
        callback(null, data);
    });
}
