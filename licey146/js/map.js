"use strict";
var i = 0;
var maps;

function getAllUrlParams(url) {

    // get query string from url (optional) or window
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

    // we'll store the parameters here
    var obj = {};

    // if query string exists
    if (queryString) {

        // stuff after # is not part of query string, so get rid of it
        queryString = queryString.split('#')[0];

        // split our query string into its component parts
        var arr = queryString.split('&');

        for (var i=0; i<arr.length; i++) {
            // separate the keys and the values
            var a = arr[i].split('=');

            // in case params look like: list[]=thing1&list[]=thing2
            var paramNum = undefined;
            var paramName = a[0].replace(/\[\d*\]/, function(v) {
                paramNum = v.slice(1,-1);
                return '';
            });

            // set parameter value (use 'true' if empty)
            var paramValue = typeof(a[1])==='undefined' ? true : a[1];

            // (optional) keep case consistent
            paramName = paramName.toLowerCase();
            paramValue = paramValue.toLowerCase();

            // if parameter name already exists
            if (obj[paramName]) {
                // convert value to array (if still string)
                if (typeof obj[paramName] === 'string') {
                    obj[paramName] = [obj[paramName]];
                }
                // if no array index number specified...
                if (typeof paramNum === 'undefined') {
                    // put the value on the end of the array
                    obj[paramName].push(paramValue);
                }
                // if array index number specified...
                else {
                    // put the value at that index number
                    obj[paramName][paramNum] = paramValue;
                }
            }
            // if param name doesn't exist yet, set it
            else {
                obj[paramName] = paramValue;
            }
        }
    }

    return obj;
}

var params = getAllUrlParams(window.location.href);
function myMap() {
    var mapCanvas = document.getElementById("map");
    var mapOptions = {
        center: new google.maps.LatLng(55.85728025,49.10239577),
        zoom: 18,
        disableDefaultUI: true,
        fullscreenControl:true
    };

    maps = new google.maps.Map(mapCanvas, mapOptions);
}
var markers = {1:[],2:[],3:[],4:[],5:[],6:[],7:[],8:[],9:[],'alw':[]};
function marker(title,lat,lng,theme,img,always_show) {
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat,lng),
        map: maps,
        animation: google.maps.Animation.DROP,
        title: title
    });
    var ms = {marker:marker,image:img,theme:theme,title:title};
    marker.addListener('click', function() {
        display(ms);
    });
    if(always_show){
        markers['alw'].push(ms);
    }
    else {
        markers[theme].push(ms);
    }
    return ms;
}

function setGetParameter(paramName, paramValue) {
    var url = window.location.href;
    var hash = location.hash;
    url = url.replace(hash, '');
    if (url.indexOf(paramName + "=") >= 0)
    {
        var prefix = url.substring(0, url.indexOf(paramName));
        var suffix = url.substring(url.indexOf(paramName));
        suffix = suffix.substring(suffix.indexOf("=") + 1);
        suffix = (suffix.indexOf("&") >= 0) ? suffix.substring(suffix.indexOf("&")) : "";
        url = prefix + paramName + "=" + paramValue + suffix;
    }
    else
    {
        if (url.indexOf("?") < 0)
            url += "?" + paramName + "=" + paramValue;
        else
            url += "&" + paramName + "=" + paramValue;
    }
    window.location.href = url + hash;
}

