import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function RoleSelectPage({ navigation, onSelectUsertype }) {
  const enterCanteen = (selectedUsertype) => {
    onSelectUsertype(selectedUsertype);
    navigation.navigate('Canteen');
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
        <Text style={styles.topBarTitle}>{'\u9009\u62e9\u8eab\u4efd'}</Text>
        <View style={styles.topBarButton} />
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => enterCanteen('customer')}
          style={styles.roleButton}
        >
          <Text style={styles.roleTitle}>{'\u666e\u901a\u7528\u6237'}</Text>
          <Text style={styles.roleDesc}>{'\u67e5\u770b\u83dc\u5355\u3001\u6536\u85cf\u83dc\u54c1\u3001\u52a0\u5165\u8d2d\u7269\u8f66'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => enterCanteen('admin')}
          style={styles.roleButton}
        >
          <Text style={styles.roleTitle}>{'\u7ba1\u7406\u5458'}</Text>
          <Text style={styles.roleDesc}>{'\u7ba1\u7406\u83dc\u5355\u548c\u83dc\u54c1\uff0c\u8fdb\u884c\u7f16\u8f91\u64cd\u4f5c'}</Text>
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
  content: {
    flex: 1,
    gap: 14,
    justifyContent: 'center',
    padding: 18,
  },
  roleButton: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    borderRadius: 8,
    borderWidth: 1,
    padding: 18,
  },
  roleTitle: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 8,
  },
  roleDesc: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
});
