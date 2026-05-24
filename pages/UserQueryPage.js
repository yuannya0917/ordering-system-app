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

import { getAllUsers, queryUsers } from '../api/user-query';
import { useAuth } from '../contexts/AuthContext';

const TOP_BAR_PADDING_TOP = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 6 : 0;
const TOP_BAR_MIN_HEIGHT = 58 + TOP_BAR_PADDING_TOP;
const pageSize = 10;

export default function UserQueryPage({ navigation }) {
  const { userId: currentUserId } = useAuth();
  const [keyword, setKeyword] = useState('');
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadUsers = useCallback(async () => {
    if (!currentUserId) {
      setError('\u5f53\u524d\u7528\u6237\u4fe1\u606f\u4e0d\u5b8c\u6574');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const query = keyword.trim();

      if (!query) {
        const result = await getAllUsers({ currentUserId });
        setUsers(result);
        setTotal(result.length);
        setTotalPages(1);
        setPage(1);
        return;
      }

      const result = await queryUsers({
        currentUserId,
        userId: query,
        username: query,
        page,
        pageSize,
      });

      setUsers(result.records || []);
      setTotal(result.total || 0);
      setTotalPages(result.pages || 1);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : '\u67e5\u8be2\u7528\u6237\u5931\u8d25');
    } finally {
      setLoading(false);
    }
  }, [currentUserId, keyword, page]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleSearch = () => {
    setPage(1);
    loadUsers();
  };

  const resetSearch = () => {
    setKeyword('');
    setPage(1);
  };

  const renderUser = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.userHeader}>
        <View>
          <Text style={styles.userName}>{item.username || item.userId}</Text>
          <Text style={styles.userId}>{item.userId}</Text>
        </View>
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>{'\u8d26\u53f7'}</Text>
          <Text style={styles.infoValue}>{item.userId}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>{'\u6d88\u8d39\u91d1\u989d'}</Text>
          <Text style={styles.infoValue}>{'\u00a5'}{item.totalAmount ?? 0}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>{'\u8ba2\u5355\u6570'}</Text>
          <Text style={styles.infoValue}>{item.orderCount ?? 0}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>{'\u8fd4\u56de'}</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>{'\u7528\u6237\u67e5\u8be2'}</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.content}>
        <View style={styles.searchPanel}>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setKeyword}
            placeholder={'\u8bf7\u8f93\u5165\u8d26\u53f7\u6216\u7528\u6237\u540d'}
            placeholderTextColor="#9ca3af"
            style={styles.searchInput}
            value={keyword}
          />
          <View style={styles.searchActions}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleSearch}
              style={styles.searchButton}
            >
              <Text style={styles.searchButtonText}>{'\u641c\u7d22'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={resetSearch}
              style={styles.resetButton}
            >
              <Text style={styles.resetButtonText}>{'\u91cd\u7f6e'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <FlatList
          contentContainerStyle={styles.listContent}
          data={users}
          keyExtractor={(item) => item.userId}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {loading ? '\u7528\u6237\u52a0\u8f7d\u4e2d...' : '\u672a\u627e\u5230\u76f8\u5173\u7528\u6237'}
            </Text>
          }
          onRefresh={loadUsers}
          refreshing={loading}
          renderItem={renderUser}
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
    minHeight: TOP_BAR_MIN_HEIGHT,
    paddingTop: TOP_BAR_PADDING_TOP,
    paddingHorizontal: 16,
  },
  backButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
    minWidth: 50,
  },
  backButtonText: {
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
    paddingHorizontal: 18,
    paddingTop: 22,
  },
  searchPanel: {
    gap: 10,
  },
  searchInput: {
    backgroundColor: '#ffffff',
    borderColor: '#d1d5db',
    borderRadius: 8,
    borderWidth: 1,
    color: '#111827',
    fontSize: 16,
    minHeight: 52,
    paddingHorizontal: 14,
  },
  searchActions: {
    flexDirection: 'row',
    gap: 10,
  },
  searchButton: {
    alignItems: 'center',
    backgroundColor: '#0f766e',
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
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 12,
  },
  listContent: {
    gap: 12,
    paddingBottom: 24,
    paddingTop: 18,
  },
  userCard: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  userHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  userName: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '800',
  },
  userId: {
    color: '#6b7280',
    fontSize: 13,
    marginTop: 4,
  },
  statusTag: {
    backgroundColor: '#ccfbf1',
    borderRadius: 8,
    color: '#0f766e',
    fontSize: 13,
    fontWeight: '800',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pausedStatusTag: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
  },
  infoGrid: {
    gap: 10,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoLabel: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '700',
  },
  infoValue: {
    color: '#1f2937',
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 14,
    textAlign: 'right',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 15,
    paddingTop: 28,
    textAlign: 'center',
  },
  pagination: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    paddingBottom: 16,
  },
  pageButton: {
    alignItems: 'center',
    backgroundColor: '#0f766e',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 40,
    minWidth: 82,
    paddingHorizontal: 10,
  },
  disabledPageButton: {
    backgroundColor: '#9ca3af',
  },
  pageButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
  },
  pageInfo: {
    color: '#374151',
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
});
