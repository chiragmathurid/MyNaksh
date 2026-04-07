import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, LayoutAnimation } from 'react-native';
import { COLORS } from '../constants/theme';


const AIBubble = ({ item }) => {
 const [feedback, setFeedback] = useState(item.feedbackType === 'liked' ? 'like' : null);


 const toggleDislike = () => {
   LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
   setFeedback(feedback === 'dislike' ? null : 'dislike');
 };


 return (
   <View style={styles.container}>
     <View style={styles.bubble}><Text style={styles.text}>{item.text}</Text></View>
     <View style={styles.actions}>
       <TouchableOpacity onPress={() => setFeedback('like')}>
         <Text style={{ opacity: feedback === 'like' ? 1 : 0.3, fontSize: 18 }}>👍🏻</Text>
       </TouchableOpacity>
       <TouchableOpacity style={{ marginLeft: 15 }} onPress={toggleDislike}>
         <Text style={{ opacity: feedback === 'dislike' ? 1 : 0.3, fontSize: 18 }}>👎🏻</Text>
       </TouchableOpacity>
     </View>
     {/* Three chips appear when thumbs down is selected */}
     {feedback === 'dislike' && (
       <View style={styles.chipRow}>
         {['Inaccurate', 'Too Vague', 'Too Long'].map(c => (
           <View key={c} style={styles.chip}><Text style={{ fontSize: 12 }}>{c}</Text></View>
         ))}
       </View>
     )}
   </View>
 );
};


const styles = StyleSheet.create({
 container: { paddingHorizontal: 15, marginVertical: 8 },
 bubble: { backgroundColor: COLORS.aiBubble, padding: 12, borderRadius: 18, alignSelf: 'flex-start', maxWidth: '85%' },
 text: { color: '#000', fontSize: 16 },
 actions: { flexDirection: 'row', marginTop: 6, paddingLeft: 5 },
 chipRow: { flexDirection: 'row', marginTop: 10 },
 chip: { backgroundColor: '#eee', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 15, marginRight: 8 },
});


export default AIBubble;


