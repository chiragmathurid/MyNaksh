import React, { useRef } from 'react';
import { StyleSheet, Text, View, Animated, Pressable, TouchableOpacity } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { COLORS, REACTION_EMOJIS } from '../constants/theme';

const MessageBubble = ({ item, onReply, onReact, activeEmojiId, setActiveEmojiId, replyToText }) => {
  const dragX = useRef(new Animated.Value(0)).current;
  const isEmojiVisible = activeEmojiId === item.id;

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      if (event.nativeEvent.translationX > 70 && typeof onReply === 'function') {
        onReply(item);
      }
      // useNativeDriver: false prevents the Host Function crashes
      Animated.spring(dragX, { toValue: 0, tension: 40, friction: 7, useNativeDriver: false }).start();
    }
  };

  const iconOpacity = dragX.interpolate({
    inputRange: [0, 60],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  if (item.type === 'event') {
    return <Text style={styles.systemText}>{item.text}</Text>;
  }

  const isUser = item.sender === 'user';

  return (
    <View style={[styles.wrapper, { zIndex: isEmojiVisible ? 999 : 1 }]}>
      <Animated.View style={[styles.replyIconFixed, { opacity: iconOpacity }]}>
        <Text style={{ fontSize: 22 }}>↩️</Text>
      </Animated.View>

      <PanGestureHandler 
        onGestureEvent={Animated.event([{ nativeEvent: { translationX: dragX } }], { useNativeDriver: false })}
        onHandlerStateChange={onHandlerStateChange}
        activeOffsetX={[0, 10]}
      >
        <Animated.View style={{ transform: [{ translateX: dragX }] }}>
          <View style={[styles.bubble, isUser ? styles.userBubble : styles.humanBubble]}>
            {replyToText && (
              <View style={styles.replyRef}>
                <Text style={{ fontSize: 10, color: COLORS.primary, fontWeight: 'bold' }}>Replying to</Text>
                <Text numberOfLines={1} style={styles.replyRefText}>{replyToText}</Text>
              </View>
            )}
            <Pressable onLongPress={() => setActiveEmojiId(item.id)} delayLongPress={350}>
              <Text style={isUser ? styles.textWhite : styles.textBlack}>{item.text}</Text>
            </Pressable>
            {item.reaction && (
              <View style={styles.reactionBadge}><Text style={{ fontSize: 12 }}>{item.reaction}</Text></View>
            )}
          </View>
        </Animated.View>
      </PanGestureHandler>

      {isEmojiVisible && (
        <View style={styles.emojiBar}>
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
  wrapper: { marginVertical: 6, paddingHorizontal: 15, justifyContent: 'center' },
  systemText: { textAlign: 'center', color: COLORS.systemText, fontSize: 12, marginVertical: 10 },
  replyIconFixed: { position: 'absolute', left: 20, zIndex: -1 },
  bubble: { padding: 12, borderRadius: 18, maxWidth: '80%' },
  userBubble: { backgroundColor: COLORS.primary, alignSelf: 'flex-start' }, // Blue on the left
  humanBubble: { backgroundColor: COLORS.humanBubble, alignSelf: 'flex-start' },
  textWhite: { color: '#fff', fontSize: 16 },
  textBlack: { color: '#000', fontSize: 16 },
  replyRef: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 5, borderRadius: 8, marginBottom: 5, borderLeftWidth: 3, borderLeftColor: '#fff' },
  replyRefText: { fontSize: 12, color: '#fff' },
  emojiBar: { position: 'absolute', top: -50, left: 20, flexDirection: 'row', backgroundColor: '#fff', borderRadius: 25, padding: 5, elevation: 5, shadowOpacity: 0.2 },
  reactionBadge: { position: 'absolute', bottom: -12, left: 10, backgroundColor: '#f0f0f0', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2, borderWidth: 1, borderColor: '#ddd' },
});

export default MessageBubble;