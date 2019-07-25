$(document).ready(function () {
    var config = {
        url: null,
        method: "GET"
    }
    function searchFilter() {
        var { url, method } = config;

        makeAjaxCall(url, method).done(function (result) {
            $('.result-container').empty();
            $('.err').remove();
            var person = result;
            if (person.length) {
                for (var item in person) {
                    // Destructured Person object -- Magic!!
                    var { first_name, last_name, list_agency_desc, list_no, list_title_desc, published_date } = person[item];

                    var card_content = '<div class="card col-sm-4"><div class="card-content">' +
                        '<div class="card-item"><p class="first-name">' + first_name + '</p><p class="last-name">' + last_name + '</p></div>' +
                        '<div class="card-item"><p class="agency-desc">' + list_agency_desc + '</p><p class="agency-no">' + list_no + '</p></div>' +
                        '<div class="card-item"><p class="list_title_desc">' + list_title_desc + '</p><p class="published_date">' + published_date + '</p></div>' +
                        '</div></div>';

                    $('.result-container').append(card_content);
                    $('.search-tag').removeClass('hide');
                }
            }
            else {
                var error_content = '<div class=err>No results found</div>';
                $('.result-container').append(error_content);
            }
        }).fail(function (reason) {
            console.log('Error processing your request.', reason);
        });
    }

    function makeAjaxCall(url, methodType) {
        return $.ajax({
            url: url,
            method: methodType,
            dataType: "json",
        });
    }
    function prepareAjaxCall() {
        var baseURL = "https://data.cityofnewyork.us/resource/5scm-b38n.json";
        var firstName = $('#first-name').val().toUpperCase().replace(/\s+/g, '');
        var lastName = $('#last-name').val().toUpperCase().replace(/\s+/g, '');

        if (firstName != "" && lastName != "") {
            config.url = baseURL + "?first_name=" + firstName + "&last_name=" + lastName + "";
        }
        else if (firstName == "" && lastName != "") {
            config.url = baseURL + "?last_name=" + lastName + "";
        }
        else if (firstName != "" && lastName == "") {
            config.url = baseURL + "?first_name=" + firstName + "";
        }
        else {
            config.url = baseURL;
        }
        startFilterProcess();
    }

    function startFilterProcess() {
        var obj = $('.preloader'),
            inner = $('.preloader_inner');
        $(obj).addClass('show');
        var w = 0,
            t = setInterval(function () {   /* <--------------------- Loader -------*/
                w = w + 1;
                $(inner).html('<div class=percent>' + w + '% </br> Waiting for results</div>');
                if (w === 100) {
                    $(obj).removeClass('show');
                    clearInterval(t);
                    w = 0;

                    /*---- Call ----*/
                    searchFilter();
                }
            }, 20);
    }

    $(document).on('click', '#search-btn', function () {
        prepareAjaxCall();
    });

    /*---------------On Enter key press-------------------*/
    $(document).on('keypress', function (e) {
        if (e.which == 13) {
            prepareAjaxCall();
        }
    });
});