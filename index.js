var xhr = new XMLHttpRequest();
xhr.open("GET", "http://tipdoma.ru/search_str.php?value=%D0%90%D0%B2%D0%B0%D0%BD%D0%B3%D0%B0%D1%80%D0%B4%D0%BD%D0%B0%D1%8F", true);
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
        var content = document.getElementById('content');
        console.log(xhr.responseText);
        content.innerHTML = xhr.responseText;
    }
}
xhr.send();