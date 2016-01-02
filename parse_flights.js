var i = 0;

function expandNextTab(i, continuation) {
    var elem = document.getElementsByClassName("pir-arr-nc")[i];
    if (elem) {
        elem.click();
    }
    continuation();
}

function expandTabIteration(continuation) {
    setTimeout(function() {
        if (i < 20) {
            expandNextTab(i, function() {
                i += 1;
                expandTabIteration(continuation);
            });
        } else {
            continuation();
        }
    }, 100);
}

function expandAllFlights(continuation) {
    var elements = document.getElementsByClassName("pxc");
    var k = 0;
    for (var i = 0; i < elements.length; i++) {
        if (elements[i].innerHTML.indexOf("2015") != -1) {
            k += 1;
            elements[i].click();
        }
    }
    continuation(k);
}

var r = null;
function getAllFlightContainers(max, continuation) {
    var routes = document.getElementsByClassName("card-section");

    //the 0th element in this list isn't a flight, and
    //get elements by class name doesn't return an array
    var build = [];
    for (var i = 1; i < max+1;  i++) {
        build.push(routes[i]);
    }
    continuation(build);
}

function parseFlight(flight) {
    var from = flight.getElementsByClassName("vk_ans")[0].innerHTML;
    var to = flight.getElementsByClassName("vk_ans")[1].innerHTML;

    var from_date = flight.getElementsByClassName("vk_gy")[0].children[1].innerHTML;
    var from_time = flight.getElementsByClassName("vk_bk")[2].innerHTML;

    var to_date = flight.getElementsByClassName("vk_gy")[1].children[1].innerHTML;
    var to_time = flight.getElementsByClassName("vk_bk")[3].innerHTML;

    return {
        "from": { "airport": from, "time": Date.parse(from_date + " 2015, " + from_time) },
        "to": { "airport": to, "time": Date.parse(to_date + " 2015, " + to_time) }
    };

}

function getFlightsFromContainer(container) {
    var individualFlights = container.getElementsByTagName("ol");
    var build = [];
    for (var i = 0; i < individualFlights.length; i++) {
        build.push(parseFlight(individualFlights[i]));
    }
    console.log(build);

    return build;
}

expandNextTab(i, function() {
    expandTabIteration(function() {
        expandAllFlights(function(max) {
            setTimeout(function() {
                getAllFlightContainers(max, function(routes) {
                    var completed = [];
                    for (var i = 0; i < routes.length; i++) {
                        completed = completed.concat(getFlightsFromContainer(routes[i]));
                    }
                    console.log(completed);
                    document.body.innerHTML = JSON.stringify(completed);
                });
            }, 1000);
        });
    });
});
