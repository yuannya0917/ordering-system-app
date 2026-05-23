import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const reviewMap = {
  'hot-1': [
    {
      id: 'hot-1-r1',
      user: '\u5f20\u4e09',
      rating: 5,
      content: '\u9e21\u8089\u5f88\u5165\u5473\uff0c\u7c73\u996d\u4efd\u91cf\u4e5f\u591f\u3002',
    },
    {
      id: 'hot-1-r2',
      user: '\u674e\u56db',
      rating: 4,
      content: '\u5473\u9053\u4e0d\u9519\uff0c\u4e0b\u6b21\u60f3\u52a0\u70b9\u8fa3\u3002',
    },
  ],
  'hot-2': [
    {
      id: 'hot-2-r1',
      user: '\u738b\u4e94',
      rating: 5,
      content: '\u725b\u8169\u8f6f\u70c2\uff0c\u6c64\u5e95\u5f88\u9999\u3002',
    },
  ],
  'noodle-1': [
    {
      id: 'noodle-1-r1',
      user: '\u8d75\u516d',
      rating: 4,
      content: '\u5c0f\u9762\u8fa3\u5ea6\u521a\u597d\uff0c\u51fa\u9910\u4e5f\u5feb\u3002',
    },
  ],
};

export default function DishReviewsPage({ navigation, route }) {
  const dish = route.params?.dish;
  const reviews = reviewMap[dish?.id] || [];

  const renderReview = ({ item }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Text style={styles.userName}>{item.user}</Text>
        <Text style={styles.rating}>{item.rating}{'\u5206'}</Text>
      </View>
      <Text style={styles.content}>{item.content}</Text>
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
        <Text style={styles.topBarTitle}>{'\u83dc\u54c1\u8bc4\u8bba'}</Text>
        <View style={styles.topBarButton} />
      </View>

      <View style={styles.dishPanel}>
        <Text style={styles.dishName}>{dish?.name || '\u83dc\u54c1'}</Text>
        <Text style={styles.dishDesc}>{dish?.desc}</Text>
      </View>

      <FlatList
        contentContainerStyle={styles.listContent}
        data={reviews}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>{'\u6682\u65e0\u8bc4\u8bba'}</Text>
        }
        renderItem={renderReview}
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
  dishPanel: {
    backgroundColor: '#ffffff',
    borderBottomColor: '#e5e7eb',
    borderBottomWidth: 1,
    padding: 16,
  },
  dishName: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 8,
  },
  dishDesc: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  listContent: {
    gap: 12,
    padding: 16,
  },
  reviewCard: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    borderRadius: 8,
    borderWidth: 1,
    padding: 15,
  },
  reviewHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  userName: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '900',
  },
  rating: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '900',
  },
  content: {
    color: '#374151',
    fontSize: 14,
    lineHeight: 20,
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 15,
    paddingTop: 36,
    textAlign: 'center',
  },
});
