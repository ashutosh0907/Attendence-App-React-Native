
import { Alert, Linking, Text, TouchableOpacity, View } from "react-native";
import React from "react";

import { RNCamera } from "react-native-camera"
import { useState } from "react";
import { Image } from "react-native";
import { ScrollView } from "react-native";
import { Vibration } from "react-native";
import { useEffect } from "react";
import { PermissionsAndroid } from "react-native";
import { HEIGHT, MyStatusBar, WIDTH } from "../constants/config";
import { BACK, LOADER, LUNCHBREAK, SESSION, SPLASH } from '../constants/imagepath'
const Remarks = ({ navigation, route }) => {
    const [camerastate, setcamerastate] = useState(true);
    const [scanned, setscanned] = useState(false)
    const [data, setdata] = useState('')

    const display = (e) => {
        Vibration.vibrate();
        console.log("readed  barcode called  ", e);
        console.log("update ",);
        navigation.goBack(10);
    }

    const requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.VIBRATE,
                {
                    title: 'Cool Photo App Camera Permission',
                    message:
                        'Cool Photo App needs access to your camera ' +
                        'so you can take awesome pictures.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('You can use the camera');
            } else {
                console.log('Camera permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    };
    const Data = () => {
        return (
            <>
                <View style={{ backgroundColor: 'black', height: 100, width: 300, alignSelf: 'center', marginTop: 70, borderRadius: 10, justifyContent: 'center' }}>
                    <TouchableOpacity
                        onPress={() => {
                            if (data.includes('www') || data.includes('http')) {
                                return Alert.alert(
                                    'Are your sure?',
                                    'Are you are Going To Open Browser ?',
                                    [
                                        {
                                            text: 'Yes Open',
                                            onPress: () => {
                                                Linking.openURL(data)


                                            },
                                        },
                                        {
                                            text: 'No',
                                        },
                                    ],
                                );

                            }
                            else {
                                <></>
                            }

                        }}
                    >
                        <Text style={{ color: 'tomato', fontSize: 20, fontWeight: '800', alignSelf: "center" }}>{data.length >= 1 ? (data.includes('www') ? "Go To " : "Data Is") : "No Data "} {data}
                        </Text>
                    </TouchableOpacity>

                </View>

            </>
        )
    }
    useEffect(() => {
        setcamerastate(true)
        setcamerastate(true)
    }, [])
    return (
        <>
            <View style={{ flex: 1 }}>
                <MyStatusBar backgroundColor={"#D7E0FF"} barStyle={'dark-content'} />
                <View
                    style={{
                        height: HEIGHT * 0.1,
                        width: WIDTH * 1,
                        flexDirection: 'row',
                        backgroundColor: '#D7E0FF',
                        flexDirection: 'row',
                        backgroundColor: 'white'
                    }}>
                    <View style={{ width: WIDTH * 0.2, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity style={{
                            height: 60, width: 60, justifyContent: 'center', alignItems: 'center'
                        }} onPress={() => {
                            navigation.goBack();
                        }}>
                            <Image
                                style={{ height: 50, width: 50, margin: 15 }}
                                source={BACK}
                            />
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            height: HEIGHT * 0.1,
                            width: WIDTH * 0.67,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                        <Text style={{ color: 'black', fontSize: 25 }}>Attendify Scanner</Text>
                    </View>
                </View>
                <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
                    <View style={{
                        height: 300,
                        width: WIDTH * 0.9,
                        marginTop: 100,
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <View
                            style={{
                                height: HEIGHT * 0.1,
                                width: WIDTH * 0.67,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                            <Text style={{ color: 'black', fontSize: 25 }}>Scan to Proceed!</Text>
                        </View>
                        {
                            camerastate &&
                            <View style={{ width: WIDTH, height: HEIGHT * 0.5, justifyContent: 'center', alignItems: 'center' }}>
                                <RNCamera
                                    autoFocus="on"
                                    ratio="4:4"
                                    style={{ height: 300, width: 300, }}
                                    captureAudio={false}
                                    onBarCodeRead={(e) => {
                                        setscanned(true)
                                        setcamerastate(false)
                                        setdata(e.data)
                                        display(e)
                                    }} />
                            </View>
                        }
                    </View>
                    <View style={{ flexDirection: 'column', height: HEIGHT * 0.15, marginTop: 60, width: 360, alignSelf: 'center', justifyContent: 'space-around' }}>
                        <View style={{ backgroundColor: camerastate ? '#35CC00' : '#EDB900', height: 50, width: 250, alignSelf: 'center', borderRadius: 10, justifyContent: 'center' }}>
                            <TouchableOpacity onPress={() => {
                                if (camerastate == true) {
                                    setcamerastate(false),
                                        setdata("")
                                    setTimeout(() => {
                                        setcamerastate(true)
                                    }, 100);
                                }
                                else {
                                    setcamerastate(true)
                                }
                            }
                            }>
                                <Text style={{ color: 'white', fontSize: 20, fontWeight: '500', alignSelf: "center" }}>{camerastate == true ? "Scanning..." : "Scan"}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ backgroundColor: camerastate ? 'red' : '#35CC00', height: 50, width: 250, alignSelf: 'center', borderRadius: 10, justifyContent: 'center' }}>
                            <TouchableOpacity onPress={() => {
                                setcamerastate(false)
                            }}>
                                <Text style={{ color: 'white', fontSize: 20, fontWeight: '800', alignSelf: "center" }}>Stop</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                    {/* <Data /> */}
                </ScrollView>
            </View >


        </>
    )
};

export default Remarks;
