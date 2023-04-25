import * as React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import Home from "../screens/Home";
// import Login from "../loginpages/Login";
import PermissionScreen from "../loginpages/PermissionScreen";
// import StartScreen from "../loginpages/StartScreen";
// import Profile from "../loginpages/CustomDrawer";
import DrawerStack from "./DrawerStack";
import Login from "../loginpages/Login";
const Stack = createNativeStackNavigator();
export default HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName="PermissionScreen">
      <Stack.Screen options={{ headerShown: false }} name="PermissionScreen" component={PermissionScreen} />
      <Stack.Screen options={{ headerShown: false }} name="DrawerStack" component={DrawerStack} />
      {/* <Stack.Screen options={{ headerShown: false }} name="Login" component={Login} /> */}
    </Stack.Navigator>
  )
}