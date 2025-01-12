import React from 'react';
import { useEffect, useState, useRef } from 'react';
import './App.scss';
import {io} from "socket.io-client";
import { Paper, Slider, TextField, SvgIcon, IconButton, Typography, Stack, Switch, Button } from '@mui/material'
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid2'
import ThreeD from './3D';
import toast, {Toaster} from "react-hot-toast";

import Pause from '@mui/icons-material/Pause';
import RotateRight from '@mui/icons-material/RotateRight';
import RotateLeft from '@mui/icons-material/RotateLeft';

const SOCKET_URL = 'https://rangersw.com';

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

	return (
		<div className="app-wrapper">
			<Toaster position="bottom-left"  />

			<Grid container spacing={2}>
				<Grid container order={modelExpand ? 1 : 2} size={modelExpand ? 12 : 6} sx={{ transition: 'all 0.3s ease', height: `87vh`, backgroundColor: 'white', color: 'black', padding: '20px', borderRadius: '15px'}}>					
					
					<div style={{ width: '100%' }}>
						<Stack direction="row" spacing={2} sx={{justifyContent: "space-between", alignItems: "center"}}>
							<Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
								<Typography>3D</Typography>
								<Switch checked={is3D} onChange={handleSwitch}/>
								<Typography>2D</Typography>
							</Stack>
							<Button onClick={handleModelExpand}>
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
							<Typography textAlign='left' style={{ marginLeft: 3 }} >Filter motor</Typography>
							<IconButton onClick={() => {handleSpeedUpdate({...motorInput, filterMotor: -1 * (isFilterTwoTimes ? 2 : 1)}); console.log(motorInput)}}>
								<RotateLeft />
							</IconButton>
							<IconButton onClick={() => {handleSpeedUpdate({...motorInput, filterMotor: 0}); console.log(motorInput)}}>
								<Pause />
							</IconButton>
							<IconButton onClick={() => {handleSpeedUpdate({...motorInput, filterMotor: (isFilterTwoTimes ? 2 : 1)}); console.log(motorInput)}}>
								<RotateRight />
							</IconButton>
							<IconButton onClick={() => {handleSpeedUpdate({...motorInput, filterMotor: motorInput.filterMotor * (isFilterTwoTimes ? 0.5 : 2)}); handleFilterTwoTimes(!isFilterTwoTimes); console.log(motorInput)}}>
								<SvgIcon>
								<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 449.851"><g fill-rule="nonzero"><path fill={isFilterTwoTimes ? "blue" : "black"} d="M153.143 219.364l-4.867-26.516c15.716-4.737 31.372-7.106 46.96-7.106 6.241 0 11.445.183 15.624.559 4.178.376 8.513 1.31 13.003 2.809 4.49 1.493 8.046 3.55 10.667 6.171 5.988 5.988 8.98 15.157 8.98 27.505 0 12.348-3.491 21.452-10.479 27.317-6.982 5.86-21.704 12.595-44.154 20.206v7.955h52.763v27.219h-95.984v-23.385c0-15.525 3.97-23.486 15.715-33.117 3.367-2.87 7.89-5.614 13.567-8.234a4349.194 4349.194 0 0116.091-7.39c5.05-2.31 9.137-4.211 12.253-5.706v-11.468c-5.613-.627-10.787-.938-15.528-.938-11.474 0-23.016 1.374-34.611 4.119zm144.908-30.818l12.908 31.248h1.873l12.908-31.248h40.599l-26.006 56.503 26.006 60.434h-41.534l-14.034-33.676h-1.681l-13.848 33.676h-39.664l25.447-59.311-25.447-57.626h42.473z"/></g></svg>
								</SvgIcon>
							</IconButton>
							
						</div>

						<div style={{ display: 'flex', flexDirection: 'row', marginTop: 20, width: '100%' }}>
							<Typography textAlign='left' style={{ marginLeft: 3 }} >Image motor</Typography>
							<Typography textAlign='left' style={{ marginLeft: 3 }} >Filter motor</Typography>
							<IconButton onClick={() => {handleSpeedUpdate({...motorInput, imageMotor: -1 * (isImageTwoTimes ? 2 : 1)}); console.log(motorInput)}}>
								<RotateLeft />
							</IconButton>
							<IconButton onClick={() => {handleSpeedUpdate({...motorInput, imageMotor: 0}); console.log(motorInput)}}>
								<Pause />
							</IconButton>
							<IconButton onClick={() => {handleSpeedUpdate({...motorInput, imageMotor: (isImageTwoTimes ? 2 : 1)}); console.log(motorInput)}}>
								<RotateRight />
							</IconButton>
							<IconButton onClick={() => {handleSpeedUpdate({...motorInput, imageMotor: motorInput.imageMotor * (isImageTwoTimes ? 0.5 : 2)}); handleImageTwoTimes(!isImageTwoTimes); console.log(motorInput)}}>
								<SvgIcon>
								<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 449.851"><g fill-rule="nonzero"><path fill={isImageTwoTimes ? "blue" : "black"} d="M153.143 219.364l-4.867-26.516c15.716-4.737 31.372-7.106 46.96-7.106 6.241 0 11.445.183 15.624.559 4.178.376 8.513 1.31 13.003 2.809 4.49 1.493 8.046 3.55 10.667 6.171 5.988 5.988 8.98 15.157 8.98 27.505 0 12.348-3.491 21.452-10.479 27.317-6.982 5.86-21.704 12.595-44.154 20.206v7.955h52.763v27.219h-95.984v-23.385c0-15.525 3.97-23.486 15.715-33.117 3.367-2.87 7.89-5.614 13.567-8.234a4349.194 4349.194 0 0116.091-7.39c5.05-2.31 9.137-4.211 12.253-5.706v-11.468c-5.613-.627-10.787-.938-15.528-.938-11.474 0-23.016 1.374-34.611 4.119zm144.908-30.818l12.908 31.248h1.873l12.908-31.248h40.599l-26.006 56.503 26.006 60.434h-41.534l-14.034-33.676h-1.681l-13.848 33.676h-39.664l25.447-59.311-25.447-57.626h42.473z"/></g></svg>
								</SvgIcon>
							</IconButton>
						</div>

						{/* <Typography textAlign='left' style={{ marginLeft: 3 }} >Prefabulated alumnite</Typography>
						<div style={{ display: 'flex', flexDirection: 'row', marginTop: 10, width: '80%' }}>
							<Slider
								value={sliderInput.angle2}
								onChange={(event, value) => {handleSliderUpdate({...sliderInput, angle2: value })}}
								onChangeCommitted={(event, value) => {
									socket_connection.current.emit('adjust', {
										gear: 2,
										value: value
									});
								}}
								min={-90}
								max={90}
							/>
							<Typography style={{ marginLeft: 20 }}>{sliderInput.angle2}</Typography>
						</div>

						<Typography textAlign='left' style={{ marginLeft: 3 }} >Pentametric fan</Typography>
						<div style={{ display: 'flex', flexDirection: 'row', marginTop: 10, width: '100%', gap: 5 }}>
							<Slider
								value={sliderInput.angle3}
								onChange={(event, value) => {handleSliderUpdate({ ...sliderInput, angle3: value, angle3Input: "" + value })}}
								onChangeCommitted={(event, value) => {
									socket_connection.current.emit('adjust', {
										gear: 3,
										value: value
									});
								}}
								min={-90}
								max={90}
							/>
							<TextField
								size="small"
								value={sliderInput.angle3Input}
								onChange={(event, value) => {
									handleSliderUpdate({ ...sliderInput, angle3Input: value, angle3: parseInt(value) })
									if(Number(event.target.value)){
										socket_connection.current.emit('adjust', {
											gear: 3,
											value: Number(event.target.value)
										});
									}
								}}
								sx={{ width: 80 }}
								inputProps={{ style: { textAlign: 'right' } }}
							/>
						</div> */}
					</div>
				</Grid>

				<Grid order={webcamExpand ? 1 : 3} size={webcamExpand ? 12 : 6} sx={{ transition: 'all 0.3s ease', height: '87vh', backgroundColor: 'white', color: 'black', padding: '20px', borderRadius: '15px'}}>
					<div style={{ width: '100%' }}>
						<Stack direction="row" spacing={2} sx={{ justifyContent: "flex-end", alignItems: "center"}}>
							<Button onClick={handleWebcamExpand}>
								{webcamExpand ? <>COLLAPSE</> : <>EXPAND</>}
							</Button>
						</Stack>
					</div>
					<img src="/AllPurposeFiller.jpg" style={{ height: '90%', width: 'auto', objectFit: 'cover' }} />
				</Grid>

			</Grid>
		</div>
	);
}

export default App;
