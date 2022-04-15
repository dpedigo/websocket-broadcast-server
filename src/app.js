#!/usr/bin/env node
'use strict'

import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';
import fs from 'fs/promises';
import {dirname} from 'path';
import { fileURLToPath } from 'url';

const port = process.env.PORT || 8080;
const websocketPattern = /^\/\.ws\/(.*)/;

const wss = new WebSocketServer({ noServer: true });
wss.on('connection', (ws) => {
    ws.on('message', (data, isBinary) => {
        wss.clients.forEach((client) => {
            // send to all other clients connected to same room
            if (client !== ws && ws.room === ws.room && client.readyState === WebSocket.OPEN) {
                client.send(data, { binary: isBinary });
            }
        });
    }); 
});

http.createServer()
.on('request', async (request, response) => {
    const match = request.url.match(websocketPattern);
    if (match) {
        const data = await fs.readFile(dirname(fileURLToPath(import.meta.url)) + '/index.html');
        
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end(data.toString());
    } else {
        const buffer = [];
        for await (const chunk of request) {
             buffer.push(chunk);
        }

        let data = `${request.method} ${request.url}\n`;
        for (const [key, value] of Object.entries(request.headers)) {
            data += `${key}: ${value}\n`;
        }

        data += Buffer.concat(buffer).toString();
        response.end(data);
    }
})
.on('upgrade', (request, socket, head) => {
    const match = request.url.match(websocketPattern);
    if (match) {
        wss.handleUpgrade(request, socket, head, (ws) => {
            ws.room = match[1]; // save the room for later
            wss.emit('connection', ws, request);
        });
    } else {
        socket.destroy();
    }
})
.listen(port, () => {
    console.log(`HTTP server is listening on port: ${port}`);
});