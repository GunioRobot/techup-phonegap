(function ($) {
    var getApiData, getApiDataSuccess, getApiDataFail;
    
    getApiData = function () {
        var url, container;
        // /api/event/$id.json
        // /api/events/upcoming.json
        // /api/events/past.json
        // /api/user/$twittername.json

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
        // $('body').html(data);
        console.log(data);
    };
    getApiData();
    
}(jQuery));