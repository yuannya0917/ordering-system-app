import { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function OrderReviewPage({ navigation, route }) {
  const [reviewText, setReviewText] = useState('');
  const order = route.params?.order;
  const dishNames = order?.dishes || [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => navigation.goBack()}
          style={styles.topBarButton}
        >
          <Text style={styles.topBarButtonText}>{'\u8fd4\u56de'}</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>{'\u8bc4\u4ef7\u8ba2\u5355'}</Text>
        <View style={styles.topBarButton} />
      </View>

      <View style={styles.content}>
        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>{'\u83dc\u54c1\u540d\u79f0'}</Text>
          <View style={styles.dishList}>
            {dishNames.map((dishName) => (
              <Text key={dishName} style={styles.dishName}>
                {dishName}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>{'\u8bc4\u4ef7\u5185\u5bb9'}</Text>
          <TextInput
            multiline
            onChangeText={setReviewText}
            placeholder={'\u8bf7\u8f93\u5165\u8bc4\u4ef7\u6587\u672c'}
            placeholderTextColor="#9ca3af"
            style={styles.reviewInput}
            textAlignVertical="top"
            value={reviewText}
          />
        </View>

        <TouchableOpacity activeOpacity={0.85} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>{'\u63d0\u4ea4'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#f7f8f3',
    flex: 1,
  },
  topBar: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomColor: '#e5e7eb',
    borderBottomWidth: 1,
    flexDirection: 'row',
    minHeight: 58,
    paddingHorizontal: 16,
  },
  topBarButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
    minWidth: 50,
  },
  topBarButtonText: {
    color: '#0f766e',
    fontSize: 15,
    fontWeight: '700',
  },
  topBarTitle: {
    color: '#111827',
    flex: 1,
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: 0,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  panel: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 14,
    padding: 15,
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 12,
  },
  dishList: {
    gap: 8,
  },
  dishName: {
    color: '#374151',
    fontSize: 15,
    fontWeight: '800',
  },
  reviewInput: {
    backgroundColor: '#f9fafb',
    borderColor: '#d1d5db',
    borderRadius: 8,
    borderWidth: 1,
    color: '#111827',
    fontSize: 15,
    minHeight: 140,
    padding: 12,
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: '#0f766e',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 52,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '900',
  },
});
