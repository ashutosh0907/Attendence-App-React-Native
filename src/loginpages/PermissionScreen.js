import { View, Text, Image, TextInput, TouchableOpacity, ImageBase, PermissionsAndroid, Alert, Modal, StyleSheet, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import SPLASH from '../assets/images/splash.png'
import PERMISSION from '../assets/images/permission.png'
import LOCATION from '../assets/images/location.png'
import WIFI from '../assets/images/wifi.png'
import { GRAY, WHITE } from '../constants/color'
import { MyStatusBar, WIDTH } from '../constants/config'
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
        getUserData()
        getStatus();
        const id = setInterval(() => {
            getLocation();
            wifiChecking();
        }, 3000)
    }, [])


    useEffect(() => {
        let url = `${BASE_URL}checkYesterdayLogin?_format=json`
        GETNETWORK(url, true).then(res => {
            console.log('res', res);
            if (res.code == 200) {
                console.log(res.message)
            }
            else if (res.code == 201) {
                setModalVisible(true)
            }
        }).catch(err => {
            console.log("ERROR", err);
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
            console.log('res', res);
            if (res.code == 200) {
                console.log(res.message)
                setModalVisible(false)
            }
        }).catch(err => {
            console.log("ERROR", err);
        })
    }

    const getStatus = async () => {
        let startStatus = await getObjByKey('startStatus');
        let wifiandlocationStatus = await getObjByKey('wifiStart');
        // console.log("Start Status : ", typeof (startStatus.isStarted), "wifi and locationStatus", typeof (wifiandlocationStatus.wifi), typeof (wifiandlocationStatus.location));
        if (startStatus.isStarted && wifiandlocationStatus.wifi && wifiandlocationStatus.location) {
            navigation.navigate("DrawerStack")
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
                return true;
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    };

    // function to check permissions and get Location
    const getLocation = () => {
        const result = requestLocationPermission();
        result.then(res => {
            if (res) {
                Geolocation.getCurrentPosition(
                    position => {
                        setLocation(position);
                        setLocationEnabled(true);
                    },
                    error => {
                        setLocation(false);
                        console.log("inide err")
                        setLocationEnabled(false);
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
                );
            }
        });
    };

    const wifiChecking = () => {
        NetInfo.fetch().then(state => {
            if (state.type == 'wifi') {
                setWifi(true);
            }
        });
    }

    return (
        <>
            <MyStatusBar backgroundColor={WHITE} barStyle={'dark-content'} />
            <ScrollView>
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
                            style={{ backgroundColor: 'red', padding: 10 }}
                            animationType="fade"
                            transparent={true}
                            visible={modalVisible}
                        >
                            <View style={{ ...styles.centeredView, backgroundColor: 'yellow' }}>
                                <Text style={{ color: 'black' }}>Why You Haven't Logged Out Yesterday?</Text>
                                <TextInput value={issuetext} onChangeText={setIssueText} style={styles.input} />
                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={handleModalSubmit}>
                                    <Text style={styles.textStyle}>Submit Response</Text>
                                </Pressable>
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
                                Linking.openSettings();
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
    input: {
        backgroundColor: "white",
        height: 200,
        width: 300,
    },
})