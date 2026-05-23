import { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const menus = [
  {
    id: 'hot',
    name: '\u70ed\u9500',
    dishes: [
      {
        id: 'hot-1',
        name: '\u9ec4\u7116\u9e21\u7c73\u996d',
        price: '16',
        desc: '\u9e21\u8089\u9c9c\u5ae9\uff0c\u914d\u9752\u6912\u9999\u83c7',
      },
      {
        id: 'hot-2',
        name: '\u756a\u8304\u725b\u8169\u9762',
        price: '18',
        desc: '\u6c64\u5e95\u6d53\u90c1\uff0c\u725b\u8089\u8f6f\u70c2',
      },
      {
        id: 'hot-3',
        name: '\u9c7c\u9999\u8089\u4e1d\u5957\u9910',
        price: '14',
        desc: '\u9178\u751c\u5f00\u80c3\uff0c\u914d\u7c73\u996d\u548c\u65f6\u852c',
      },
    ],
  },
  {
    id: 'rice',
    name: '\u7c73\u996d\u5957\u9910',
    dishes: [
      {
        id: 'rice-1',
        name: '\u9ed1\u6912\u725b\u67f3\u996d',
        price: '17',
        desc: '\u9ed1\u6912\u9999\u6c14\u8db3\uff0c\u725b\u67f3\u5165\u5473',
      },
      {
        id: 'rice-2',
        name: '\u571f\u8c46\u70e7\u9e21\u996d',
        price: '15',
        desc: '\u571f\u8c46\u7ef5\u8f6f\uff0c\u6c64\u6c41\u4e0b\u996d',
      },
      {
        id: 'rice-3',
        name: '\u849c\u9999\u6392\u9aa8\u996d',
        price: '19',
        desc: '\u6392\u9aa8\u5916\u9999\u91cc\u5ae9\uff0c\u5206\u91cf\u624e\u5b9e',
      },
    ],
  },
  {
    id: 'noodle',
    name: '\u7c89\u9762',
    dishes: [
      {
        id: 'noodle-1',
        name: '\u91cd\u5e86\u5c0f\u9762',
        price: '11',
        desc: '\u9ebb\u8fa3\u9c9c\u9999\uff0c\u53ef\u9009\u8fa3\u5ea6',
      },
      {
        id: 'noodle-2',
        name: '\u725b\u8089\u6cb3\u7c89',
        price: '16',
        desc: '\u6cb3\u7c89\u723d\u6ed1\uff0c\u725b\u8089\u91cf\u8db3',
      },
      {
        id: 'noodle-3',
        name: '\u9999\u83c7\u9e21\u6c64\u9762',
        price: '13',
        desc: '\u6e05\u723d\u6c64\u5e95\uff0c\u9002\u5408\u6e05\u6de1\u53e3',
      },
    ],
  },
  {
    id: 'snack',
    name: '\u5c0f\u5403',
    dishes: [
      {
        id: 'snack-1',
        name: '\u9e21\u86cb\u704c\u997c',
        price: '8',
        desc: '\u73b0\u70e4\u9999\u8106\uff0c\u914d\u9171\u9999\u6d53',
      },
      {
        id: 'snack-2',
        name: '\u70e4\u51b7\u9762',
        price: '9',
        desc: '\u9178\u751c\u5fae\u8fa3\uff0c\u52a0\u86cb\u66f4\u9999',
      },
      {
        id: 'snack-3',
        name: '\u84b8\u997a',
        price: '10',
        desc: '\u76ae\u8584\u9985\u591a\uff0c\u4e00\u7b3c\u5341\u4e2a',
      },
    ],
  },
  {
    id: 'drink',
    name: '\u996e\u54c1',
    dishes: [
      {
        id: 'drink-1',
        name: '\u67e0\u6aac\u8336',
        price: '7',
        desc: '\u9178\u751c\u6e05\u723d\uff0c\u51b0\u70ed\u53ef\u9009',
      },
      {
        id: 'drink-2',
        name: '\u7eff\u8c46\u6c99',
        price: '6',
        desc: '\u6e05\u51c9\u89e3\u817b\uff0c\u5348\u9910\u642d\u914d',
      },
      {
        id: 'drink-3',
        name: '\u539f\u5473\u8c46\u6d46',
        price: '4',
        desc: '\u73b0\u78e8\u8c46\u6d46\uff0c\u53e3\u611f\u9187\u539a',
      },
    ],
  },
];

const favoriteMenu = {
  id: 'favorite',
  name: '\u6536\u85cf',
};

export default function CanteenPage({
  cartCount,
  cartTotal,
  navigation,
  onAddDish,
  usertype,
}) {
  const [activeMenuId, setActiveMenuId] = useState(menus[0].id);
  const [editorTitle, setEditorTitle] = useState('');
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const isAdmin = usertype === 'admin';

  const menuItems = useMemo(
    () => (isAdmin ? menus : [favoriteMenu, ...menus]),
    [isAdmin]
  );

  const allDishes = useMemo(() => menus.flatMap((menu) => menu.dishes), []);

  const favoriteDishes = useMemo(
    () => allDishes.filter((dish) => favoriteIds.includes(dish.id)),
    [allDishes, favoriteIds]
  );

  const activeMenu = useMemo(
    () => menus.find((menu) => menu.id === activeMenuId) || menus[0],
    [activeMenuId]
  );

  const dishes = useMemo(() => {
    const query = keyword.trim().toLowerCase();
    const sourceDishes =
      !isAdmin && activeMenuId === favoriteMenu.id
        ? favoriteDishes
        : activeMenu.dishes;

    if (!query) {
      return sourceDishes;
    }

    return sourceDishes.filter((dish) =>
      [dish.name, dish.price, dish.desc].join(' ').toLowerCase().includes(query)
    );
  }, [activeMenu, activeMenuId, favoriteDishes, isAdmin, keyword]);

  const toggleFavorite = (dish) => {
    setFavoriteIds((current) => {
      if (current.includes(dish.id)) {
        return current.filter((id) => id !== dish.id);
      }

      return [...current, dish.id];
    });
  };

  const openEditor = (title) => {
    setEditorTitle(title);
    setModalVisible(true);
  };

  const renderMenu = ({ item }) => {
    const isActive = item.id === activeMenuId;

    return (
      <View style={[styles.menuButton, isActive && styles.activeMenuButton]}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setActiveMenuId(item.id)}
          style={styles.menuNameButton}
        >
          <Text style={[styles.menuText, isActive && styles.activeMenuText]}>
            {item.name}
          </Text>
        </TouchableOpacity>
        {isAdmin && (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => openEditor('\u7f16\u8f91\u83dc\u5355')}
            style={styles.menuEditButton}
          >
            <Text style={styles.menuEditText}>{'\u7f16\u8f91'}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderDish = ({ item }) => (
    <View style={styles.dishCard}>
      <View style={styles.dishHeader}>
        <Text style={styles.dishName}>{item.name}</Text>
        <View style={styles.dishAction}>
          <Text style={styles.dishPrice}>{'\u00a5'}{item.price}</Text>
          {!isAdmin && (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => toggleFavorite(item)}
              style={[
                styles.favoriteButton,
                favoriteIds.includes(item.id) && styles.activeFavoriteButton,
              ]}
            >
              <Text
                style={[
                  styles.favoriteButtonText,
                  favoriteIds.includes(item.id) &&
                    styles.activeFavoriteButtonText,
                ]}
              >
                {favoriteIds.includes(item.id) ? '\u5df2\u85cf' : '\u6536\u85cf'}
              </Text>
            </TouchableOpacity>
          )}
          {isAdmin && (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => openEditor('\u7f16\u8f91\u83dc\u54c1')}
              style={styles.dishEditButton}
            >
              <Text style={styles.dishEditButtonText}>{'\u7f16\u8f91'}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => onAddDish(item)}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.dishDesc}>{item.desc}</Text>
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
        <Text style={styles.topBarTitle}>{'\u5357\u822a\u98df\u5802'}</Text>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => navigation.navigate('UserCenter')}
          style={styles.topBarButton}
        >
          <View style={styles.avatarButton}>
            <Text style={styles.avatarText}>{'\u7528'}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.searchArea}>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={setKeyword}
          placeholder={'\u641c\u7d22\u83dc\u54c1'}
          placeholderTextColor="#9ca3af"
          style={styles.searchInput}
          value={keyword}
        />
      </View>

      <View style={styles.mainArea}>
        <View style={styles.menuColumn}>
          <FlatList
            contentContainerStyle={styles.menuList}
            data={menuItems}
            keyExtractor={(item) => item.id}
            ListFooterComponent={
              isAdmin ? (
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => openEditor('\u6dfb\u52a0\u83dc\u5355')}
                  style={styles.menuAddButton}
                >
                  <Text style={styles.menuAddText}>+</Text>
                </TouchableOpacity>
              ) : null
            }
            renderItem={renderMenu}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <View style={styles.dishColumn}>
          <FlatList
            contentContainerStyle={styles.dishList}
            data={dishes}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                {!isAdmin && activeMenuId === favoriteMenu.id
                  ? '\u6682\u65e0\u6536\u85cf\u83dc\u54c1'
                  : '\u5f53\u524d\u83dc\u5355\u672a\u627e\u5230\u76f8\u5173\u83dc\u54c1'}
              </Text>
            }
            renderItem={renderDish}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>

      <View style={styles.cartBar}>
        <View>
          <Text style={styles.cartTotal}>{'\u00a5'}{cartTotal}</Text>
          <Text style={styles.cartCount}>{'\u5df2\u9009'} {cartCount} {'\u4ef6\u83dc\u54c1'}</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Cart')}
          style={styles.cartButton}
        >
          <Text style={styles.cartButtonText}>{'\u8d2d\u7269\u8f66'}</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalPanel}>
            <Text style={styles.modalTitle}>{editorTitle}</Text>
            <View style={styles.modalPlaceholder} />
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setModalVisible(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseText}>{'\u5173\u95ed'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  avatarButton: {
    alignItems: 'center',
    backgroundColor: '#0f766e',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
  },
  topBarTitle: {
    color: '#111827',
    flex: 1,
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: 0,
    textAlign: 'center',
  },
  searchArea: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  searchInput: {
    backgroundColor: '#f9fafb',
    borderColor: '#d1d5db',
    borderRadius: 8,
    borderWidth: 1,
    color: '#111827',
    fontSize: 16,
    minHeight: 50,
    paddingHorizontal: 14,
  },
  mainArea: {
    flex: 1,
    flexDirection: 'row',
  },
  menuColumn: {
    backgroundColor: '#eef2f7',
    borderRightColor: '#e5e7eb',
    borderRightWidth: 1,
    width: 104,
  },
  menuList: {
    paddingVertical: 8,
  },
  menuButton: {
    alignItems: 'center',
    borderLeftColor: 'transparent',
    borderLeftWidth: 4,
    justifyContent: 'center',
    minHeight: 62,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  menuNameButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 28,
    width: '100%',
  },
  activeMenuButton: {
    backgroundColor: '#ffffff',
    borderLeftColor: '#0f766e',
  },
  menuEditButton: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#d1d5db',
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    marginTop: 5,
    minHeight: 24,
    minWidth: 52,
  },
  menuEditText: {
    color: '#4b5563',
    fontSize: 12,
    fontWeight: '800',
  },
  menuAddButton: {
    alignItems: 'center',
    backgroundColor: '#0f766e',
    borderRadius: 8,
    justifyContent: 'center',
    marginHorizontal: 12,
    marginTop: 8,
    minHeight: 40,
  },
  menuAddText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 28,
  },
  menuText: {
    color: '#4b5563',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  activeMenuText: {
    color: '#0f766e',
    fontWeight: '800',
  },
  dishColumn: {
    flex: 1,
    paddingHorizontal: 12,
  },
  dishList: {
    gap: 12,
    paddingBottom: 24,
    paddingTop: 12,
  },
  dishCard: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
  },
  dishHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    marginBottom: 8,
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
  dishAction: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  favoriteButton: {
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db',
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 32,
    minWidth: 50,
    paddingHorizontal: 8,
  },
  activeFavoriteButton: {
    backgroundColor: '#fff7ed',
    borderColor: '#fb923c',
  },
  favoriteButtonText: {
    color: '#4b5563',
    fontSize: 13,
    fontWeight: '800',
  },
  activeFavoriteButtonText: {
    color: '#c2410c',
  },
  dishEditButton: {
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderColor: '#93c5fd',
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 32,
    minWidth: 50,
    paddingHorizontal: 8,
  },
  dishEditButtonText: {
    color: '#1d4ed8',
    fontSize: 13,
    fontWeight: '800',
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: '#0f766e',
    borderRadius: 8,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 26,
  },
  dishDesc: {
    color: '#6b7280',
    fontSize: 13,
    lineHeight: 19,
  },
  cartBar: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderTopColor: '#e5e7eb',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 70,
    paddingHorizontal: 16,
  },
  cartTotal: {
    color: '#dc2626',
    fontSize: 20,
    fontWeight: '900',
  },
  cartCount: {
    color: '#6b7280',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 3,
  },
  cartButton: {
    alignItems: 'center',
    backgroundColor: '#0f766e',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 46,
    minWidth: 100,
    paddingHorizontal: 16,
  },
  cartButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 15,
    paddingTop: 32,
    textAlign: 'center',
  },
  modalBackdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(17, 24, 39, 0.35)',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modalPanel: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 18,
    width: '100%',
  },
  modalTitle: {
    color: '#111827',
    fontSize: 19,
    fontWeight: '900',
    marginBottom: 14,
  },
  modalPlaceholder: {
    backgroundColor: '#f9fafb',
    borderColor: '#e5e7eb',
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 120,
  },
  modalCloseButton: {
    alignItems: 'center',
    backgroundColor: '#0f766e',
    borderRadius: 8,
    justifyContent: 'center',
    marginTop: 14,
    minHeight: 46,
  },
  modalCloseText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
  },
});
