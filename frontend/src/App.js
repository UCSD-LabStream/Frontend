import React from 'react';
import { useEffect, useState, useRef } from 'react';
import './App.scss';
import {io} from "socket.io-client";
import { Paper, Slider, TextField, Typography, Stack, Switch, Button } from '@mui/material'
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid2'
import ThreeD from './3D';
import toast, {Toaster} from "react-hot-toast";

const SOCKET_URL = 'https://rangersw.com';

function App() {
	const connecting = useRef(false);
	const socket_connection = useRef(null);

	// stores slider values
	const [sliderInput, handleSliderUpdate] = useState({
        angle1: 0,
        angle2: 0,
        angle3: 0,
        angle3Input: "0",
    });

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
				handleSliderUpdate({angle1 : data.gear1, angle2 : data.gear2, angle3 : data.gear3, angle3Input : data.gear3.toString()})
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
						<Typography textAlign='left' style={{ marginLeft: 3 }} >Turbo encabulator</Typography>
						<div style={{ display: 'flex', flexDirection: 'row', marginTop: 20, width: '100%' }}>
							<Slider
								valueLabelDisplay="on"
								value={sliderInput.angle1}
								onChange={(event, value) => {handleSliderUpdate({...sliderInput, angle1: value })}}
								onChangeCommitted={(event, value) => {
									socket_connection.current.emit('adjust', {
										gear: 1,
										value: value
									});
								}}
								min={-90}
								max={90}
							/>
						</div>

						<Typography textAlign='left' style={{ marginLeft: 3 }} >Prefabulated alumnite</Typography>
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
						</div>
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
