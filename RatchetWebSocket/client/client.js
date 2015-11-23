// Verbindung zum implementierten Websocketserver herstellen
var connection = new WebSocket("ws://magnus.dev:8080");

connection.onopen = function () {
    connection.send("Neuer Client ist nun verbunden!");
};

connection.onerror = function (error) {
    // Fehlerhandling
};

connection.onmessage = function (data) {
    // Neue Daten vom Server empfangen. UI aktualisieren!
};