window.techup = (function ($) {
    var initialize, getApiDataSuccess, getApiDataFail, getLastRefresh,
    showMap, initMap, retrieveEvents, fillAttendees, dateFormatter;

    initialize = function () {
        // Api definition
        // /api/event/$id.json
        // /api/events/upcoming.json
        // /api/events/past.json
        // /api/user/$twittername.json
        render();

        // refresh outdated cache
        if (new Date().getTime() > (getLastRefresh() + 3600000)) {
            $.ajax({
                url: 'http://techup.ch/api/events/upcoming.json',
                success: getApiDataSuccess,
                error: getApiDataFail,
                dataType: 'json'
            });
        }
    };

    getApiDataFail = function (e) {
        alert('Could not connect to the API, probably a cross domain problem.');
    };

    getApiDataSuccess = function (data) {
        localStorage.setItem("events", JSON.stringify(data.events));
        localStorage.setItem("lastRefresh", new Date().getTime());
        render(true);
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

    render = function (doRefresh) {
        var events, ul, li;
        events = retrieveEvents();
        ul = $('#listViewContent');
        li = '';
        if (events === null) {
            return;
        }
        ul.jqotesub('#listViewTemplate', {events: events, formatDate: dateFormatter})
            .click(function (e) {
                e.stopImmediatePropagation();
                var index = $(e.target).closest('li').data('index');
                var selectedMeetup = events[index];
                $('#detailViewContent')
                    .jqotesub('#detailViewTemplate', selectedMeetup)
                    .find('ul').listview();
                $('#detailview').data('meetup', selectedMeetup);
                $('#showMap').click(showMap);
                $('#showAttendees').click(fillAttendees);
                $.mobile.changePage('#detailview');
                $.mobile.updateHash('#detailview'); // This is a hack related to http://forum.jquery.com/topic/changepage-not-updating-hash-for-internal-div-pages
            });
        try {
            ul.listview('refresh', true);
        } catch(e) {
        }
    };

    showMap = function () {
        var meetup;
        meetup = $('#detailview').data('meetup');
        $('#mapContent').jqotesub('#mapTemplate', meetup);
        if (typeof(google) === 'undefined') {
            $('body').append('<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false&callback=techup.initMap&language=en&v=3.1"></script>');
        } else {
            initMap();
        }
    };

    fillAttendees = function () {
        meetup = $('#detailview').data('meetup');
        $('#attendeesTitle').html(meetup.name);
        $('#attendeesContainer').jqotesub('#attendeesTemplate', meetup).listview('refresh', true);
    };

    initMap = function () {
        var location, map, marker, meetup;

        meetup = $('#detailview').data('meetup');
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

    dateFormatter = function (date) {
        var matches = date.match(/(\d+)-(\d+)-(\d+) (\d+):(\d+):(\d+)/);
        date = new Date(matches[1], matches[2], matches[3], matches[4], matches[5], matches[6]);
        return (date.getDate() < 10 ? '0' : '') + date.getDate() +
            '.' + (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1) +
            '.' + date.getFullYear() +
            ' ' + (date.getHours() < 10 ? '0' : '') + date.getHours() +
            ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    };

    $(document).bind('deviceready', function () {
        initialize();
    });

    // init hack for browser debugging
    if (navigator.userAgent.indexOf('Windows') ||
        navigator.userAgent.indexOf('Linux') ||
        navigator.userAgent.indexOf('Macintosh')) {
        $(function () {
            initialize();
        });
    }

    return {
        initMap: initMap
    };
}(jQuery));
