import { View, Text, Image, Alert, Modal, StyleSheet, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SPLASH, MENU, LOADER } from "../constants/imagepath";
import { ScrollView, TouchableOpacity } from 'react-native';
import { HEIGHT, MyStatusBar, WIDTH } from '../constants/config';
import { WHITE } from '../constants/color';
import BackgroundService from 'react-native-background-actions';
import Geolocation from 'react-native-geolocation-service';
import 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { clearAll, deleteByKeys, getObjByKey, storeObjByKey, storeStringByKey } from '../utils/Storage';
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
    const [isStart, setIsStart] = useState(1);
    const dispatch = useDispatch();
    const [isbrake, setIsBrake] = useState(false);
    const [islunchbrake, setIsLunchBrake] = useState(false);
    const [userdata, setUserData] = useState('');
    const [checkStart, setCheckIsStart] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [ismodalopen, setIsModalOpen] = useState(false);
    const [res, setRes] = useState();
    const [wifi, setWifi] = useState(false);
    const [lunchString, setlunchString] = useState("");
    const [locationenabled, setLocationEnabled] = useState(false);
    const [loadermodalVisible, setloadermodalVisible] = useState(false);
    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')
    const [gateway, setGateway] = useState('')


    useEffect(() => {
        async function getStartStatus() {
            let startStatus = await getObjByKey('startStatus');
            // console.log("start status : ", startStatus)
            setCheckIsStart(startStatus?.isStarted)
            let normalBrake = await getObjByKey('normalBrake');
            setIsBrake(normalBrake)
            let lunchBrake = await getObjByKey('lunchBrake');
            setIsLunchBrake(lunchBrake)
            setStartstop(!startStatus?.isStarted)
            let result = await getObjByKey('lunchstring');
            setlunchString(result);
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

    useEffect(() => {
        getLatLongGateway();
        getLatLongGateway();
        getLatLongGateway();
    }, [])

    const getLatLongGateway = async () => {
        try {
            var latitude, longitude, gateway;
            // NetworkInfo.getBSSID().then(defaultGateway => {
            NetworkInfo.getGatewayIPAddress().then(defaultGateway => {
                gateway = defaultGateway;
                setGateway(gateway)
            }).catch((e) => {
                console.log(e)
            })
            let permission = getObjByKey('permission');
            if (permission) {
                Geolocation.getCurrentPosition(
                    position => {
                        if (position) {
                            latitude = position?.coords?.latitude;
                            longitude = position?.coords?.longitude;
                            setLatitude(latitude)
                            setLongitude(longitude)
                        }
                        console.log("latitude - > ", latitude, "longitude - > ", longitude, "Gateway - >", gateway);
                    },
                    (error) => {
                        Alert.alert("Turn on the Location");
                        console.log("Error in getting latitude longitude", error.code, "---", error.message)
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
                );
            }
        } catch (e) {
            Alert.alert('Turn on the Location');
            console.log(e);
        }
    }


    // startTime() is called whenever user clicks on START on UI
    const startTime = async () => {
        setloadermodalVisible(true)
        console.log("inside startTime()");
        const url = `${BASE_URL}addAttendance?_format=json`;
        await getLatLongGateway();
        const obj = {
            start: isStart,
            attendance_type: 1,
            lat: latitude,
            lng: longitude,
            gateway: gateway,
        }
        console.log(url)
        POSTNETWORK(url, obj, true).then(res => {
            setloadermodalVisible(false)
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
            } else if (res.message === 'Network is not same') {
                setloadermodalVisible(false)
                Alert.alert('Connect to the office Wifi');
            } else if (res.code == 400) {
                Alert.alert(res.message, "Try again !");
            } else {
                setloadermodalVisible(false)
                Alert.alert('Your Attendece Is Already Marked For Today');
            }
        }).catch(err => {
            setloadermodalVisible(false);
            Alert('Try Again')
            console.log("ERROR", err);
        })
    }


    // Function for NORMAL_BRAKE
    // handleBrake() called whenever user clicks on Take a Brake in the UI
    const handleBrake = async (bk = isbrake) => {
        setloadermodalVisible(true)
        const url = `${BASE_URL}addAttendance?_format=json`;
        await getLatLongGateway();
        const obj = {
            start: bk ? 0 : 1,
            attendance_type: 3,
            lat: latitude,
            lng: longitude,
            gateway: gateway,
        }
        stopBackgroundService()
        POSTNETWORK(url, obj, true).then(res => {
            console.log('res', res);
            if (res.code == 200) {
                setloadermodalVisible(false)
                console.log(res)
                //Storing status of normal brake in Async-Storage
                storeObjByKey('normalBrake', !isbrake);
                setIsBrake(!isbrake)
                if (!isbrake)
                    stopBackgroundService()
                else
                    startBackgroundService()
            } else if (res.message === 'Network is not same') {
                setloadermodalVisible(false)
                Alert.alert('Connect to the office Wifi');
            }
            else {
                setloadermodalVisible(false)
                Alert.alert(res.message);
            }
        }).catch(err => {
            setloadermodalVisible(false)
            console.log("ERROR", err);
        })
    }

    // Function for LUNCH_BRAKE
    // handleLunchBrake() called whenever user clicks on Take Lunch Brake in the UI
    const handleLunchBrake = async () => {
        // getLatLongGateway();
        // getLatLongGateway();
        setloadermodalVisible(true)
        const url = `${BASE_URL}addAttendance?_format=json`;
        await getLatLongGateway();
        // console.log("handle lunch brake latttttttitude----------------", getlatlongGateway[0]);
        const obj = {
            start: islunchbrake ? 0 : 1,
            attendance_type: 2,
            lat: latitude,
            lng: longitude,
            gateway: gateway,
        }
        POSTNETWORK(url, obj, true).then(res => {
            console.log('res', res);
            if (res.code == 200) {
                setloadermodalVisible(false)
                console.log(res)
                if (islunchbrake) {
                    let temp = res.message.filter((t) => t.attendance_type == 2)
                    console.log(temp)
                    let t = "Start : " + moment(temp[0].attendance_start).format("hh:mm a") + " End : " + moment(temp[0].attendance_end).format("hh:mm a");
                    setlunchString(t)
                    storeObjByKey('lunchstring', t);
                }
                setIsLunchBrake(!islunchbrake)
                // Storing status of lunch brake in Async-Storage
                storeObjByKey("lunchBrake", !islunchbrake)

                if (!islunchbrake)
                    stopBackgroundService()
                else // end lunchbreak on press
                    startBackgroundService()
            } else if (res.message === 'Network is not same') {
                setloadermodalVisible(false)
                Alert.alert('Connect to the office Wifi');
            }
            else {
                setloadermodalVisible(false)
                Alert.alert("You can have only one Lunch Brake")
            }
        }).catch(err => {
            setloadermodalVisible(false);
            Alert.alert("Something went wrong");
        })
    }

    //  Function for END SESSION
    const logoutTime = async () => {
        getLatLongGateway();
        getLatLongGateway();
        setloadermodalVisible(true);
        await getLatLongGateway();
        const url = `${BASE_URL}addAttendance?_format=json`;
        const obj = {
            start: 0,
            attendance_type: 1,
            lat: latitude,
            lng: longitude,
            gateway: gateway,
        }
        console.log(url, isStart, obj);
        POSTNETWORK(url, obj, true).then(async (res) => {
            console.log('res', res);
            if (res.code == 200) {
                setloadermodalVisible(false)
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
                deleteByKeys('lunchstring');
            } else if (res.message === 'Network is not same') {
                setloadermodalVisible(false)
                Alert.alert('Connect to the office Wifi');
            } else {
                setloadermodalVisible(false)
                stopBackgroundService();
            }
        }).catch(err => {
            Alert.alert('You have not logged out Yesterday, Logout first and start new session');
            console.log("ERROR", err);
            setloadermodalVisible(false)
            stopBackgroundService();
        })
        stopBackgroundService();
    }


    const pulseCheck = async () => {
        // await getLatLongGateway();
        console.log("Inside Pulse Check")
        const url = `${BASE_URL}checkLocation?_format=json`;
        await getLatLongGateway();
        const obj = {
            lat: latitude,
            lng: longitude,
            gateway: gateway,
        }
        stopBackgroundService()
        POSTNETWORK(url, obj, true).then(res => {
            console.log('res', res);
            if (res.code == 200) {
                console.log("You are in office");
                startBackgroundService()
            }
            else {
                console.log("IN ELSE GOING TO HANDLE BRAKE");
                stopBackgroundService();
                handleBrake(false);
            }
        }).catch(err => {
            console.log('err');
            stopBackgroundService();
        })
    }


    const veryIntensiveTask = async (taskDataArguments) => {
        const { delay } = taskDataArguments;
        try {
            await new Promise(async (resolve) => {
                for (let i = 0; BackgroundService.isRunning(); i++) {
                    await BackgroundService.updateNotification({ taskDesc: 'Attendify Is Running ' });
                    if (!BackgroundService.isRunning()) {
                        break;
                    }
                    await sleep(delay);
                    await pulseCheck();
                }
            });
        } catch (error) {
            console.log("Error in veryIntensiveTask: ", error);
        }
    };

    const options = {
        taskName: 'Attendify background task',
        taskTitle: 'Attendify background task',
        taskDesc: 'Attendify is running in the background',
        taskIcon: {
            name: 'ic_launcher',
            type: 'mipmap',
        },
        color: '#ff00ff',
        linkingURI: 'Attendify://chat/jane',
        parameters: {
            delay: 300000,
        },
    };

    const startBackgroundService = async () => {
        try {
            console.log("Background Service");
            await BackgroundService.start(veryIntensiveTask, options);
            await BackgroundService.updateNotification({ taskDesc: 'Attendify is Running ' });
        } catch (error) {
            console.log("Error starting background service: ", error);
        }
    };

    const stopBackgroundService = async () => {
        try {
            console.log("Stopped")
            await BackgroundService.stop();
        } catch (error) {
            console.log("Error stopping background service: ", error);
        }
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
                            <ScrollView style={{ padding: 10, margin: 10 }}>{res && res.map((record, index) => {
                                return <View key={index}>
                                    <Text style={{ color: 'black' }}>{getHeading(record.attendance_type)}</Text>
                                    <Text style={{ color: getColor(record.attendance_type), margin: 10 }}>
                                        {index + 1} Start: {moment(record.attendance_start).format("hh:mm:ss") + " "} End:{moment(record.attendance_end).format("hh:mm:ss")}
                                    </Text>
                                </View>
                            })}</ScrollView>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalVisible(!modalVisible)}>
                                <Text style={styles.textStyle}>Okay</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={loadermodalVisible}
                    onRequestClose={() => {
                        // setModalVisible(!modalVisible);
                    }}>
                    <View style={styles.centeredView}>
                        <Image
                            style={{ height: 100, width: 100 }}
                            source={LOADER}
                        />
                    </View>
                </Modal>

                <ScrollView style={{ backgroundColor: 'white' }}>
                    <View style={{ flex: 1, marginTop: 70, flexDirection: 'row', justifyContent: 'center', width: WIDTH * 0.9 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: WIDTH }}>
                                <View style={{ marginHorizontal: 10 }}>
                                    <Image
                                        source={SPLASH}
                                        style={{ width: 78, height: 78, }}
                                    />
                                </View>
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
                        </View>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', width: WIDTH, alignSelf: "center", alignItems: "center", marginTop: 20 }}>
                        <Text style={{ fontSize: 15 }}>“Start your day, log your attendance, and</Text>
                        <Text style={{ fontSize: 15 }}>manage all your attendance any time.”</Text>
                    </View>

                    <View style={{ flexDirection: 'row', width: WIDTH * 0.9, alignItems: 'center', justifyContent: 'space-between', alignSelf: 'center' }}>
                        <Text style={{ marginTop: 60, fontSize: 20, color: 'black' }}>Date : {moment(date, 'MM/DD/YYYY').format('DD/MM/YYYY')}</Text>
                        <Text style={{ marginTop: 60, fontSize: 20, color: 'green' }}>Time : {time}</Text>
                    </View>
                    <View>
                        {startstop ? <TouchableOpacity
                            style={{ width: 202, height: 51, backgroundColor: '#35CC00', marginTop: 70, alignItems: 'center', alignSelf: "center", borderRadius: 10, }}
                            onPress={() => {
                                console.log("Starrrrrrrrrrrrrrrrrrrrrrrt");
                                startTime();
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
                                {/* <View style={{ justifyContent: 'center', alignItems: 'center', width: WIDTH * 0.5, backgroundColor: '#1111', padding: 5, borderRadius: 10, marginVertical: 6.9 }}> */}
                                {/* <Text style={{ color: 'black' }}>Total Working Time</Text>
                                    <Text style={{ color: 'black' }}>{hour} : {mins} : {sec}</Text> */}
                                {/* </View> */}
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
                            }} style={{ width: 302, height: 51, backgroundColor: '#EDB900', marginTop: 30, alignItems: 'center', borderRadius: 10, marginVertical: 10 }}>
                                <Text style={{ alignContent: 'center', justifyContent: 'center', fontSize: 20, marginTop: 10, color: 'black', fontWeight: '200' }}>
                                    {islunchbrake ? " End Lunch Break" : "Take Lunch Break"}</Text>
                                <View style={{ marginVertical: 2.5 }}></View>
                                <View style={{ justifyContent: 'center', alignItems: 'center', width: WIDTH * 0.6, backgroundColor: '#1111', padding: 6, borderRadius: 10, marginVertical: 10 }}>
                                    <Text style={{ color: 'black' }}>{lunchString}</Text>
                                </View>
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
        marginVertical: HEIGHT * 0.2,
    },
    modalView: {
        height: HEIGHT * 0.8,
        width: WIDTH * 0.9,
        margin: 20,
        backgroundColor: '#dedcdc',
        borderRadius: 20,
        padding: 30,
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
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        width: WIDTH * 0.5,
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