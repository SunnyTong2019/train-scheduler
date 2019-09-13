$(document).ready(function () {

    var firebaseConfig = {
        apiKey: "AIzaSyA5uS7r_fgRWfzzGwqcl3NeAeaId-nJ6y0",
        authDomain: "sunny-cbc-activities.firebaseapp.com",
        databaseURL: "https://sunny-cbc-activities.firebaseio.com",
        projectId: "sunny-cbc-activities",
        storageBucket: "",
        messagingSenderId: "525657123109",
        appId: "1:525657123109:web:e95c6e92592c09f9a3d2cc"
    };

    firebase.initializeApp(firebaseConfig);

    var database = firebase.database();

    var trainListRef = database.ref('/trainList');


    $("#add-train").on("click", function (event) {

        event.preventDefault();

        var trainName = $("#trainName").val().trim();
        var destination = $("#destination").val().trim();
        var firstTrainTime = $("#firstTrainTime").val().trim();
        var frequency = $("#frequency").val().trim();

        trainListRef.push({
            trainName: trainName,
            destination: destination,
            firstTrainTime: firstTrainTime,
            frequency: frequency
        });

        $("#trainName").val("");
        $("#destination").val("");
        $("#firstTrainTime").val("");
        $("#frequency").val("");

    });


    trainListRef.on("child_added", function (snapshot) {

        var trEle = $("<tr>");

        // create <td> for the first 3 fields: Train Name, Destination, Frequency
        var trainTdEle = $("<td>" + snapshot.val().trainName + "</td>");
        var destinationTdEle = $("<td>" + snapshot.val().destination + "</td>");
        var frequencyTdEle = $("<td>" + snapshot.val().frequency + "</td>");

        // calculate Next Arrival
        var now = moment();
        var nextArrival = moment(snapshot.val().firstTrainTime, "HH:mm");

        while (nextArrival.isBefore(now)) {
            nextArrival.add(parseInt(snapshot.val().frequency), 'minutes');
        }

        // calculate Minutes Away
        var minutesAway = Math.round(nextArrival.diff(now, "minutes", true));

        // create <td> for Next Arrival and Minutes Away
        var nextArrivalTdEle = $("<td>" + nextArrival.format("LT") + "</td>");
        var minutesAwayTdEle = $("<td>" + minutesAway + "</td>");

        trEle.append(trainTdEle, destinationTdEle, frequencyTdEle, nextArrivalTdEle, minutesAwayTdEle);

        $("tbody").append(trEle);

    }, function (errorObject) {
        console.log("error: " + errorObject.code);
    });


    /*
    - function "redrawTable" is to remove elements in <tbody>, then get all the train data from firebase and re-create elements to display in <tbody>;
    - then use setInterval to call this function every 1 minute so Next Arrival and Minutes Away are up to date;
    - for now, I need to comment out these code as I don't want it keep querying firebase

    function redrawTable() {

        $("tbody").empty();

        trainListRef.once('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {

                var trEle = $("<tr>");

                // create <td> for the first 3 fields: Train Name, Destination, Frequency
                var trainTdEle = $("<td>" + childSnapshot.val().trainName + "</td>");
                var destinationTdEle = $("<td>" + childSnapshot.val().destination + "</td>");
                var frequencyTdEle = $("<td>" + childSnapshot.val().frequency + "</td>");

                // calculate Next Arrival
                var now = moment();
                var nextArrival = moment(childSnapshot.val().firstTrainTime, "HH:mm");

                while (nextArrival.isBefore(now)) {
                    nextArrival.add(parseInt(childSnapshot.val().frequency), 'minutes');
                }

                // calculate Minutes Away
                var minutesAway = Math.round(nextArrival.diff(now, "minutes", true));

                // create <td> for Next Arrival and Minutes Away
                var nextArrivalTdEle = $("<td>" + nextArrival.format("LT") + "</td>");
                var minutesAwayTdEle = $("<td>" + minutesAway + "</td>");

                trEle.append(trainTdEle, destinationTdEle, frequencyTdEle, nextArrivalTdEle, minutesAwayTdEle);

                $("tbody").append(trEle);

            });
        });
    }

    setInterval(redrawTable, 60000);


    // Another solution to calculate Next Arrival and Minutes Away:

    var tFrequency = parseInt(snapshot.val().frequency);
    var firstTime = snapshot.val().firstTrainTime;
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    var currentTime = moment();
    var diffTime = moment().diff(firstTimeConverted, "minutes");
    var tRemainder = diffTime % tFrequency;
    var minutesAway = tFrequency - tRemainder;
    var nextArrival = moment().add(minutesAway, "minutes");
    */

});




