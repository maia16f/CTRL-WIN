import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/posts/HomeScreen';
import MapScreen from '../screens/map/MapScreen';
import PostCreatorModal from '../screens/posts/PostCreatorModal';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';
import ChatListScreen from '../screens/chat/ChatListScreen';
import LoveRadarScreen from '../screens/love-radar/LoveRadarScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const tabIcons = {
  Home: ['home', 'home-outline'],
  Map: ['map', 'map-outline'],
  Post: ['add-circle', 'add-circle-outline'],
  Notifications: ['notifications', 'notifications-outline'],
  Messages: ['chatbubbles', 'chatbubbles-outline'],
  LoveRadar: ['heart', 'heart-outline'],
  Profile: ['person', 'person-outline'],
};

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const [filled, outline] = tabIcons[route.name] || ['help', 'help-outline'];
          return <Ionicons name={focused ? filled : outline} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#E57373',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Post" component={PostCreatorModal} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notificări' }} />
      <Tab.Screen name="Messages" component={ChatListScreen} options={{ title: 'Mesaje' }} />
      <Tab.Screen name="LoveRadar" component={LoveRadarScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
