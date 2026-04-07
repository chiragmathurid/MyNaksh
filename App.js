import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, FlatList, TouchableOpacity, Image, 
  SafeAreaView, TextInput, KeyboardAvoidingView, Platform, 
  Pressable, Modal, Alert 
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { COLORS } from './src/constants/theme';
import MessageBubble from './src/components/MessageBubble';
import AIBubble from './src/components/AIBubble';

// JSON Payload specific only to Astrologer Chat
const ASTRO_DATA = [
  { "id": "1", "sender": "system", "text": "Your session with Astrologer Vikram has started.", "timestamp": 1734681480000, "type": "event" },
  { "id": "2", "sender": "user", "text": "Namaste. I am feeling very anxious about my current job. Can you look at my chart?", "timestamp": 1734681600000, "type": "text" },
  { "id": "3", "sender": "ai_astrologer", "text": "Namaste! I am analyzing your birth details. Currently, you are running through Shani Mahadasha. This often brings pressure but builds resilience.", "timestamp": 1734681660000, "type": "ai", "hasFeedback": true, "feedbackType": "liked" },
  { "id": "4", "sender": "human_astrologer", "text": "I see the same. Look at your 6th house; Saturn is transiting there. This is why you feel the workload is heavy.", "timestamp": 1734681720000, "type": "human" },
  { "id": "5", "sender": "user", "text": "Is there any remedy for this? I find it hard to focus.", "timestamp": 1734681780000, "type": "text", "replyTo": "4" },
  { "id": "6", "sender": "ai_astrologer", "text": "I suggest chanting the Shani Mantra 108 times on Saturdays. Would you like the specific mantra text?", "timestamp": 1734681840000, "type": "ai", "hasFeedback": false }
];

// Default Payload for MyNaksh
const MYNAKSH_DATA = [
  { id: 'm1', text: 'Swipe right to see the reply icon! ↩️', sender: 'user', type: 'text' },
  { id: 'm2', text: 'Long press for emojis ✨', sender: 'user', type: 'text' }
];

export default function App() {
  const [screen, setScreen] = useState('list');
  const [showRating, setShowRating] = useState(false);
  const [astroMessages, setAstroMessages] = useState(ASTRO_DATA);
  const [myNakshMessages, setMyNakshMessages] = useState(MYNAKSH_DATA);
  const [replyTo, setReplyTo] = useState(null);
  const [activeEmojiId, setActiveEmojiId] = useState(null);

  const handleReact = (id, emoji) => {
    const update = (msgs) => msgs.map(m => m.id === id ? { ...m, reaction: m.reaction === emoji ? null : emoji } : m);
    screen === 'aiChat' ? setAstroMessages(update(astroMessages)) : setMyNakshMessages(update(myNakshMessages));
    setActiveEmojiId(null);
  };

  const handleStarClick = () => {
    Alert.alert("Captured"); // Capture Alert
    setShowRating(false);
    setScreen('list');
  };

  if (screen === 'list') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.mainHeader}><Text style={styles.mainTitle}>Chats</Text></View>
        {/* List Items matching provided image */}
        <TouchableOpacity style={styles.listItem} onPress={() => setScreen('aiChat')}>
          <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2585/2585169.png' }} style={styles.avatar} />
          <View><Text style={styles.name}>AI Astrologer</Text><Text style={styles.sub}>How are your stars?</Text></View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.listItem} onPress={() => setScreen('userChat')}>
          <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }} style={styles.avatar} />
          <View><Text style={styles.name}>MyNaksh</Text><Text style={styles.sub}>Online</Text></View>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const currentMessages = screen === 'aiChat' ? astroMessages : myNakshMessages;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        {/* Chat Header */}
        <View style={styles.header}>
          <View style={styles.headerSide}>
            <TouchableOpacity onPress={() => setScreen('list')}><Text style={{ fontSize: 24, paddingLeft: 10 }}>←</Text></TouchableOpacity>
          </View>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{screen === 'aiChat' ? 'AI Astrologer' : 'MyNaksh'}</Text>
          </View>
          <View style={styles.headerSide}>
            {screen === 'aiChat' && (
              <TouchableOpacity onPress={() => setShowRating(true)} style={{ alignItems: 'flex-end', paddingRight: 10 }}>
                <Text style={{ color: 'red', fontWeight: 'bold' }}>End Chat</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <Pressable style={{ flex: 1 }} onPress={() => setActiveEmojiId(null)}>
            <FlatList 
              data={currentMessages}
              keyExtractor={item => item.id}
              contentContainerStyle={{ paddingTop: 10, paddingBottom: 20 }}
              renderItem={({ item }) => {
                if (item.type === 'ai') return <AIBubble item={item} />;
                const replyText = item.replyTo ? currentMessages.find(m => m.id === item.replyTo)?.text : null;
                return <MessageBubble item={item} onReply={setReplyTo} onReact={handleReact} activeEmojiId={activeEmojiId} setActiveEmojiId={setActiveEmojiId} replyToText={replyText} />;
              }}
            />
          </Pressable>

          {/* Swipe to reply preview bar */}
          {replyTo && (
            <View style={styles.replyPreview}>
              <View style={styles.replyAccent} />
              <View style={{ flex: 1, paddingLeft: 10 }}>
                <Text style={{ fontWeight: 'bold', color: COLORS.primary, fontSize: 12 }}>Replying to</Text>
                <Text numberOfLines={1} style={{ color: '#666', marginTop: 2 }}>{replyTo.text}</Text>
              </View>
              <TouchableOpacity onPress={() => setReplyTo(null)} style={{ padding: 10 }}>
                <Text style={{ fontSize: 18, color: '#999' }}>✕</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Bottom Input Area */}
          <View style={styles.inputArea}>
            <TextInput placeholder="Write a message..." style={styles.input} />
            <TouchableOpacity style={{ marginLeft: 10 }}><Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>Send</Text></TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        {/* 5 Star Rating Modal */}
        <Modal visible={showRating} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.ratingCard}>
              <Text style={styles.ratingTitle}>Thank You!</Text>
              <View style={{ flexDirection: 'row', marginVertical: 20 }}>
                {[1, 2, 3, 4, 5].map(s => (
                  <TouchableOpacity key={s} onPress={handleStarClick}>
                    <Text style={{ fontSize: 40, marginHorizontal: 2 }}>⭐</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity onPress={() => setShowRating(false)}>
                <Text style={{ color: 'gray', fontSize: 14 }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  mainHeader: { padding: 20, borderBottomWidth: 1, borderColor: '#eee' },
  mainTitle: { fontSize: 28, fontWeight: 'bold' },
  listItem: { flexDirection: 'row', padding: 15, alignItems: 'center', borderBottomWidth: 0.5, borderColor: '#eee' },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  name: { fontWeight: 'bold', fontSize: 16, marginBottom: 2 },
  sub: { color: 'gray', fontSize: 14 },
  
  header: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee', alignItems: 'center' },
  headerSide: { flex: 1 },
  headerCenter: { flex: 2, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  
  replyPreview: { flexDirection: 'row', padding: 10, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#eee', alignItems: 'center' },
  replyAccent: { width: 4, height: '100%', backgroundColor: COLORS.primary, borderRadius: 2 },
  inputArea: { flexDirection: 'row', padding: 12, borderTopWidth: 1, borderColor: '#eee', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#f0f0f0', borderRadius: 20, paddingHorizontal: 15, height: 40 },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  ratingCard: { backgroundColor: '#fff', padding: 30, borderRadius: 25, alignItems: 'center', width: '80%', elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  ratingTitle: { fontSize: 24, fontWeight: 'bold' }
});