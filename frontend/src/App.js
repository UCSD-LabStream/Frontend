import React from 'react';
import {NavBar} from './Navbar';
import { useEffect, useState, useRef } from 'react';
import './App.scss';
import {io} from "socket.io-client";
import { Paper, Slider, TextField, Typography, Stack, Switch } from '@mui/material'
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid2'
import ThreeD from './3D';
import toast, {Toaster} from "react-hot-toast";

const SOCKET_URL = 'https://rangersw.com';

function App() {
	const connecting = useRef(false);
    	const socket_connection = useRef(null);
	const [sliderInput, handleSliderUpdate] = useState({
        angle1: 0,
        angle2: 0,
        angle3: 0,
        angle3Input: "0",
    });
	const [is3D, switchDimensions] = useState(false)

	useEffect(() => {
        if(connecting.current) return;
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
	
	const handleSwitch = () => {
		switchDimensions(!is3D)
	}

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        ...theme.applyStyles('dark', {
            backgroundColor: '#1A2027',
        }),
    }));

	return (
		<div className="TwoD-wrapper">
			<Toaster position="bottom-left"  />
			<Grid container spacing={2}>
				<Grid size={12}>
				</Grid>
				
				<Grid size={9}>
					<Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
						<Typography>3D</Typography>
						<Switch checked={is3D} onChange={handleSwitch}/>
						<Typography>2D</Typography>
					</Stack>
					{is3D ? <Item><img src="/ThorLabsKit.png" style={{ width: '80%', height: 'auto', objectFit: 'cover' }} /></Item> : 
					<ThreeD></ThreeD>}
					
				</Grid>
				<Grid size={3}>
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<div>Options

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
					</div>
				</Grid>
				<Grid size={9}>
					<Item>
						<span>Webcam live feed</span>
						<img src="/AllPurposeFiller.jpg" style={{ width: '80%', height: 'auto', objectFit: 'cover' }} />
					</Item>
				</Grid>
			</Grid>
		</div>
	);
}

export default App;
