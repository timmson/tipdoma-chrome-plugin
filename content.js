const config = {
    "www.cian.ru": {
        addressSelector: "address > a",
        addressReady: true,
        insertAfter: "address"
    },
    "www.domofond.ru": {
        addressSelector: "div.e-listing-address > a.e-listing-address-line:last",
        addressReady: false,
        insertAfter: "div.e-listing-address > a.e-listing-address-line:last"
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

    if (!cfg.addressReady) {
        address = [address[3].trim(), "?AO", address[2].trim(), address[0].trim(), address[1].replace(/д\./i, "").trim()];
    }

    address = {
        city: address[0] + ", " + address[1],
        district: address[2],
        street: address[3],
        building: address[4]
    };

    if (address.city.search(/Москва/i) < 0) {
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