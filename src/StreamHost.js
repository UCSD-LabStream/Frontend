import {io} from "socket.io-client";
import { Peer } from 'peerjs';
import { useEffect, useState, useRef } from "react";

function StreamHost() {

    // references to video tags to be able to add streams as their src object
    const videoRefs = useRef([]);

    // required to re-render the videos
    const [isPopulated, populateVideos] = useState(0)
    
    // holds the streams
    // the refs are necessary here since the websockets use the initial state
    const [streams, addStreams] = useState([])
    const streamsRef = useRef([])

    // tags the streams as fourier or brewster (or any other exp)
    const [streamTags, changeStreamTags] = useState([])
    const streamTagsRef = useRef([])

    const [hostId, changeHostId] = useState('')
    
    function handleStreamTags(event, index) {
        const newTags = streamTags.map((tag, i) => {
            if (i === index) {
                return event.target.value
            } else {
                return tag
            }
        })
        changeStreamTags(newTags)
    }

    useEffect(() => {
        const init = async () => {
            // required to access enumerateDevices
            await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
            let tempStreams = [];
      
            for (let i = 0; i < videoDevices.length; i++) {
                tempStreams.push(await navigator.mediaDevices.getUserMedia({video: {deviceId: videoDevices[i].deviceId}, audio: false}));
        
                if (i != 0) {
                    tempStreams[0].addTrack(tempStreams[i].getVideoTracks()[0]);
                }
            }

            addStreams(tempStreams)
            changeStreamTags(Array(tempStreams.length).fill('fourier'))
            populateVideos(isPopulated + 1) // reruns the code for populating the video tags
        };
        init();
    }, [])

    useEffect(() => {
        streamsRef.current = streams
    }, [streams])

    useEffect(() => {
        streamTagsRef.current = streamTags
    }, [streamTags])

    useEffect(() => {

        // prevents the abort error
        if (streams.length === 0) {
            return
        }
        
        videoRefs.current.forEach((video, index) => {
            if (video) {
                video.pause()
                console.log(video)
                console.log(streams[index])
                video.srcObject = streams[index]
                video.play()
            }
        })
        //})
        
        //populateVideos()
        
    }, [isPopulated])

    
    let call;

    useEffect(() => {
        const peer = new Peer();

        const socket = io.connect('https://labstream.ucsd.edu', {
            path: '/camera',
            transports: ['websocket']
        });

        peer.on('open', function(id) {
            changeHostId(id)
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
            call = peer.call(event, streamsRef.current[0], options)
        })
    }, [])

    return (
        <div id="main-page" className="flex">
            { [...Array(4).keys()].map((index) => {
                return (<div className="z-10">
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
