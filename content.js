$(document).ready(function () {
    console.log("Yes--> " + $("address > a").length);
    $("address > a").each(function() {
        console.log($(this).html());
    });
});