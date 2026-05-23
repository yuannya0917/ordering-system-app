import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CartPage({ cartItems, cartTotal, navigation }) {
  const renderCartItem = ({ item }) => (
    <View style={styles.cartCard}>
      <View style={styles.cartHeader}>
        <Text style={styles.dishName}>{item.name}</Text>
        <Text style={styles.dishPrice}>{'\u00a5'}{item.price}</Text>
      </View>
      <View style={styles.cartMeta}>
        <Text style={styles.quantityText}>{'\u6570\u91cf'} x {item.quantity}</Text>
        <Text style={styles.subtotalText}>
          {'\u5c0f\u8ba1\uff1a\u00a5'}{Number(item.price) * item.quantity}
        </Text>
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
        <Text style={styles.topBarTitle}>{'\u8d2d\u7269\u8f66'}</Text>
        <View style={styles.topBarButton} />
      </View>

      <FlatList
        contentContainerStyle={styles.listContent}
        data={cartItems}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>{'\u8d2d\u7269\u8f66\u8fd8\u6ca1\u6709\u83dc\u54c1'}</Text>
        }
        renderItem={renderCartItem}
      />

      <View style={styles.totalBar}>
        <View>
          <Text style={styles.totalLabel}>{'\u5408\u8ba1'}</Text>
          <Text style={styles.totalPrice}>{'\u00a5'}{cartTotal}</Text>
        </View>
        <TouchableOpacity activeOpacity={0.85} style={styles.confirmButton}>
          <Text style={styles.confirmButtonText}>{'\u786e\u8ba4\u8ba2\u5355'}</Text>
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
  listContent: {
    gap: 12,
    padding: 16,
    paddingBottom: 92,
  },
  cartCard: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    borderRadius: 8,
    borderWidth: 1,
    padding: 15,
  },
  cartHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dishName: {
    color: '#111827',
    flex: 1,
    fontSize: 17,
    fontWeight: '800',
  },
  dishPrice: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: '800',
  },
  cartMeta: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quantityText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '700',
  },
  subtotalText: {
    color: '#1f2937',
    fontSize: 14,
    fontWeight: '800',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 15,
    paddingTop: 40,
    textAlign: 'center',
  },
  totalBar: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderTopColor: '#e5e7eb',
    borderTopWidth: 1,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 0,
    minHeight: 64,
    paddingHorizontal: 18,
    position: 'absolute',
    right: 0,
  },
  totalLabel: {
    color: '#374151',
    fontSize: 15,
    fontWeight: '800',
  },
  totalPrice: {
    color: '#dc2626',
    fontSize: 20,
    fontWeight: '900',
  },
  confirmButton: {
    alignItems: 'center',
    backgroundColor: '#0f766e',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 46,
    minWidth: 112,
    paddingHorizontal: 16,
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
});