function display(marker) {
    document.querySelector('#img').setAttribute('src',marker.image);
    document.querySelector('#title').innerHTML=  marker.title;
    document.querySelector('#bottom').innerHTML = marker.marker.position;
    maps.setZoom(18);
    maps.panTo(marker.marker.getPosition());
}
function toggle_night() {
    var night = [
        {
            "stylers": [
                {
                    "hue": "#ff1a00"
                },
                {
                    "invert_lightness": true
                },
                {
                    "saturation": -100
                },
                {
                    "lightness": 33
                },
                {
                    "gamma": 0.5
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#2D333C"
                }
            ]
        }
    ];
    var day = null;
    var styles=[night,day];
    maps.setOptions({styles:styles[i]});
    $('nav').toggleClass('navbar-dark navbar-light');
    $('nav').toggleClass('bg-dark bg-light');
    $('body').toggleClass('bg-dark bg-light');
    $('footer').toggleClass('bg-light bg-dark');
    $('#cnt').toggleClass('bg-white bg-black');
    $('#cnt2').toggleClass('bg-light bg-dark');
    $('#cnt3').toggleClass('bg-light bg-dark');
    $('#title').toggleClass('text-dark text-light');
    $('#cnt4').toggleClass('bg-white bg-black');
    $('footer').toggleClass('text-white text-dark');
}
function toggle() {
    i = (i+1)%2;
    setGetParameter('ii',i);
}
function queryMarkers(type) {
    for(var ii in markers){
        for(var m in markers[ii]){
            if (type === '0' || type === null || ii==='alw') {
                markers[ii][m].marker.setMap(maps);
            }
            else {
                if (type !== ii) {
                    markers[ii][m].marker.setMap(null);
                }
                else {
                    markers[ii][m].marker.setMap(maps);
                }
            }
        }
    }
}

function goto(type) {
    setGetParameter('type',type);
}
myMap();
display(marker('Лицей 145',55.85728025,49.10239577,1,'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/%D0%9C%D0%91%D0%9E%D0%A3_%3D%D0%9B%D0%B8%D1%86%D0%B5%D0%B9_%E2%84%96_145%3D_%28%D0%B3._%D0%9A%D0%B0%D0%B7%D0%B0%D0%BD%D1%8C%29_.JPG/1280px-%D0%9C%D0%91%D0%9E%D0%A3_%3D%D0%9B%D0%B8%D1%86%D0%B5%D0%B9_%E2%84%96_145%3D_%28%D0%B3._%D0%9A%D0%B0%D0%B7%D0%B0%D0%BD%D1%8C%29_.JPG',true));
marker('Национальный музей Республики Татарстан',55.79577321,49.10960859,1,'http://17.04.2015.xn----7sbjubaqairdbd1aqae9a8l.xn--p1ai/images/content/images/10-3.jpeg',false);
marker('Музей Социалистического Быта',55.78691113,49.11964104,1,'http://strana.ru/media/images/uploaded/gallery_promo21333681.jpg',false);
marker('Музей Константина Васильева',55.79004621,49.11646431,1,'http://www.mytravelbook.org/object_foto/2016/04/Muzei_Konstantina_Vasileva_1.jpg',false);
marker('Казанский Вертолетный Завод',55.85194355,49.03998473,2,'https://u-kon.ru/wp-content/uploads/2012/03/art1-240.jpg',false);
marker('КАПО им. С.П. ГОРБУНОВА',55.85888197,49.10783395,2,'http://www.tupolev.ru/files/core/o_kompanii/filialy/KAZ/%D0%BD%D0%B0%20%D1%81%D0%B0%D0%BC%D1%8B%D0%B9%20%D0%B2%D0%B5%D1%80%D1%85_%D0%B3%D0%BB%D0%B0%D0%B2%D0%BD%D0%B0%D1%8F.jpg',false);
marker('КМПО',55.85525994,49.10169303,2,'http://kmpo.tatar/images/resize/slider/639x351/8049ce4cee55d3bf0f266456370c9808.jpg',false);
marker('Литературный музей Габдуллы Тукая',55.77744195,49.11568072,3,'http://komanda-k.ru/sites/default/files/IMG_2551m.jpg',false);
marker('Музей-квартира Мусы Джалиля',55.79414794,49.13239154,3,'https://to-kazan.ru/wp-content/uploads/2015/12/%D0%94%D0%B6%D0%B0%D0%BB%D0%B8%D0%BB%D1%8C-2.jpg',false);
marker('Музей С. Сайдашева',55.79432881,49.12997588,3,'http://www.exmu.ru/media/museums/muzey_salikha_saydasheva_bolshoy_kontsertnyy_zal_im_s_saydasheva_8065.jpg',false);
queryMarkers(params.type);


if((params.ii|0)!==i){
    toggle_night();
}
i=params.ii|0;