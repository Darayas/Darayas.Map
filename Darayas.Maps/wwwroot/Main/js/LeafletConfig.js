
var map;
var PlacesMarker = new Array();
var ClickedMarker;
var ClickedMarkerIcon = L.icon({
    iconUrl: 'Main/img/ClickedMarker.png',
    shadowUrl: 'Main/img/marker-shadow.png',
    iconSize: [38, 38],
    shadowSize: [41, 41],
    iconAnchor: [22, 38],
    shadowAnchor: [22, 62]
});

function LoadMap(_Lat, _Lng, _Zoom) {
    map = null;
    var CopyRight = 'قدرت گرفته از: <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | وبسایت <a  class="bold" href="https://dotnetLearn.com">دات نت لرن</a> | طراح و برنامه نویس: <a class="bold" href="https://dotnetlearn.com/fa/Resumes/MohammadRezaAhmadi">محمدرضا احمدی</a> | سورس در <a class="bold" href="https://github.com/reza9025/DotnetLearn.Maps">github</a>';
    map = L.map('map', {
        center: [_Lat, _Lng],
        zoom: _Zoom,
        contextmenu: true,
        contextmenuWidth: 140,
        contextmenuItems: [{
            text: 'اینجا کجاست؟',
            callback: WhatsHere,
            icon: '/Main/img/marker-here.png'
        }]
    }).on('zoomend', function () {
        LoadPlace();
    })
        .on('moveend', function () {
            LoadPlace();
        });

    L.control.scale({ position: "bottomright" }).addTo(map);

    var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: CopyRight
    });

    var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        attribution: CopyRight
    }).addTo(map);

    var Stamen_Terrain = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}', {
        attribution: CopyRight,
        subdomains: 'abcd',
        minZoom: 2,
        maxZoom: 13,
        ext: 'png'
    });

    var _baseLayers = {
        "OpenStreetMap_Mapnik": OpenStreetMap_Mapnik,
        "OpenTopoMap": OpenTopoMap,
        "Stamen_Terrain": Stamen_Terrain
    };

    L.control.layers(_baseLayers, null, { position: "bottomright" }).addTo(map);
    map.zoomControl.setPosition('bottomright');

    map.on("click", function (e) {
        if (ClickedMarker != undefined) {
            ClosePlaceDetails();
            map.removeLayer(ClickedMarker);
            ClickedMarker = undefined;
        } else {
            AddMarkerOnClick(e.latlng);
            ShowPlaceNameBox(e.latlng.lat, e.latlng.lng);
        }
    });

    LoadPlace();

}

function WhatsHere(e) {
    AddMarkerOnClick(e.latlng);
    ShowPlaceNameBox(e.latlng.lat, e.latlng.lng);
}

function ShowPlaceNameBox(_Lat, _Lng) {
    $('.PlaceDetails').animate({ bottom: -200 }, 200, function () {

        $.get('https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=' + _Lat + '&lon=' + _Lng, { "_": $.now() }, function (_data) {

            //$('.PlaceDetails .PlaceImg').attr('src', '');
            $('.PlaceDetails .PlaceName .city').text(_data.address.city ?? _data.address.village ?? _data.address.town ?? _data.address.municipality ?? _data.address.county ?? _data.address.region ?? _data.address.district);
            $('.PlaceDetails .PlaceName .state').text((_data.address.state ?? _data.address.province) + ', ' + _data.address.country);
            $('.PlaceDetails .PlaceName .LatLng .Lat').text(_Lat);
            $('.PlaceDetails .PlaceName .LatLng .Lng').text(_Lng);
        });

        $('.PlaceDetails').animate({ bottom: 10 }, 400);
    });

}

function AddMarkerOnClick(LatLng) {
    ClickedMarker = new L.marker(LatLng, {
        icon: ClickedMarkerIcon,
        contextmenu: true,
        contextmenuInheritItems: true,
        contextmenuItems: [{
            text: 'حذف مارکر',
            index: 0,
            callback: function () {
                map.removeLayer(ClickedMarker);
                ClosePlaceDetails();
                ClickedMarker = undefined;
            }
        }, {
            separator: true,
            index: 1
        }]
    }).addTo(map);
}

