import React from 'react';
import { useEffect, useState, useRef } from 'react';
import './App.scss';
import {io} from "socket.io-client";
import { Peer } from 'peerjs';
import { IconButton, Typography, Stack, Switch, Button, Popover } from '@mui/material'
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid2'
import ThreeD from './3D';
import toast, {Toaster} from "react-hot-toast";

import { OpenInFull, CloseFullscreen, Pause, RotateRight, RotateLeft, FastForward, InfoOutlined } from '@mui/icons-material';

const SOCKET_URL = 'https://labstream.ucsd.edu';

function App() {
	const connecting = useRef(false);
	const socket_connection = useRef(null);

	// stores motor speed values
	const [motorInput, handleSpeedUpdate] = useState({
        imageMotorH: "stop",
		imageMotorV: "stop",
		filterMotorH: "stop",
		filterMotorV: "stop",
    });

	// stores state of 2x button
	// const [isFilterTwoTimes, handleFilterTwoTimes] = useState(false)
	// const [isImageTwoTimes, handleImageTwoTimes] = useState(false)

	// stores current dimension state (2D or 3D)
	const [is3D, switchDimensions] = useState(false)
	const handleSwitch = () => {
		switchDimensions(!is3D)
	}

	// set popup for info button
	const [anchorEl, setAnchorEl] = useState(null);

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
				handleSpeedUpdate({imageMotorH : "stop", imageMotorV : "stop", filterMotorH : "stop", filterMotorV : "stop"})
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
				let currVideoIndex = 0;
				for (let i = 0; i < videoTracks.length; i++) {
					// THIS IS ONLY IN CASE THE VIDEO DOESN'T ALREADY EXIST IN DOM
					// if (!document.getElementById(`video${i}`)) {
					// 	document.getElementById('main-page').innerHTML += `<video playsinline autoplay id='video${i}'></video>`;
					// }
					console.log(stream)
					console.log(call.metadata)
					if (call.metadata[i] !== 'fourier') {
						continue
					}

					tempStreams[`video${currVideoIndex}`] = new MediaStream([videoTracks[i]])
					document.getElementById(`video${currVideoIndex}`).srcObject = new MediaStream([videoTracks[i]]);
					currVideoIndex += 1
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
		<body className='bg-transparent'>
			<Toaster position="bottom-left"  />

			<Grid container spacing={2} sx={{padding: '10px', backgroundColor: 'transparent'}}>
				<Grid container order={modelExpand ? 1 : 2} size={modelExpand ? 12 : 6} className="relative" sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px', transition: 'all 0.3s ease', height: `87vh`, backgroundColor: 'white', color: 'black', padding: '20px', borderRadius: '15px' }}>					
					
					<div style={{ width: '100%' }}>
						<Stack direction="row" spacing={2} sx={{justifyContent: "space-between", alignItems: "center"}}>
							<Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
								<Typography>3D</Typography>
								<Switch checked={is3D} onChange={handleSwitch}/>
								<Typography>2D</Typography>
								<IconButton onClick={(e) => setAnchorEl(e.currentTarget)}><InfoOutlined /></IconButton>
								<Popover
									open={Boolean(anchorEl)}
									anchorEl={anchorEl}
									onClose={() => setAnchorEl(null)}
									anchorOrigin={{
									vertical: 'bottom',
									horizontal: 'left',
									}}
								>
									<Typography className="p-2 w-[200px] bg-slate-100">To learn more about a component, click on it in the model. Left-click and drag to rotate the scene. Right-click and drag to pan. Scroll to zoom.</Typography>
								</Popover>
							</Stack>
							<Button variant='text' onClick={handleModelExpand}> 
								{modelExpand ? <>COLLAPSE</> : <>EXPAND</>}
							</Button>
						</Stack>
					{is3D ? 
					<><img src="/ThorLabsKit.png" style={{ width: '80%', height: 'auto', objectFit: 'cover' }} /></> : 
					<><ThreeD></ThreeD></>
					}
					</div>
					
					<div className="absolute flex gap-4 p-4 bg-white border-4 rounded-md bottom-5 left-5">
						<div className="flex flex-col flex-1 gap-4">
							<div className="flex w-full">
								<Typography textAlign='left' className="flex flex-col justify-center">Filter motor left-right</Typography>
								<IconButton style={{ backgroundColor: 'transparent' }} onClick={() => {handleSpeedUpdate({...motorInput, filterMotorH: "ccw"}); console.log(motorInput); socket_connection.current.emit('adjust', {gear: 1, value: "ccw"})}}>
									<RotateLeft color={motorInput.filterMotorH === "ccw" ? 'secondary' : ''} />
								</IconButton>
								<IconButton style={{ backgroundColor: 'transparent' }} onClick={() => {handleSpeedUpdate({...motorInput, filterMotorH: "stop"}); console.log(motorInput); socket_connection.current.emit('adjust', {gear: 1, value: "stop"})}}>
									<Pause />
								</IconButton>
								<IconButton style={{ backgroundColor: 'transparent' }} onClick={() => {handleSpeedUpdate({...motorInput, filterMotorH: "cw"}); console.log(motorInput); socket_connection.current.emit('adjust', {gear: 1, value: "cw"})}}>
									<RotateRight color={motorInput.filterMotorH === "cw" ? 'secondary' : ''} />
								</IconButton>
								{/* <IconButton style={{ backgroundColor: 'transparent' }} onClick={() => {handleSpeedUpdate({...motorInput, imageMotor: motorInput.imageMotor * (isImageTwoTimes ? 0.5 : 2)}); handleImageTwoTimes(!isImageTwoTimes); console.log(motorInput); socket_connection.current.emit('adjust', {gear: 2, value: motorInput.imageMotor * (isImageTwoTimes ? 0.5 : 2)})}}>
									<FastForward color={isImageTwoTimes ? 'secondary' : ''}/>
								</IconButton> */}
							</div>

							<div className="flex w-full">
								<Typography textAlign='left' className="flex flex-col justify-center">Filter motor up-down</Typography>
								<IconButton style={{ backgroundColor: 'transparent' }} onClick={() => {handleSpeedUpdate({...motorInput, filterMotorV: "ccw"}); console.log(motorInput); socket_connection.current.emit('adjust', {gear: 2, value: "ccw"})}}>
									<RotateLeft color={motorInput.filterMotorV === "ccw" ? 'secondary' : ''} />
								</IconButton>
								<IconButton style={{ backgroundColor: 'transparent' }} onClick={() => {handleSpeedUpdate({...motorInput, filterMotorV: "stop"}); console.log(motorInput); socket_connection.current.emit('adjust', {gear: 2, value: "stop"})}}>
									<Pause />
								</IconButton>
								<IconButton style={{ backgroundColor: 'transparent' }} onClick={() => {handleSpeedUpdate({...motorInput, filterMotorV: "cw"}); console.log(motorInput); socket_connection.current.emit('adjust', {gear: 2, value: "cw"})}}>
									<RotateRight color={motorInput.filterMotorV === "cw" ? 'secondary' : ''} />
								</IconButton>
								{/* <IconButton style={{ backgroundColor: 'transparent' }} onClick={() => {handleSpeedUpdate({...motorInput, imageMotor: motorInput.imageMotor * (isImageTwoTimes ? 0.5 : 2)}); handleImageTwoTimes(!isImageTwoTimes); console.log(motorInput); socket_connection.current.emit('adjust', {gear: 2, value: motorInput.imageMotor * (isImageTwoTimes ? 0.5 : 2)})}}>
									<FastForward color={isImageTwoTimes ? 'secondary' : ''}/>
								</IconButton> */}
							</div>

						</div>
						<div className="flex flex-col gap-4">
							<div className="flex w-full">
								<Typography textAlign='left' className="flex flex-col justify-center">Image motor left-right</Typography>
								<IconButton style={{ backgroundColor: 'transparent' }} onClick={() => {handleSpeedUpdate({...motorInput, imageMotorH: "ccw"}); console.log(motorInput); socket_connection.current.emit('adjust', {gear: 3, value: "ccw"})}}>
									<RotateLeft color={motorInput.imageMotorH === "ccw" ? 'secondary' : ''} />
								</IconButton>
								<IconButton style={{ backgroundColor: 'transparent' }} onClick={() => {handleSpeedUpdate({...motorInput, imageMotorH: "stop"}); console.log(motorInput); socket_connection.current.emit('adjust', {gear: 3, value: "stop"})}}>
									<Pause />
								</IconButton>
								<IconButton style={{ backgroundColor: 'transparent' }} onClick={() => {handleSpeedUpdate({...motorInput, imageMotorH: "cw"}); console.log(motorInput); socket_connection.current.emit('adjust', {gear: 3, value: "cw"})}}>
									<RotateRight color={motorInput.imageMotorH === "cw" ? 'secondary' : ''} />
								</IconButton>
								{/* <IconButton style={{ backgroundColor: 'transparent' }} onClick={() => {handleSpeedUpdate({...motorInput, imageMotor: motorInput.imageMotor * (isImageTwoTimes ? 0.5 : 2)}); handleImageTwoTimes(!isImageTwoTimes); console.log(motorInput); socket_connection.current.emit('adjust', {gear: 2, value: motorInput.imageMotor * (isImageTwoTimes ? 0.5 : 2)})}}>
									<FastForward color={isImageTwoTimes ? 'secondary' : ''}/>
								</IconButton> */}
							</div>

							<div className="flex w-full">
								<Typography textAlign='left' className="flex flex-col justify-center">Image motor up-down</Typography>
								<IconButton style={{ backgroundColor: 'transparent' }} onClick={() => {handleSpeedUpdate({...motorInput, imageMotorV: "ccw"}); console.log(motorInput); socket_connection.current.emit('adjust', {gear: 4, value: "ccw"})}}>
									<RotateLeft color={motorInput.imageMotorV === "ccw" ? 'secondary' : ''} />
								</IconButton>
								<IconButton style={{ backgroundColor: 'transparent' }} onClick={() => {handleSpeedUpdate({...motorInput, imageMotorV: "stop"}); console.log(motorInput); socket_connection.current.emit('adjust', {gear: 4, value: "stop"})}}>
									<Pause />
								</IconButton>
								<IconButton style={{ backgroundColor: 'transparent' }} onClick={() => {handleSpeedUpdate({...motorInput, imageMotorV: "cw"}); console.log(motorInput); socket_connection.current.emit('adjust', {gear: 4, value: "cw"})}}>
									<RotateRight color={motorInput.imageMotorV === "cw" ? 'secondary' : ''} />
								</IconButton>
								{/* <IconButton style={{ backgroundColor: 'transparent' }} onClick={() => {handleSpeedUpdate({...motorInput, imageMotor: motorInput.imageMotor * (isImageTwoTimes ? 0.5 : 2)}); handleImageTwoTimes(!isImageTwoTimes); console.log(motorInput); socket_connection.current.emit('adjust', {gear: 2, value: motorInput.imageMotor * (isImageTwoTimes ? 0.5 : 2)})}}>
									<FastForward color={isImageTwoTimes ? 'secondary' : ''}/>
								</IconButton> */}
							</div>
						</div>
					</div>
				</Grid>

				<Grid order={webcamExpand ? 1 : 3} size={webcamExpand ? 12 : 6} sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px', transition: 'all 0.3s ease', height: '87vh', zIndex: 2, backgroundColor: 'white', color: 'black', padding: '20px', borderRadius: '15px'}}>
					<div style={{ width: '100%' }}>
						<Stack direction="row" spacing={2} sx={{ justifyContent: "flex-end", alignItems: "center"}}>
							<Button variant='text' onClick={handleWebcamExpand}>
								{webcamExpand ? <>COLLAPSE</> : <>EXPAND</>}
							</Button>
						</Stack>
					</div>

					{/* expanded view */}
					<div className={videoExpand == 0 ? "hidden" : "flex justify-center h-full w-full"}>
						<div className="h-[80%] w-[50vw] max-w-full mt-4 bg-slate-300 rounded-md overflow-hidden relative">
							<IconButton className="absolute z-10"><CloseFullscreen onClick={() => handleVideoExpand(0)} /></IconButton>
							<video ref={videoExpandRef} className="absolute top-0 left-0 object-cover w-full h-full" autoPlay></video>
						</div>
					</div>
					

					{/* default view */}
					<div className={(videoExpand == 0 ? "" : "hidden ") + (webcamExpand ? "mr-[15%] " : "flex-col ") + "h-[80%] mt-4 flex gap-4 items-center"}>
						<div className={(webcamExpand ? "flex-col items-end " : "") + "flex-1 flex gap-4 overflow-hidden h-full w-full"}>
							<div className="relative flex-1 w-[60%] bg-slate-300 rounded-md overflow-hidden">
									<IconButton className="absolute z-10"><OpenInFull onClick={() => handleVideoExpand(1)} /></IconButton>
									<video className="absolute top-0 left-0 object-cover w-full h-full" id="video0" autoPlay></video>
							</div>
							<div className="relative flex-1 w-[60%] bg-slate-300 rounded-md overflow-hidden">
								<IconButton className="absolute z-10"><OpenInFull onClick={() => handleVideoExpand(2)} /></IconButton>
								<video className="absolute top-0 left-0 object-cover w-full h-full" id="video1" autoPlay></video>
							</div>
						</div>
						<div className="relative flex-1 bg-slate-300 rounded-md overflow-hidden w-[55%] h-full">
							<IconButton className="absolute z-10"><OpenInFull onClick={() => handleVideoExpand(3)} /></IconButton>
							<video className="absolute top-0 left-0 object-cover w-full h-full" id="video2" autoPlay></video>
						</div>
					</div>
				</Grid>

			</Grid>
			</body>
		// </div>
	);
}

export default App;
