var config = {
    apiKey: "AIzaSyB-lB8LARaWxcqUuNN0f2VwHDgF7D3-15Y",
    authDomain: "trainscheduler-a91ed.firebaseapp.com",
    databaseURL: "https://trainscheduler-a91ed.firebaseio.com",
    projectId: "trainscheduler-a91ed",
    storageBucket: "trainscheduler-a91ed.appspot.com",
    messagingSenderId: "831667325304"
};
firebase.initializeApp(config);
var database = firebase.database();

$("#trainAdd").on("click", function (event) {
    event.preventDefault();

    var tName = $("#trainName").val().trim();
    var tDest = $("#trainDestination").val().trim();
    var tTime = moment($("#startTrain").val().trim(), "HH:mm").format("HH:mm");
    var tFreq = moment($("#freqRate").val().trim(), "mm").format("mm");

    console.log(tTime);
    console.log(tFreq);

    if (tName === "") {
        alert("Please enter a name for the Train.");
        return;
    };

    if (tDest === "") {
        alert("Please enter a destination for the Train.");
        return;
    };

    if (tTime === "Invalid date") {
        alert("Please enter a valid military time for the First Train time.");
        return;
    };

    var newTrain = {
        name: tName,
        destination: tDest,
        firstTime: tTime,
        frequency: tFreq
    };

    database.ref().push(newTrain);

    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.firstTime);
    console.log(newTrain.frequency);

    alert("Train successfully added.");

    $("#trainName").val("");
    $("#trainDestination").val("");
    $("#startTrain").val("");
    $("#freqRate").val("");

    

});

database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    var tName = childSnapshot.val().name;
    var tDest = childSnapshot.val().destination;
    var tTime = childSnapshot.val().firstTime;
    var tFreq = childSnapshot.val().frequency;

    console.log(tName);
    console.log(tDest);
    console.log(tTime);
    console.log(tFreq);

    //Math
    var converted = moment(tTime, "HH:mm").subtract(1, "years");
    var diffTime = moment().diff(moment(converted),"minutes");
    var tRemainder = diffTime % tFreq;

    //minutes away
    var tMinutesTillTrain = tFreq - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain)

    var nextTrain = moment().add(tMinutesTillTrain, "minutes");

    //next arrival
    var tArrival = moment(nextTrain).format("hh:mm");

    var newRow = $("<tr>").append(
        $("<td>").text(tName),
        $("<td>").text(tDest),
        $("<td>").text(tFreq),
        $("<td>").text(tArrival),
        $("<td>").text(tMinutesTillTrain),
    );

    $("#train-table > tbody").append(newRow);

});