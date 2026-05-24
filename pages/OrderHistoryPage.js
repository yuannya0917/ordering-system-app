import { useCallback, useEffect, useMemo, useState } from 'react';
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

import { getOrderDetails, getOrderHistory } from '../api/order-history';
import { useAuth } from '../contexts/AuthContext';

const TOP_BAR_PADDING_TOP = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 6 : 0;
const TOP_BAR_MIN_HEIGHT = 58 + TOP_BAR_PADDING_TOP;
const tabs = [
  {
    id: 'all',
    label: '\u5168\u90e8',
  },
  {
    id: 'processing',
    label: '\u8fdb\u884c\u4e2d',
  },
  {
    id: 'completed',
    label: '\u5df2\u5b8c\u6210',
  },
];

const statusTextMap = {
  0: '\u672a\u63a5\u5355',
  1: '\u8fdb\u884c\u4e2d',
  2: '\u5df2\u5b8c\u6210',
};

const statusKeyMap = {
  0: 'pending',
  1: 'processing',
  2: 'completed',
};

export default function MyOrdersPage({ navigation }) {
  const { userId } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState([]);
  const [detailsByOrderId, setDetailsByOrderId] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadOrders = useCallback(async () => {
    if (!userId) {
      setError('\u5f53\u524d\u7528\u6237\u4fe1\u606f\u4e0d\u5b8c\u6574');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const orderList = await getOrderHistory(userId);
      setOrders(orderList);

      const detailEntries = await Promise.all(
        orderList.map(async (order) => {
          try {
            const details = await getOrderDetails(order.orderId);
            return [order.orderId, details];
          } catch {
            return [order.orderId, []];
          }
        })
      );

      setDetailsByOrderId(Object.fromEntries(detailEntries));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : '\u83b7\u53d6\u5386\u53f2\u8ba2\u5355\u5931\u8d25');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filteredOrders = useMemo(() => {
    if (activeTab === 'all') {
      return orders;
    }

    return orders.filter((order) => statusKeyMap[order.orderStatus] === activeTab);
  }, [activeTab, orders]);

  const renderOrder = ({ item }) => {
    const statusKey = statusKeyMap[item.orderStatus] || 'completed';
    const details = detailsByOrderId[item.orderId] || [];
    const items = details.length
      ? details
          .map((detail) => `${detail.dishName} \u00a5${detail.dishPrice} x${detail.dishNum}`)
          .join('\uff0c')
      : '\u6682\u65e0\u8be6\u60c5';

    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderId}>{item.orderId}</Text>
          <Text
            style={[
              styles.status,
              statusKey === 'processing' && styles.processingStatus,
            ]}
          >
            {statusTextMap[item.orderStatus] || '\u672a\u77e5\u72b6\u6001'}
          </Text>
        </View>
        <Text style={styles.orderDate}>{item.orderTime}</Text>
        <Text style={styles.orderItems}>{items}</Text>
        {item.orderNote ? (
          <Text style={styles.orderItems}>{'\u5907\u6ce8\uff1a'}{item.orderNote}</Text>
        ) : null}
        <View style={styles.orderFooter}>
          <Text style={styles.total}>{'\u5408\u8ba1\uff1a\u00a5'}{item.orderPrice}</Text>
          {statusKey === 'completed' ? (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate('OrderReview', { order: item, details })}
              style={styles.reviewButton}
            >
              <Text style={styles.reviewButtonText}>{'\u8bc4\u4ef7'}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
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
        <Text style={styles.topBarTitle}>{'\u6211\u7684\u8ba2\u5355'}</Text>
        <View style={styles.topBarButton} />
      </View>

      <View style={styles.tabs}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;

          return (
            <TouchableOpacity
              activeOpacity={0.85}
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={[styles.tabButton, isActive && styles.activeTabButton]}
            >
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <FlatList
        contentContainerStyle={styles.listContent}
        data={filteredOrders}
        keyExtractor={(item) => item.orderId}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {loading ? '\u8ba2\u5355\u52a0\u8f7d\u4e2d...' : '\u6682\u65e0\u8ba2\u5355'}
          </Text>
        }
        onRefresh={loadOrders}
        refreshing={loading}
        renderItem={renderOrder}
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
  tabs: {
    backgroundColor: '#ffffff',
    borderBottomColor: '#e5e7eb',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tabButton: {
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    minHeight: 40,
  },
  activeTabButton: {
    backgroundColor: '#0f766e',
  },
  tabText: {
    color: '#4b5563',
    fontSize: 14,
    fontWeight: '800',
  },
  activeTabText: {
    color: '#ffffff',
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    borderRadius: 8,
    borderWidth: 1,
    padding: 15,
  },
  orderHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderId: {
    color: '#111827',
    flex: 1,
    fontSize: 15,
    fontWeight: '900',
  },
  status: {
    color: '#0f766e',
    fontSize: 13,
    fontWeight: '800',
  },
  processingStatus: {
    color: '#d97706',
  },
  orderDate: {
    color: '#6b7280',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },
  orderItems: {
    color: '#374151',
    fontSize: 14,
    lineHeight: 20,
  },
  orderFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  total: {
    color: '#dc2626',
    fontSize: 15,
    fontWeight: '900',
  },
  reviewButton: {
    alignItems: 'center',
    backgroundColor: '#0f766e',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 38,
    minWidth: 76,
    paddingHorizontal: 14,
  },
  reviewButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
});
