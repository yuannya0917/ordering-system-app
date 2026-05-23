import { useMemo } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const initialOrders = [
  {
    id: 'NO20260523001',
    amount: 23,
  },
  {
    id: 'NO20260522003',
    amount: 19,
  },
  {
    id: 'NO20260521008',
    amount: 36,
  },
];

export default function RevenuePage({ navigation }) {
  const totalRevenue = useMemo(
    () => initialOrders.reduce((sum, order) => sum + order.amount, 0),
    []
  );

  const renderOrder = ({ item }) => (
    <View style={styles.orderRow}>
      <Text style={styles.orderId}>{item.id}</Text>
      <Text style={styles.orderAmount}>{'\u00a5'}{item.amount}</Text>
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
        <View style={styles.summaryRow}>
          <View style={styles.summaryPanel}>
            <Text style={styles.summaryLabel}>{'\u603b\u8425\u4e1a\u989d'}</Text>
            <Text style={styles.revenueValue}>{'\u00a5'}{totalRevenue}</Text>
          </View>
          <View style={styles.summaryPanel}>
            <Text style={styles.summaryLabel}>{'\u8ba2\u5355\u6570\u91cf'}</Text>
            <Text style={styles.countValue}>{initialOrders.length}</Text>
          </View>
        </View>

        <FlatList
          contentContainerStyle={styles.listContent}
          data={initialOrders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrder}
        />
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
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
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
  orderId: {
    color: '#374151',
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
  },
  orderAmount: {
    color: '#dc2626',
    fontSize: 15,
    fontWeight: '900',
  },
});
