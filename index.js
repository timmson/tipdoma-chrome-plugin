chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
    let activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {msg: "address"}, function (address) {
        $("#house_address").html(address.street + " " + address.building);
        $.get("http://tipdoma.ru/search_str.php?value=" + decodeURIComponent(address.street), function (data1) {
            let str1 = data1.match(/change_building\(.*,/i)[0];
            let id = str1.substr(16, str1.length - 3);
            $.get("http://tipdoma.ru/search_bld.php?id=" + id + "&value=" + decodeURIComponent(address.street), function (data2) {
                let str2 = data2.replace(/href="series/ig, 'href="http://tipdoma.ru/series');
                $("#house_type").html(str2);
            });
        });
    });
});


