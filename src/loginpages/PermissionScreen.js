import { View, Text, Image, TextInput, TouchableOpacity, ImageBase, PermissionsAndroid, Alert, Modal, StyleSheet, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import SPLASH from '../assets/images/splash.png'
import PERMISSION from '../assets/images/permission.png'
import LOCATION from '../assets/images/location.png'
import WIFI from '../assets/images/wifi.png'
import { GRAY, WHITE } from '../constants/color'
import { HEIGHT, MyStatusBar, WIDTH } from '../constants/config'
import Geolocation from 'react-native-geolocation-service'
// import DeviceInfo from 'react-native-device-info'
import NetInfo from '@react-native-community/netinfo'
import { Settings, Linking } from 'react-native'
import { getObjByKey, getStringByKey, storeObjByKey, storeStringByKey } from '../utils/Storage'
import { GETNETWORK, POSTNETWORK } from '../utils/Network'
import { BASE_URL } from '../constants/url'



export default function PermissionScreen({ navigation }) {
    const [wifi, setWifi] = useState(false);
    const [netinfo, setNetInfo] = useState(false);
    const [location, setLocation] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [userdata, setUserData] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [locationenabled, setLocationEnabled] = useState(false);
    const [issuetext, setIssueText] = useState('')



    useEffect(() => {
        async function getUserData() {
            let result = await getObjByKey('loginResponse');
            setUserData(result);
        }
        setWifi(false)
        getUserData()
        wifiChecking();
        getLocation();
    }, [])

    useEffect(() => {
        wifiChecking();
        getLocation();
    }, [])
    useEffect(() => {
        getStatus()
    }, [wifi, locationenabled])


    useEffect(() => {
        let url = `${BASE_URL}checkYesterdayLogin?_format=json`
        GETNETWORK(url, true).then(res => {
            // console.log('res', res);
            if (res.code == 200) {
                // console.log(res.message)
            }
            else if (res.code == 201) {
                setModalVisible(true)
            }
        }).catch(err => {
            // console.log("ERROR", err);
        })
    }, [])

    const handleModalSubmit = () => {
        if (issuetext.length < 3)
            return;
        const url = `${BASE_URL}setRemarks?_format=json`
        const obj = {
            remarks: issuetext,
        }
        POSTNETWORK(url, obj, true).then(res => {
            // console.log('res', res);
            if (res.code == 200) {
                // console.log(res.message)
                setModalVisible(false)
            }
        }).catch(err => {
            // console.log("ERROR", err);
        })
    }

    const getStatus = async () => {
        console.log("get status called --------------------- > ");
        let startStatus = await getObjByKey('startStatus');
        let wifiandlocationStatus = await getObjByKey('wifiStart');
        console.log("Start Status : ", startStatus.isStarted, "wifi and locationStatus", wifiandlocationStatus.wifi, wifiandlocationStatus.location);
        if (startStatus?.isStarted && wifiandlocationStatus.wifi && wifiandlocationStatus.location) {
            navigation.navigate("DrawerStack")
            setWifi(false)
            setLocationEnabled(false)
            let storeWifi = { wifi: wifi, location: locationenabled };
            storeObjByKey('wifiStart', storeWifi);
        }
    }


    const requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Geolocation Permission',
                    message: 'Can we access your location?',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            // console.log('granted', granted);
            if (granted === 'granted') {
                setNetInfo(true);
                storeObjByKey('permission', netinfo);
                return true;
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    };

    const getLocation = () => {
        // console.log("location");
        const result = requestLocationPermission();
        let storeWifi = { wifi: true, location: false };
        result.then(res => {
            if (res) {
                try {
                    Geolocation.getCurrentPosition(
                        position => {
                            setLocation(position);
                            setLocationEnabled(true);
                            storeWifi.location = true
                            storeObjByKey('wifiStart', storeWifi);
                        },
                        error => {
                            setLocation(false);
                            setLocationEnabled(false);
                        },
                        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                    );
                } catch (error) {
                    console.log("Error getting location: ", error);
                }
            }
        });
    };


    const wifiChecking = () => {
        // console.log('wifi')
        NetInfo.fetch().then(state => {
            let storeWifi = { wifi: wifi, location: locationenabled };
            if (state.type == 'wifi') {
                // console.log('wifi')
                setWifi(true);
                storeWifi.wifi = true;
                storeObjByKey('wifiStart', storeWifi);
            } else {
                setWifi(false);
                storeWifi.wifi = false;
                storeObjByKey('wifiStart', storeWifi);
                Alert.alert('Connect to the wifi')
                storeObjByKey('wifiStart', storeWifi);
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    return (
        <>
            <MyStatusBar backgroundColor={WHITE} barStyle={'dark-content'} />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ backgroundColor: 'white', marginLeft: 10 }}>
                    <Image
                        source={SPLASH}
                        style={{ height: 48, width: 48, marginRight: 12, marginTop: 15 }}
                    />
                </View>
                <View style={{ backgroundColor: 'white', width: WIDTH, height: 1000, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 30, color: 'black', paddingBottom: 20 }}>Hello {userdata?.employee?.employee_name}</Text>
                    </View>
                    {/* IMAGE */}
                    <Image
                        source={PERMISSION}
                        style={{ width: 284.5, height: 161 }}
                    />
                    <View style={{ width: WIDTH, height: 660, backgroundColor: '#3E2EFF', marginTop: 40, borderRadius: 40, alignItems: 'center' }}>
                        {/* Blue Box */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center', marginTop: 20 }}>
                            <Text style={{ color: '#FFDC61', fontSize: 16, fontWeight: '300' }}>Allow Location Access</Text>
                            <Image
                                source={LOCATION}
                                style={{ width: 27, height: 27, marginLeft: 10 }}
                            />
                        </View>


                        <Modal
                            style={{ backgroundColor: '#2196F3' }}
                            animationType="slide"
                            transparent={false}
                            visible={modalVisible}
                        >
                            <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 170, width: WIDTH }}>
                                <Text style={{ color: 'black', fontSize: 20, fontWeight: '700' }}>Why You Had Not Logged Out</Text>
                                <Text style={{ color: 'black', fontSize: 20, fontWeight: '700' }}> Yesterday?</Text>
                                <TextInput multiline={true} textAlignVertical={"top"} value={issuetext} onChangeText={setIssueText} style={styles.input} />
                                <TouchableOpacity
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={handleModalSubmit}>
                                    <Text style={styles.textStyle}>Submit Response</Text>
                                </TouchableOpacity>
                            </View>
                        </Modal>


                        <View>
                            <TouchableOpacity onPress={() => {
                                getLocation();
                            }} style={{ width: WIDTH * 0.7, height: 45, backgroundColor: 'white', marginTop: 10, alignItems: 'center', borderRadius: 10 }}>
                                <Text style={{ fontSize: 20, marginTop: 10, color: 'blue', fontWeight: "500" }}>GPS</Text>
                            </TouchableOpacity>
                            <View style={{ backgroundColor: 'white', marginTop: 10, borderRadius: 10, width: 110 }}>
                                {location ? <Text style={{ color: 'green', padding: 5, marginLeft: 4 }}>Connected</Text> : <Text style={{ color: 'red', padding: 5, marginLeft: 4 }}>Disconnected</Text>}
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignSelf: 'center', alignItems: 'center', marginTop: 30 }}>
                            <Text style={{ color: '#FFDC61', fontSize: 16, fontWeight: '300' }}>Connect to Wifi</Text>
                            <Image
                                source={WIFI}
                                style={{ width: 27, height: 27, marginLeft: 10 }}
                            />
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => {
                                // Linking.openSettings();
                                wifiChecking();
                            }} style={{ width: WIDTH * 0.7, height: 45, backgroundColor: 'white', marginTop: 10, alignItems: 'center', borderRadius: 10 }}>
                                <Text style={{ fontSize: 20, marginTop: 10, color: 'blue', fontWeight: "500" }}>WIFI</Text>
                            </TouchableOpacity>
                            <View style={{ backgroundColor: 'white', marginTop: 10, borderRadius: 10, width: 110 }}>
                                {wifi ? <Text style={{ color: 'green', padding: 5, marginLeft: 4 }}>Connected</Text> : <Text style={{ color: 'red', padding: 5, marginLeft: 4 }}>Disconnected</Text>}
                            </View>
                        </View>
                        <View>
                            <TouchableOpacity onPress={async () => {
                                { location && wifi ? navigation.navigate("DrawerStack") : Alert.alert("Give Requierd Permissions First !") }
                                let storeWifi = { wifi: wifi, location: locationenabled };
                                storeObjByKey('wifiStart', storeWifi);
                            }} style={{ width: WIDTH * 0.7, height: 45, backgroundColor: 'white', marginTop: 10, alignItems: 'center', borderRadius: 10 }}>
                                <Text style={{ fontSize: 20, marginTop: 10, color: 'blue', fontWeight: "500" }}>Get Attendence</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
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
        height: 500,
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
        width: WIDTH * 0.5,
        marginTop: 10,
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        backgroundColor: 'red',
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
    input: {
        backgroundColor: "#dedcdc",
        height: 200,
        width: 300,
        borderRadius: 10,
    },
})