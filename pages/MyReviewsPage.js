import { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { getMyReviews } from '../api/my-review';
import { useAuth } from '../contexts/AuthContext';

const TOP_BAR_PADDING_TOP = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 6 : 0;
const TOP_BAR_MIN_HEIGHT = 58 + TOP_BAR_PADDING_TOP;

export default function MyReviewsPage({ navigation }) {
  const { userId } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadReviews = useCallback(async () => {
    if (!userId) {
      setError('\u5f53\u524d\u7528\u6237\u4fe1\u606f\u4e0d\u5b8c\u6574');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const result = await getMyReviews(userId);
      setReviews(result);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : '\u83b7\u53d6\u6211\u7684\u8bc4\u8bba\u5931\u8d25');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const renderReview = ({ item }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Text style={styles.dishName}>{item.orderId}</Text>
        <Text style={styles.rating}>{item.commentId}</Text>
      </View>
      <Text style={styles.reviewDate}>{item.publishTime}</Text>
      <Text style={styles.reviewContent}>{item.content}</Text>
    </View>
  );

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
        <Text style={styles.topBarTitle}>{'\u6211\u7684\u8bc4\u8bba'}</Text>
        <View style={styles.topBarButton} />
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <FlatList
        contentContainerStyle={styles.listContent}
        data={reviews}
        keyExtractor={(item) => item.commentId}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {loading ? '\u8bc4\u8bba\u52a0\u8f7d\u4e2d...' : '\u6682\u65e0\u8bc4\u8bba'}
          </Text>
        }
        onRefresh={loadReviews}
        refreshing={loading}
        renderItem={renderReview}
      />
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
  listContent: {
    gap: 12,
    padding: 16,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 15,
    paddingTop: 28,
    textAlign: 'center',
  },
  reviewCard: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    borderRadius: 8,
    borderWidth: 1,
    padding: 15,
  },
  reviewHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dishName: {
    color: '#111827',
    flex: 1,
    fontSize: 16,
    fontWeight: '900',
  },
  rating: {
    color: '#dc2626',
    fontSize: 15,
    fontWeight: '900',
  },
  reviewDate: {
    color: '#6b7280',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },
  reviewContent: {
    color: '#374151',
    fontSize: 14,
    lineHeight: 20,
  },
});
