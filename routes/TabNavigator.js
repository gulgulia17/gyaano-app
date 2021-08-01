import React, { Component } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon, } from 'native-base';
import Docs from '../screens/Docs';
import Home from '../screens/Home';

export default class TabNavigator extends Component {
    render() {
        const Tab = createBottomTabNavigator();
        return (
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === 'HomeTab') {
                            iconName = focused
                                ? 'home'
                                : 'home';
                        } else if (route.name === 'Docs') {
                            iconName = focused ? 'document' : 'document';
                        }
                        return <Icon type="Ionicons" name={iconName} size={size} style={{ color: color }} />;
                    },
                })}
                tabBarOptions={{
                    activeTintColor: 'black',
                    inactiveTintColor: 'gray',
                }}
            >
                <Tab.Screen name="HomeTab" component={Home} options={{title:'Home'}}/>
                <Tab.Screen name="Docs" component={Docs} />
            </Tab.Navigator>
        )
    }
}