function LoadRoads(_jsonData) {
    $.ajax({
        url: '/Compo/Direction/GetLstRoads',
        type: 'post',
        data: { JsonData: JSON.stringify(_jsonData) },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("XSRF-TOKEN",
                $('input:hidden[name="__RequestVerificationToken"]').val());
        }
    }).done(function (res) {
        $('.LstRoads').html(res);
    });
}

function Route() {

    var ArrWayPoints = new Array();
    $('#TextBoxs .TxtLatLng').each(function () {
        if ($(this).val().trim(" ") != "")
            ArrWayPoints.push(new L.latLng($(this).val().split(', ')[0], $(this).val().split(', ')[1]));
    });

    if (ArrWayPoints.length == 0) {
        alert("مبدا و مقد را مشخص نمایید");
        return;
    }

    var dirMarker;
    var routeControl = L.Routing.control({
        routeWhileDragging: true,
        lineOptions: {
            styles: [{ color: 'green', opacity: .4, weight: 5 }]
        },
        createMarker: function (i, waypoints, n) {
            dirMarker = L.marker(waypoints.latLng, {
                draggable: true
            });

            return dirMarker;
        }
    }).on("routesfound", function (e) {
        var _routes = e.routes;
        var summary = _routes[0].summary;
        dirMarker.bindPopup('فاصله: ' + (summary.totalDistance / 1000).toFixed(2) + " Km, زمان: " + Math.round(summary.totalTime / 60) + " دقیقه").openPopup();

        LoadRoads(_routes);
    }).addTo(map);

    routeControl.setWaypoints(ArrWayPoints);
}

function Direction() {

    $.ajax({
        url: '/Compo/Direction/LoadDirection',
        type: 'get',
        data: {}
    }).done(function (res) {
        $('.SideBar').html(res);
        OpenSideBar();
    });
}

function RemoveDirection() {
    var _lat = map.getCenter().lat;
    var _lng = map.getCenter().lng;
    var _zoom = map.getZoom();

    $('.SideBar').html("");
    ClosePlaceDetails();
    CloseSideBar();

    map.remove();
    map = null;

    LoadMap(_lat, _lng, _zoom);
}

function LoadPlace() {

    for (var i = 0; i < PlacesMarker.length; i++) {
        map.removeLayer(PlacesMarker[i]);
    }


    var _NorthEast = map.getBounds()._northEast.lat + ", " + map.getBounds()._northEast.lng;
    var _SouthWest = map.getBounds()._southWest.lat + ", " + map.getBounds()._southWest.lng;
    var _zoom = map.getZoom();


    $.ajax({
        url: '/Compo/SearchPlace/Places',
        type: 'get',
        data: { NorthEast: _NorthEast, SouthWest: _SouthWest, zoom: _zoom }
    }).done(function (res) {

        for (var i = 0; i < res.length; i++) {
            PlacesMarker.push(new L.marker(new L.latLng(res[i].lat, res[i].lng), {
                icon: L.icon({
                    iconUrl: 'Main/img/' + res[i].imgName,
                    shadowUrl: 'Main/img/marker-shadow.png',
                    iconSize: [38, 38],
                    shadowSize: [41, 41],
                    iconAnchor: [22, 38],
                    shadowAnchor: [22, 62]
                })
            }).bindPopup(res[i].name).addTo(map));
        }

    });
}

function ShowPlace(_Lat, _Lng, _Zoom, _ImgName) {
    map.remove();
    map = null;

    LoadMap(_Lat, _Lng, _Zoom);

    var PlaceMarker = new L.marker(new L.latLng(_Lat, _Lng), {
        icon: L.icon({
            iconUrl: 'Main/img/' + _ImgName,
            shadowUrl: 'Main/img/marker-shadow.png',
            iconSize: [38, 38],
            shadowSize: [41, 41],
            iconAnchor: [22, 38],
            shadowAnchor: [22, 62]
        })
    })/*.bindPopup(res[i].name)*/.addTo(map)

}