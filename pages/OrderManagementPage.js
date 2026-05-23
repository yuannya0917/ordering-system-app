import { useMemo, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const tabs = [
  {
    id: 'all',
    label: '\u5168\u90e8',
  },
  {
    id: 'pending',
    label: '\u672a\u63a5\u5355',
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

const initialOrders = [
  {
    id: 'NO20260523006',
    time: '2026-05-23 12:20',
    status: '\u672a\u63a5\u5355',
    statusKey: 'pending',
    detail: '\u9ed1\u6912\u725b\u67f3\u996d x1\uff0c\u67e0\u6aac\u8336 x1',
    total: 24,
  },
  {
    id: 'NO20260523005',
    time: '2026-05-23 12:10',
    status: '\u8fdb\u884c\u4e2d',
    statusKey: 'processing',
    detail: '\u756a\u8304\u725b\u8169\u9762 x1\uff0c\u7eff\u8c46\u6c99 x1',
    total: 24,
  },
  {
    id: 'NO20260523001',
    time: '2026-05-23 11:30',
    status: '\u5df2\u5b8c\u6210',
    statusKey: 'completed',
    detail: '\u9ec4\u7116\u9e21\u7c73\u996d x1\uff0c\u67e0\u6aac\u8336 x1',
    total: 23,
  },
];

export default function OrderManagementPage({ navigation }) {
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState(initialOrders);

  const filteredOrders = useMemo(() => {
    if (activeTab === 'all') {
      return orders;
    }

    return orders.filter((order) => order.statusKey === activeTab);
  }, [activeTab, orders]);

  const updateOrderStatus = (orderId, statusKey, status) => {
    setOrders((current) =>
      current.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status,
              statusKey,
            }
          : order
      )
    );
  };

  const renderOrder = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>{item.id}</Text>
        <Text
          style={[
            styles.status,
            item.statusKey === 'pending' && styles.pendingStatus,
            item.statusKey === 'processing' && styles.processingStatus,
          ]}
        >
          {item.status}
        </Text>
      </View>
      <Text style={styles.orderTime}>{'\u4e0b\u5355\u65f6\u95f4\uff1a'}{item.time}</Text>
      <Text style={styles.orderDetail}>{'\u8ba2\u5355\u8be6\u60c5\uff1a'}{item.detail}</Text>
      <View style={styles.orderFooter}>
        <Text style={styles.total}>{'\u603b\u4ef7\uff1a\u00a5'}{item.total}</Text>
        {item.statusKey === 'pending' && (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() =>
              updateOrderStatus(item.id, 'processing', '\u8fdb\u884c\u4e2d')
            }
            style={styles.actionButton}
          >
            <Text style={styles.actionButtonText}>{'\u63a5\u5355'}</Text>
          </TouchableOpacity>
        )}
        {item.statusKey === 'processing' && (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() =>
              updateOrderStatus(item.id, 'completed', '\u5df2\u5b8c\u6210')
            }
            style={styles.actionButton}
          >
            <Text style={styles.actionButtonText}>{'\u51fa\u9910'}</Text>
          </TouchableOpacity>
        )}
      </View>
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

      <FlatList
        contentContainerStyle={styles.listContent}
        data={filteredOrders}
        keyExtractor={(item) => item.id}
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
