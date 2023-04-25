import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert, Pressable, Image, BackHandler } from 'react-native'
import React, { useEffect, useState } from 'react'
import DatePicker from 'react-native-date-picker'
import moment from 'moment'
import { POSTNETWORK } from '../utils/Network'
import { BASE_URL } from '../constants/url'
import { HEIGHT, MyStatusBar, WIDTH } from '../constants/config'
import { BLACK, WHITE } from '../constants/color'
import { BACK, LOADER,LUNCHBREAK, SESSION } from '../constants/imagepath'
import StartScreen from '../loginpages/StartScreen'
import { ScrollView } from 'react-native-gesture-handler'
import { Calendar, LocaleConfig } from 'react-native-calendars';
import LinearGradient from 'react-native-linear-gradient'
import { useFocusEffect } from '@react-navigation/native'

export default function Attendencereport({ navigation }) {
    const [date, setDate] = useState(new Date())
    const [modalVisible, setModalVisible] = useState(false);
    const [loadermodalVisible, setloadermodalVisible] = useState(false);
    const [res, setRes] = useState([])
    const [remark, setRemark] = useState("")
    let r = ""
    const [selected, setSelected] = useState('');
    const [sessiontime, setSessionTime]  = useState('')
    const [lunchsessiontime, setLunchSessionTime] = useState('')
    const [norecords, setNoRecords] = useState('')
    const [record, setRecord] = useState([])

    useFocusEffect(() => {
        const backAction = () => {
            setSelected('')
            setSessionTime('')
            setLunchSessionTime('')
            setNoRecords('')
        };
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );
        return () => backHandler.remove();
    });

    useEffect(() => {
            getSession();
            // getLunchSession();
    }, [])


    const getAttendance = async (formattedDate) => {
        setloadermodalVisible(true)
        const url = `${BASE_URL}getAttendanceByDate?_format=json`;
        console.log("formatted date is -------- > ", formattedDate);
        const obj = {
            date: formattedDate
        }
        POSTNETWORK(url, obj, true).then(res => {
            console.log('res', res);
            if (res.code == 200) {
                // console.log("success")
                // console.log(res.message);
                setRes(res.message)
                setloadermodalVisible(false);
                getSession(date)
                // getLunchSession(date);
                // setModalVisible(true);
            } else {
                // Alert.alert('No records found !');
                setloadermodalVisible(false)
                setSessionTime('')
                setLunchSessionTime('')
                setNoRecords('No Records Found')
            }
        }).catch(err => {
            setloadermodalVisible(false);
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

    const getSession =  () => {
        var arr = [];
        console.log("ashu");
        res.map((record, index) => {
            if(record.attendance_type == 1){
                console.log(moment(record.attendance_start).format("hh:mm:ss"));
                let s = moment(record.attendance_start).format("hh:mm");
                let e = moment(record.attendance_end).format("hh:mm")
                setSessionTime(s + " to " +  e);
            } 
            else if(record.attendance_type == 2){
                let s = moment(record.attendance_start).format("hh:mm");
                let e = moment(record.attendance_end).format("hh:mm")
                setLunchSessionTime(s + " to " + e)
            } else {
                arr.push(record);
                console.log("record is -- > ", record);
            }
        })
        setRecord(arr)
    }

    // const getLunchSession = () => {
    //     res.map((record, index) => {
    //         if(record.attendance_type == 2){
    //             console.log(moment(record.attendance_start).format("hh:mm:ss"));
    //             let s = moment(record.attendance_start).format("hh:mm");
    //             let e = moment(record.attendance_end).format("hh:mm")
    //             setLunchSessionTime(s + " to " +  e);
    //         } 
    //         // else {
    //         //     setLunchSessionTime("Not Found!");
    //         // }
    //     })
    // }

    const getStatus = () => {
        getSession();
        // getLunchSession();
    }

    return (
        <>

            <MyStatusBar backgroundColor='white' barStyle={'dark-content'} />
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
            <View style={{ width: WIDTH, backgroundColor: 'white' }}>
                <TouchableOpacity style={{
                    height: 60, width: 60,
                }} onPress={() => {
                    setSelected('')
                    setSessionTime('')
                    setLunchSessionTime('')
                    setNoRecords('')
                    navigation.goBack();
                }}>
                    <Image
                        style={{ height: 50, width: 50, margin: 15 }}
                        source={BACK}
                    />
                </TouchableOpacity>
            </View>
            <View style={{ ...styles.mainView }}>
                <View style={{
                    height: HEIGHT * 0.4,
                    width: WIDTH * 0.9,
                    position: 'absolute',
                    bottom: HEIGHT * 0.36,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginVertical: 10
                    }}>
                        <Text style={{ color: BLACK, fontSize: 20 }}>Select a date to view report !</Text>
                    </View>
                    <Calendar
                        style={{
                            borderColor: 'gray',
                            height: HEIGHT * 0.4,
                            width: WIDTH * 0.9,
                            borderRadius: 10,
                            elevation: 10
                        }}
                        onDayPress={day => {
                            console.log("day selected is ----------- > ", day)
                            setSelected(day.dateString);
                            let dat=moment(day.dateString).format("YYYY/MM/DD")
                            setDate(dat) 
                            // console.log("date is ----------- > ", date)
                            getAttendance(dat)
                            getStatus();
                            // console.log("record is -------- > ", record);
                        }}
                        
                        // onDayLongPress={(day) => console.log('onDayLongPress', day)}
                        markedDates={{
                            [selected]: { selected: true, disableTouchEvent: true, selectedColor: 'green' },
                            ['2023-04-28']: {selected: true, disableTouchEvent: true, selectedColor: 'red'},
                            ['2023-04-29']: {selected: true, disableTouchEvent: true, selectedColor: 'red'},
                        }}
                    />

                   {sessiontime != '' || lunchsessiontime != '' ?  
                   <LinearGradient colors={['#FFFFFF', '#E2E2E2']} style={{  width: WIDTH * 0.9, marginVertical: 10, height: HEIGHT * 0.08, flexDirection: 'column', borderWidth:1, borderColor:'gray', borderRadius:6, backgroundColor:'red', padding:4, justifyContent:'center', alignItems:'center' }}>
                        <View style={{ flexDirection: 'row', width: WIDTH * 0.82, height: HEIGHT * 0.03, margin:1, justifyContent:'space-between' }}>
                            
                            <View style={{ height: 30, width:WIDTH*0.3, flexDirection:'row', justifyContent:'space-between'}}>
                                <View>
                                <Image style={{ height: 26, width: 26 }} source={SESSION} />
                                </View>
                                <Text style={{ ...styles.textStyle, fontSize: 18, }}>Session : </Text>
                            </View>
                            <View style={{ height: 30,width:WIDTH*0.69,}}>
                                <Text style={{ ...styles.textStyle, fontSize: 18, }}>{sessiontime} </Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', width: WIDTH * 0.82, height: HEIGHT * 0.03, margin:1, justifyContent:'space-between' }}>
                            
                            <View style={{ height: 30, width:WIDTH*0.4, flexDirection:'row', justifyContent:'space-between'}}>
                                <View>
                                <Image style={{ height: 26, width: 26 }} source={LUNCHBREAK} />
                                </View>
                                <Text style={{ ...styles.textStyle, fontSize: 18, }}>Lunch Break : </Text>
                            </View>
                            <View style={{ height: 30,width:WIDTH*0.5, }}>
                                <Text style={{ ...styles.textStyle, fontSize: 18, }}>{lunchsessiontime} </Text>
                            </View>
                        </View>

                    </LinearGradient> : <>
                    <View style={{padding:10}}>
                        <Text style={{color:'black', fontSize:20}}>{norecords}</Text>
                    </View></>}
                </View>
            </View>
        </>
    )
}
const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
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
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});


        // <>
        //     <MyStatusBar backgroundColor={WHITE} barStyle={'dark-content'} />
        //     <View style={{ flex: 1, backgroundColor: 'white' }}>
        //         <View style={{ backgroundColor: 'white', width: WIDTH * 0.2 }}>
        //             <TouchableOpacity onPress={() => {
        //                 navigation.navigate("StartScreen")
        //             }}>
        //                 <Image
        //                     style={{ height: 50, width: 50, margin: 15 }}
        //                     source={BACK}
        //                 />
        //             </TouchableOpacity>
        //         </View>
        //         <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 100 }}>
        //             <View><Text style={{ color: 'grey', fontSize: 27, fontWeight: '600' }}>Attendence Report</Text></View>
        //             <Modal
        //                 animationType="fade"
        //                 transparent={true}
        //                 visible={loadermodalVisible}
        //                 onRequestClose={() => {
        //                     // setModalVisible(!modalVisible);
        //                 }}>
        //                 <View style={styles.centeredView}>
        //                     <Image
        //                         style={{ height: 100, width: 100 }}
        //                         source={LOADER}
        //                     />
        //                 </View>
        //             </Modal>
        //             <Modal
        //                 animationType="fade"
        //                 transparent={true}
        //                 visible={modalVisible}
        //                 onRequestClose={() => {
        //                     setModalVisible(!modalVisible);
        //                 }}>
        //                 <View
        //                     activeOpacity={1}
        //                     onPress={() => setModalVisible(false)}
        //                     style={styles.centeredView}>
        //                     <View style={styles.modalView}>
        //                         <ScrollView showsVerticalScrollIndicator={true} style={{}}>{res.length > 0 && res.map((record, index) => {
        //                             if (record?.attendance_remark != "") {
        //                                 // setRemark(record.attendance_remark)
        //                                 r = (record.attendance_remark)
        //                             }
        //                             return <View key={index}>
        //                                 <Text style={{ color: 'black' }}>{getHeading(record.attendance_type)}</Text>
        //                                 <Text style={{ color: getColor(record.attendance_type), margin: 10 }}>
        //                                     Start: {moment(record.attendance_start).format("hh:mm:ss") + " "} End:{moment(record.attendance_end).format("hh:mm:ss")}
        //                                 </Text>
        //                                 {/* { <View style={{ backgroundColor: "red" }}> <Text style={{ color: "white" }}>{record.attendance_remark}</Text></View> : null} */}
        //                             </View>
        //                         })}</ScrollView>
        //                         <View>
        //                             {r ?
        //                                 <View style={{ backgroundColor: 'red', padding: 20, borderRadius: 10 }}>
        //                                     <Text style={{ fontSize: 15, color: 'black' }}>Last Logout Faliure Remarks</Text>
        //                                     <Text style={{ fontSize: 25, color: 'black' }}>{r}</Text>
        //                                 </View> : null
        //                             }
        //                         </View>
        //                         <Pressable
        //                             style={[styles.button, styles.buttonClose]}
        //                             onPress={() => setModalVisible(!modalVisible)}>
        //                             <Text style={styles.textStyle}>Close</Text>
        //                         </Pressable>
        //                     </View>
        //                 </View>
        //             </Modal>
        //             <View style={{ marginVertical: 40, justifyContent: 'center', alignItems: 'center' }}>
        //                 <Text style={{ color: 'black', fontSize: 20 }}>Pick a date to get Attendece Report </Text>
        //                 <DatePicker
        //                     style={styles.datePickerStyle}
        //                     date={date} //initial date from state
        //                     mode="date" //The enum of date, datetime and time
        //                     // placeholder="select date"
        //                     textColor='black'
        //                     format="DD-MM-YYYY"
        //                     minimumDate={new Date("2013-01-01")}
        //                     maxDate="01-01-2045"
        //                     onDateChange={(date) => {
        //                         console.log("date is ---------------- > ", date);
        //                         setDate(date);
        //                     }}
        //                 />
        //             </View>
        //             <TouchableOpacity
        //                 onPress={() => {
        //                     let dt = moment(date).format("YYYY/MM/DD")
        //                     console.log("formated date is ------------ > ", dt);
        //                     setloadermodalVisible(true);
        //                     getAttendance(dt)
        //                     // setModalVisible(true);
        //                     // console.log(date)
        //                 }} style={styles.touchableOpacityStyle}>
        //                 <Text style={{ color: 'white' }}>Show Details</Text>
        //             </TouchableOpacity>
        //         </View>
        //     </View>
        // </>



        // to align text to the left 
//         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//   <Text style={{ flex: 1, textAlign: 'left', alignSelf: 'stretch' }}>
//     Your text here
//   </Text>
// </View>
