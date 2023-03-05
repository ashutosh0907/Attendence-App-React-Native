import { View, Text, Image } from 'react-native'
import React from 'react'
import { MyStatusBar } from '../constants/config'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { BACK } from '../constants/imagepath'
import { WHITE } from '../constants/color'
import StartScreen from '../loginpages/StartScreen'

export default function Remarks({ navigation }) {
    return (
        <>
            <MyStatusBar backgroundColor={WHITE} barStyle={'dark-content'} />
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={{ backgroundColor: 'white' }}>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("StartScreen")
                    }}>
                        <Image
                            style={{ height: 50, width: 50, margin: 15 }}
                            source={BACK}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 30, color: 'green' }}>Remarks Screen</Text>
                </View>
            </View>
        </>
    )
}