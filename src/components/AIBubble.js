import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, LayoutAnimation } from 'react-native';
import { COLORS } from '../constants/theme';

const AIBubble = ({ item }) => {
  const [feedback, setFeedback] = useState(item.feedbackType === 'liked' ? 'like' : null);
  const [selectedChip, setSelectedChip] = useState(null); // Track the active feedback chip

  const toggleDislike = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (feedback === 'dislike') {
      setFeedback(null);
      setSelectedChip(null); // Reset chip if dislike is toggled off
    } else {
      setFeedback('dislike');
    }
  };

  const handleChipPress = (chip) => {
    setSelectedChip(chip);
    // You could trigger an API call or analytics here
  };

  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <Text style={styles.text}>{item.text}</Text>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => { setFeedback('like'); setSelectedChip(null); }}>
          <Text style={{ opacity: feedback === 'like' ? 1 : 0.3, fontSize: 18 }}>👍🏻</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: 15 }} onPress={toggleDislike}>
          <Text style={{ opacity: feedback === 'dislike' ? 1 : 0.3, fontSize: 18 }}>👎🏻</Text>
        </TouchableOpacity>
      </View>

      {/* Feedback chips appear only on Thumbs Down */}
      {feedback === 'dislike' && (
        <View style={styles.chipRow}>
          {['Inaccurate', 'Too Vague', 'Too Long'].map((chip) => {
            const isSelected = selectedChip === chip;
            return (
              <TouchableOpacity 
                key={chip} 
                onPress={() => handleChipPress(chip)}
                style={[
                  styles.chip, 
                  isSelected && styles.chipSelected
                ]}
              >
                <Text style={[
                  styles.chipText, 
                  isSelected && styles.chipTextSelected
                ]}>
                  {chip}
                </Text>
              </TouchableOpacity>
            );
          })}
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
  chipRow: { flexDirection: 'row', marginTop: 10, flexWrap: 'wrap' },
  chip: { 
    backgroundColor: '#eee', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 15, 
    marginRight: 8, 
    marginBottom: 5,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: { fontSize: 12, color: '#000' },
  chipTextSelected: { color: '#fff', fontWeight: '600' },
});

export default AIBubble;