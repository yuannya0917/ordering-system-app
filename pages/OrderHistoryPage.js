import { useMemo, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const orders = [
  {
    id: 'NO20260523002',
    date: '2026-05-23 12:05',
    dishes: ['\u756a\u8304\u725b\u8169\u9762', '\u7eff\u8c46\u6c99'],
    items: '\u756a\u8304\u725b\u8169\u9762 x1\uff0c\u7eff\u8c46\u6c99 x1',
    status: '\u8fdb\u884c\u4e2d',
    statusKey: 'processing',
    total: 24,
  },
  {
    id: 'NO20260523001',
    date: '2026-05-23 11:30',
    dishes: ['\u9ec4\u7116\u9e21\u7c73\u996d', '\u67e0\u6aac\u8336'],
    items: '\u9ec4\u7116\u9e21\u7c73\u996d x1\uff0c\u67e0\u6aac\u8336 x1',
    status: '\u5df2\u5b8c\u6210',
    statusKey: 'completed',
    total: 23,
  },
  {
    id: 'NO20260522003',
    date: '2026-05-22 18:10',
    dishes: ['\u91cd\u5e86\u5c0f\u9762', '\u9e21\u86cb\u704c\u997c'],
    items: '\u91cd\u5e86\u5c0f\u9762 x1\uff0c\u9e21\u86cb\u704c\u997c x1',
    status: '\u5df2\u5b8c\u6210',
    statusKey: 'completed',
    total: 19,
  },
];

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

export default function MyOrdersPage({ navigation }) {
  const [activeTab, setActiveTab] = useState('all');

  const filteredOrders = useMemo(() => {
    if (activeTab === 'all') {
      return orders;
    }

    return orders.filter((order) => order.statusKey === activeTab);
  }, [activeTab]);

  const renderOrder = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>{item.id}</Text>
        <Text
          style={[
            styles.status,
            item.statusKey === 'processing' && styles.processingStatus,
          ]}
        >
          {item.status}
        </Text>
      </View>
      <Text style={styles.orderDate}>{item.date}</Text>
      <Text style={styles.orderItems}>{item.items}</Text>
      <View style={styles.orderFooter}>
        <Text style={styles.total}>{'\u5408\u8ba1\uff1a\u00a5'}{item.total}</Text>
        {item.statusKey === 'completed' && (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('OrderReview', { order: item })}
            style={styles.reviewButton}
          >
            <Text style={styles.reviewButtonText}>{'\u8bc4\u4ef7'}</Text>
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
