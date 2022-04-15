# WebSocket Broadcast Server

A simple WebSocket server that broadcasts messages received to all clients listening on the same endpoint. You can create distinct "rooms" by specifying a unique endpoint when connecting to the WebSocket server. For example:

`http://localhost:8080/.ws/test` and `http://localhost:8080/.ws/testing` are distinct rooms. There are no hardcoded limitations with regard to number of rooms or room identifiers.

It's also possible to make HTTP requests to any url that doesn't start with `/.ws/`. These requests will be echoed back to the client.

## Configuration Options
- You can specify the `PORT` environment variable to change the port the server will listen on. Defaults to 8080.

## Usage
A few usage examples have been provided below.

### Locally
```
PORT=5577 node src/app.js
```

### Docker
```
docker run -d -p 5577:8080 --rm danpedigo/websocket-broadcast-server
```