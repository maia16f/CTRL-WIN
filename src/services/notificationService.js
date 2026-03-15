import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../config/firebase';

const functions = getFunctions(app, 'europe-west1');
const sendNotificationCallable = httpsCallable(functions, 'sendNotification');

export const sendNotification = async ({ recipientUid, title, body, data }) => {
  try {
    await sendNotificationCallable({
      recipientUid,
      title,
      body,
      data: data || {}
    });
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

export const sendSpottedNotification = async (authorId, petName, locationName, postId) => {
  await sendNotification({
    recipientUid: authorId,
    title: '🐾 Animalul tău a fost văzut!',
    body: `Cineva l-a văzut pe ${petName} în zona ${locationName}`,
    data: { postId, type: 'SPOTTED' }
  });
};

export const sendFoundNotification = async (authorId, petName, postId) => {
  await sendNotification({
    recipientUid: authorId,
    title: `🎉 ${petName} a fost găsit!`,
    body: `Cineva l-a recuperat. Accesează chat-ul pentru detalii.`,
    data: { postId, type: 'FOUND' }
  });
};

export const sendChatNotification = async (recipientUid, senderName, content, conversationId) => {
  await sendNotification({
    recipientUid,
    title: `Mesaj nou de la ${senderName}`,
    body: content.length > 50 ? content.substring(0, 47) + '...' : content,
    data: { conversationId, type: 'CHAT' }
  });
};
