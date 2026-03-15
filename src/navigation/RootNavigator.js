import React from 'react';
import { useAuth } from '../context/AuthContext';
import { createStackNavigator } from '@react-navigation/stack';
import MainTabs from './MainTabs';
import AuthStack from './AuthStack';
import PostDetailScreen from '../screens/posts/PostDetailScreen';
import CreatePostScreen from '../screens/posts/CreatePostScreen';
import PostTypeSelector from '../screens/posts/PostTypeSelector';
import ChatListScreen from '../screens/chat/ChatListScreen';
import ChatScreen from '../screens/chat/ChatScreen';
import AddPetScreen from '../screens/profile/AddPetScreen';
import PetProfileScreen from '../screens/profile/PetProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import CreateMatingPostScreen from '../screens/love-radar/CreateMatingPostScreen';
import MatingDetailScreen from '../screens/love-radar/MatingDetailScreen';
import SectionListScreen from '../screens/posts/SectionListScreen';
import PickLocationScreen from '../screens/map/PickLocationScreen';
import { ActivityIndicator, View } from 'react-native';
import { COLORS } from '../utils/constants';

const Stack = createStackNavigator();

const AppStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MainTabs" component={MainTabs} />
    <Stack.Screen name="PostDetail" component={PostDetailScreen} options={{ headerShown: true, title: 'Post details' }} />
    <Stack.Screen name="PostTypeSelector" component={PostTypeSelector} options={{ headerShown: true, title: 'Post type' }} />
    <Stack.Screen name="CreatePost" component={CreatePostScreen} options={{ headerShown: true, title: 'Create post' }} />
    <Stack.Screen name="PickLocation" component={PickLocationScreen} options={{ headerShown: true, title: 'Alege locația' }} />
    <Stack.Screen name="ChatList" component={ChatListScreen} options={{ headerShown: true, title: 'Messages' }} />
    <Stack.Screen name="Chat" component={ChatScreen} options={{ headerShown: true, title: 'Chat' }} />
    <Stack.Screen name="AddPet" component={AddPetScreen} options={{ headerShown: true, title: 'Add pet' }} />
    <Stack.Screen name="PetProfile" component={PetProfileScreen} options={{ headerShown: true, title: 'Pet profile' }} />
    <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: true, title: 'Edit profile' }} />
    <Stack.Screen name="CreateMatingPost" component={CreateMatingPostScreen} options={{ headerShown: true, title: 'Mating post' }} />
    <Stack.Screen name="MatingDetail" component={MatingDetailScreen} options={{ headerShown: true, title: 'Mating details' }} />
    <Stack.Screen name="SectionList" component={SectionListScreen} options={({ route }) => ({ headerShown: true, title: route.params?.sectionTitle || 'More' })} />
  </Stack.Navigator>
);

export default function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return user ? <AppStack /> : <AuthStack />;
}
