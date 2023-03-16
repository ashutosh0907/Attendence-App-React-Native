import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import StartScreen from '../loginpages/StartScreen';
import { WHITE } from '../constants/color';
import { WIDTH } from '../constants/config';
import CustomDrawer from '../loginpages/CustomDrawer';
import Remarks from '../DrawerScreens/Remarks';
import Myprofile from '../DrawerScreens/Myprofile';
import Attendencereport from '../DrawerScreens/Attendencereport';

export default function DrawerStack() {
    const Drawer = createDrawerNavigator();
    return (
        <Drawer.Navigator
            drawerContent={props => <CustomDrawer {...props} />}
            screenOptions={{
                drawerPosition: 'right',
                drawerStyle: {
                    backgroundColor: WHITE,
                    width: WIDTH,
                    // width:WIDTH * 0.9,
                },
            }}>
            <Drawer.Screen options={{ headerShown: false }} name="StartScreen" component={StartScreen} />
            <Drawer.Screen options={{ headerShown: false, swipeEnabled: false }} name="Remarks" component={Remarks} />
            <Drawer.Screen options={{ headerShown: false, swipeEnabled: false }} name="Myprofile" component={Myprofile} />
            <Drawer.Screen options={{ headerShown: false, swipeEnabled: false }} name="Attendencereport" component={Attendencereport} />
        </Drawer.Navigator>
    )
}