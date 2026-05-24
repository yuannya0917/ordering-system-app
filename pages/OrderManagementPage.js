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

import {
  formatWsError,
  getAllOrders,
  getOrderDetails,
  subscribeMerchantNewOrders,
  updateOrderStatus as updateOrderStatusApi,
} from '../api/order-management';

const TOP_BAR_PADDING_TOP = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 6 : 0;
const TOP_BAR_MIN_HEIGHT = 58 + TOP_BAR_PADDING_TOP;
const tabs = [
  {
    id: 'all',
    status: undefined,
    label: '\u5168\u90e8',
  },
  {
    id: 'pending',
    status: '0',
    label: '\u672a\u63a5\u5355',
  },
  {
    id: 'processing',
    status: '1',
    label: '\u8fdb\u884c\u4e2d',
  },
  {
    id: 'completed',
    status: '2',
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

export default function OrderManagementPage({ navigation }) {
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState([]);
  const [detailsByOrderId, setDetailsByOrderId] = useState({});
  const [loading, setLoading] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState('');
  const [error, setError] = useState('');

  const loadOrders = useCallback(async () => {
    const activeStatus = tabs.find((tab) => tab.id === activeTab)?.status;

    try {
      setLoading(true);
      setError('');

      const orderList = await getAllOrders(
        activeStatus ? { orderStatus: activeStatus } : undefined
      );
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
      setError(requestError instanceof Error ? requestError.message : '\u83b7\u53d6\u8ba2\u5355\u5931\u8d25');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    const unsubscribe = subscribeMerchantNewOrders({
      onMessage: () => {
        loadOrders();
      },
      onError: (wsError) => {
        const wsMessage = formatWsError(wsError);
        if (wsMessage === 'WebSocket 连接已正常关闭') {
          return;
        }
        setError(wsMessage);
      },
    });

    return unsubscribe;
  }, [loadOrders]);

  const handleUpdateOrderStatus = async (orderId, orderStatus) => {
    try {
      setUpdatingOrderId(orderId);
      setError('');
      await updateOrderStatusApi({ orderId, orderStatus });
      await loadOrders();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : '\u66f4\u65b0\u8ba2\u5355\u72b6\u6001\u5931\u8d25');
    } finally {
      setUpdatingOrderId('');
    }
  };

  const renderOrder = ({ item }) => {
    const statusKey = statusKeyMap[item.orderStatus] || 'completed';
    const details = detailsByOrderId[item.orderId] || [];
    const detailText = details.length
      ? details
          .map((detail) => `${detail.dishName} x${detail.dishNum}`)
          .join('\uff0c')
      : '\u6682\u65e0\u8be6\u60c5';

    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderId}>{item.orderId}</Text>
          <Text
            style={[
              styles.status,
              statusKey === 'pending' && styles.pendingStatus,
              statusKey === 'processing' && styles.processingStatus,
            ]}
          >
            {statusTextMap[item.orderStatus] || '\u672a\u77e5\u72b6\u6001'}
          </Text>
        </View>
        <Text style={styles.orderTime}>{'\u4e0b\u5355\u65f6\u95f4\uff1a'}{item.orderTime}</Text>
        <Text style={styles.orderDetail}>{'\u4e0b\u5355\u7528\u6237\uff1a'}{item.userId}</Text>
        <Text style={styles.orderDetail}>{'\u8ba2\u5355\u8be6\u60c5\uff1a'}{detailText}</Text>
        {item.orderNote ? (
          <Text style={styles.orderDetail}>{'\u5907\u6ce8\uff1a'}{item.orderNote}</Text>
        ) : null}
        <View style={styles.orderFooter}>
          <Text style={styles.total}>{'\u603b\u4ef7\uff1a\u00a5'}{item.orderPrice}</Text>
          {statusKey === 'pending' && (
            <TouchableOpacity
              activeOpacity={0.85}
              disabled={updatingOrderId === item.orderId}
              onPress={() => handleUpdateOrderStatus(item.orderId, '1')}
              style={styles.actionButton}
            >
              <Text style={styles.actionButtonText}>
                {updatingOrderId === item.orderId ? '\u5904\u7406\u4e2d' : '\u63a5\u5355'}
              </Text>
            </TouchableOpacity>
          )}
          {statusKey === 'processing' && (
            <TouchableOpacity
              activeOpacity={0.85}
              disabled={updatingOrderId === item.orderId}
              onPress={() => handleUpdateOrderStatus(item.orderId, '2')}
              style={styles.actionButton}
            >
              <Text style={styles.actionButtonText}>
                {updatingOrderId === item.orderId ? '\u5904\u7406\u4e2d' : '\u51fa\u9910'}
              </Text>
            </TouchableOpacity>
          )}
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
        <Text style={styles.topBarTitle}>{'\u8ba2\u5355\u7ba1\u7406'}</Text>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => navigation.navigate('UserCenter')}
          style={styles.topBarButton}
        >
          <View style={styles.avatarButton}>
            <Text style={styles.avatarText}>{'\u7528'}</Text>
          </View>
        </TouchableOpacity>
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
        data={orders}
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
  avatarButton: {
    alignItems: 'center',
    backgroundColor: '#0f766e',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
  },
  topBarTitle: {
    color: '#111827',
    flex: 1,
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: 0,
    textAlign: 'center',
  },
  tabs: {
    backgroundColor: '#ffffff',
    borderBottomColor: '#e5e7eb',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
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
    fontSize: 13,
    fontWeight: '800',
  },
  activeTabText: {
    color: '#ffffff',
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
    fontSize: 14,
    fontWeight: '700',
    paddingVertical: 24,
    textAlign: 'center',
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
    marginBottom: 10,
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
    fontWeight: '900',
  },
  pendingStatus: {
    color: '#dc2626',
  },
  processingStatus: {
    color: '#d97706',
  },
  orderTime: {
    color: '#6b7280',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  orderDetail: {
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
    flex: 1,
    fontSize: 15,
    fontWeight: '900',
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#0f766e',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 38,
    minWidth: 76,
    paddingHorizontal: 14,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
  },
});
