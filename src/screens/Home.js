import React from "react";
import { Button, View } from "react-native";
export default Home=()=>{
    return (
        <View style={{flex:1,backgroundColor:'cyan',justifyContent:'center'}}>
            <Button
                title="Press Here"
                onPress={()=>{
                    console.log("Hello");
                }}
            />
        </View>
    )
}