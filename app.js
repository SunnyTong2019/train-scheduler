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

    var trainListRef = database.ref('trainList');

    $("#add-train").on("click", function (event) {

        event.preventDefault();

        var trainName = $("#trainName").val().trim();
        var destination = $("#destination").val().trim();
        var firstTrainTime = $("#firstTrainTime").val().trim();
        var frequency = $("#frequency").val().trim();

        var newTrainRef = trainListRef.push();

        newTrainRef.set({
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


    trainListRef.on("value", function (snapshot) {

        snapshot.forEach(function (childSnapshot) {

            var trEle = $("<tr>");

            var trainTdEle = $("<td>" + childSnapshot.val().trainName + "</td>");
            var destinationTdEle = $("<td>" + childSnapshot.val().destination + "</td>");
            var frequencyTdEle = $("<td>" + childSnapshot.val().frequency + "</td>");

            trEle.append(trainTdEle, destinationTdEle, frequencyTdEle);

            $("tbody").append(trEle);

        });

    },

        function (errorObject) {
            console.log("error: " + errorObject.code);
        });




});