import React, { useEffect, useState } from "react";
import { Button, ImageBackground, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BACKGROUNDBLACK, BLACK, WHITE } from "../constants/color";
import { HEIGHT, mod, MyStatusBar, WIDTH } from "../constants/config";
import { IMAGEBACKGROUND, SPLASH } from "../constants/imagepath";

export default Splash = ({ navigation }) => {
    useEffect(() => {
        setTimeout(() => {
            navigation.navigate('Login')
        }, 1000)
    }, [])

    return (
        <>
            <View style={{ flex: 1 }}>
                <MyStatusBar backgroundColor={WHITE} barStyle={'dark-content'} />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ImageBackground
                        resizeMethod="resize"
                        style={{
                            // flexWrap: 'wrap',
                            height: 100,
                            width: 100,
                        }}
                        source={SPLASH}
                    />
                    <View style={{ width: 400, height: 50, alignItems: 'center', justifyContent: 'center', marginTop: 400 }}><Text style={{ color: 'black', fontSize: 40 }}>Attendify</Text></View>
                </View>
            </View>
        </>
    )
}
