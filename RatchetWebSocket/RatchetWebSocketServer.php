<?php

namespace Magnus
{

    use Ratchet\ConnectionInterface;
    use Ratchet\WebSocket\WsServer;
    use Ratchet\Http\HttpServer;
    use Ratchet\Server\IoServer;
    use Ratchet\MessageComponentInterface;

    class DartServer
    {
        public function __construct()
        {
            $webSocketServer = new WsServer(new DartLogik());

            $server = IoServer::factory(
                new HttpServer($webSocketServer)
            );

            $server->run();
        }
    }

    class DartLogik implements MessageComponentInterface
    {
        function onOpen(ConnectionInterface $conn)
        {
            // Neuer Client hat sich mit Server verbunden
        }

        function onClose(ConnectionInterface $conn)
        {
            // Client $conn hat Verbindung mit Server getrennt
        }

        function onError(ConnectionInterface $conn, \Exception $e)
        {
            // Beim Client $conn ist Fehler $e aufgetreten
        }

        function onMessage(ConnectionInterface $from, $msg)
        {
            // Der Client $from hat die Nachricht $mst gesendet
        }
    }
}