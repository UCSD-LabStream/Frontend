## Streaming Documentation

Author: Wanning Lu

LabStream uses PeerJS, a WebRTC wrapper, for livestreaming. WebRTC allows for the host and the viewer to establish a direct connection, where the server is only necessary for setting up the stream.

Host:
- `peer.on('open')`
	- Sets up the Peer ID for the host as soon as the Peer is created
- `socket.on('connect')`
	- Sends the host's Peer ID to the server as soon as it is initialized
- `socket.on('viewer_join')`
	- When the host receives a viewer join request from the server, start a call with the viewer using the viewer's Peer ID
	- Now, a connection is established directly between the host and viewer without the need for the server
- `peer.on('disconnected')`
    - If connection to the server is lost, then attempt to reestablish connection through `peer.reconnect()`

Viewer:
- `peer.on('open')`
	- Sets up the Peer ID for the host as soon as the Peer is created
- `socket.on('connect')`
	- Sends the viewer's Peer ID to the server as soon as it is initialized
	- Also creates a view stream request
- `peer.on('call')`
	- Once the host has created a call, the viewer receives the stream from the host and displays it in the browser
- `peer.on('disconnected')`
    - If connection to the server is lost, then attempt to reestablish connection through `peer.reconnect()`

Server:
- `socket.on('stream_start')`
	- Receives the host ID and stores it
- `socket.on('stream_view')`
	- Receives viewer ID and sends it to the host through a 'viewer_join' event