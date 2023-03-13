import { View, Text, Image, StyleSheet, Alert } from 'react-native'

import React, { useEffect, useState } from 'react'
import { ELLIPSE, PROFILE, REPORT, REMARKS, LOGOUT, CROSS } from '../constants/imagepath'
import { FlatList, ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { MyStatusBar } from '../constants/config'
import { WHITE } from '../constants/color'
import { useNavigation, DrawerActions } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { clearAll, getObjByKey } from '../utils/Storage'
import { checkuserToken } from '../redux/actions/auth'


export default function CustomDrawer({ navigation }) {
    const [userdata, setUserData] = useState('');


    useEffect(() => {
        async function getUserData() {
            let result = await getObjByKey('loginResponse');
            setUserData(result);
        }
        getUserData();
    }, [])

    const dispatch = useDispatch();
    const logout = () => {
        Alert.alert('', 'Do you want to Logout ?', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: 'OK',
                onPress: () => {
                    clearAll().then(() => {
                        dispatch(checkuserToken());
                    })
                },
            },
        ]);
    }
    // const navigation = useNavigation();
    const Profiledata = [
        {
            name: 'My Profile',
            navigateTo: () => navigation.navigate("Myprofile"),
            img: PROFILE,
        }, {
            name: 'Attendence Report',
            navigateTo: () => navigation.navigate("Attendencereport"),
            img: REPORT,
        },
        // {
        //     name: 'Remarks',
        //     navigateTo: () => navigation.navigate("Remarks"),
        //     img: REMARKS,
        // },
        {
            name: 'Log Out',
            navigateTo: () => logout(),
            img: LOGOUT,
        },
    ]

    const ProfileView = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    item.navigateTo()
                }}
                style={styles.profilelist}
            >
                <Image
                    style={{
                        height: 50,
                        width: 50,
                    }}
                    source={item.img}
                />
                <Text style={{ ...styles.profiletxt, left: 20 }}>{item.name}</Text>
            </TouchableOpacity>
        )
    }
    return (
        <>
            <MyStatusBar backgroundColor={WHITE} barStyle={'dark-content'} />
            {/* <ScrollView> */}
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                <View style={{ marginVertical: 20, alignSelf: 'flex-end', marginRight: 20 }}>
                    <TouchableOpacity onPress={() => {
                        navigation.dispatch(DrawerActions.closeDrawer());
                    }}>
                        <Image
                            source={CROSS}
                            style={{ height: 60, width: 60 }}
                        />
                    </TouchableOpacity>
                </View>
                <Image
                    source={ELLIPSE}
                    style={{ width: 120, height: 120, marginTop: 50 }}
                />
                <View style={{ justifyContent: 'center', alignItems: 'center', margin: 20 }}>
                    <Text style={styles.textStyle}>{userdata?.employee?.employee_name}</Text>
                    <Text style={styles.textStyle}>Emp ID : {userdata?.employee?.employee_no} </Text>
                </View>
                {/* Options View */}
                <FlatList
                    style={{ padding: 50 }}
                    data={Profiledata}
                    renderItem={ProfileView}
                />
            </View>
            {/* </ScrollView> */}
        </>
    )
}

const styles = StyleSheet.create({
    textStyle: {
        fontSize: 20,
        color: 'black'
    },
    optionStyle: {
        marginVertical: 20,
    },
    imageStyle: {
        height: 80,
        width: 80
    },
    touchableOpacityStyle: {
        backgroundColor: 'red',
        padding: 10,
        marginHorizontal: 10,
        width: 150,
        height: 60,
    },
    profilelist: {
        height: 50,
        marginVertical: 10,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        width: 500,
        // backgroundColor:WHITE
    },
    profiletxt: {
        color: 'black',
        fontSize: 20,
        fontFamily: 'Roboto-Bold',
        textAlign: 'center',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'
    }


})



/*
<View style={styles.optionStyle}>
                        <View style={styles.optionStyle}>
                            <View style={{ flexDirection: 'row' }}>
                                <Image
                                    source={PROFILE}
                                    style={styles.imageStyle}
                                />
                                <Text style={{ justifyContent: 'center' }}>My Profile</Text>
                            </View>
                        </View>

                        <View style={styles.optionStyle}>
                            <View style={{ flexDirection: 'row' }}>
                                <Image
                                    source={REPORT}
                                    style={styles.imageStyle}
                                />
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <TouchableOpacity style={styles.touchableOpacityStyle}>
                                        <Text style={{ justifyContent: 'center', fontSize: 20 }}>Attendence</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View style={styles.optionStyle}>
                            <View style={{ flexDirection: 'row' }}>
                                <Image
                                    source={REMARKS}
                                    style={styles.imageStyle}
                                />
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <TouchableOpacity style={styles.touchableOpacityStyle}>
                                        <Text style={{ justifyContent: 'center', fontSize: 20 }}>Remarks</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View style={styles.optionStyle}>
                            <View style={{ flexDirection: 'row' }}>
                                <Image
                                    source={LOGOUT}
                                    style={styles.imageStyle}
                                />
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <TouchableOpacity style={styles.touchableOpacityStyle}>
                                        <Text style={{ justifyContent: 'center', fontSize: 20 }}>Log out</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
*/