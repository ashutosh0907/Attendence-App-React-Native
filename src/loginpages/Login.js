import React, { useState, useRef, useEffect } from "react";
import { Button, Modal, TouchableOpacity, View, TextInput, Text, StyleSheet, Image, ImageBackground, ScrollView, Alert, Keyboard, ToastAndroid, BackHandler } from "react-native";
import { BACKGROUNDBLACK, BLACK, GRAY, WHITE } from "../constants/color";
import { HEIGHT, mod, MyStatusBar, WIDTH } from "../constants/config";
import { IMAGEBACKGROUND, SPLASH, PHONE, BACK, PINK, LOADER } from "../constants/imagepath";
import { POSTNETWORK } from "../utils/Network";
import { STYLESCONFIG } from "../constants/config";
import { BASE_URL } from "../constants/url";
import { useDispatch } from "react-redux";
import { checkuserToken } from "../redux/actions/auth";
import { storeObjByKey } from "../utils/Storage";
import { useFocusEffect } from "@react-navigation/native";



export default Login = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [page, setPage] = useState(0);
    const [number, setNumber] = useState('');
    const [signInres, setSignInres] = useState('');
    const [err, setErr] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [num1, setNum1] = useState('');
    const [num2, setNum2] = useState('');
    const [num3, setNum3] = useState('');
    const [num4, setNum4] = useState('');

    const [counter, setCounter] = useState(30);
    const ref1 = useRef('');
    const ref2 = useRef('');
    const ref3 = useRef('');
    const ref4 = useRef('');
    const dispatch = useDispatch();

    useEffect(() => {
        const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
        return () => clearInterval(timer);
    })



    useFocusEffect(() => {
        const backAction = () => {
            if (page == 0) {
                BackHandler.exitApp();
            } else if (page == 1) {
                setErr('');
                Alert.alert('', 'Do you want to change your mobile number ?', [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                    {
                        text: 'OK',
                        onPress: () => {
                            setPage(0);
                        },
                    },
                ]);
            }
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );
        return () => backHandler.remove();
    });


    const VerifyOTP = () => {
        setModalVisible(true);
        const url = `${BASE_URL}verifyOTP?_format=json`;
        const obj = {
            mobile: signInres.mobile,
            otp: "" + num1 + num2 + num3 + num4,
            token: "" + signInres.token
        }
        setLoading(true);
        POSTNETWORK(url, obj).then(res => {
            console.log('res', res);
            setLoading(true);
            if (res.code == 200) {
                setModalVisible(false)
                storeObjByKey('loginResponse', res).then(() => {
                    dispatch(checkuserToken())
                })
                ToastAndroid.show(res.msg, ToastAndroid.SHORT)
                setLoading(false)
            } else {
                Alert.alert(res.message);
                setLoading(false)
                setModalVisible(false)
            }
        }).catch(err => {
            setModalVisible(false)
            console.log("ERROR", err);
            setLoading(false)
        })
    }

    const sendOTP = () => {
        setModalVisible(true)
        const url = `${BASE_URL}userSignin?_format=json`;
        const obj = {
            mobile: parseInt(number),
        }
        console.log(url);
        // setModalVisible(true)
        POSTNETWORK(url, obj).then(res => {
            console.log('ress', res);
            if (res.code == 200) {
                setModalVisible(false)
                setSignInres(res.data);
                Alert.alert("Your OTP Is ", res.data.otp)
                setPage(1);
                setCounter(30);
            } else {
                setModalVisible(false)
                Alert.alert(res.message)
            }
        }).catch(err => {
            console.log("ERROR", err);
            setModalVisible(false)
        })
    }
    const SigninView = () => {
        return (
            <>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ ...Styles.mainView }}>
                        {/* MODAL START------------------------------------------------------------------------------------------------ */}
                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={() => {
                                // setModalVisible(!modalVisible);
                            }}>
                            <View style={Styles.centeredView}>
                                <Image
                                    style={{ height: 100, width: 100 }}
                                    source={LOADER}
                                />
                            </View>
                        </Modal>
                        {/* MODAL END--------------------------------------------------------------------------------------------------- */}
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ width: 56, height: 30 }}>
                                <Text style={{ fontSize: 20, color: 'black' }}>Login</Text>
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Image
                                    source={SPLASH}
                                    style={{ height: 102, width: 102, marginRight: 12, marginTop: 10 }}
                                />
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={{ fontSize: 30, color: 'black' }}>Attendify</Text>
                            </View>
                        </View>
                        <View style={{ marginTop: 20, alignItems: 'center' }}>
                            <Text style={{ color: 'black' }}>Login to your account to log your</Text>
                            <Text style={{ color: 'black' }}>attendence</Text>
                        </View>
                        <View style={{ flex: 0.8, width: WIDTH, height: 10, backgroundColor: '#FFDC61', marginTop: 40, borderRadius: 40, alignItems: 'center' }}>
                            {/* Yellow Box */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', width: 302, height: 48, marginTop: 50, borderRadius: 10 }}>
                                <View style={{ paddingRight: 20 }}>
                                    <Image
                                        source={PHONE}
                                        style={{ height: 22, width: 22, marginRight: 12, marginTop: 5, }}
                                    />
                                </View>
                                <View style={{ marginRight: 20, justifyContent: 'center' }}>
                                    <TextInput
                                        onChangeText={(txt) => {
                                            setErr('')
                                            if (!/[a-zA-Z." "-,]/.test(txt.slice(-1))) {
                                                setNumber(txt)
                                                console.log(number);
                                            } else {
                                                setErr('This field only contains numbers');
                                            }
                                        }}
                                        style={{
                                            color: BLACK
                                        }}
                                        value={number}
                                        maxLength={10}
                                        keyboardType={"numeric"}
                                        placeholder={'Enter your Mobile Number'}
                                        placeholderTextColor={GRAY}
                                    />
                                </View>
                            </View>
                            <Text style={{ marginTop: 20, color: 'black' }}>By signing in you agree to our t&c and</Text>
                            <Text style={{ color: 'black' }}>privacy policy.</Text>
                            <TouchableOpacity onPress={() => {
                                if (number.length != 10 || number == "") {
                                    Alert.alert('Enter 10 Digit Mobile Number')
                                    setErr('Enter 10 digit mobile number');
                                } else {
                                    sendOTP();
                                }
                            }} style={{ width: 302, height: 45, backgroundColor: '#3E2EFF', marginTop: 70, alignItems: 'center', borderRadius: 10 }}>
                                <Text style={{ fontSize: 20, marginTop: 10, color: 'white', fontWeight: "500" }}>Send OTP</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </>
        )
    }
    const OtpView = () => {
        return (
            <>
                <MyStatusBar backgroundColor={WHITE} barStyle={'dark-content'} />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ backgroundColor: 'white', width: WIDTH, height: 1000, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ alignItems: 'center', width: WIDTH, height: 60, flexDirection: 'row' }}>
                            <View style={{ marginLeft: 20 }}>
                                <TouchableOpacity onPress={() => {
                                    setErr('');
                                    Alert.alert(
                                        "",
                                        "Do you want to change your mobile number ?",
                                        [
                                            {
                                                text: "Cancel",
                                                onPress: () => console.log("Cancel Pressed"),
                                                style: "cancel"
                                            },
                                            {
                                                text: "Yes",
                                                // setPage(0)
                                                onPress: () => setPage(0)
                                            }
                                        ]
                                    )
                                }}>
                                    <Image style={{ width: 34, height: 24, marginRight: 40 }} source={BACK} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginLeft: 35 }}>
                                <Text style={{ fontSize: 20, color: 'black' }}>OTP Verification</Text>
                            </View>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Image
                                source={SPLASH}
                                style={{ height: 102, width: 102, marginRight: 12, marginTop: 10 }}
                            />
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontSize: 30, color: 'black' }}>Attendify</Text>
                        </View>
                        <View style={{ marginTop: 20, alignItems: 'center' }}>
                            <Text style={{ color: 'black' }}>We ‘ve sent you an OTP to your</Text>
                            <Text style={{ color: 'black' }}>phone, please enter the code.</Text>
                        </View>
                        <View style={{ width: WIDTH, height: 560, backgroundColor: '#FFDC61', marginTop: 40, borderRadius: 40, alignItems: 'center' }}>
                            <View style={{ flex: 1 }}>
                                <View style={{ flex: 0.3, justifyContent: 'space-evenly', flexDirection: 'row', marginTop: 20 }}>
                                    <View style={{ ...Styles.otpview }}>
                                        <TextInput
                                            value={num1}
                                            onKeyPress={({ nativeEvent }) => {
                                                setErr('');
                                                if (num2 == '' && nativeEvent.key != 'Backspace' && !/[" ",.-]/.test(nativeEvent.key)) {
                                                    ref2.current.focus();
                                                }
                                            }}
                                            onChangeText={(txt) => {
                                                setErr('');
                                                if (!/[" ",.-]/.test(txt)) {
                                                    setNum1(txt)
                                                }
                                                if (txt != "" && !/[" ",.-]/.test(txt)) {
                                                    ref2.current.focus();
                                                } else if (/[" ",.-]/.test(txt)) {
                                                    setErr('Invalid number');
                                                }
                                            }}
                                            keyboardType="numeric"
                                            ref={ref1}
                                            cursorColor={PINK}
                                            selectionColor={PINK}
                                            maxLength={1}
                                            style={{ ...Styles.otptxt }}
                                        />
                                    </View>
                                    <View style={{ ...Styles.otpview }}>
                                        <TextInput
                                            value={num2}
                                            onKeyPress={({ nativeEvent }) => {
                                                setErr('');
                                                if (nativeEvent.key == 'Backspace') {
                                                    ref1.current.focus();
                                                } else if (num3 == '' && !/[" ",.-]/.test(nativeEvent.key)) {
                                                    ref3.current.focus();
                                                }
                                            }}
                                            onChangeText={(txt) => {
                                                setErr('');
                                                if (!/[" ",.-]/.test(txt)) {
                                                    setNum2(txt)
                                                } else if (/[" ",.-]/.test(txt)) {
                                                    setErr('Invalid number');
                                                }
                                            }}
                                            keyboardType="numeric"
                                            ref={ref2}
                                            cursorColor={PINK}
                                            selectionColor={PINK}
                                            maxLength={1}
                                            style={{ ...Styles.otptxt }}
                                        />
                                    </View>
                                    <View style={{ ...Styles.otpview }}>
                                        <TextInput
                                            value={num3}
                                            onKeyPress={({ nativeEvent }) => {
                                                setErr('');
                                                if (nativeEvent.key == 'Backspace') {
                                                    ref2.current.focus();
                                                } else if (!/[" ",.-]/.test(nativeEvent.key)) {
                                                    ref4.current.focus();
                                                }
                                            }}
                                            onChangeText={(txt) => {
                                                setErr('');
                                                if (!/[" ",.-]/.test(txt)) {
                                                    setNum3(txt)
                                                } else if (/[" ",.-]/.test(txt)) {
                                                    setErr('Invalid number');
                                                }
                                            }}
                                            keyboardType="numeric"
                                            ref={ref3}
                                            cursorColor={PINK}
                                            selectionColor={PINK}
                                            maxLength={1}
                                            style={{ ...Styles.otptxt }}
                                        />
                                    </View>
                                    <View style={{ ...Styles.otpview }}>
                                        <TextInput
                                            value={num4}
                                            onKeyPress={({ nativeEvent }) => {
                                                setErr('');
                                                if (nativeEvent.key == 'Backspace') {
                                                    ref3.current.focus();
                                                }
                                            }}
                                            onChangeText={(txt) => {
                                                setErr('');
                                                if (!/[" ",.-]/.test(txt)) {
                                                    setNum4(txt)
                                                } else if (/[" ",.-]/.test(txt)) {
                                                    setErr('Invalid number');
                                                }
                                            }}
                                            keyboardType="numeric"
                                            ref={ref4}
                                            cursorColor={PINK}
                                            selectionColor={PINK}
                                            maxLength={1}
                                            style={{ ...Styles.otptxt }}
                                        />
                                    </View>
                                </View>
                            </View>
                            <View style={{ alignItems: 'center', marginTop: 100 }}>
                                <Text style={{ color: 'black' }}>Didn’t receive OTP?</Text>
                                <Text style={{ alignSelf: 'center', color: BLACK }}> Wait for 00:{counter == 0 ? "00" : counter} sec</Text>
                                <TouchableOpacity onPress={() => {
                                    sendOTP();
                                }}>
                                    {counter == 0 ? <Text
                                        onPress={() => {
                                            sendOTP();
                                        }}
                                        style={{
                                            fontFamily: 'Roboto-Regular',
                                            margin: 5,
                                            color: 'red',
                                            alignSelf: 'center',
                                            fontSize: 15
                                        }}>
                                        Resend OTP
                                    </Text> : null}
                                </TouchableOpacity>
                            </View>

                            <View style={{ flex: 3, marginBottom: 500 }}>
                                <TouchableOpacity onPress={() => {
                                    VerifyOTP();
                                }} style={{ width: 302, height: 45, backgroundColor: '#3E2EFF', marginTop: 40, alignItems: 'center', borderRadius: 10 }}>
                                    <Text style={{ fontSize: 20, marginTop: 10, color: 'white', fontWeight: "500" }}>Verify</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </>
        )
    }
    return (
        <View>
            {page == 0 && SigninView()}
            {page == 1 && OtpView()}
        </View>
    )
}

const Styles = StyleSheet.create({
    mainView: {
        backgroundColor: 'white',
        width: WIDTH,
        height: HEIGHT * 1.2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    touchableOpacityStyles: {
        backgroundColor: 'blue',
        color: 'red',
        padding: 20
    },
    TextInputView: {
        backgroundColor: 'white',
        width: 50,
    },
    input: {
        backgroundColor: 'red'
    },
    otpview: {
        ...STYLESCONFIG.elevation,
        height: 50,
        width: 50,
        marginHorizontal: 5,
        backgroundColor: WHITE,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    otptxt: {
        color: 'black',
    },
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
})

