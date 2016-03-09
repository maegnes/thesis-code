// Verbindung zum implementierten Websocketserver herstellen
var connection = new WebSocket("ws://magnus.dev:8080");

connection.onopen = function () {
    connection.send("Neuer Client ist nun verbunden!");
};

connection.onclose = function (error) {
    // Client hat die Verbindung getrennt
};

connection.onmessage = function (data) {
    // Neue Daten vom Server empfangen. UI aktualisieren!
};
