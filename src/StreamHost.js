import {io} from "socket.io-client";
import { Peer } from 'peerjs';
import { useEffect, useState, useRef } from "react";

function StreamHost() {

    const videoRefs = useRef([]);

    const [isPopulated, populateVideos] = useState(false)
    const [streams, addStreams] = useState([])
    const streamsRef = useRef([])
    const [streamTags, changeStreamTags] = useState([])
    const streamTagsRef = useRef([])
    function handleStreamTags(event, index) {
        const newTags = streamTags.map((tag, i) => {
            if (i === index) {
                return event.target.value
            } else {
                return tag
            }
        })
        console.log(newTags)
        changeStreamTags(newTags)
        console.log(streamTags)
    }

    function initVideos() {
        const init = async () => {
            // required to access enumerateDevices
            await navigator.mediaDevices.getUserMedia({ video: true, audio: false });

            console.log('uhh.. got video yet??')
      
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
            let tempStreams = [];
      
            for (let i = 0; i < videoDevices.length; i++) {
                tempStreams.push(await navigator.mediaDevices.getUserMedia({video: {deviceId: videoDevices[i].deviceId}, audio: false}));
                //document.getElementById('main-page').innerHTML += `<video autoplay playsinline id='video${i}'></video>`;
        
                if (i != 0) {
                    tempStreams[0].addTrack(tempStreams[i].getVideoTracks()[0]);
                }
            }

            console.log('is empty...?', tempStreams)
            addStreams(tempStreams)

            // for (let i = 0; i < videoDevices.length; i++) {
            //     document.getElementById(`video${i}`).srcObject = streams[i]
            // }

            changeStreamTags(Array(streams.length).fill('fourier'))
            populateVideos(true)
        };
        init();
    }

    useEffect(() => {
        streamsRef.current = streams
    }, [streams])

    useEffect(() => {
        streamTagsRef.current = streamTags
    }, [streamTags])

    useEffect(() => {
        async function populateVideos() {
            await initVideos()
            videoRefs.current.forEach((video, index) => {
            if (video && streams) {
                video.srcObject = streams[index]
            }
        })
        }
        populateVideos()
        
    }, [isPopulated])

    var peer = new Peer();
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
            let options = {metadata: streamTagsRef.current};
            console.log(streamsRef.current)
            call = peer.call(event, streamsRef.current[0], options)
        })
    }, [])

    return (
        <div id="main-page" className="flex">
            { [...Array(4).keys()].map((index) => {
                return (<div className="z-10">
                    {console.log(streams)}
                    <video autoplay playsinline ref={el => videoRefs.current[index] = el} id={`video${index}`}></video>
                    <select onChange={(event) => {handleStreamTags(event, index)}}>
                        <option>fourier</option>
                        <option>brewster</option>
                    </select>
                </div>)
            })
                
            }
        </div>
    )
}

export default StreamHost
