import React from 'react';
import { useEffect, useState, useRef } from 'react';
import './App.scss';
import {io} from "socket.io-client";
import { Peer } from 'peerjs';
import { IconButton, Typography, Stack, Switch, Button, Popover, Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import Grid from '@mui/material/Grid2'
import ThreeD from './3D';
import toast, {Toaster} from "react-hot-toast";

import { OpenInFull, CloseFullscreen, Pause, RotateRight, RotateLeft, InfoOutlined } from '@mui/icons-material';

const SOCKET_URL = 'https://labstream.ucsd.edu';

function App() {
	const connecting = useRef(false);
	const socket_connection = useRef(null);


	// keep track of which motor is selected for adjustment
	const [selectedMotor, setSelectedMotor] = useState("Filter motor");

	// stores motor speed values
	// [filterMotorH, filterMotorV, imageMotorH, imageMotorV]
	const [motorInput, handleSpeedUpdate] = useState(["stop", "stop", "stop", "stop"]);

	const updateSpeed = (motorOnPage, dir) => {

		// calculate the real gear index based on which motor was clicked on screen
		let gearIndex = selectedMotor === "Filter motor" ? motorOnPage : motorOnPage + 2;
		socket_connection.current.emit('adjust', {gear: (gearIndex), value: dir})

		// since we cannot directly update motorInput, use a copy to set motorInput[motor] = value
		let newMotorInput = [...motorInput];
		// array indexed from 0, gears are indexed from 1
		newMotorInput[gearIndex - 1] = dir;
		console.log("new state: ", newMotorInput);
		handleSpeedUpdate(newMotorInput);
	}

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
		if (videoExpandRef.current !== null && videoId !== 0) {
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
				handleSpeedUpdate(["stop", "stop", "stop", "stop"]);
                toast.success('Gear State has been retrieved or updated.',  {
                    duration: 5000
                });
                console.log(data);
            }, 200);

			socket.on('filter_motor_H_done', () => {
				handleSpeedUpdate({filterMotorH : "stop"})
				toast('Filter motor rotation limit reached', {
					icon: '⚠️',
					duration: 7000
				});
			}, 200);

			socket.on('filter_motor_V_done', () => {
				handleSpeedUpdate({filterMotorV : "stop"})
				toast('Filter motor open-close limit reached', {
					icon: '⚠️',
					duration: 7000
				});
			}, 200);

			socket.on('image_motor_H_done', () => {
				handleSpeedUpdate({imageMotorH : "stop"})
				toast('Image motor left-right limit reached', {
					icon: '⚠️',
					duration: 7000
				});
			}, 200);

			socket.on('image_motor_V_done', () => {
				handleSpeedUpdate({imageMotorV : "stop"})
				toast('Image motor up-down limit reached', {
					icon: '⚠️',
					duration: 7000
				});
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
					<><img alt="overview of the thorlabs fourier experiment" src="/ThorLabsKit.png" style={{ width: '80%', height: 'auto', objectFit: 'cover' }} /></> : 
					<><ThreeD></ThreeD></>
					}
					</div>
					
					<div className="absolute flex flex-col gap-4 p-4 bg-white border-4 rounded-md bottom-5 left-5">
						{/* Select Component */}
						<FormControl style={{ width: '50%' }}>
							<InputLabel id="motor-select-label">Select Motor</InputLabel>
							<Select
								labelId="motor-select-label"
								value={selectedMotor}
								label="Select Motor"
								onChange={(e) => setSelectedMotor(e.target.value)}
							>
							<MenuItem value="Filter motor">Filter motor</MenuItem>
							<MenuItem value="Image motor">Image motor</MenuItem>
							</Select>
						</FormControl>

						{/* Motor Control Panels */}
						<div className="flex gap-4">
							<div className="flex flex-col flex-1 gap-4">
							<div className="flex w-full">
								<Typography textAlign='left' className="flex flex-col justify-center">
								{selectedMotor} {selectedMotor === "Image motor" ? "left-right" : "rotation"}
								</Typography>
								<IconButton style={{ backgroundColor: 'transparent' }} onClick={() => { updateSpeed(1, "ccw") }}>
								<RotateLeft color={motorInput[selectedMotor === "Filter motor" ? 0 : 2] === "ccw" ? 'secondary' : ''} />
								</IconButton>
								<IconButton style={{ backgroundColor: 'transparent' }} onClick={() => { updateSpeed(1, "stop") }}>
								<Pause />
								</IconButton>
								<IconButton style={{ backgroundColor: 'transparent' }} onClick={() => { updateSpeed(1, "cw") }}>
								<RotateRight color={motorInput[selectedMotor === "Filter motor" ? 0 : 2] === "cw" ? 'secondary' : ''} />
								</IconButton>
							</div>
							</div>

							<div className="flex flex-col gap-4">
							<div className="flex w-full">
								<Typography textAlign='left' className="flex flex-col justify-center">
								{selectedMotor} {selectedMotor === "Image motor" ? "up-down" : "open-close"}
								</Typography>
								<IconButton style={{ backgroundColor: 'transparent' }} onClick={() => { updateSpeed(2, "ccw") }}>
								<RotateLeft color={motorInput[selectedMotor === "Filter motor" ? 1 : 3] === "ccw" ? 'secondary' : ''} />
								</IconButton>
								<IconButton style={{ backgroundColor: 'transparent' }} onClick={() => { updateSpeed(2, "stop") }}>
								<Pause />
								</IconButton>
								<IconButton style={{ backgroundColor: 'transparent' }} onClick={() => { updateSpeed(2, "cw") }}>
								<RotateRight color={motorInput[selectedMotor === "Filter motor" ? 1 : 3] === "cw" ? 'secondary' : ''} />
								</IconButton>
							</div>
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
					<div className={videoExpand === 0 ? "hidden" : "flex justify-center h-full w-full"}>
						<div className="h-[80%] w-[50vw] max-w-full mt-4 bg-slate-300 rounded-md overflow-hidden relative">
							<IconButton className="absolute z-10"><CloseFullscreen onClick={() => handleVideoExpand(0)} /></IconButton>
							<video ref={videoExpandRef} className="absolute top-0 left-0 object-cover w-full h-full" autoPlay></video>
						</div>
					</div>
					

					{/* default view */}
					<div className={(videoExpand === 0 ? "" : "hidden ") + (webcamExpand ? "mr-[15%] " : "flex-col ") + "h-[80%] mt-4 flex gap-4 items-center"}>
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
