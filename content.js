$(document).ready(function () {
    let address = [];
    $("address > a").each(function () {
        address.push($(this).html());
    });

    address = address.join().split(",");

    console.debug("Sending: " + JSON.stringify(address));
    chrome.runtime.sendMessage({
        msg: "address", address: {
            city: address[0] + ", " + address[1],
            district: address[2],
            street: address[3],
            building: address[4]
        }
    }, function (response) {
        console.debug("Buildings: " + JSON.stringify(response));
        $(getDescriptionTable(response)).insertAfter("address");
        $("p#tipdoma_section_enable").click(function () {
            $("div#tipdoma_section").slideToggle();
        });
    });
});

function getDescriptionTable(buildings) {
    let out ="<p id=\"tipdoma_section_enable\">Справка по типу дома</p><div id=\"tipdoma_section\">";
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
            out += "Individual project";
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