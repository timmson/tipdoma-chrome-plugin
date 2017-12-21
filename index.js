chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
    let activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {msg: "address"}, function (address) {
        $("#house_address").html(address.street + " " + address.building);
        let streetName = address.street.replace(/проезд/i, "");
        getStreetId(streetName, function (err, streetId) {
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

function getBuildingData(building, callback) {
    $.get("http://tipdoma.ru/search_bld.php?id=" + building.streetId + "&value=" + decodeURIComponent(building.streetName), function (data) {
        let buildings = [];
        $("tbody tr", data).each(function () {
            let address = $(this).find("td:nth-child(2) a").html();
            let buildNumber = building.number.replace(/К/i, " корп.").replace(/С/i, " стр.");
            console.log(buildNumber + ", " + address + " = " + address.search(buildNumber));
            if (address.search(buildNumber) >= 0) {
                buildings.push({
                    address: address,
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
        let out = "<table width=\"450px;\"><tr><th>Address</th><th>Material</th><th>Floors</th><th>Built</th><th>Series</th></tr>";
        for (let i = 0; i < buildings.length; i++) {
            out += "<tr>";
            out += "<td>" + buildings[i].address + "</td>";
            out += "<td>" + buildings[i].material + "</td>";
            out += "<td>" + buildings[i].floorsCount + "</td>";
            out += "<td>" + buildings[i].year + "</td>";
            out += "<td>";
            if (buildings[i].series.name !== undefined) {
                out += "<a target=\"_blank\" href=\"" + buildings[i].series.url + "\">" + buildings[i].series.name + "</a>";
            } else {
                out += "Individual project";
            }
            out += "</td>";
            out += "</tr>";
            if (buildings[i].series.name !== undefined) {
                out += "<tr><td colspan=\"5\"><a id=\"plan" + i + "\" target=\"_blank\">&nbsp;</a></td></tr>";
                getHouseTypeByUrl(buildings[i].series.url, function (err, houseType) {
                    $("#plan" + i).attr("href", houseType.plan);
                    $("#plan" + i).append("<img src=\"" + houseType.plan + "\"/>");
                });
            }
        }
        out += "</table>";
        //console.log(out);d
        callback(null, out);
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
