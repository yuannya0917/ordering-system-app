import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
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

import { getCart, removeCartItem, submitOrder } from '../api/cart';
import { useAuth } from '../contexts/AuthContext';

const TOP_BAR_PADDING_TOP = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 6 : 0;
const TOP_BAR_MIN_HEIGHT = 58 + TOP_BAR_PADDING_TOP;
const WINDOW_HEIGHT = Dimensions.get('window').height;
const SCREEN_HEIGHT = Dimensions.get('screen').height;
const BOTTOM_SAFE_PADDING = Platform.OS === 'android'
  ? Math.max(0, SCREEN_HEIGHT - WINDOW_HEIGHT - (StatusBar.currentHeight || 0))
  : 0;

export default function CartPage({ cartItems, cartTotal, navigation }) {
  const { userId } = useAuth();
  const [apiCartItems, setApiCartItems] = useState([]);
  const [apiCartTotal, setApiCartTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [removingIds, setRemovingIds] = useState([]);
  const [orderNote, setOrderNote] = useState('');
  const [error, setError] = useState('');

  const loadCart = useCallback(async () => {
    if (!userId) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await getCart(userId);

      if (res.code === 400) {
        setError(res.message || res.msg || '\u83b7\u53d6\u8d2d\u7269\u8f66\u5931\u8d25');
        return;
      }

      if (res.data && typeof res.data === 'object' && 'items' in res.data) {
        setApiCartItems(res.data.items || []);
        setApiCartTotal(res.data.totalPrice || 0);
        return;
      }

      setApiCartItems([]);
      setApiCartTotal(0);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : '\u83b7\u53d6\u8d2d\u7269\u8f66\u5931\u8d25');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const displayItems = useMemo(() => {
    if (userId) {
      return apiCartItems.map((item) => ({
        id: item.dishId,
        name: item.dishName,
        price: item.dishPrice,
        quantity: item.dishNum,
        subtotal: item.totalPrice,
      }));
    }

    return cartItems;
  }, [apiCartItems, cartItems, userId]);

  const displayTotal = userId ? apiCartTotal : cartTotal;

  const handleRemoveItem = async (dishId) => {
    if (!userId) {
      setError('\u8bf7\u5148\u767b\u5f55');
      return;
    }

    try {
      setRemovingIds((current) => [...current, dishId]);
      setError('');
      const res = await removeCartItem({ userId, dishId });
      if (res.code === 400) {
        setError(res.message || res.msg || '\u79fb\u9664\u8d2d\u7269\u8f66\u5931\u8d25');
        return;
      }
      await loadCart();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : '\u79fb\u9664\u8d2d\u7269\u8f66\u5931\u8d25');
    } finally {
      setRemovingIds((current) => current.filter((id) => id !== dishId));
    }
  };

  const handleSubmitOrder = async () => {
    if (!userId) {
      setError('\u8bf7\u5148\u767b\u5f55');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const orderPayload = {
        userId,
      };

      if (orderNote.trim()) {
        orderPayload.orderNote = orderNote.trim();
      }

      const res = await submitOrder({
        ...orderPayload,
      });

      if (res.code && res.code !== 200) {
        setError(res.message || res.msg || '\u63d0\u4ea4\u8ba2\u5355\u5931\u8d25');
        return;
      }

      setOrderNote('');
      await loadCart();
      navigation.navigate('MyOrders');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : '\u63d0\u4ea4\u8ba2\u5355\u5931\u8d25');
    } finally {
      setSubmitting(false);
    }
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartCard}>
      <View style={styles.cartHeader}>
        <View style={styles.cartTitleArea}>
          <Text style={styles.dishName}>{item.name}</Text>
          <Text style={styles.dishPrice}>{'\u00a5'}{item.price}</Text>
        </View>
        {userId ? (
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={removingIds.includes(item.id)}
            onPress={() => handleRemoveItem(item.id)}
            style={[styles.removeButton, removingIds.includes(item.id) && styles.disabledButton]}
          >
            <Text style={styles.removeButtonText}>
              {removingIds.includes(item.id) ? '\u79fb\u9664\u4e2d' : '\u79fb\u9664'}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <View style={styles.cartMeta}>
        <Text style={styles.quantityText}>{'\u6570\u91cf'} x {item.quantity}</Text>
        <Text style={styles.subtotalText}>
          {'\u5c0f\u8ba1\uff1a\u00a5'}{item.subtotal ?? Number(item.price) * item.quantity}
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

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <FlatList
        contentContainerStyle={styles.listContent}
        data={displayItems}
        keyExtractor={(item) => item.id}
        ListFooterComponent={
          userId ? (
            <View style={styles.noteCard}>
              <Text style={styles.noteLabel}>{'\u8ba2\u5355\u5907\u6ce8'}</Text>
              <TextInput
                autoCorrect={false}
                multiline
                onChangeText={setOrderNote}
                placeholder={'\u4f8b\u5982\uff1a\u5c11\u8fa3\u3001\u4e0d\u8981\u9999\u83dc'}
                placeholderTextColor="#9ca3af"
                style={styles.noteInput}
                textAlignVertical="top"
                value={orderNote}
              />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {loading ? '\u8d2d\u7269\u8f66\u52a0\u8f7d\u4e2d...' : '\u8d2d\u7269\u8f66\u8fd8\u6ca1\u6709\u83dc\u54c1'}
          </Text>
        }
        onRefresh={loadCart}
        refreshing={loading}
        renderItem={renderCartItem}
      />

      <View style={styles.totalBar}>
        <View>
          <Text style={styles.totalLabel}>{'\u5408\u8ba1'}</Text>
          <Text style={styles.totalPrice}>{'\u00a5'}{displayTotal}</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={submitting}
          onPress={handleSubmitOrder}
          style={[
            styles.confirmButton,
            submitting && styles.disabledButton,
          ]}
        >
          <Text style={styles.confirmButtonText}>
            {submitting ? '\u63d0\u4ea4\u4e2d...' : '\u786e\u8ba4\u8ba2\u5355'}
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
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  listContent: {
    gap: 12,
    padding: 16,
    paddingBottom: 92 + BOTTOM_SAFE_PADDING,
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
  cartTitleArea: {
    flex: 1,
    gap: 4,
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
  removeButton: {
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 32,
    minWidth: 56,
    paddingHorizontal: 8,
  },
  removeButtonText: {
    color: '#dc2626',
    fontSize: 13,
    fontWeight: '800',
  },
  noteCard: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 4,
    padding: 15,
  },
  noteLabel: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 10,
  },
  noteInput: {
    backgroundColor: '#f9fafb',
    borderColor: '#d1d5db',
    borderRadius: 8,
    borderWidth: 1,
    color: '#111827',
    fontSize: 15,
    minHeight: 88,
    paddingHorizontal: 12,
    paddingTop: 12,
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
    minHeight: 64 + BOTTOM_SAFE_PADDING,
    paddingBottom: Math.max(BOTTOM_SAFE_PADDING, 10),
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
    backgroundColor: '#ea580c',
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
  disabledButton: {
    opacity: 0.65,
  },
});
