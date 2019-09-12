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
        var trainTdEle = $("<td>" + snapshot.val().trainName + "</td>");
        var destinationTdEle = $("<td>" + snapshot.val().destination + "</td>");
        var frequencyTdEle = $("<td>" + snapshot.val().frequency + "</td>");


        var now = moment();
        var nextArrival = moment(snapshot.val().firstTrainTime, "HH:mm");

        while (nextArrival.isBefore(now)) {
            nextArrival.add(parseInt(snapshot.val().frequency), "m");
        }

        var minutesAway = nextArrival.diff(now, "minutes");


        var nextArrivalTdEle = $("<td>" + nextArrival.format("LT") + "</td>");
        var minutesAwayTdEle = $("<td>" + minutesAway + "</td>");

        trEle.append(trainTdEle, destinationTdEle, frequencyTdEle, nextArrivalTdEle, minutesAwayTdEle);

        $("tbody").append(trEle);

    },

        function (errorObject) {
            console.log("error: " + errorObject.code);
        });

});