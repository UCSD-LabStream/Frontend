import React from 'react';
import { useEffect, useState, useRef } from 'react';
import './App.scss';
import {io} from "socket.io-client";
import { Peer } from 'peerjs';
import { Paper, Slider, TextField, SvgIcon, IconButton, Typography, Stack, Switch, Button, Icon } from '@mui/material'
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid2'
import ThreeD from './3D';
import toast, {Toaster} from "react-hot-toast";

import { OpenInFull, CloseFullscreen, Pause, RotateRight, RotateLeft, FastForward } from '@mui/icons-material';

const SOCKET_URL = 'https://labstream.ucsd.edu';

function App() {
	const connecting = useRef(false);
	const socket_connection = useRef(null);

	// stores motor speed values
	const [motorInput, handleSpeedUpdate] = useState({
        imageMotor: 0,
		filterMotor: 0
    });

	// stores state of 2x button
	const [isFilterTwoTimes, handleFilterTwoTimes] = useState(false)
	const [isImageTwoTimes, handleImageTwoTimes] = useState(false)

	// stores current dimension state (2D or 3D)
	const [is3D, switchDimensions] = useState(false)
	const handleSwitch = () => {
		switchDimensions(!is3D)
	}

	// allow for expandable components
	const [modelExpand, expandModel] = useState(false)
	const handleModelExpand = () => {
		expandModel(!modelExpand)
	}
	const [webcamExpand, expandWebcam] = useState(false)
	const handleWebcamExpand = () => {
		expandWebcam(!webcamExpand)
	}

	// store the streams
	const [streams, addStream] = useState({})

	// allow for expandable video
	const [videoExpand, expandVideo] = useState(0)
	const videoExpandRef = useRef(null)
	const handleVideoExpand = (videoId) => {
		expandVideo(videoId)
		if (videoExpandRef.current != null && videoId != 0) {
			console.log(videoId)
			console.log(streams)
			videoExpandRef.current.srcObject = streams["video" + (videoId - 1)]
		}
	}

	// websocket for motors
	useEffect(() => {
        if (connecting.current) return;
        connecting.current = true;
        // This effect will run when the app starts
        // this will be responsible for initializing the websocket connection
        try {
            console.log("attempting to connect")
            const socket = io(SOCKET_URL, {
                path: '/labstream/socket.io',
            });

            socket.on('connect', () => {
                console.log('connected');
                toast.success('Connected to the server',  {
                    duration: 5000
                });
                socket_connection.current = socket;
                socket.emit('gear_state');
            })

            // there is a new gear state, update the gear
            socket.on('gear', (data) => {
                // set_gear_state(data);
				handleSpeedUpdate({imageMotor : 0, filterMotor : 0})
                toast.success('Gear State has been retrieved or updated.',  {
                    duration: 5000
                });
                console.log(data);
            }, 200);
        } catch(e) {
            toast.error('Failed to connect to the server');
        }
    }, []);

	// websocket for webcam viewer
	useEffect(() => {
		const cameraSocket = io(SOCKET_URL, {
			path: '/camera',
			transports: ['websocket']
		});

		var peer = new Peer();
		let viewerId;

		peer.on('open', function(id) {
			viewerId = id
		});

		peer.on('call', function(call) {
			call.answer();
			call.on('stream', (stream) => {
				let videoTracks = stream.getVideoTracks();
				let tempStreams = {} // necessary since useState doesn't save correctly in for loop
				for (let i = 0; i < videoTracks.length; i++) {
					// THIS IS ONLY IN CASE THE VIDEO DOESN'T ALREADY EXIST IN DOM
					// if (!document.getElementById(`video${i}`)) {
					// 	document.getElementById('main-page').innerHTML += `<video playsinline autoplay id='video${i}'></video>`;
					// }

					tempStreams[`video${i}`] = new MediaStream([videoTracks[i]])
					document.getElementById(`video${i}`).srcObject = new MediaStream([videoTracks[i]]);
				}
				addStream({...tempStreams})
			})
		});

		peer.on('disconnected', function() {
			peer.reconnect()
		})

		cameraSocket.on('connect', async (event) => {
			console.log("Connected to camera server!")
			await new Promise(resolve => {
				const checkViewerId = setInterval(() => {
					if (typeof viewerId !== 'undefined') {
						clearInterval(checkViewerId);
						resolve();
					}
				}, 100);
			});
		
			cameraSocket.emit("stream_view", JSON.stringify({
				'client': '8555',
				'operation': 'connecting',
				'viewerId': viewerId
			}));
		});
	}, [])

	return (
		<body>
			<Toaster position="bottom-left"  />

			<Grid container spacing={2} backgroundColor="background" sx={{padding: '10px'}}>
				<Grid container order={modelExpand ? 1 : 2} size={modelExpand ? 12 : 6} sx={{ transition: 'all 0.3s ease', height: `87vh`, backgroundColor: 'white', color: 'black', padding: '20px', borderRadius: '15px'}}>					
					
					<div style={{ width: '100%' }}>
						<Stack direction="row" spacing={2} sx={{justifyContent: "space-between", alignItems: "center"}}>
							<Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
								<Typography>3D</Typography>
								<Switch checked={is3D} onChange={handleSwitch}/>
								<Typography>2D</Typography>
							</Stack>
							<Button variant='contained' onClick={handleModelExpand}> 
								{modelExpand ? <>COLLAPSE</> : <>EXPAND</>}
							</Button>
						</Stack>
					{is3D ? 
					<><img src="/ThorLabsKit.png" style={{ width: '80%', height: 'auto', objectFit: 'cover' }} /></> : 
					<><ThreeD></ThreeD></>
					}
					</div>
					
					<div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
						
						<div style={{ display: 'flex', flexDirection: 'row', marginTop: 20, width: '100%' }}>
							<Typography textAlign='left' sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }} >Filter motor</Typography>
							<IconButton style={{ backgroundColor: 'transparent' }} onClick={() => {handleSpeedUpdate({...motorInput, filterMotor: -1 * (isFilterTwoTimes ? 2 : 1)}); console.log(motorInput); socket_connection.current.emit('adjust', {gear: 1, value: -1 * (isFilterTwoTimes ? 2 : 1)})}}>
								<RotateLeft color={motorInput.filterMotor < 0 ? 'secondary' : ''}/>
							</IconButton>
							<IconButton style={{ backgroundColor: 'transparent' }} onClick={() => {handleSpeedUpdate({...motorInput, filterMotor: 0}); console.log(motorInput); socket_connection.current.emit('adjust', {gear: 1, value: 0})}}>
								<Pause />
							</IconButton>
							<IconButton style={{ backgroundColor: 'transparent' }} onClick={() => {handleSpeedUpdate({...motorInput, filterMotor: (isFilterTwoTimes ? 2 : 1)}); console.log(motorInput); socket_connection.current.emit('adjust', {gear: 1, value: (isFilterTwoTimes ? 2 : 1)})}}>
								<RotateRight color={motorInput.filterMotor > 0 ? 'secondary' : ''}/>
							</IconButton>
							<IconButton style={{ backgroundColor: 'transparent' }} onClick={() => {handleSpeedUpdate({...motorInput, filterMotor: motorInput.filterMotor * (isFilterTwoTimes ? 0.5 : 2)}); handleFilterTwoTimes(!isFilterTwoTimes); console.log(motorInput); socket_connection.current.emit('adjust', {gear: 1, value: motorInput.filterMotor * (isFilterTwoTimes ? 0.5 : 2)})}}>
								<FastForward color={isFilterTwoTimes ? 'secondary' : ''}/>
							</IconButton>
							
						</div>

						<div style={{ display: 'flex', flexDirection: 'row', marginTop: 20, width: '100%' }}>
							<Typography textAlign='left' sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }} >Image motor</Typography>
							<IconButton style={{ backgroundColor: 'transparent' }} onClick={() => {handleSpeedUpdate({...motorInput, imageMotor: -1 * (isImageTwoTimes ? 2 : 1)}); console.log(motorInput); socket_connection.current.emit('adjust', {gear: 2, value: -1 * (isImageTwoTimes ? 2 : 1)})}}>
								<RotateLeft color={motorInput.imageMotor < 0 ? 'secondary' : ''} />
							</IconButton>
							<IconButton style={{ backgroundColor: 'transparent' }} onClick={() => {handleSpeedUpdate({...motorInput, imageMotor: 0}); console.log(motorInput); socket_connection.current.emit('adjust', {gear: 2, value: 0})}}>
								<Pause />
							</IconButton>
							<IconButton style={{ backgroundColor: 'transparent' }} onClick={() => {handleSpeedUpdate({...motorInput, imageMotor: (isImageTwoTimes ? 2 : 1)}); console.log(motorInput); socket_connection.current.emit('adjust', {gear: 2, value: (isImageTwoTimes ? 2 : 1)})}}>
								<RotateRight color={motorInput.imageMotor > 0 ? 'secondary' : ''} />
							</IconButton>
							<IconButton style={{ backgroundColor: 'transparent' }} onClick={() => {handleSpeedUpdate({...motorInput, imageMotor: motorInput.imageMotor * (isImageTwoTimes ? 0.5 : 2)}); handleImageTwoTimes(!isImageTwoTimes); console.log(motorInput); socket_connection.current.emit('adjust', {gear: 2, value: motorInput.imageMotor * (isImageTwoTimes ? 0.5 : 2)})}}>
								<FastForward color={isImageTwoTimes ? 'secondary' : ''}/>
							</IconButton>
						</div>
					</div>
				</Grid>

				<Grid order={webcamExpand ? 1 : 3} size={webcamExpand ? 12 : 6} sx={{ transition: 'all 0.3s ease', height: '87vh', backgroundColor: 'white', color: 'black', padding: '20px', borderRadius: '15px'}}>
					<div style={{ width: '100%' }}>
						<Stack direction="row" spacing={2} sx={{ justifyContent: "flex-end", alignItems: "center"}}>
							<Button variant='contained' onClick={handleWebcamExpand}>
								{webcamExpand ? <>COLLAPSE</> : <>EXPAND</>}
							</Button>
						</Stack>
					</div>

					{/* expanded view */}
					<div className={videoExpand == 0 ? "hidden" : "flex justify-center h-full w-full"}>
						<div className="h-[80%] w-[50vw] max-w-full mt-4 bg-slate-300 rounded-md overflow-hidden relative">
							<IconButton className="z-10 absolute"><CloseFullscreen onClick={() => handleVideoExpand(0)} /></IconButton>
							<video ref={videoExpandRef} className="top-0 left-0 absolute h-full w-full object-cover" autoPlay></video>
						</div>
					</div>
					

					{/* default view */}
					<div className={(videoExpand == 0 ? "" : "hidden ") + (webcamExpand ? "" : "flex-col ") + "h-[80%] mt-4 flex gap-4 items-center"}>
						<div className={(webcamExpand ? "flex-col " : "") + "flex-1 flex gap-4 overflow-hidden h-full w-full"}>
							<div className="relative flex-1 w-full bg-slate-300 rounded-md overflow-hidden">
								<IconButton className="z-10 absolute"><OpenInFull onClick={() => handleVideoExpand(1)} /></IconButton>
								<video className="top-0 left-0 absolute h-full w-full object-cover" id="video0" autoPlay></video>
							</div>
							<div className="relative flex-1 bg-slate-300 rounded-md overflow-hidden">
								<IconButton className="z-10 absolute"><OpenInFull onClick={() => handleVideoExpand(2)} /></IconButton>
								<video className="top-0 left-0 absolute h-full w-full object-cover" id="video1" autoPlay></video>
							</div>
						</div>
						<div className="relative flex-1 bg-slate-300 rounded-md overflow-hidden w-[55%] h-full">
							<IconButton className="z-10 absolute"><OpenInFull onClick={() => handleVideoExpand(3)} /></IconButton>
							<video className="top-0 left-0 absolute h-full w-full object-cover" id="video2" autoPlay></video>
						</div>
					</div>
				</Grid>

			</Grid>
			</body>
		// </div>
	);
}

export default App;
