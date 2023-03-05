import { View, Text, Image, Alert, Modal, StyleSheet, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SPLASH, MENU } from "../constants/imagepath";
import { ScrollView, TouchableOpacity } from 'react-native';
import { MyStatusBar, WIDTH } from '../constants/config';
import { WHITE } from '../constants/color';
import BackgroundService from 'react-native-background-actions';
import Geolocation from 'react-native-geolocation-service';
import 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { clearAll, getObjByKey, storeObjByKey, storeStringByKey } from '../utils/Storage';
import { checkuserToken } from '../redux/actions/auth';
import { BASE_URL } from '../constants/url';
import { POSTNETWORK } from '../utils/Network';
import { NetworkInfo } from 'react-native-network-info';

import moment from 'moment';

const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time))

export default function StartScreen() {
    const { toggleDrawer, closeDrawer, openDrawer } = useNavigation();
    const [time, setTime] = useState(new Date().toLocaleTimeString());
    const [date, setDate] = useState(new Date().toLocaleDateString());
    const [startstop, setStartstop] = useState(true);
    const [isStart, setIsStart] = useState(1)
    const dispatch = useDispatch();
    const [isbrake, setIsBrake] = useState(false);
    const [islunchbrake, setIsLunchBrake] = useState(false);
    const [userdata, setUserData] = useState('');
    const [checkStart, setCheckIsStart] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [ismodalopen, setIsModalOpen] = useState(false);
    const [res, setRes] = useState()

    useEffect(() => {
        async function getStartStatus() {
            let startStatus = await getObjByKey('startStatus');
            // console.log("start status : ", startStatus)
            setCheckIsStart(startStatus.isStarted)
            let normalBrake = await getObjByKey('normalBrake');
            setIsBrake(normalBrake)
            let lunchBrake = await getObjByKey('lunchBrake');
            setIsLunchBrake(lunchBrake)
            setStartstop(!startStatus.isStarted)
        }
        getStartStatus();
    }, [])

    useEffect(() => {
        async function getUserData() {
            let result = await getObjByKey('loginResponse');
            setUserData(result);
        }
        getUserData();
        const intervalId = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
            setDate(new Date().toLocaleDateString());
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);



    const getLatLongGateway = () => {
        NetworkInfo.getGatewayIPAddress().then(defaultGateway => {
            gateway = defaultGateway;
        }).catch((e) => {
            console.log(e)
        })
        Geolocation.getCurrentPosition(
            position => {
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;
            },
            error => {

            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
        return [latitude, longitude, gateway]
    }


    // startTime() is called whenever user clicks on START on UI
    const startTime = async () => {
        const url = `${BASE_URL}addAttendance?_format=json`;
        let getlatlongGateway = getLatLongGateway();
        // console.log(getlatlongGateway[2]);
        const obj = {
            start: isStart,
            attendance_type: 1,
            lat: getlatlongGateway[0],
            lng: getlatlongGateway[1],
            gateway: getlatlongGateway[2]
        }
        POSTNETWORK(url, obj, true).then(res => {
            console.log('res', res);
            if (res.code == 200) {
                console.log(res)
                setIsStart(0)
                setCheckIsStart(true);
                setStartstop(false);
                startBackgroundService();
                let startStatus = {
                    isStarted: true
                }
                storeObjByKey('startStatus', startStatus);
            } else {
                Alert.alert('Your Attendece Is Already Marked For Today');
            }
        }).catch(err => {
            Alert.alert('Your Attendece Is Already Marked For Today');
            console.log("ERROR", err);
        })
    }


    // Function for NORMAL_BRAKE
    // handleBrake() called whenever user clicks on Take a Brake in the UI
    const handleBrake = async () => {
        const url = `${BASE_URL}addAttendance?_format=json`;
        let getlatlongGateway = getLatLongGateway();
        const obj = {
            start: isbrake ? 0 : 1,
            attendance_type: 3,
            lat: getlatlongGateway[0],
            lng: getlatlongGateway[1],
            gateway: getlatlongGateway[2],
        }
        POSTNETWORK(url, obj, true).then(res => {
            console.log('res', res);
            if (res.code == 200) {
                console.log(res)
                //Storing status of normal brake in Async-Storage
                storeObjByKey('normalBrake', !isbrake);
                setIsBrake(!isbrake)

                if (!isbrake)
                    stopBackgroundService()
                else
                    startBackgroundService()

            }
        }).catch(err => {
            console.log("ERROR", err);
        })
    }

    // Function for LUNCH_BRAKE
    // handleLunchBrake() called whenever user clicks on Take Lunch Brake in the UI
    const handleLunchBrake = async () => {
        const url = `${BASE_URL}addAttendance?_format=json`;
        let getlatlongGateway = getLatLongGateway();
        const obj = {
            start: islunchbrake ? 0 : 1,
            attendance_type: 2,
            lat: getlatlongGateway[0],
            lng: getlatlongGateway[1],
            gateway: getlatlongGateway[2],
        }
        POSTNETWORK(url, obj, true).then(res => {
            console.log('res', res);
            if (res.code == 200) {
                console.log(res)
                setIsLunchBrake(!islunchbrake)
                // Storing status of lunch brake in Async-Storage
                storeObjByKey("lunchBrake", !islunchbrake)
                if (!islunchbrake)
                    stopBackgroundService()
                else
                    startBackgroundService()
            }
            else {
                Alert.alert("You can have only one Lunch Brake")
            }
        }).catch(err => {
            Alert.alert("You can have only one Lunch Brake")
        })
    }

    const logoutTime = async () => {
        let getlatlongGateway = getLatLongGateway();
        const url = `${BASE_URL}addAttendance?_format=json`;
        const obj = {
            start: 0,
            attendance_type: 1,
            lat: getlatlongGateway[0],
            lng: getlatlongGateway[1],
            gateway: getlatlongGateway[2],
        }
        console.log(url, isStart, obj);
        POSTNETWORK(url, obj, true).then(async (res) => {
            console.log('res', res);
            if (res.code == 200) {
                console.log("SUCCESS")
                setIsStart(1)
                stopBackgroundService();
                // if (islunchbrake)
                setRes(res.message)
                setModalVisible(true)
                //Remove 
                let startStatus = await getObjByKey('startStatus');
                let obj = {
                    startStatus: false
                }
                await storeObjByKey('startStatus', obj)
                setCheckIsStart(false)
                await storeObjByKey('normalBrake', false);
                setIsBrake(false)
                await storeObjByKey('lunchBrake', false);
                setIsLunchBrake(false)
                setStartstop(true);
            }
        }).catch(err => {
            console.log("ERROR", err);
        })
    }

    // const checkLocation = async () => {
    //     Geolocation.getCurrentPosition(
    //         position => {
    //         },
    //         error => {
    //             setLatitude(false);
    //             setLongitude(false);
    //         },
    //         { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    //     );
    // }

    const pulseCheck = async () => {
        const url = `${BASE_URL}checkLocation?_format=json`;
        let getlatlongGateway = getLatLongGateway();
        const obj = {
            lat: getlatlongGateway[0],
            lng: getlatlongGateway[1],
            gateway: getlatlongGateway[2],
        }
        POSTNETWORK(url, obj, true).then(res => {
            console.log('res', res);
            if (res.code == 200) {
                console.log("sUCCESS SSSSSSSSSSSSSSS");
            }
            else {
                console.log("IN ELSE GOING TO HANDLE BRAKE");
                stopBackgroundService()
                handleBrake();
            }
        }).catch(err => {

        })
    }
    const veryIntensiveTask = async (taskDataArguments) => {
        const { delay } = taskDataArguments;
        await new Promise(async (resolve) => {
            for (let i = 0; BackgroundService.isRunning(); i++) {
                await BackgroundService.updateNotification({ taskDesc: 'Attendify Is Running ' });
                await sleep(300000);
                pulseCheck();
                // console.log(new Date())
            }
        });
    };

    const options = {
        taskName: 'Example',
        taskTitle: 'Attendify Is Keeping Track',
        taskDesc: 'ExampleTask description',
        taskIcon: {
            name: 'ic_launcher',
            type: 'mipmap',
        },
        color: '#ff00ff',
        linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
        parameters: {
            delay: 1000,
        },
    };

    const startBackgroundService = async () => {
        await BackgroundService.start(veryIntensiveTask, options);
    }
    const stopBackgroundService = async () => {
        console.log("Stopped")
        await BackgroundService.stop();
    }



    const getColor = (id) => {
        if (id == 1)
            return "green"
        else if (id == 2)
            return "blue"
        else return "red"
    }
    const getHeading = (id) => {
        if (id == 1)
            return "Login and Logout"
        else if (id == 2)
            return "Lunch Break"
        else return "Break Timing"
    }
    return (
        <>
            <View style={{ flex: 1, backgroundColor: WHITE }}>
                <MyStatusBar backgroundColor={WHITE} barStyle={'dark-content'} />
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                        setModalVisible(!modalVisible);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={{ padding: 10, margin: 10 }}>{res && res.map((record, index) => {
                                return <View>
                                    <Text>{getHeading(record.attendance_type)}</Text>
                                    <Text style={{ color: getColor(record.attendance_type), margin: 10 }}>
                                        {index + 1} Start: {moment(record.attendance_start).format("hh:mm:ss") + " "} End:{moment(record.attendance_end).format("hh:mm:ss")}
                                    </Text>
                                </View>
                            })}</View>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalVisible(!modalVisible)}>
                                <Text style={styles.textStyle}>Okay</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>

                <ScrollView style={{ backgroundColor: 'white' }}>
                    <View style={{ flex: 1, marginTop: 70, flexDirection: 'row', justifyContent: 'center', width: WIDTH }}>
                        <Image
                            source={SPLASH}
                            style={{ width: 78, height: 78, }}
                        />
                        <View style={{ justifyContent: 'center', }}>
                            <Text style={{ color: 'black', fontSize: 20, fontWeight: '400' }}>Hello, {userdata?.employee?.employee_name}</Text>
                            <Text style={{ color: 'black', fontSize: 20 }}>Emp. ID  : {userdata?.employee?.employee_no}</Text>
                        </View>
                        <View style={{ justifyContent: 'center' }}>
                            <TouchableOpacity onPress={openDrawer}>
                                <Image
                                    source={MENU}
                                    style={{ flex: 1, width: 40, height: 40, justifyContent: 'center', }}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', width: WIDTH, alignSelf: "center", alignItems: "center", marginTop: 20 }}>
                        <Text style={{ fontSize: 15 }}>“Start your day, log your attendance, and</Text>
                        <Text style={{ fontSize: 15 }}>manage all your attendance any time.”</Text>
                    </View>
                    <View style={{ flexDirection: 'row', width: WIDTH * 0.95, alignItems: 'center', justifyContent: 'space-between', alignSelf: 'center' }}>
                        <Text style={{ marginTop: 60, fontSize: 20, color: 'black' }}>Date : {date}</Text>
                        <Text style={{ marginTop: 60, fontSize: 20, color: 'green' }}>Time : {time}</Text>
                    </View>
                    <View>
                        {startstop ? <TouchableOpacity
                            style={{ width: 202, height: 51, backgroundColor: '#35CC00', marginTop: 70, alignItems: 'center', alignSelf: "center", borderRadius: 10, }}
                            onPress={() => {
                                startTime();

                                // checkLocation();
                            }}
                        >
                            <Text style={{ alignContent: 'center', justifyContent: 'center', fontSize: 30, marginTop: 5, color: 'white' }}>START</Text>
                        </TouchableOpacity> :
                            <TouchableOpacity
                                style={{ width: WIDTH * 0.7, height: 51, backgroundColor: '#EDB900', marginTop: 70, alignItems: 'center', borderRadius: 10, alignSelf: 'center' }}
                                onPress={() => {
                                    // stopBackgroundService();
                                    Alert.alert('', 'Stop the session ?', [
                                        {
                                            text: 'Cancel',
                                            onPress: () => console.log('Cancel Pressed'),
                                            style: 'cancel',
                                        },
                                        {
                                            text: 'OK',
                                            onPress: () => {
                                                logoutTime()
                                                setIsModalOpen(true);
                                            },
                                        },
                                    ]);
                                }}
                            >
                                <Text style={{ alignContent: 'center', justifyContent: 'center', fontSize: 30, marginTop: 5, color: 'white', }}>END SESSION</Text>
                            </TouchableOpacity>}
                    </View>
                    <View style={{ flex: 1, marginVertical: 150, width: WIDTH, alignItems: 'center', justifyContent: 'center' }}>
                        {!startstop ? <View>
                            {!islunchbrake && <TouchableOpacity onPress={() => {
                                handleBrake();
                                // stopBackgroundService();
                            }} style={{ width: 302, height: 51, backgroundColor: '#EDB900', alignItems: 'center', borderRadius: 10, }}>
                                <Text style={{ alignContent: 'center', justifyContent: 'center', fontSize: 20, marginTop: 10, color: 'black', fontWeight: '200' }}>
                                    {isbrake ? " End a Break" : "Take a Break"}</Text>
                            </TouchableOpacity>}

                            {!isbrake && <TouchableOpacity onPress={() => {
                                handleLunchBrake();
                                // stopBackgroundService();
                            }} style={{ width: 302, height: 51, backgroundColor: '#EDB900', marginTop: 30, alignItems: 'center', borderRadius: 10, }}>
                                <Text style={{ alignContent: 'center', justifyContent: 'center', fontSize: 20, marginTop: 10, color: 'black', fontWeight: '200' }}>
                                    {islunchbrake ? " End Lunch Break" : "Take Lunch Break"}</Text>
                            </TouchableOpacity>}
                        </View> : null}
                    </View>
                </ScrollView>
            </View>
        </>
    )
}
const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        height: 800,
        width: 400,
        margin: 20,
        backgroundColor: '#EDB900',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        marginTop: 20,
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});