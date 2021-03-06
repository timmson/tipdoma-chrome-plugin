chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.msg === "address") {
        let address = message.address;
        getStreetId(address.street, function (err, streetId) {
            if (err) {
                console.error(err);
            } else {
                getBuildingData({
                    streetId: streetId,
                    streetName: address.street,
                    number: address.building
                }, function (err, data) {
                    if (err) {
                        console.error(err);
                    } else {
                        sendResponse(data);
                    }
                });
            }
        });
    } else if (message.msg === "plan") {
        getHouseTypeByUrl(message.url, function (err, houseType) {
            sendResponse(houseType);
        })
    }
    return true;
});

function getStreetId(streetName, callback) {
    $.get(encodeURI("http://tipdoma.ru/search_str.php?value=" + streetName), function (data) {
        let str = null;
        $("a", data).each(function () {
            if ($(this).html().startsWith(streetName) && !str) {
                str = $(this).attr("onclick");
            }
        });
        let id = str.split("(")[1].split(",")[0];
        return callback(null, id);
    });
}

function getBuildingData(building, callback) {
    $.get(encodeURI("http://tipdoma.ru/search_bld.php?id=" + building.streetId + "&value=" + building.streetName), function (data) {
        let buildings = [];
        $("tbody tr", data).each(function () {
            let address = $(this).find("td:nth-child(2) a").html();
            address = address.split(",")[1].trim();
            if (address === building.number) {
                buildings.push({
                    address: $(this).find("td:nth-child(2) a").html(),
                    material: $(this).find("td:nth-child(3)").html(),
                    floorsCount: $(this).find("td:nth-child(4)").html(),
                    year: $(this).find("td:nth-child(5)").html(),
                    series: {
                        name: $(this).find("td:nth-child(6) a").html(),
                        url: "http://tipdoma.ru/" + $(this).find("td:nth-child(6) a").attr("href")
                    }
                })
            }
        });
        callback(null, buildings);
    });
}

function getHouseTypeByUrl(url, callback) {
    $.get(url, function (data) {
        callback(null, {
            photo: "http://tipdoma.ru/" + $("#carousel-photo > div > div > img", data).attr("src"),
            plan: "http://tipdoma.ru/" + $("#carousel-plan > div > div > img", data).attr("src")
        });
    });
}