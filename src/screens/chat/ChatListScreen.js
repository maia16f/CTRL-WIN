import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { COLORS } from '../../utils/constants';

const ChatListScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Conversații</Text>
      <FlatList
        data={[]}
        renderItem={({ item }) => <Text>Chat {item.id}</Text>}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>Nu ai nicio conversație încă.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textLight,
    marginTop: 50,
  }
});

export default ChatListScreen;
