import React, { useState } from "react";
import { Button, Modal, TouchableOpacity, View } from "react-native";
import { HEIGHT, mod, MyStatusBar, WIDTH } from "../constants/config";
export default Intro = ({ navigation }) => {
    return (
        <>
            <View style={{ flex: 1, backgroundColor: 'red', }}>
                <MyStatusBar backgroundColor={'yellow'} barStyle={'dark-content'} />
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Button
                        title="Welcome To Attendify Press Here To Continue"
                        onPress={() => {
                            navigation.navigate("Login");
                        }} />
                </View>
            </View>
        </>
    )
}