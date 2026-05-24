import { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { getAllOrders, getTotalAmount } from '../api/revenue';

const TOP_BAR_PADDING_TOP = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 6 : 0;
const TOP_BAR_MIN_HEIGHT = 58 + TOP_BAR_PADDING_TOP;
const dateTimePattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

export default function RevenuePage({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState({
    totalAmount: 0,
    orderCount: 0,
  });
  const [draftFilters, setDraftFilters] = useState({
    startTime: '',
    endTime: '',
  });
  const [filters, setFilters] = useState({
    startTime: '',
    endTime: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadRevenue = useCallback(async () => {
    const params = {
      orderStatus: '2',
      startTime: filters.startTime || undefined,
      endTime: filters.endTime || undefined,
    };

    try {
      setLoading(true);
      setError('');

      const [summaryResult, orderList] = await Promise.all([
        getTotalAmount(params),
        getAllOrders(params),
      ]);

      setSummary({
        totalAmount: summaryResult?.totalAmount ?? 0,
        orderCount: summaryResult?.orderCount ?? orderList.length,
      });
      setOrders(orderList);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : '\u83b7\u53d6\u8425\u4e1a\u989d\u5931\u8d25');
    } finally {
      setLoading(false);
    }
  }, [filters.endTime, filters.startTime]);

  useEffect(() => {
    loadRevenue();
  }, [loadRevenue]);

  const updateFilter = (field, value) => {
    setDraftFilters((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const searchRevenue = () => {
    if (
      (draftFilters.startTime && !dateTimePattern.test(draftFilters.startTime)) ||
      (draftFilters.endTime && !dateTimePattern.test(draftFilters.endTime))
    ) {
      setError('\u65e5\u671f\u683c\u5f0f\u8bf7\u4f7f\u7528 yyyy-MM-dd HH:mm:ss');
      return;
    }

    setFilters(draftFilters);
  };

  const resetFilters = () => {
    setDraftFilters({
      startTime: '',
      endTime: '',
    });
    setFilters({
      startTime: '',
      endTime: '',
    });
  };

  const renderOrder = ({ item }) => (
    <View style={styles.orderRow}>
      <View style={styles.orderInfo}>
        <Text style={styles.orderId}>{item.orderId}</Text>
        <Text style={styles.orderTime}>{item.orderTime}</Text>
      </View>
      <Text style={styles.orderAmount}>{'\u00a5'}{item.orderPrice}</Text>
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
        <Text style={styles.topBarTitle}>{'\u67e5\u770b\u8425\u4e1a\u989d'}</Text>
        <View style={styles.topBarButton} />
      </View>

      <View style={styles.content}>
        <View style={styles.searchPanel}>
          <View style={styles.searchFields}>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={(value) => updateFilter('startTime', value)}
              placeholder={'\u5f00\u59cb\u65f6\u95f4\uff0c\u5982 2026-05-01 00:00:00'}
              placeholderTextColor="#9ca3af"
              style={styles.searchInput}
              value={draftFilters.startTime}
            />
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={(value) => updateFilter('endTime', value)}
              placeholder={'\u7ed3\u675f\u65f6\u95f4\uff0c\u5982 2026-05-23 23:59:59'}
              placeholderTextColor="#9ca3af"
              style={styles.searchInput}
              value={draftFilters.endTime}
            />
          </View>
          <View style={styles.searchActions}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={searchRevenue}
              style={styles.searchButton}
            >
              <Text style={styles.searchButtonText}>{'\u641c\u7d22'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={resetFilters}
              style={styles.resetButton}
            >
              <Text style={styles.resetButtonText}>{'\u91cd\u7f6e'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryPanel}>
            <Text style={styles.summaryLabel}>{'\u603b\u8425\u4e1a\u989d'}</Text>
            <Text style={styles.revenueValue}>{'\u00a5'}{summary.totalAmount}</Text>
          </View>
          <View style={styles.summaryPanel}>
            <Text style={styles.summaryLabel}>{'\u8ba2\u5355\u6570\u91cf'}</Text>
            <Text style={styles.countValue}>{summary.orderCount}</Text>
          </View>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <FlatList
          contentContainerStyle={styles.listContent}
          data={orders}
          keyExtractor={(item) => item.orderId}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {loading ? '\u8425\u4e1a\u989d\u52a0\u8f7d\u4e2d...' : '\u6682\u65e0\u5df2\u5b8c\u6210\u8ba2\u5355'}
            </Text>
          }
          onRefresh={loadRevenue}
          refreshing={loading}
          renderItem={renderOrder}
        />
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
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  searchPanel: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
    marginBottom: 14,
    padding: 12,
  },
  searchFields: {
    gap: 10,
  },
  searchInput: {
    backgroundColor: '#f9fafb',
    borderColor: '#d1d5db',
    borderRadius: 8,
    borderWidth: 1,
    color: '#111827',
    fontSize: 14,
    minHeight: 44,
    paddingHorizontal: 12,
  },
  searchActions: {
    flexDirection: 'row',
    gap: 10,
  },
  searchButton: {
    alignItems: 'center',
    backgroundColor: '#ea580c',
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    minHeight: 42,
  },
  searchButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
  },
  resetButton: {
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 42,
  },
  resetButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '900',
  },
  summaryPanel: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    padding: 18,
  },
  summaryLabel: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 8,
  },
  revenueValue: {
    color: '#dc2626',
    fontSize: 26,
    fontWeight: '900',
  },
  countValue: {
    color: '#111827',
    fontSize: 26,
    fontWeight: '900',
  },
  listContent: {
    gap: 10,
    paddingTop: 14,
    paddingBottom: 20,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '700',
    paddingVertical: 24,
    textAlign: 'center',
  },
  orderRow: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 52,
    paddingHorizontal: 14,
  },
  orderInfo: {
    flex: 1,
    gap: 4,
  },
  orderId: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '800',
  },
  orderTime: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '700',
  },
  orderAmount: {
    color: '#dc2626',
    fontSize: 15,
    fontWeight: '900',
  },
});
