import React, { Component } from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import TabNavigator from './TabNavigator';
import DrawerContent from './DrawerContent';

export default class DrawerNavigator extends Component {

    render() {

        const Drawer = createDrawerNavigator();
        return (
            <Drawer.Navigator
                headerMode="none"
                initialRouteName="Tabs"
                drawerContent={props => <DrawerContent {...props} />}
                drawerContentOptions={{
                    activeTintColor: '#e91e63',
                }}>
                <Drawer.Screen
                    name="Tabs"
                    component={TabNavigator}
                />
                
            </Drawer.Navigator>
        )
    }
}
