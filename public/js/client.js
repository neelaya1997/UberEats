window.setTimeout(function () {
    $(".alert").fadeTo(1000, 0);
    $(this).css({
        transform: "translate(500px)",
        transition: "ease all 0.5s",
    });
}, 5000);

{
    $(".alert").css({
        transform: "translate(0px)",
        transition: "ease all 0.5s",
    });
}

let searchInput = "search_input";
$(document).ready(function () {
    let autocomplete;
    autocomplete = new google.maps.places.Autocomplete((document.getElementById(searchInput)), {
        type: ['geocode']
    });
    google.maps.event.addListner(autocomplete, 'place_changed', function () {
        let near_place = autocomplete.getPlace();
        document.getElementById('latitude_input').value = near_place.geometry.location.lat();
        document.getElementById('longitude_input').value = near_place.geometry.location.lng();
    })

});
$(document).on('change', '#' + searchInput, function () {
    document.getElementById('latitude_input').value = '';
    document.getElementById('longitude_input').value = '';
})