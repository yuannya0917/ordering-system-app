import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const user = {
  name: '\u5357\u822a\u7528\u6237',
  uid: 'NUAA-20260523',
};

export default function UserCenterPage({ navigation, usertype }) {
  const isAdmin = usertype === 'admin';

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
        <Text style={styles.topBarTitle}>{'\u7528\u6237\u4e2d\u5fc3'}</Text>
        <View style={styles.topBarButton} />
      </View>

      <View style={styles.content}>
        <View style={styles.profile}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{'\u7528'}</Text>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userUid}>{'UID\uff1a'}{user.uid}</Text>
        </View>

        <View style={styles.actions}>
          {isAdmin ? (
            <>
              <ActionButton
                label={'\u4fee\u6539\u83dc\u5355'}
                onPress={() => navigation.navigate('Canteen')}
              />
              <ActionButton
                label={'\u7528\u6237\u67e5\u8be2'}
                onPress={() => navigation.navigate('UserQuery')}
              />
              <ActionButton
                label={'\u67e5\u770b\u8425\u4e1a\u989d'}
                onPress={() => navigation.navigate('Revenue')}
              />
              <ActionButton
                label={'\u4fee\u6539\u5bc6\u7801'}
                onPress={() => navigation.navigate('ChangePassword')}
              />
              <ActionButton
                danger
                label={'\u6ce8\u9500\u8d26\u53f7'}
                onPress={() => navigation.navigate('AccountCancel')}
              />
            </>
          ) : (
            <>
              <ActionButton
                label={'\u6211\u7684\u8ba2\u5355'}
                onPress={() => navigation.navigate('MyOrders')}
              />
              <ActionButton
                label={'\u6211\u7684\u8bc4\u8bba'}
                onPress={() => navigation.navigate('MyReviews')}
              />
              <ActionButton
                label={'\u4fee\u6539\u5bc6\u7801'}
                onPress={() => navigation.navigate('ChangePassword')}
              />
              <ActionButton
                danger
                label={'\u6ce8\u9500\u8d26\u53f7'}
                onPress={() => navigation.navigate('AccountCancel')}
              />
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

function ActionButton({ danger, label, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.actionButton}
    >
      <Text style={[styles.actionText, danger && styles.dangerActionText]}>
        {label}
      </Text>
      <Text style={styles.actionArrow}>{'>'}</Text>
    </TouchableOpacity>
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
    padding: 18,
  },
  profile: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    borderRadius: 8,
    borderWidth: 1,
    padding: 22,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: '#0f766e',
    borderRadius: 34,
    height: 68,
    justifyContent: 'center',
    marginBottom: 14,
    width: 68,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '900',
  },
  userName: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '900',
  },
  userUid: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
  },
  actions: {
    gap: 12,
    marginTop: 18,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 56,
    paddingHorizontal: 16,
  },
  actionText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '800',
  },
  actionArrow: {
    color: '#9ca3af',
    fontSize: 20,
    fontWeight: '800',
  },
  dangerActionText: {
    color: '#dc2626',
  },
});
