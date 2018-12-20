// initialize Firebase
var config = {
    apiKey: "AIzaSyCUa3OmzBQAV9MHxQg6Pgl2s5533V5qjEI",
    authDomain: "trainscheduler-d8b8f.firebaseapp.com",
    databaseURL: "https://trainscheduler-d8b8f.firebaseio.com/",
    storageBucket: "trainscheduler-d8b8f.appspot.com"
};

firebase.initializeApp(config);

// variable reference to database
var database = firebase.database();

var trainName = "";
var trainDest = "";
var firstTime = "";
var trainFreq = 0;
var nextTrain = "";
var minutesAway = 0;

// Capture Button Click
$("#add-user").on("click", function (event) {
    event.preventDefault();

    trainName = $("#trainName-input").val().trim();
    trainDest = $("#trainDest-input").val().trim();
    firstTime = $("#firstTime-input").val().trim();
    trainFreq = $("#trainFreq-input").val().trim();

    // calculate train arrival time and minutes away from first time and frequency
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    var tRemainder = diffTime % trainFreq;
    console.log(tRemainder);

    minutesAway = trainFreq - tRemainder;
    console.log("MINUTES TILL TRAIN: " + minutesAway);

    nextTrain = moment().add(minutesAway, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    // Code for the push
    dataRef.ref().push({

        trainName: trainName,
        trainDest: trainDest,
        trainFreq: trainFreq,
        nextTrain: nextTrain,
        minutesAway: minutesAway,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
});


dataRef.ref().on("child_added", function (childSnapshot) {

    // Log everything that's coming out of snapshot
    console.log(childSnapshot.val().trainName);
    console.log(childSnapshot.val().trainDest);
    console.log(childSnapshot.val().trainFreq);
    console.log(childSnapshot.val().nextTrain);
    console.log(childSnapshot.val().minutesAway);
    console.log(childSnapshot.val().joinDate);

    // full list of items to the well
    $("#full-train-list").append("<div class='well'><span class='train-trainName'> " +
        childSnapshot.val().trainName +
        " </span><span class='train-trainDest'> " + childSnapshot.val().trainDest +
        " </span><span class='train-trainFreq'> " + childSnapshot.val().trainFreq +
        " </span><span class='train-nextTrain'> " + childSnapshot.val().nextTrain +
        " </span><span class='train-minutesAway'>" + childSnapshot.val().minutesAway +
        " </span></div>");

    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

dataRef.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function (snapshot) {
    // Change the HTML to reflect
    $("#trainName-display").text(snapshot.val().trainName);
    $("#trainDest-display").text(snapshot.val().trainDest);
    $("#trainFreq-display").text(snapshot.val().trainFreq);
    $("#nextTrain-display").text(snapshot.val().nextTrain);
    $("#minutesAway-display").text(snapshot.val().minutesAway);
});