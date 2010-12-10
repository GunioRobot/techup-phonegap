var techup;

techup = (function ($) {
    var initialize, getApiDataSuccess, getApiDataFail, getLastRefresh,
    showMap, initMap, retrieveEvents;

    initialize = function () {
        // Api definition
        // /api/event/$id.json
        // /api/events/upcoming.json
        // /api/events/past.json
        // /api/user/$twittername.json

        if (new Date().getTime() < (getLastRefresh() + 5000)) {
            console.log('Used Cached Data');
            render();
        } else {
            console.log('Updating API Data');
            $.ajax({
                url: 'http://techup.ch/api/events/upcoming.json',
                success: getApiDataSuccess,
                error: getApiDataFail,
                dataType: 'json'
            });
        }

        $('#showMap').click(showMap);
    };

    getApiDataFail = function (e) {
        alert('Could not connect to the API, probably a cross domain problem.');
    };

    getApiDataSuccess = function (data) {
        localStorage.setItem("events", JSON.stringify(data.events));
        localStorage.setItem("lastRefresh", new Date().getTime());
        render();
    };

    getLastRefresh = function () {
        var lastRefresh;
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
        var events, ul, li;
        events = retrieveEvents();
        ul = $('#content');
        li = '';
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

    showMap = function() {
        if (google === undefined) {
            $('body').append('<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false&callback=techup.initMap&language=en&v=3.1"></script>');
        } else {
            initMap();
        }
    };

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
    };

    $(document).bind('deviceready', function() {
        initialize();
    });

    // init hack for browser debugging
    if (navigator.userAgent.indexOf('Windows') ||
        navigator.userAgent.indexOf('Linux') ||
        navigator.userAgent.indexOf('Macintosh')) {
        initialize();
    }

    return {
        initMap: initMap
    }

}(jQuery));
