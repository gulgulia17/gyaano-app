import React, { Component } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native'
import Splash from '../screens/Splash';
import Auth from '../screens/Auth';
import Login from '../screens/Login';
import Register from '../screens/Register';
import Home from '../screens/Home';
import DrawerNavigator from './DrawerNavigator';
import CourseList from '../screens/CourseList';
import CourseTopic from '../screens/CourseTopic';
import CoursePlayer from '../screens/CoursePlayer';
import Docviwer from '../screens/Docviwer';
import ProfileSection from '../screens/ProfileSection';
import Subscription from '../screens/Subscription';
import MySubscription from '../screens/MySubscription';
import Notifications from '../screens/Notifications';
import ResetPassword from '../screens/ResetPassword';
import TNC from '../screens/TNC';
import Forgot from '../screens/Forgot';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PdfScreen from '../screens/PdfScreen';
import { Icon } from 'native-base';

export default class StackNavigator extends Component {
    render() {
        const Stack = createStackNavigator();
        const TabStack = createBottomTabNavigator();

        const AuthScreen = () => {
            return (
                <Stack.Navigator initialRouteName='Splash' headerMode="none">
                    <Stack.Screen
                        name="Splash"
                        component={Splash}
                    />
                    <Stack.Screen
                        name="Auth"
                        component={Auth}
                    />
                    <Stack.Screen
                        name="Login"
                        component={Login}
                    />
                    <Stack.Screen
                        name="Register"
                        component={Register}
                    />
                    <Stack.Screen
                        name="Forgot"
                        component={Forgot}
                    />
                </Stack.Navigator>
            )
        }

        const TabScreen = () => {
            return (
                <TabStack.Navigator
                    initialRouteName="Videos"
                    screenOptions={({ route }) => ({
                        tabBarIcon: ({ focused, color, size }) => {
                            let iconName;

                            if (route.name === 'Videos') {
                                iconName = focused
                                    ? 'videocam'
                                    : 'videocam';
                            } else if (route.name === 'Books') {
                                iconName = focused ? 'book' : 'book';
                            }
                            return <Icon type="Ionicons" name={iconName} size={size} style={{ color: color }} />;
                        },
                    })}
                    tabBarOptions={{
                        activeTintColor: 'black',
                        inactiveTintColor: 'gray',
                    }}
                >
                    <TabStack.Screen name="Videos" component={CourseTopic} />
                    <TabStack.Screen name="Books" component={PdfScreen} />
                </TabStack.Navigator>
            )
        }

        const HomeScreen = () => {
            return (
                <Stack.Navigator initialRouteName='Home'>
                    <Stack.Screen
                        name="Home"
                        component={DrawerNavigator}
                        options={{
                            headerLeft: null,
                            title: '',
                            headerStyle: {
                                height: 0
                            }
                        }}
                    />
                    <Stack.Screen
                        name="Docviwer"
                        component={Docviwer}
                    />
                    <Stack.Screen
                        name="CourseList"
                        component={CourseList}
                    />
                    <Stack.Screen
                        name="CourseTopic"
                        options={{ title:'Topic'}}
                        children={TabScreen}
                    />
                    <Stack.Screen
                        name="Profile"
                        component={ProfileSection}
                    />
                    <Stack.Screen
                        name="Subscription"
                        component={Subscription}
                    />
                    <Stack.Screen
                        name="MySubscription"
                        component={MySubscription}
                        options={{
                            title: 'My Subscription',
                        }}
                    />
                    <Stack.Screen
                        name="Notifications"
                        component={Notifications}
                    />

                    <Stack.Screen
                        name="CoursePlayer"
                        component={CoursePlayer}
                        options={{
                            headerLeft: null,
                            title: '',
                            headerStyle: {
                                height: 0
                            }
                        }}
                    />
                    <Stack.Screen
                        name="ResetPassword"
                        component={ResetPassword}
                        options={{ title: 'Reset Password' }}
                    />
                    <Stack.Screen
                        name="TNC"
                        component={TNC}
                        options={{ title: 'Terms & Conditions' }}
                    />

                </Stack.Navigator>

            )
        }
        return (
            <NavigationContainer>
                <StatusBar translucent={true} barStyle="dark-content" backgroundColor="transparent" />
                <Stack.Navigator initialRouteName='AuthScreen' headerMode="none">
                    <Stack.Screen
                        name="AuthScreen"
                        component={AuthScreen}
                    />
                    <Stack.Screen
                        name="HomeScreen"
                        component={HomeScreen}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        )
    }
}
