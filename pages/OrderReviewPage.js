import { useMemo, useState } from 'react';
import {
  Dimensions,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { addComment } from '../api/my-review';
import { useAuth } from '../contexts/AuthContext';

const TOP_BAR_PADDING_TOP = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 6 : 0;
const TOP_BAR_MIN_HEIGHT = 58 + TOP_BAR_PADDING_TOP;
const WINDOW_HEIGHT = Dimensions.get('window').height;
const SCREEN_HEIGHT = Dimensions.get('screen').height;
const BOTTOM_SAFE_PADDING = Platform.OS === 'android'
  ? Math.max(0, SCREEN_HEIGHT - WINDOW_HEIGHT - (StatusBar.currentHeight || 0))
  : 0;

export default function OrderReviewPage({ navigation, route }) {
  const { userId } = useAuth();
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const order = route.params?.order;
  const details = route.params?.details || [];
  const dishNames = useMemo(
    () => details.map((dish) => dish.dishName).filter(Boolean),
    [details]
  );

  const handleSubmitReview = async () => {
    if (!userId) {
      setError('\u5f53\u524d\u7528\u6237\u4fe1\u606f\u4e0d\u5b8c\u6574');
      return;
    }

    if (!order?.orderId) {
      setError('\u8ba2\u5355\u4fe1\u606f\u4e0d\u5b8c\u6574');
      return;
    }

    if (!reviewText.trim()) {
      setError('\u8bf7\u8f93\u5165\u8bc4\u8bba\u5185\u5bb9');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const result = await addComment({
        orderId: order.orderId,
        userId,
        content: reviewText.trim(),
      });

      if (!result.success) {
        setError(result.message || '\u63d0\u4ea4\u8bc4\u8bba\u5931\u8d25');
        return;
      }

      navigation.navigate('MyReviews');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : '\u63d0\u4ea4\u8bc4\u8bba\u5931\u8d25');
    } finally {
      setSubmitting(false);
    }
  };

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
            {dishNames.length ? dishNames.map((dishName) => (
              <Text key={dishName} style={styles.dishName}>
                {dishName}
              </Text>
            )) : (
              <Text style={styles.emptyDishText}>{'\u6682\u65e0\u83dc\u54c1\u4fe1\u606f'}</Text>
            )}
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
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          activeOpacity={0.85}
          disabled={submitting}
          onPress={handleSubmitReview}
          style={[styles.submitButton, submitting && styles.disabledButton]}
        >
          <Text style={styles.submitButtonText}>
            {submitting ? '\u63d0\u4ea4\u4e2d...' : '\u63d0\u4ea4'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff7ed',
    flex: 1,
  },
  topBar: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomColor: '#e5e7eb',
    borderBottomWidth: 1,
    flexDirection: 'row',
    minHeight: TOP_BAR_MIN_HEIGHT,
    paddingTop: TOP_BAR_PADDING_TOP,
    paddingHorizontal: 16,
  },
  topBarButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
    minWidth: 50,
  },
  topBarButtonText: {
    color: '#ea580c',
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
    paddingBottom: 16 + BOTTOM_SAFE_PADDING,
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
  emptyDishText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '700',
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
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: '#ea580c',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 52,
    paddingBottom: Math.max(BOTTOM_SAFE_PADDING, 0),
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '900',
  },
  disabledButton: {
    opacity: 0.65,
  },
});
