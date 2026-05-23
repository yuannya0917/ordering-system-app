import { useMemo, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const users = [
  {
    id: 'U001',
    name: '\u5f20\u4e09',
    account: 'zhangsan',
    phone: '13800000001',
    role: '\u7ba1\u7406\u5458',
    status: '\u6b63\u5e38',
  },
  {
    id: 'U002',
    name: '\u674e\u56db',
    account: 'lisi',
    phone: '13800000002',
    role: '\u6536\u94f6\u5458',
    status: '\u6b63\u5e38',
  },
  {
    id: 'U003',
    name: '\u738b\u4e94',
    account: 'wangwu',
    phone: '13800000003',
    role: '\u670d\u52a1\u5458',
    status: '\u6682\u505c',
  },
  {
    id: 'U004',
    name: '\u8d75\u516d',
    account: 'zhaoliu',
    phone: '13800000004',
    role: '\u540e\u53a8',
    status: '\u6b63\u5e38',
  },
];

export default function UserQueryPage({ navigation }) {
  const [keyword, setKeyword] = useState('');

  const filteredUsers = useMemo(() => {
    const query = keyword.trim().toLowerCase();

    if (!query) {
      return users;
    }

    return users.filter((user) =>
      [user.id, user.name, user.account, user.phone, user.role, user.status]
        .join(' ')
        .toLowerCase()
        .includes(query)
    );
  }, [keyword]);

  const renderUser = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.userHeader}>
        <View>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userId}>{item.id}</Text>
        </View>
        <Text
          style={[
            styles.statusTag,
            item.status === '\u6682\u505c' && styles.pausedStatusTag,
          ]}
        >
          {item.status}
        </Text>
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>{'\u8d26\u53f7'}</Text>
          <Text style={styles.infoValue}>{item.account}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>{'\u624b\u673a'}</Text>
          <Text style={styles.infoValue}>{item.phone}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>{'\u89d2\u8272'}</Text>
          <Text style={styles.infoValue}>{item.role}</Text>
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
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => navigation.navigate('Canteen')}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>{'\u98df\u5802'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={setKeyword}
          placeholder={'\u8bf7\u8f93\u5165\u59d3\u540d\u3001\u8d26\u53f7\u6216\u624b\u673a\u53f7'}
          placeholderTextColor="#9ca3af"
          style={styles.searchInput}
          value={keyword}
        />

        <FlatList
          contentContainerStyle={styles.listContent}
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>{'\u672a\u627e\u5230\u76f8\u5173\u7528\u6237'}</Text>
          }
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
    minHeight: 58,
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
});
