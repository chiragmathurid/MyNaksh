import React, { useRef } from 'react';
import { StyleSheet, Text, View, Animated, Pressable, TouchableOpacity } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { COLORS, REACTION_EMOJIS } from '../constants/theme';

const MessageBubble = ({ item, onReply, onReact, activeEmojiId, setActiveEmojiId, replyToText }) => {
  const dragX = useRef(new Animated.Value(0)).current;
  const isEmojiVisible = activeEmojiId === item.id;
  const isUser = item.sender === 'user';

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      if (event.nativeEvent.translationX > 70) {
        onReply(item);
      }
      Animated.spring(dragX, { toValue: 0, tension: 40, friction: 7, useNativeDriver: false }).start();
    }
  };

  const iconOpacity = dragX.interpolate({
    inputRange: [0, 60],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.wrapper, isUser ? styles.alignRight : styles.alignLeft]}>
      <Animated.View style={[styles.replyIconFixed, { opacity: iconOpacity }]}>
        <Text style={{ fontSize: 22 }}>↩️</Text>
      </Animated.View>

      <PanGestureHandler 
        onGestureEvent={Animated.event([{ nativeEvent: { translationX: dragX } }], { useNativeDriver: false })}
        onHandlerStateChange={onHandlerStateChange}
        activeOffsetX={[0, 10]}
      >
        <Animated.View style={[{ transform: [{ translateX: dragX }] }, isUser ? styles.alignRight : styles.alignLeft]}>
          <View style={[styles.bubble, isUser ? styles.userBubble : styles.otherBubble]}>
            
            {replyToText && (
              <View style={[styles.replyRefContainer, isUser ? styles.userReplyBg : styles.otherReplyBg]}>
                <View style={[styles.verticalLine, isUser ? { backgroundColor: '#fff' } : { backgroundColor: COLORS.primary }]} />
                <View style={styles.replyContent}>
                  <Text style={[styles.replyHeader, isUser ? { color: '#fff' } : { color: COLORS.primary }]}>Replying to</Text>
                  <Text numberOfLines={1} style={[styles.replyRefText, isUser ? { color: '#eee' } : { color: '#666' }]}>{replyToText}</Text>
                </View>
              </View>
            )}

            <Pressable onLongPress={() => setActiveEmojiId(item.id)} delayLongPress={350}>
              <Text style={isUser ? styles.textWhite : styles.textBlack}>{item.text}</Text>
            </Pressable>
            
            {item.reaction && (
              <View style={styles.reactionBadge}>
                <Text style={{ fontSize: 12 }}>{item.reaction}</Text>
              </View>
            )}
          </View>
        </Animated.View>
      </PanGestureHandler>

      {isEmojiVisible && (
        <View style={[styles.emojiBar, isUser ? { right: 0 } : { left: 0 }]}>
          {REACTION_EMOJIS.map(e => (
            <TouchableOpacity key={e} onPress={() => onReact(item.id, e)} style={{ padding: 5 }}>
              <Text style={{ fontSize: 24 }}>{e}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginVertical: 6, paddingHorizontal: 15, width: '100%' },
  alignRight: { alignItems: 'flex-end' },
  alignLeft: { alignItems: 'flex-start' },
  replyIconFixed: { position: 'absolute', left: 20, zIndex: -1 },
  bubble: { padding: 12, borderRadius: 18, maxWidth: '85%' },
  userBubble: { backgroundColor: COLORS.primary },
  otherBubble: { backgroundColor: '#F0F0F0' },
  textWhite: { color: '#fff', fontSize: 16 },
  textBlack: { color: '#000', fontSize: 16 },
  replyRefContainer: { flexDirection: 'row', borderRadius: 8, marginBottom: 8, overflow: 'hidden', height: 45 },
  userReplyBg: { backgroundColor: 'rgba(0,0,0,0.15)' },
  otherReplyBg: { backgroundColor: 'rgba(0,0,0,0.05)' },
  verticalLine: { width: 3, height: '100%' },
  replyContent: { paddingHorizontal: 8, justifyContent: 'center' },
  replyHeader: { fontSize: 11, fontWeight: '700', marginBottom: 1 },
  replyRefText: { fontSize: 13 },
  emojiBar: { position: 'absolute', top: -50, flexDirection: 'row', backgroundColor: '#fff', borderRadius: 25, padding: 5, elevation: 5, shadowOpacity: 0.2 },
  reactionBadge: { position: 'absolute', bottom: -12, right: 10, backgroundColor: '#f0f0f0', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2, borderWidth: 1, borderColor: '#ddd' },
});

export default MessageBubble;