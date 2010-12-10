var loadMap, initMap;

(function ($) {
    var getApiData, getApiDataSuccess, getApiDataFail, buildCurrentTimestamp, getlastRefresh, storeDataInStorage,
    retrieveEvents, apiLoadingStarted = false, i=1;

    getApiData = function () {
        var url, container;
        // Api definition
        // /api/event/$id.json
        // /api/events/upcoming.json
        // /api/events/past.json
        // /api/user/$twittername.json
        //console.log(JSON.parse(localStorage.getItem("events")));

        if (buildCurrentTimestamp() < (getlastRefresh() + 5)) {
            console.log('Used Cached Data');
            render();
            return;
        }
        console.log('Updating API Data');
        $.ajax({
            url: 'http://techup.ch/api/events/upcoming.json',
            success: getApiDataSuccess,
            error: getApiDataFail,
            dataType: 'json'
        });
    };

    getApiDataFail = function (e) {
        alert('Could not connect to the API, probably a cross domain problem.');
    };

    getApiDataSuccess = function (data) {
        storeDataInStorage(data);
    };

    buildCurrentTimestamp = function () {
        var timestamp = new Date().getTime();
        timestamp = parseInt(timestamp / 1000, 10);
        return timestamp;
    };

    getlastRefresh = function () {
        var lastRefresh;
        if (typeof(localStorage) == 'undefined') {
            alert('Local storage not supported by this browser.');
        }
        lastRefresh = localStorage.getItem("lastRefresh");
        if (lastRefresh === null) {
            return 0;
        }
        return parseInt(lastRefresh, 10);
    };

    retrieveEvents = function () {
        return JSON.parse(localStorage.getItem("events"));
    };

    render = function () {
        var events = retrieveEvents();
        var ul = $('#content');
        var li = '';
        $.each(events, function (id, event) {
            li = li + '<li data-index=' + id + '><h3>' + event.name + '</h3><p class="ui-li-desc">' + event.dateFrom.date + ' - ' + event.dateTo.date + ', ' + event.city + '</p></li>';
        });
        ul.html(li)
            .click(function(e) {
                var index = $(e.target).parent('li').data('index');
                var selectedMeetup = events[index];
                $('#detailViewContent').jqotesub('#detailViewTemplate', selectedMeetup);
                $('#detailview').data('meetup', selectedMeetup);
                $.mobile.changePage('#detailview');
                $.mobile.updateHash('#detailview/' + index); // This is a hack related to http://forum.jquery.com/topic/changepage-not-updating-hash-for-internal-div-pages
            })
            .listview('refresh', true);
    };

    storeDataInStorage = function (data) {
        var timestamp = 0;
        if (typeof(localStorage) == 'undefined') {
            alert('Local storage not supported by this browser.');
        }

        localStorage.setItem("events", JSON.stringify(data.events));
        localStorage.setItem("lastRefresh", buildCurrentTimestamp());
        render();
    };

    getApiData();
}(jQuery));

loadMap = function() {
    $('body').append('<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false&callback=initMap&language=en&v=3.1"></script>');

    initMap = function() {
        var location, map, marker, meetup;

        meetup = $('#detailview').data('meetup');
        console.log(meetup);
        location = new google.maps.LatLng(meetup.lat, meetup.lon);
        map = new google.maps.Map($('#meetupMap')[0], {
            zoom: 14,
            center: location,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControlOptions: {
                mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.HYBRID]
            }
        });
        marker = new google.maps.Marker({
            position: location,
            map: map
        });
    }
}
