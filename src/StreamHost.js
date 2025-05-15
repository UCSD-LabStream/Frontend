import {io} from "socket.io-client";
import { Peer } from 'peerjs';
import { useEffect } from "react";

function StreamHost() {

	let streams;

    useEffect(() => {
        const init = async () => {
            // required to access enumerateDevices
            await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
            streams = [];
      
            for (let i = 0; i < videoDevices.length; i++) {
                streams.push(await navigator.mediaDevices.getUserMedia({video: {deviceId: videoDevices[i].deviceId}, audio: false}));
                document.getElementById('main-page').innerHTML += `<video autoplay playsinline id='video${i}'></video>`;
                document.getElementById(`video${i}`).srcObject = streams[i];
        
                if (i != 0) {
                    streams[0].addTrack(streams[i].getVideoTracks()[0]);
                }
            }
            if (streams.length > 0) {
                document.getElementById('video0').srcObject = streams[0];
            }
          };
      
        init();
    }, [])

    var peer = new Peer();
    let viewerIds = [];
    let call;
    let hostId;

    useEffect(() => {

        const socket = io.connect('https://labstream.ucsd.edu', {
            path: '/camera',
            transports: ['websocket']
        });

        peer.on('open', function(id) {
            hostId = id;
        });

        peer.on('disconnected', function() {
            console.log("currently disconnected...")
			peer.reconnect()
		})
        
        socket.on('connect', async (event) => {
            console.log('Connected to server!');
            await new Promise(resolve => {
                const checkHostId = setInterval(() => {
                    if (typeof hostId !== 'undefined') {
                        clearInterval(checkHostId);
                        resolve();
                    }
                }, 100);
            });
        
            socket.emit('stream_start',  JSON.stringify({
                'client': '8555',
                'operation': 'connecting',
                'hostId': hostId
            }));
        });
	
	    socket.on('viewer_join', (event) => {
    call = peer.call(event, streams[0])
})
    }, [])

    return (
        <div id="main-page" className="flex"></div>
    )
}

export default StreamHost
