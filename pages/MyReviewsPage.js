import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const reviews = [
  {
    id: 'R001',
    dish: '\u9ec4\u7116\u9e21\u7c73\u996d',
    date: '2026-05-23',
    rating: 5,
    content: '\u5473\u9053\u4e0d\u9519\uff0c\u7c73\u996d\u548c\u6c64\u6c41\u5f88\u642d\u3002',
  },
  {
    id: 'R002',
    dish: '\u91cd\u5e86\u5c0f\u9762',
    date: '2026-05-22',
    rating: 4,
    content: '\u8fa3\u5ea6\u521a\u597d\uff0c\u4e0b\u6b21\u60f3\u8bd5\u8bd5\u52a0\u8fa3\u3002',
  },
];

export default function MyReviewsPage({ navigation }) {
  const renderReview = ({ item }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Text style={styles.dishName}>{item.dish}</Text>
        <Text style={styles.rating}>{item.rating}{'\u5206'}</Text>
      </View>
      <Text style={styles.reviewDate}>{item.date}</Text>
      <Text style={styles.reviewContent}>{item.content}</Text>
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
        <Text style={styles.topBarTitle}>{'\u6211\u7684\u8bc4\u8bba'}</Text>
        <View style={styles.topBarButton} />
      </View>

      <FlatList
        contentContainerStyle={styles.listContent}
        data={reviews}
        keyExtractor={(item) => item.id}
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
    marginBottom: 8,
  },
  dishName: {
    color: '#111827',
    flex: 1,
    fontSize: 16,
    fontWeight: '900',
  },
  rating: {
    color: '#dc2626',
    fontSize: 15,
    fontWeight: '900',
  },
  reviewDate: {
    color: '#6b7280',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },
  reviewContent: {
    color: '#374151',
    fontSize: 14,
    lineHeight: 20,
  },
});
