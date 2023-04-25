import { View, Text, StyleSheet, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getObjByKey } from '../utils/Storage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { BACK, ICON } from '../constants/imagepath'
import { SafeAreaView } from 'react-native-safe-area-context';
import { HEIGHT, MyStatusBar, WIDTH } from '../constants/config';
import { WHITE } from '../constants/color';
import StartScreen from '../loginpages/StartScreen';
import LinearGradient from 'react-native-linear-gradient'

export default function Myprofile({ navigation }) {
    const [userdata, setUserData] = useState('');
    useEffect(() => {
        async function getUserData() {
            let result = await getObjByKey('loginResponse');
            setUserData(result);
        }
        getUserData();
    }, [])
    return (
        <>
            <MyStatusBar backgroundColor='white' barStyle={'dark-content'} />
            <View style={{ ...styles.mainView }}>
                <View style={{ width: WIDTH * 0.2 }}>
                    <TouchableOpacity onPress={() => {
                        navigation.goBack();
                    }}>
                        <Image
                            style={{ height: 50, width: 50, margin: 15 }}
                            source={BACK}
                        />
                    </TouchableOpacity>
                </View>
                <LinearGradient colors={['#FFFFFF', '#E2E2E2', '#E2E2E2']} style={{ ...styles.detailsView }}>
                    <View style={{ ...styles.detailsSubView }}>
                        <View style={{ height: HEIGHT * 0.12, width: WIDTH * 0.3, alignItems: 'center', justifyContent: 'center', }}>
                            <Image style={{ height: 95, width: 90 }} source={ICON} />
                        </View>
                        <View style={{ height: HEIGHT * 0.12, width: WIDTH * 0.65, alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ width: WIDTH * 0.65, height: HEIGHT * 0.025 }}>
                                <Text style={{ ...styles.textStyle }}>{userdata?.employee?.employee_name} </Text>
                            </View>
                            <View style={{ width: WIDTH * 0.65, height: HEIGHT * 0.025 }}>
                                <Text style={{ ...styles.textStyle }}>React Native Developer</Text>
                            </View>
                            <View style={{ width: WIDTH * 0.65, height: HEIGHT * 0.025 }}>
                                <Text style={{ ...styles.textStyle }}>Emp. ID : {userdata?.employee?.employee_no}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ height: HEIGHT * 0.368, width: WIDTH * 0.9, alignItems: 'center', }}>
                        <View style={{ height: userdata?.employee?.employee_email.length > 20 ? HEIGHT * 0.05 : HEIGHT * 0.03, width: WIDTH * 0.9, flexDirection: 'row' }}>
                            <View style={{ height: userdata?.employee?.employee_email.length > 20 ? HEIGHT * 0.04 : HEIGHT * 0.03, justifyContent: 'center', alignItems: 'center', width: WIDTH * 0.2, }}>
                                <Text style={{ ...styles.textStyle }}>Email : </Text>
                            </View>
                            <View style={{ height: userdata?.employee?.employee_email.length > 20 ? HEIGHT * 0.04 : HEIGHT * 0.03, width: WIDTH * 0.70, justifyContent: 'center', paddingHorizontal: 20 }}>
                                <Text style={{ ...styles.textStyle, fontSize: 15 }}>{userdata?.employee?.employee_email}</Text>
                            </View>
                        </View>
                        <View style={{ height: HEIGHT * 0.05, width: WIDTH * 0.89, flexDirection: 'row' }}>
                            <View style={{ height: userdata?.employee?.employee_email.length > 20 ? HEIGHT * 0.04 : HEIGHT * 0.03, justifyContent: 'center', alignItems: 'center', width: WIDTH * 0.2, }}>
                                <Text style={{ ...styles.textStyle }}>Phone : </Text>
                            </View>
                            <View style={{ height: HEIGHT * 0.04, width: WIDTH * 0.70, justifyContent: 'center', paddingHorizontal: 20 }}>
                                <Text style={{ ...styles.textStyle, fontSize: 15 }}>{userdata?.employee?.employee_mobile}</Text>
                            </View>
                        </View>
                        <View style={{ height: HEIGHT * 0.11, width: WIDTH * 0.87, flexDirection: 'row' }}>
                            <View style={{ height: HEIGHT * 0.05, justifyContent: 'center', alignItems: 'center', width: WIDTH * 0.35, }}>
                                <Text style={{ ...styles.textStyle }}>Office address : </Text>
                            </View>
                            <View style={{ height: HEIGHT * 0.051, width: WIDTH * 0.55, justifyContent: 'center', }}>
                                <Text style={{ ...styles.textStyle, fontSize: 15 }}>{userdata?.employee?.employee_office_address}</Text>
                            </View>
                        </View>
                        <View style={{ height: HEIGHT * 0.13, width: WIDTH * 0.87, flexDirection: 'row', }}>
                            <View style={{ height: HEIGHT * 0.05, justifyContent: 'center', alignItems: 'center', width: WIDTH * 0.35, }}>
                                <Text style={{ ...styles.textStyle }}>Home address : </Text>
                            </View>
                            <View style={{ height: HEIGHT * 0.051, width: WIDTH * 0.54, justifyContent: 'center', }}>
                                <Text style={{ ...styles.textStyle, fontSize: 15 }}>{userdata?.employee?.employee_home_address}</Text>
                            </View>
                        </View>
                    </View>
                </LinearGradient >
            </View>
        </>
    )
}


const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: 'white'
    },
    detailsView: {
        backgroundColor: '#00000040',
        width: WIDTH * 0.9,
        height: HEIGHT * 0.5,
        alignSelf: 'center',
        borderRadius: 9,
        elevation: 10
    },
    detailsSubView: {
        flexDirection: 'row',
        width: WIDTH * 0.9,
        height: HEIGHT * 0.13,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textStyle: {
        fontSize: 17,
        fontWeight: '500',
        color: 'black',
    }
})
// const styles = StyleSheet.create({
//     detailsContainerStyle: {
//         padding: 30
//     },
//     eachEntryStyle: {
//         padding: 6,
//         // borderColor: 'black',
//         // borderWidth: 1,
//         marginVertical: 2
//     },
//     headersStyle: {
//         fontSize: 18,
//         color: 'blue',
//         fontWeight: '500',

//     },
//     dataStyles: {
//         fontSize: 24,
//         color: 'black',
//         fontWeight: '400'
//     }
// })