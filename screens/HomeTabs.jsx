import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import ProfileScreen from './ProfileScreen';
import RentScreen from './RentScreen';
import CarScreen from './CarScreen';

const Tab = createBottomTabNavigator();

export default function HomeTabs({navigation}) {
    return(
    <Tab.Navigator initialRouteName='Profile'
        screenOptions={{
            headerShown:false,
            tabBarActiveTintColor:'#000000',
            tabBarInactiveTintColor:'#000000',
            tabBarActiveBackgroundColor:'#D2EDFF',
        }}>
        <Tab.Screen name='Car' component={CarScreen} options={{tabBarIcon:() => (<MaterialIcons color={'#000000'} name="train" size={30}/>)}}/>
        <Tab.Screen name ='Profile' component={ProfileScreen} options={{tabBarIcon:() => (<MaterialIcons color={'#000000'} name="home" size={30}/>)}}/>
        <Tab.Screen name='Rent' component={RentScreen} options={{headerShadowVisible:false,tabBarIcon:() => (<MaterialIcons color={'#000000'} name="shop" size={30}/>)}}/>
    </Tab.Navigator>
    );
}
