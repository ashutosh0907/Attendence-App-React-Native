import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert, Pressable, Image } from 'react-native'
import React, { useState } from 'react'
import DatePicker from 'react-native-date-picker'
import moment from 'moment'
import { POSTNETWORK } from '../utils/Network'
import { BASE_URL } from '../constants/url'
import { HEIGHT, MyStatusBar, WIDTH } from '../constants/config'
import { WHITE } from '../constants/color'
import { BACK, LOADER } from '../constants/imagepath'
import StartScreen from '../loginpages/StartScreen'
import { ScrollView } from 'react-native-gesture-handler'


export default function Attendencereport({ navigation }) {
    const [date, setDate] = useState(new Date())
    const [modalVisible, setModalVisible] = useState(false);
    const [loadermodalVisible, setloadermodalVisible] = useState(false);
    const [res, setRes] = useState([])
    const [remark, setRemark] = useState("")
    let r = ""

    const getAttendance = async (formattedDate) => {
        const url = `${BASE_URL}getAttendanceByDate?_format=json`;
        const obj = {
            date: formattedDate
        }
        POSTNETWORK(url, obj, true).then(res => {
            console.log('res', res);
            if (res.code == 200) {
                console.log("success")
                console.log(res.message);
                setRes(res.message)
                setloadermodalVisible(false);
                setModalVisible(true);
            } else {
                Alert.alert('No Records');
                setloadermodalVisible(false)
            }
        })
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
            <MyStatusBar backgroundColor={WHITE} barStyle={'dark-content'} />
            <View style={{ flex: 1, backgroundColor: 'white' }}>
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
                <View><Text style={{ alignSelf: 'center', fontSize: 30, color: 'black' }}>Attendece Report</Text></View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
                                <ScrollView showsVerticalScrollIndicator={true} style={{}}>{res.length > 0 && res.map((record, index) => {
                                    if (record?.attendance_remark != "") {
                                        // setRemark(record.attendance_remark)
                                        r = (record.attendance_remark)
                                    }
                                    return <View key={index}>
                                        <Text style={{ color: 'black' }}>{getHeading(record.attendance_type)}</Text>
                                        <Text style={{ color: getColor(record.attendance_type), margin: 10 }}>
                                            Start: {moment(record.attendance_start).format("hh:mm:ss") + " "} End:{moment(record.attendance_end).format("hh:mm:ss")}
                                        </Text>
                                        {/* { <View style={{ backgroundColor: "red" }}> <Text style={{ color: "white" }}>{record.attendance_remark}</Text></View> : null} */}
                                    </View>
                                })}</ScrollView>
                                <View>
                                    {r ?
                                        <View style={{ backgroundColor: 'red', padding: 20, borderRadius: 10 }}>
                                            <Text style={{ fontSize: 15, color: 'black' }}>Last Logout Faliure Remarks</Text>
                                            <Text style={{ fontSize: 25, color: 'black' }}>{r}</Text>
                                        </View> : null
                                    }
                                </View>
                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => setModalVisible(!modalVisible)}>
                                    <Text style={styles.textStyle}>Close</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>
                    <Text style={{ color: 'black', fontSize: 20 }}>Pick A Date</Text>
                    <DatePicker
                        style={styles.datePickerStyle}
                        date={date} //initial date from state
                        mode="date" //The enum of date, datetime and time
                        // placeholder="select date"
                        textColor='black'
                        format="DD-MM-YYYY"
                        minDate="10-02-2023"
                        maxDate="01-01-2045"
                        onDateChange={(date) => {
                            setDate(date);
                        }}
                    />
                    <TouchableOpacity
                        onPress={() => {
                            let dt = moment(date).format("YYYY/MM/DD")
                            setloadermodalVisible(true);
                            getAttendance(dt)
                            // setModalVisible(true);
                            // console.log(date)
                        }} style={styles.touchableOpacityStyle}>
                        <Text style={{ color: 'white' }}>Show Details</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        padding: 20,
    },
    datePickerStyle: {
        width: 400,
        height: 150,
        marginTop: 20,
    },
    touchableOpacityStyle: {
        backgroundColor: 'green',
        padding: 15,
        marginVertical: 20,
        borderRadius: 5
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
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
        width: WIDTH * 0.5
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



/*

<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
                        <View style={{ padding: 10, margin: 10 }}>{res.length > 0 && res.map((record, index) => {
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
                            <Text style={styles.textStyle}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <Text style={{ color: 'black', fontSize: 20 }}>Pick A Date</Text>
            <DatePicker
                style={styles.datePickerStyle}
                date={date} //initial date from state
                mode="date" //The enum of date, datetime and time
                // placeholder="select date"
                format="DD-MM-YYYY"
                minDate="10-02-2023"
                maxDate="01-01-2045"

                onDateChange={(date) => {
                    setDate(date);
                }}
            />

            <TouchableOpacity
                onPress={() => {
                    // dateFormat = moment(date).format("DD-MM-YYYY")
                    // setDate(dateFormat);
                    let dt = moment(date).format("YYYY/MM/DD")
                    getAttendance(dt)
                    setModalVisible(true);
                    // console.log(date)
                }} style={styles.touchableOpacityStyle}>
                <Text style={{ color: 'white' }}>Show Details</Text>
            </TouchableOpacity>
        </View>

*/