import { useEffect, useState, useRef } from 'react';
import '../App.scss';
import {io} from "socket.io-client";
import { Peer } from 'peerjs';
import { IconButton, Typography, Stack, Switch, Button, Popover } from '@mui/material'
import Grid from '@mui/material/Grid2'
import ThreeD from '../3D';
import toast, {Toaster} from "react-hot-toast";
import { OpenInFull, CloseFullscreen, Pause, RotateRight, RotateLeft, FastForward, Home, InfoOutlined } from '@mui/icons-material';


const SOCKET_URL = 'https://labstream.ucsd.edu';

const Brewster = () => {
    const connecting = useRef(false);
    const socket_connection = useRef(null);

    // stores motor speed values
    const [motorInput, handleSpeedUpdate] = useState({
        filterMotor: 0
    });

    // stores state of 2x button
    const [isFilterTwoTimes, handleFilterTwoTimes] = useState(false)
    const [isFilterHomeLEDOn, setFilterHomeLEDOn] = useState(false);
    const [filterDistance, setFilterDistance] = useState(0); 
    const [isFilterHoming, setIsFilterHoming] = useState(false);
    const motorInputRef = useRef(motorInput);
    let toastFilterHoming;

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
                toast.success('Connected to the server',  {
                    duration: 5000
                });
                socket_connection.current = socket;
                socket.emit('brewsters_gear_state');
            })

            socket.on('filter_limit', (state) => {
                if (state === "0") {
                    toast('Filter motor forward limit reached', {
                        icon: '⚠️',
                        duration: 7000
                    });
                } else {
                    toast('Filter motor reverse limit reached', {
                        icon: '⚠️',
                        duration: 7000
                    });
                }
                handleSpeedUpdate({ ...motorInput, filterMotor: 0 });
            }, 200);

            socket.on('filter_homed', () => {
                setFilterHomeLEDOn(true);
                handleSpeedUpdate({ ...motorInput, filterMotor: 0 });
                setIsFilterHoming(false);
                toast.dismiss(toastFilterHoming);
            }, 200);

            socket.on('filter_distance', (newDistance) => {
                setFilterDistance(newDistance);
            }, 200);
        
        } catch(e) {
            toast.error('Failed to connect to the server');
        }
    }, []);

    useEffect(() => {
        motorInputRef.current = motorInput;
    }, [motorInput]);

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

                    if (call.metadata[i] !== 'brewster') {
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
                                <div style={{ display: 'flex', alignItems: 'center', marginRight: 'auto', gap: '10px' }}>
                                    <Typography>Home</Typography>
                                    <GreenLED isOn={isFilterHomeLEDOn} />	
							    </div>
                                <div style={{display: 'flex', alignItems: 'center', marginLeft: '50px' }}>
                                    <Typography textAlign='left' className="flex flex-col justify-center">Filter motor</Typography>
                                </div>
                                <IconButton style={{ backgroundColor: 'transparent' }} onClick={() => {handleSpeedUpdate({...motorInput, filterMotor: -1 * (isFilterTwoTimes ? 2 : 1)}); console.log(motorInput); socket_connection.current.emit('brewsters_adjust', {value: -1 * (isFilterTwoTimes ? 2 : 1)}); setFilterHomeLEDOn(false)}} disabled={isFilterHoming}>
                                    <RotateLeft color={motorInput.filterMotor < 0 ? 'secondary' : ''}/>
                                </IconButton>
                                <IconButton style={{ backgroundColor: 'transparent' }} onClick={() => {handleSpeedUpdate({...motorInput, filterMotor: 0}); console.log(motorInput); socket_connection.current.emit('brewsters_adjust', {value: 0})}}  disabled={isFilterHoming}>
                                    <Pause />
                                </IconButton>
                                <IconButton style={{ backgroundColor: 'transparent' }} onClick={() => {handleSpeedUpdate({...motorInput, filterMotor: (isFilterTwoTimes ? 2 : 1)}); console.log(motorInput); socket_connection.current.emit('brewsters_adjust', {value: (isFilterTwoTimes ? 2 : 1)}); setFilterHomeLEDOn(false)}} disabled={isFilterHoming}>
                                    <RotateRight color={(motorInput.filterMotor == 1 || motorInput.filterMotor == 2) ? 'secondary' : ''} />
                                </IconButton>
                                <IconButton style={{ backgroundColor: 'transparent' }} onClick={() => {handleSpeedUpdate({...motorInput, filterMotor: motorInput.filterMotor * (isFilterTwoTimes ? 0.5 : 2)}); handleFilterTwoTimes(!isFilterTwoTimes); console.log(motorInput); socket_connection.current.emit('brewsters_adjust', {value: motorInput.filterMotor * (isFilterTwoTimes ? 0.5 : 2)})}} disabled={isFilterHoming}>
                                    <FastForward color={isFilterTwoTimes ? 'secondary' : ''}/>
                                </IconButton>
                                <IconButton style={{ backgroundColor: 'transparent' }} onClick={() => {handleSpeedUpdate({...motorInput, filterMotor: 3}); handleFilterTwoTimes(false); setIsFilterHoming(true); setTimeout(() =>  {handleSpeedUpdate({ ...motorInputRef.current, filterMotor: 0 }); setIsFilterHoming(false)}, 30000); toastFilterHoming = toast('Filter motor is homing', { icon: '⚠️', position: "bottom-right", duration: 30000 }); socket_connection.current.emit('brewsters_adjust', {value: 3})}}>
                                    <Home color={motorInput.filterMotor == 3 ? 'secondary' : ''} />
                                </IconButton>
                            
                                 <div style={{display: 'flex', alignItems: 'center', marginLeft: '50px', width: '50px'}}>
                                    <Typography> {filterDistance} mm</Typography>
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
                    <div className="flex justify-center w-full h-full">
                        <div className="h-[80%] w-[50vw] max-w-full mt-4 bg-slate-300 rounded-md overflow-hidden relative">
                            <video id='video0' className="absolute top-0 left-0 object-cover w-full h-full" autoPlay></video>
                        </div>
                    </div>
                </Grid>

            </Grid>
            </body>
    );

    function GreenLED({ isOn }) {
    return (
        <div
        style={{
            width: '16px',
            height: '16px',
            backgroundColor: isOn ? 'limegreen' : 'gray',
            borderRadius: '50%',
            boxShadow: isOn ? '0 0 8px limegreen' : 'none',
            transition: 'background-color 0.3s, box-shadow 0.3s',
            margin: 'auto'
        }}
        />
    );
    }
}

export default Brewster;