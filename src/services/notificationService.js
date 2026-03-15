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
    title: '🐾 Your pet was spotted!',
    body: `Someone saw ${petName} in ${locationName}`,
    data: { postId, type: 'SPOTTED' }
  });
};

export const sendFoundNotification = async (authorId, petName, postId) => {
  await sendNotification({
    recipientUid: authorId,
    title: `🎉 ${petName} was found!`,
    body: `Someone recovered them. Check the chat for details.`,
    data: { postId, type: 'FOUND' }
  });
};

export const sendChatNotification = async (recipientUid, senderName, content, conversationId) => {
  await sendNotification({
    recipientUid,
    title: `New message from ${senderName}`,
    body: content.length > 50 ? content.substring(0, 47) + '...' : content,
    data: { conversationId, type: 'CHAT' }
  });
};

/** Notify users that a lost animal was posted near them (within ~500m). */
export const sendLostAnimalNearbyNotification = async (recipientUid, locationName, postId) => {
  await sendNotification({
    recipientUid,
    title: '🐾 Animal în zona ta!',
    body: locationName ? `Un animal pierdut a fost raportat în: ${locationName}` : 'Un animal pierdut a fost raportat în zona ta.',
    data: { postId, type: 'LOST_NEARBY' }
  });
};
