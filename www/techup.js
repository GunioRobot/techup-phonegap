(function ($) {
    var getApiData, getApiDataSuccess, getApiDataFail, buildCurrentTimestamp, getlastRefresh, storeDataInStorage, retrieveEvents;
    
    getApiData = function () {
        var url, container;
        
        // Api definition
        // /api/event/$id.json
        // /api/events/upcoming.json
        // /api/events/past.json
        // /api/user/$twittername.json

        // console.log(buildCurrentTimestamp());
        // console.log(getlastRefresh() + 10);
        
        console.log(JSON.parse(localStorage.getItem("events")));
        
        if (buildCurrentTimestamp() < (getlastRefresh() + 5)) {
            console.log('skipped');
            render();
            return;
        } else {
            console.log('not skipped');
        }

        $.ajax({
            url: 'http://techup.ch/api/events/upcoming.json',
            success: getApiDataSuccess,
            error: getApiDataFail,
            dataType: 'json'
        });

    };
    
    getApiDataFail = function (e) {
        alert('bang');
        console.log(e);
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
        $.each(events, function (id, event) {
            console.log(event);
        });
    };
    
    storeDataInStorage = function (data) {
        var timestamp = 0;
        if (typeof(localStorage) == 'undefined') {
            alert('Local storage not supported by this browser.');
        }

        // var mycount = localStorage.length;
        
        // $.forEach(data.events, function (id, value) {
        //            
        //        });

        //this populates localStorage with a few links if there are none
        // if (mycount<1) {
        // timestamp = new Date().getTime();
        //         timestamp = parseInt(timestamp / 1000, 10);
        
        
        
        localStorage.setItem("events", JSON.stringify(data.events));
        localStorage.setItem("lastRefresh", buildCurrentTimestamp());
        render();
            // localStorage.setItem("Grand Rapids",
            // "loadFlickr('72157621350530834','37054878@N03')");
        // }

        // for ( var i=0, len=mycount; i<len; i++ ){
        //             var myitem = localStorage.key(i);
        //             var mylink = localStorage.getItem(myitem); 
        //             var myli = "<li><a href=\"javascript:" + mylink + "\">" + myitem + "</a></li>";
        //             $('#nav').append(myli);
        //         }
    };
    
    
    getApiData();
    

}(jQuery));