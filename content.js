const config = {
    "www.cian.ru": {
        addressSelector: "address > a",
        insertAfter: "address"
    },
    "www.domofond.ru": {
        addressSelector: "div.e-listing-address > a.e-listing-address-line:last",
        insertAfter: "div.e-listing-address > a.e-listing-address-line:last"
    },
    "www.avito.ru": {
        addressSelector: "span[itemprop=streetAddress]",
        insertAfter: "span[itemprop=streetAddress]"
    }
};

$(document).ready(function () {
    if (!config.hasOwnProperty(window.location.host)) {
        return;
    }
    let cfg = config[window.location.host];
    let address = [];
    $(cfg.addressSelector).each(function () {
        address.push($(this).html().trim());
    });

    address = address.join().split(",");

    switch (window.location.host) {
        case "www.domofond.ru" :
            address = [address[3].trim(), "?AO", address[2].trim(), address[0].trim(), address[1].trim()];
            break;
        case "www.avito.ru" :
            if (address.length === 1) {
                let splitPoint = address[0].search(/\d(-|c|к)?\d?/);
                address = [address[0].slice(0, splitPoint), address[0].slice(splitPoint - address[0].length)];
            }
            address = ["Москва", "?AO", "? район", address[0].trim(), address[1].trim()];
            break;
    }

    address = {
        city: address[0],
        county: address[1],
        district: address[2],
        street: address[3].replace(/(б-р|проезд|улица|ул(\.| ))/i, "").trim(),
        building: normaizeBuilding(address[4])
    };

    if (address.city.search(/Москва/i) < 0) {
        console.debug("Failed:" + address);
        return;
    }

    console.debug("Sending: " + JSON.stringify(address));
    chrome.runtime.sendMessage({msg: "address", address: address}, function (response) {
        console.debug("Buildings: " + JSON.stringify(response));
        $(getDescriptionTable(response)).insertAfter(cfg.insertAfter);
        $("p#tipdoma_section_enable").click(function () {
            $("div#tipdoma_section").slideToggle();
        });
    });
});

function normaizeBuilding(building) {
    if (building.search(/(\dк\d)/i) >= 0) {
        building = building.replace(/к/i, " корп.");
    }
    building = building.replace(/корп\. /i, "корп.");
    return building.replace(/(д\.|дом )/i, "").replace(/(с|стр\.)/i, " стр.").trim();
}

function getDescriptionTable(buildings) {
    let out = "<p id=\"tipdoma_section_enable\">Справка по типу дома</p><div id=\"tipdoma_section\">";
    out += "<table class=\"tipdoma_data\">";
    out += "<tr><th>Адрес</th><th>Материал</th><th>Кол-во этажей</th><th>Дата постройки</th><th>Серия</th></tr>";
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
            out += "Индивидуальный проект";
        }
        out += "</td>";
        out += "</tr>";
        if (buildings[i].series.name !== undefined) {
            out += "<tr><td colspan=\"5\"><a id=\"plan" + i + "\" target=\"_blank\">&nbsp;</a></td></tr>";
            chrome.runtime.sendMessage({msg: "plan", url: buildings[i].series.url}, function (houseType) {
                console.log(houseType);
                $("#plan" + i).attr("href", houseType.plan);
                $("#plan" + i).append("<img class=\"tipdoma_img\" src=\"" + houseType.plan + "\"/>");
            });

        }
    }

    out += "</table></div>";
    return out;
}