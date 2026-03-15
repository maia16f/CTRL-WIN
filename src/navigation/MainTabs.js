import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/posts/HomeScreen';
import MapScreen from '../screens/map/MapScreen';
import PostCreatorModal from '../screens/posts/PostCreatorModal';
import LoveRadarScreen from '../screens/love-radar/LoveRadarScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Home: focused ? 'home' : 'home-outline',
            Map: focused ? 'map' : 'map-outline',
            Post: focused ? 'add-circle' : 'add-circle-outline',
            LoveRadar: focused ? 'heart' : 'heart-outline',
            Profile: focused ? 'person' : 'person-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#E57373',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Post" component={PostCreatorModal} />
      <Tab.Screen name="LoveRadar" component={LoveRadarScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
