import * as React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from "../loginpages/Login";
import Splash from "../loginpages/Splash";
const Stack = createNativeStackNavigator();
export default LoginStack = () => {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Group>
        <Stack.Screen options={{ headerShown: false }} name="Splash" component={Splash} />
        <Stack.Screen options={{ headerShown: false }} name="Login" component={Login} />
      </Stack.Group>
    </Stack.Navigator>
  )
}