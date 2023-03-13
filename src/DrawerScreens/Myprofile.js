import { View, Text, StyleSheet, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getObjByKey } from '../utils/Storage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { BACK } from '../constants/imagepath'
import { SafeAreaView } from 'react-native-safe-area-context';
import { MyStatusBar, WIDTH } from '../constants/config';
import { WHITE } from '../constants/color';
import StartScreen from '../loginpages/StartScreen';

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
            <MyStatusBar backgroundColor={WHITE} barStyle={'dark-content'} />
            <View style={{ flex: 1, backgroundColor: 'white', width: WIDTH }}>
                <View style={{ backgroundColor: 'white', width: WIDTH * 0.2 }}>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("StartScreen")
                    }}>
                        <Image
                            style={{ height: 50, width: 50, margin: 15 }}
                            source={BACK}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                    <Text style={{ color: 'grey', fontSize: 27, fontWeight: '600' }}>Profile Page</Text>
                    <View style={styles.detailsContainerStyle}>
                        <View style={styles.eachEntryStyle}>
                            <Text style={styles.headersStyle}>Name :</Text>
                            <Text style={styles.dataStyles}>{userdata?.employee?.employee_name}</Text>
                        </View>
                        <View style={styles.eachEntryStyle}>
                            <Text style={styles.headersStyle}>Emp Id :</Text>
                            <Text style={styles.dataStyles}>{userdata?.employee?.employee_no}</Text>
                        </View>
                        <View style={styles.eachEntryStyle}>
                            <Text style={styles.headersStyle}>Email :</Text>
                            <Text style={styles.dataStyles}>{userdata?.employee?.employee_email}</Text>
                        </View>
                        <View style={styles.eachEntryStyle}>
                            <Text style={styles.headersStyle}>Phone Number :</Text>
                            <Text style={styles.dataStyles}>{userdata?.employee?.employee_mobile}</Text>
                        </View>
                        <View style={styles.eachEntryStyle}>
                            <Text style={styles.headersStyle}>Office Address :</Text>
                            <Text style={styles.dataStyles}>{userdata?.employee?.employee_office_address}</Text>
                        </View>
                        <View style={styles.eachEntryStyle}>
                            <Text style={styles.headersStyle}>Home Address :</Text>
                            <Text style={styles.dataStyles}>{userdata?.employee?.employee_home_address}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    detailsContainerStyle: {
        padding: 30
    },
    eachEntryStyle: {
        padding: 6,
        // borderColor: 'black',
        // borderWidth: 1,
        marginVertical: 2
    },
    headersStyle: {
        fontSize: 18,
        color: 'blue',
        fontWeight: '500',

    },
    dataStyles: {
        fontSize: 24,
        color: 'black',
        fontWeight: '400'
    }
})



/*

<View style={{ height: 900, width: 450, flexDirection: 'row' }}>
                <TouchableOpacity  style={{ width: 34, height: 24, alignSelf: 'center'}}>
                    <Image style={{ width: 34, height: 24, alignSelf: 'center' }} source={BACK} />
                </TouchableOpacity>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: 'gray', fontSize: 30 }}>Profile Page</Text>
                    <View style={styles.detailsContainerStyle}>
                        <View style={styles.eachEntryStyle}>
                            <Text style={styles.headersStyle}>Name :</Text>
                            <Text style={styles.dataStyles}>{userdata?.employee?.employee_name}</Text>
                        </View>
                        <View style={styles.eachEntryStyle}>
                            <Text style={styles.headersStyle}>Emp Id :</Text>
                            <Text style={styles.dataStyles}>{userdata?.employee?.employee_no}</Text>
                        </View>
                        <View style={styles.eachEntryStyle}>
                            <Text style={styles.headersStyle}>Email :</Text>
                            <Text style={styles.dataStyles}>{userdata?.employee?.employee_email}</Text>
                        </View>
                        <View style={styles.eachEntryStyle}>
                            <Text style={styles.headersStyle}>Phone Number :</Text>
                            <Text style={styles.dataStyles}>{userdata?.employee?.employee_mobile}</Text>
                        </View>
                        <View style={styles.eachEntryStyle}>
                            <Text style={styles.headersStyle}>Office Address :</Text>
                            <Text style={styles.dataStyles}>{userdata?.employee?.employee_office_address}</Text>
                        </View>
                        <View style={styles.eachEntryStyle}>
                            <Text style={styles.headersStyle}>Home Address :</Text>
                            <Text style={styles.dataStyles}>{userdata?.employee?.employee_home_address}</Text>
                        </View>
                    </View>
                </View>
            </View>
*/