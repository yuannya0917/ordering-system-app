import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

import {
  addCollect,
  addCommentLike,
  addDish,
  addMenu,
  cancelCommentLike,
  checkCommentLiked,
  deleteCollect,
  deleteDish,
  deleteMenu,
  getAllComments,
  getCommentLikeCount,
  getCollectList,
  getDishList,
  getMenuList,
  getOrderDetails,
  updateDish,
  updateMenu,
} from '../api/canteen';
import { addCart, getCart } from '../api/cart';
import { getDishImage, uploadDishImage } from '../api/pic';
import { useAuth } from '../contexts/AuthContext';

const TOP_BAR_PADDING_TOP = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 6 : 0;
const TOP_BAR_MIN_HEIGHT = 58 + TOP_BAR_PADDING_TOP;
const WINDOW_HEIGHT = Dimensions.get('window').height;
const SCREEN_HEIGHT = Dimensions.get('screen').height;
const BOTTOM_SAFE_PADDING = Platform.OS === 'android'
  ? Math.max(0, SCREEN_HEIGHT - WINDOW_HEIGHT - (StatusBar.currentHeight || 0))
  : 0;

const buildImageUrl = (value) => {
  if (!value) {
    return '';
  }

  if (String(value).startsWith('http')) {
    return value;
  }

  const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://10.100.48.139:8081';
  const assetBaseUrl = baseUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');
  const normalizedPath = String(value).replace(/^\/+/, '').replace(/^api\/+/, '');
  return `${assetBaseUrl}/${normalizedPath}`;
};


const favoriteMenu = {
  id: 'favorite',
  name: '\u6536\u85cf',
};

const pageTabs = [
  {
    id: 'order',
    label: '\u70b9\u9910',
  },
  {
    id: 'reviews',
    label: '\u8bc4\u8bba',
  },
];

const pickFirstNonEmpty = (...values) =>
  values.find((value) => value !== undefined && value !== null && String(value).trim() !== '');

const formatPublishTime = (value) => {
  if (!value) {
    return '';
  }

  return String(value).replace('T', ' ').slice(0, 16);
};

export default function CanteenPage({
  cartCount,
  cartTotal,
  navigation,
  onAddDish,
  usertype,
}) {
  const { userId } = useAuth();
  const [activeMenuId, setActiveMenuId] = useState('');
  const [apiMenus, setApiMenus] = useState([]);
  const [apiDishes, setApiDishes] = useState([]);
  const [editError, setEditError] = useState('');
  const [editorMode, setEditorMode] = useState('add');
  const [editorTitle, setEditorTitle] = useState('');
  const [editorType, setEditorType] = useState('');
  const [cartSummary, setCartSummary] = useState({ count: 0, totalPrice: 0 });
  const [cartLoadingIds, setCartLoadingIds] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [favoriteLoadingIds, setFavoriteLoadingIds] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [activePageTab, setActivePageTab] = useState('order');
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewLikeCounts, setReviewLikeCounts] = useState({});
  const [likedCommentIds, setLikedCommentIds] = useState([]);
  const [likeLoadingIds, setLikeLoadingIds] = useState([]);
  const [menuForm, setMenuForm] = useState({
    menuId: '',
    menuName: '',
    remark: '',
  });
  const [dishForm, setDishForm] = useState({
    dishId: '',
    dishName: '',
    dishPrice: '',
    dishIntroduction: '',
    menuId: '',
  });
  const [dishCover, setDishCover] = useState({
    previewUri: '',
    fileName: '',
    uploadFile: null,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const isAdmin = usertype === 'admin';

  const loadMenus = useCallback(async () => {
    const result = await getMenuList();
    setApiMenus(result);
    setActiveMenuId((current) => {
      if (
        current &&
        result.some((menu) => String(pickFirstNonEmpty(menu.menuId, menu.id) || '') === current)
      ) {
        return current;
      }

      return String(pickFirstNonEmpty(result[0]?.menuId, result[0]?.id) || '');
    });
  }, []);

  const loadDishes = useCallback(async () => {
    const result = await getDishList();
    const dishesWithImage = await Promise.all(
      result.map(async (dish) => {
        const dishId = String(pickFirstNonEmpty(dish.dishId, dish.id) || '');

        if (!dishId) {
          return dish;
        }

        try {
          const imageInfo = await getDishImage(dishId);
          return {
            ...dish,
            dishImage: buildImageUrl(
              pickFirstNonEmpty(dish.dishImage, imageInfo?.image_url)
            ),
          };
        } catch {
          return {
            ...dish,
            dishImage: buildImageUrl(dish.dishImage),
          };
        }
      })
    );

    setApiDishes(dishesWithImage);
  }, []);

  const loadFavorites = useCallback(async () => {
    if (isAdmin || !userId) {
      setFavoriteIds([]);
      return;
    }

    const result = await getCollectList({ userId });
    setFavoriteIds(result.map((item) => item.dishId));
  }, [isAdmin, userId]);

  const loadCartSummary = useCallback(async () => {
    if (isAdmin || !userId) {
      setCartSummary({ count: 0, totalPrice: 0 });
      return;
    }

    const result = await getCart(userId);
    const cartData = result?.data;

    if (!cartData || typeof cartData !== 'object' || !('items' in cartData)) {
      setCartSummary({ count: 0, totalPrice: 0 });
      return;
    }

    const items = Array.isArray(cartData.items) ? cartData.items : [];
    const count = items.reduce((sum, item) => sum + Number(item.dishNum || 0), 0);
    setCartSummary({
      count,
      totalPrice: Number(cartData.totalPrice || 0),
    });
  }, [isAdmin, userId]);

  const loadCanteenData = useCallback(async () => {
    try {
      setLoading(true);
      setEditError('');
      await Promise.all([loadMenus(), loadDishes(), loadFavorites(), loadCartSummary()]);
    } catch (requestError) {
      setEditError(requestError instanceof Error ? requestError.message : '\u83b7\u53d6\u83dc\u5355\u5931\u8d25');
    } finally {
      setLoading(false);
    }
  }, [loadCartSummary, loadDishes, loadFavorites, loadMenus]);

  const loadReviews = useCallback(async () => {
    try {
      setReviewsLoading(true);
      setReviewError('');

      const commentList = await getAllComments();
      const normalizedCommentList = Array.isArray(commentList) ? commentList : [];
      const orderIds = Array.from(
        new Set(normalizedCommentList.map((comment) => comment.orderId).filter(Boolean))
      );

      const detailEntries = await Promise.all(
        orderIds.map(async (orderId) => {
          try {
            const details = await getOrderDetails(orderId);
            const dishNames = Array.from(
              new Set(
                (Array.isArray(details) ? details : [])
                  .map((detail) => detail.dishName)
                  .filter(Boolean)
              )
            );

            return [orderId, dishNames.length ? dishNames.join('\u3001') : '\u672a\u77e5\u83dc\u54c1'];
          } catch {
            return [orderId, '\u672a\u77e5\u83dc\u54c1'];
          }
        })
      );
      const dishNameByOrderId = Object.fromEntries(detailEntries);

      const likeEntries = await Promise.all(
        normalizedCommentList.map(async (comment) => {
          const commentId = comment.commentId;
          const [count, likedResult] = await Promise.all([
            getCommentLikeCount(commentId).catch(() => 0),
            userId
              ? checkCommentLiked({ commentId, userId }).catch(() => ({ liked: false }))
              : Promise.resolve({ liked: false }),
          ]);

          return [commentId, { count, liked: Boolean(likedResult?.liked) }];
        })
      );
      const likeStateByCommentId = Object.fromEntries(likeEntries);

      setReviews(
        normalizedCommentList.map((comment) => ({
          ...comment,
          dishName: dishNameByOrderId[comment.orderId] || '\u672a\u77e5\u83dc\u54c1',
        }))
      );
      setReviewLikeCounts(
        Object.fromEntries(
          likeEntries.map(([commentId, state]) => [commentId, Number(state.count || 0)])
        )
      );
      setLikedCommentIds(
        Object.entries(likeStateByCommentId)
          .filter(([, state]) => state.liked)
          .map(([commentId]) => commentId)
      );
    } catch (requestError) {
      setReviewError(requestError instanceof Error ? requestError.message : '\u83b7\u53d6\u8bc4\u8bba\u5931\u8d25');
    } finally {
      setReviewsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadCanteenData();
  }, [loadCanteenData]);

  useEffect(() => {
    if (activePageTab === 'reviews') {
      loadReviews();
    }
  }, [activePageTab, loadReviews]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadCartSummary();
    });

    return unsubscribe;
  }, [loadCartSummary, navigation]);

  const normalizedMenus = useMemo(
    () =>
      apiMenus.map((menu) => {
        const menuId = String(pickFirstNonEmpty(menu.menuId, menu.id) || '');
        const menuName = String(pickFirstNonEmpty(menu.menuName, menu.name) || '');
        return {
          ...menu,
          menuId,
          menuName,
        };
      }),
    [apiMenus]
  );

  const menuItems = useMemo(
    () => (isAdmin ? normalizedMenus : [favoriteMenu, ...normalizedMenus]),
    [isAdmin, normalizedMenus]
  );

  const allDishes = useMemo(
    () =>
      apiDishes.map((dish) => ({
        ...dish,
        id: String(pickFirstNonEmpty(dish.dishId, dish.id) || ''),
        name: dish.dishName,
        price: String(dish.dishPrice),
        desc: dish.dishIntroduction || '',
        menuId: String(pickFirstNonEmpty(dish.menuId, dish.menuID) || ''),
        menuName: String(pickFirstNonEmpty(dish.menuName, dish.menu) || ''),
        dishImage: buildImageUrl(dish.dishImage),
      })),
    [apiDishes]
  );

  const favoriteDishes = useMemo(
    () => allDishes.filter((dish) => favoriteIds.includes(dish.id)),
    [allDishes, favoriteIds]
  );

  const activeMenu = useMemo(
    () => normalizedMenus.find((menu) => menu.menuId === activeMenuId) || normalizedMenus[0],
    [activeMenuId, normalizedMenus]
  );

  const dishes = useMemo(() => {
    const query = keyword.trim().toLowerCase();
    const sourceDishes =
      !isAdmin && activeMenuId === favoriteMenu.id
        ? favoriteDishes
        : allDishes.filter((dish) => {
            if (!activeMenu) {
              return false;
            }

            const sameMenuId =
              dish.menuId &&
              activeMenu.menuId &&
              String(dish.menuId) === String(activeMenu.menuId);
            const sameMenuName =
              dish.menuName &&
              activeMenu.menuName &&
              String(dish.menuName) === String(activeMenu.menuName);

            return Boolean(sameMenuId || sameMenuName);
          });

    if (!query) {
      return sourceDishes;
    }

    return sourceDishes.filter((dish) =>
      [dish.name, dish.price, dish.desc].join(' ').toLowerCase().includes(query)
    );
  }, [activeMenu, activeMenuId, allDishes, favoriteDishes, isAdmin, keyword]);

  const toggleFavorite = (dish) => {
    if (!userId) {
      setEditError('\u8bf7\u5148\u767b\u5f55\u518d\u6536\u85cf');
      return;
    }

    const isCollected = favoriteIds.includes(dish.id);
    setFavoriteLoadingIds((current) => [...current, dish.id]);
    setEditError('');

    const action = isCollected
      ? deleteCollect({ userId, dishId: dish.id })
      : addCollect({ userId, dishId: dish.id, linkUrl: '' });

    Promise.resolve(action)
      .then((result) => {
        if (!isCollected && result.code === 409) {
          setEditError(result.message || '\u60a8\u5df2\u7ecf\u6536\u85cf\u8fc7\u8fd9\u9053\u83dc\u4e86');
          return;
        }

        if (!isCollected && result.code === 400) {
          setEditError(result.message || '\u6536\u85cf\u5931\u8d25');
          return;
        }

        if (isCollected && result && typeof result === 'object' && 'success' in result && !result.success) {
          setEditError(result.message || '\u53d6\u6d88\u6536\u85cf\u5931\u8d25');
          return;
        }

        setFavoriteIds((current) => {
          if (isCollected) {
            return current.filter((id) => id !== dish.id);
          }

          return [...current, dish.id];
        });
      })
      .catch((requestError) => {
        setEditError(
          requestError instanceof Error
            ? requestError.message
            : isCollected
              ? '\u53d6\u6d88\u6536\u85cf\u5931\u8d25'
              : '\u6536\u85cf\u5931\u8d25',
        );
      })
      .finally(() => {
        setFavoriteLoadingIds((current) => current.filter((id) => id !== dish.id));
      });
  };

  const handleAddToCart = async (dish) => {
    if (isAdmin) {
      return;
    }

    if (!userId) {
      setEditError('\u8bf7\u5148\u767b\u5f55\u518d\u52a0\u5165\u8d2d\u7269\u8f66');
      return;
    }

    try {
      setCartLoadingIds((current) => [...current, dish.id]);
      setEditError('');
      await addCart({
        userId,
        dishId: dish.id,
        dishName: dish.name,
        dishPrice: Number(dish.price),
        dishNum: 1,
      });
      await loadCartSummary();
      if (typeof onAddDish === 'function') {
        onAddDish(dish);
      }
    } catch (requestError) {
      setEditError(requestError instanceof Error ? requestError.message : '\u52a0\u5165\u8d2d\u7269\u8f66\u5931\u8d25');
    } finally {
      setCartLoadingIds((current) => current.filter((id) => id !== dish.id));
    }
  };

  const handleToggleLike = async (commentId) => {
    if (!userId) {
      setReviewError('\u8bf7\u5148\u767b\u5f55\u518d\u70b9\u8d5e');
      return;
    }

    const isLiked = likedCommentIds.includes(commentId);
    setLikeLoadingIds((current) => [...current, commentId]);
    setReviewError('');

    try {
      if (isLiked) {
        await cancelCommentLike({ commentId, userId });
      } else {
        await addCommentLike({ commentId, userId });
      }

      setLikedCommentIds((current) => {
        if (isLiked) {
          return current.filter((id) => id !== commentId);
        }

        return current.includes(commentId) ? current : [...current, commentId];
      });
      setReviewLikeCounts((current) => ({
        ...current,
        [commentId]: Math.max(0, Number(current[commentId] || 0) + (isLiked ? -1 : 1)),
      }));
    } catch (requestError) {
      setReviewError(
        requestError instanceof Error
          ? requestError.message
          : isLiked
            ? '\u53d6\u6d88\u70b9\u8d5e\u5931\u8d25'
            : '\u70b9\u8d5e\u5931\u8d25'
      );
    } finally {
      setLikeLoadingIds((current) => current.filter((id) => id !== commentId));
    }
  };

  const displayCartTotal = userId && !isAdmin ? cartSummary.totalPrice : cartTotal;

  const openMenuEditor = (mode, menu) => {
    setEditorMode(mode);
    setEditorType('menu');
    setEditorTitle(mode === 'add' ? '\u6dfb\u52a0\u83dc\u5355' : '\u7f16\u8f91\u83dc\u5355');
    setEditError('');
    setMenuForm({
      menuId: menu?.menuId || '',
      menuName: menu?.menuName || '',
      remark: menu?.remark || '',
    });
    setModalVisible(true);
  };

  const openDishEditor = (mode, dish) => {
    setEditorMode(mode);
    setEditorType('dish');
    setEditorTitle(mode === 'add' ? '\u6dfb\u52a0\u83dc\u54c1' : '\u7f16\u8f91\u83dc\u54c1');
    setEditError('');
    setDishForm({
      dishId: dish?.dishId || '',
      dishName: dish?.dishName || '',
      dishPrice: dish?.dishPrice === undefined ? '' : String(dish.dishPrice),
      dishIntroduction: dish?.dishIntroduction || '',
      menuId: dish?.menuId || activeMenuId,
    });
    setDishCover({
      previewUri: dish?.dishImage || '',
      fileName: '',
      uploadFile: null,
    });
    setModalVisible(true);
  };

  const updateMenuForm = (field, value) => {
    setMenuForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updateDishForm = (field, value) => {
    setDishForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const closeEditor = () => {
    setModalVisible(false);
    setEditError('');
    setDishCover({
      previewUri: '',
      fileName: '',
      uploadFile: null,
    });
  };

  const handlePickDishCover = async () => {
    try {
      setEditError('');
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled || !result.assets?.length) {
        return;
      }

      const asset = result.assets[0];
      const fileName = asset.name || `${dishForm.dishId || 'dish'}-cover.jpg`;
      const mimeType = asset.mimeType || 'image/jpeg';
      const uploadFile = {
        uri: asset.uri,
        name: fileName,
        type: mimeType,
      };

      setDishCover({
        previewUri: asset.uri,
        fileName,
        uploadFile,
      });
    } catch (requestError) {
      setEditError(requestError instanceof Error ? requestError.message : '\u9009\u62e9\u5c01\u9762\u5931\u8d25');
    }
  };

  const submitMenuForm = async () => {
    if (!menuForm.menuId || !menuForm.menuName) {
      setEditError('\u8bf7\u586b\u5199\u83dc\u5355ID\u548c\u83dc\u5355\u540d\u79f0');
      return;
    }

    try {
      setLoading(true);
      setEditError('');
      if (editorMode === 'add') {
        await addMenu(menuForm);
      } else {
        await updateMenu(menuForm);
      }
      await loadCanteenData();
      closeEditor();
    } catch (requestError) {
      setEditError(requestError instanceof Error ? requestError.message : '\u4fdd\u5b58\u83dc\u5355\u5931\u8d25');
    } finally {
      setLoading(false);
    }
  };

  const submitDishForm = async () => {
    if (!dishForm.dishId || !dishForm.dishName || !dishForm.dishPrice || !dishForm.menuId) {
      setEditError('\u8bf7\u586b\u5199\u83dc\u54c1ID\u3001\u540d\u79f0\u3001\u4ef7\u683c\u548c\u6240\u5c5e\u83dc\u5355');
      return;
    }

    try {
      setLoading(true);
      setEditError('');
      if (editorMode === 'add') {
        await addDish(dishForm);
      } else {
        await updateDish(dishForm);
      }

      if (dishCover.uploadFile) {
        await uploadDishImage({
          dishId: dishForm.dishId,
          dishName: dishForm.dishName,
          file: dishCover.uploadFile,
        });
      }

      await loadCanteenData();
      closeEditor();
    } catch (requestError) {
      setEditError(
        requestError instanceof Error
          ? requestError.message
          : '\u4fdd\u5b58\u83dc\u54c1\u6216\u4e0a\u4f20\u5c01\u9762\u5931\u8d25'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMenu = async () => {
    try {
      setLoading(true);
      setEditError('');
      await deleteMenu({ menuId: menuForm.menuId });
      await loadCanteenData();
      closeEditor();
    } catch (requestError) {
      setEditError(requestError instanceof Error ? requestError.message : '\u5220\u9664\u83dc\u5355\u5931\u8d25');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDish = async () => {
    try {
      setLoading(true);
      setEditError('');
      await deleteDish({ dishId: dishForm.dishId });
      await loadCanteenData();
      closeEditor();
    } catch (requestError) {
      setEditError(requestError instanceof Error ? requestError.message : '\u5220\u9664\u83dc\u54c1\u5931\u8d25');
    } finally {
      setLoading(false);
    }
  };

  const renderMenu = ({ item }) => {
    const itemId = item.id || item.menuId;
    const itemName = item.name || item.menuName;
    const isActive = itemId === activeMenuId;

    return (
      <View style={[styles.menuButton, isActive && styles.activeMenuButton]}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setActiveMenuId(itemId)}
          style={styles.menuNameButton}
        >
          <Text style={[styles.menuText, isActive && styles.activeMenuText]}>
            {itemName}
          </Text>
        </TouchableOpacity>
        {isAdmin && item.menuId && (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => openMenuEditor('edit', item)}
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
      {item.dishImage ? (
        <Image
          source={{ uri: item.dishImage }}
          style={styles.dishCover}
        />
      ) : null}
      <View style={styles.dishHeader}>
        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.dishInfoButton}
        >
          <Text style={styles.dishName}>{item.name}</Text>
          <Text style={styles.dishDesc}>{item.desc}</Text>
        </TouchableOpacity>
        <View style={styles.dishAction}>
          <Text style={styles.dishPrice}>{'\u00a5'}{item.price}</Text>
          {!isAdmin && (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => toggleFavorite(item)}
              disabled={favoriteLoadingIds.includes(item.id)}
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
                {favoriteLoadingIds.includes(item.id)
                  ? '\u5904\u7406\u4e2d'
                  : favoriteIds.includes(item.id)
                    ? '\u5df2\u6536\u85cf'
                    : '\u6536\u85cf'}
              </Text>
            </TouchableOpacity>
          )}
          {isAdmin && (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => openDishEditor('edit', item)}
              style={styles.dishEditButton}
            >
              <Text style={styles.dishEditButtonText}>{'\u7f16\u8f91'}</Text>
            </TouchableOpacity>
          )}
          {!isAdmin ? (
            <TouchableOpacity
              activeOpacity={0.85}
              disabled={cartLoadingIds.includes(item.id)}
              onPress={() => handleAddToCart(item)}
              style={[
                styles.addButton,
                cartLoadingIds.includes(item.id) && styles.disabledActionButton,
              ]}
            >
              <Text style={styles.addButtonText}>
                {cartLoadingIds.includes(item.id) ? '...' : '+'}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );

  const renderReview = ({ item }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewTitleGroup}>
          <Text style={styles.reviewDishName}>{item.dishName}</Text>
          <Text style={styles.reviewMeta}>
            {'订单 '}{item.orderId}{' / 用户 '}{item.userId}{' / '}{formatPublishTime(item.publishTime)}
          </Text>
        </View>
      </View>
      <Text style={styles.reviewContent}>{item.content}</Text>
      <View style={styles.reviewFooter}>
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={likeLoadingIds.includes(item.commentId)}
          onPress={() => handleToggleLike(item.commentId)}
          style={[
            styles.likeButton,
            likedCommentIds.includes(item.commentId) && styles.activeLikeButton,
            likeLoadingIds.includes(item.commentId) && styles.disabledActionButton,
          ]}
        >
          <Text
            style={[
              styles.likeButtonText,
              likedCommentIds.includes(item.commentId) && styles.activeLikeButtonText,
            ]}
          >
            {likedCommentIds.includes(item.commentId) ? '❤ \u5df2\u70b9\u8d5e' : '❤ \u70b9\u8d5e'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.likeCount}>
          {Number(reviewLikeCounts[item.commentId] || 0)}{'\u4eba\u70b9\u8d5e'}
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
        <View style={styles.pageTabs}>
          {pageTabs.map((tab) => {
            const isActive = tab.id === activePageTab;

            return (
              <TouchableOpacity
                activeOpacity={0.85}
                key={tab.id}
                onPress={() => setActivePageTab(tab.id)}
                style={[styles.pageTabButton, isActive && styles.activePageTabButton]}
              >
                <Text style={[styles.pageTabText, isActive && styles.activePageTabText]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {activePageTab === 'order' ? (
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setKeyword}
            placeholder={'\u641c\u7d22\u83dc\u54c1'}
            placeholderTextColor="#9ca3af"
            style={styles.searchInput}
            value={keyword}
          />
        ) : null}
        {!modalVisible && activePageTab === 'order' && editError ? (
          <Text style={styles.pageError}>{editError}</Text>
        ) : null}
        {activePageTab === 'reviews' && reviewError ? (
          <Text style={styles.pageError}>{reviewError}</Text>
        ) : null}
      </View>

      {activePageTab === 'order' ? (
        <View style={styles.mainArea}>
          <View style={styles.menuColumn}>
            <FlatList
              contentContainerStyle={styles.menuList}
              data={menuItems}
              keyExtractor={(item) => item.id || item.menuId}
              ListFooterComponent={
                isAdmin ? (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => openMenuEditor('add')}
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
              ListFooterComponent={
                isAdmin && activeMenuId ? (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => openDishEditor('add')}
                    style={styles.dishAddButton}
                  >
                    <Text style={styles.dishAddText}>{'\u6dfb\u52a0\u83dc\u54c1'}</Text>
                  </TouchableOpacity>
                ) : null
              }
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
      ) : (
        <FlatList
          contentContainerStyle={styles.reviewList}
          data={reviews}
          keyExtractor={(item) => item.commentId}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {reviewsLoading ? '\u8bc4\u8bba\u52a0\u8f7d\u4e2d...' : '\u6682\u65e0\u8bc4\u8bba'}
            </Text>
          }
          onRefresh={loadReviews}
          renderItem={renderReview}
          refreshing={reviewsLoading}
          showsVerticalScrollIndicator={false}
          style={styles.reviewPage}
        />
      )}

      {activePageTab === 'order' ? (
        <View style={styles.cartBar}>
          <View>
            <Text style={styles.cartTotal}>{'\u00a5'}{displayCartTotal}</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Cart')}
            style={styles.cartButton}
          >
            <Text style={styles.cartButtonText}>{'\u8d2d\u7269\u8f66'}</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalPanel}>
            <Text style={styles.modalTitle}>{editorTitle}</Text>
            <ScrollView
              contentContainerStyle={styles.modalScrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {editorType === 'menu' ? (
                <View style={styles.editorForm}>
                  <Text style={styles.editorLabel}>{'菜单id'}</Text>
                  <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={editorMode === 'add'}
                    onChangeText={(value) => updateMenuForm('menuId', value)}
                    placeholder={'\u83dc\u5355ID'}
                    placeholderTextColor="#9ca3af"
                    style={[styles.editorInput, editorMode === 'edit' && styles.disabledInput]}
                    value={menuForm.menuId}
                  />
                  <Text style={styles.editorLabel}>{'菜单名称'}</Text>
                  <TextInput
                    autoCorrect={false}
                    onChangeText={(value) => updateMenuForm('menuName', value)}
                    placeholder={'\u83dc\u5355\u540d\u79f0'}
                    placeholderTextColor="#9ca3af"
                    style={styles.editorInput}
                    value={menuForm.menuName}
                  />
                  <Text style={styles.editorLabel}>{'备注'}</Text>
                  <TextInput
                    autoCorrect={false}
                    multiline
                    onChangeText={(value) => updateMenuForm('remark', value)}
                    placeholder={'\u5907\u6ce8'}
                    placeholderTextColor="#9ca3af"
                    style={[styles.editorInput, styles.editorTextArea]}
                    textAlignVertical="top"
                    value={menuForm.remark}
                  />
                </View>
              ) : (
                <View style={styles.editorForm}>
                  <Text style={styles.editorLabel}>{'菜品ID'}</Text>
                  <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={editorMode === 'add'}
                    onChangeText={(value) => updateDishForm('dishId', value)}
                    placeholder={'\u83dc\u54c1ID'}
                    placeholderTextColor="#9ca3af"
                    style={[styles.editorInput, editorMode === 'edit' && styles.disabledInput]}
                    value={dishForm.dishId}
                  />
                  <Text style={styles.editorLabel}>{'菜品名称'}</Text>
                  <TextInput
                    autoCorrect={false}
                    onChangeText={(value) => updateDishForm('dishName', value)}
                    placeholder={'\u83dc\u54c1\u540d\u79f0'}
                    placeholderTextColor="#9ca3af"
                    style={styles.editorInput}
                    value={dishForm.dishName}
                  />
                  <Text style={styles.editorLabel}>{'菜品价格'}</Text>
                  <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="numeric"
                    onChangeText={(value) => updateDishForm('dishPrice', value)}
                    placeholder={'\u83dc\u54c1\u4ef7\u683c'}
                    placeholderTextColor="#9ca3af"
                    style={styles.editorInput}
                    value={dishForm.dishPrice}
                  />
                  <Text style={styles.editorLabel}>{'所属菜单ID'}</Text>
                  <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={(value) => updateDishForm('menuId', value)}
                    placeholder={'\u6240\u5c5e\u83dc\u5355ID'}
                    placeholderTextColor="#9ca3af"
                    style={styles.editorInput}
                    value={dishForm.menuId}
                  />
                  <Text style={styles.editorLabel}>{'菜品介绍'}</Text>
                  <TextInput
                    autoCorrect={false}
                    multiline
                    onChangeText={(value) => updateDishForm('dishIntroduction', value)}
                    placeholder={'\u83dc\u54c1\u4ecb\u7ecd'}
                    placeholderTextColor="#9ca3af"
                    style={[styles.editorInput, styles.editorTextArea]}
                    textAlignVertical="top"
                    value={dishForm.dishIntroduction}
                  />
                  <Text style={styles.editorLabel}>{'封面图片'}</Text>
                  {dishCover.previewUri ? (
                    <Image
                      source={{ uri: dishCover.previewUri }}
                      style={styles.coverPreview}
                    />
                  ) : (
                    <View style={styles.coverPlaceholder}>
                      <Text style={styles.coverPlaceholderText}>{'暂未选择封面'}</Text>
                    </View>
                  )}
                  {dishCover.fileName ? (
                    <Text style={styles.coverFileName}>{dishCover.fileName}</Text>
                  ) : null}
                  <TouchableOpacity
                    activeOpacity={0.85}
                    disabled={loading}
                    onPress={handlePickDishCover}
                    style={[styles.coverUploadButton, loading && styles.disabledActionButton]}
                  >
                    <Text style={styles.coverUploadButtonText}>
                      {dishCover.previewUri ? '重新选择封面' : '上传封面'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
            {editError ? <Text style={styles.editorError}>{editError}</Text> : null}
            <View style={styles.modalActions}>
              {editorMode === 'edit' ? (
                <TouchableOpacity
                  activeOpacity={0.85}
                  disabled={loading}
                  onPress={editorType === 'menu' ? handleDeleteMenu : handleDeleteDish}
                  style={[styles.modalDeleteButton, loading && styles.disabledActionButton]}
                >
                  <Text style={styles.modalDeleteText}>{'\u5220\u9664'}</Text>
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                activeOpacity={0.85}
                disabled={loading}
                onPress={editorType === 'menu' ? submitMenuForm : submitDishForm}
                style={[styles.modalSaveButton, loading && styles.disabledActionButton]}
              >
                <Text style={styles.modalSaveText}>
                  {loading ? '\u4fdd\u5b58\u4e2d...' : '\u4fdd\u5b58'}
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={closeEditor}
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
  avatarButton: {
    alignItems: 'center',
    backgroundColor: '#ea580c',
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
  pageTabs: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    flexDirection: 'row',
    marginBottom: 12,
    padding: 4,
  },
  pageTabButton: {
    alignItems: 'center',
    borderRadius: 6,
    flex: 1,
    justifyContent: 'center',
    minHeight: 40,
  },
  activePageTabButton: {
    backgroundColor: '#ea580c',
  },
  pageTabText: {
    color: '#4b5563',
    fontSize: 14,
    fontWeight: '800',
  },
  activePageTabText: {
    color: '#ffffff',
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
  pageError: {
    color: '#dc2626',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 8,
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
    borderLeftColor: '#ea580c',
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
    backgroundColor: '#ea580c',
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
    color: '#ea580c',
    fontWeight: '800',
  },
  dishColumn: {
    flex: 1,
    paddingHorizontal: 12,
  },
  dishList: {
    gap: 12,
    paddingBottom: 24 + BOTTOM_SAFE_PADDING,
    paddingTop: 12,
  },
  dishCard: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
  },
  dishCover: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    height: 150,
    marginBottom: 12,
    width: '100%',
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
    fontSize: 17,
    fontWeight: '800',
  },
  dishInfoButton: {
    flex: 1,
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
    backgroundColor: '#fff7ed',
    borderColor: '#fb923c',
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 32,
    minWidth: 50,
    paddingHorizontal: 8,
  },
  dishEditButtonText: {
    color: '#c2410c',
    fontSize: 13,
    fontWeight: '800',
  },
  dishAddButton: {
    alignItems: 'center',
    backgroundColor: '#ea580c',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 44,
  },
  dishAddText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: '#ea580c',
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
    minHeight: 70 + BOTTOM_SAFE_PADDING,
    paddingBottom: Math.max(BOTTOM_SAFE_PADDING, 10),
    paddingHorizontal: 16,
  },
  cartTotal: {
    color: '#dc2626',
    fontSize: 20,
    fontWeight: '900',
  },
  cartButton: {
    alignItems: 'center',
    backgroundColor: '#ea580c',
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
  reviewPage: {
    flex: 1,
  },
  reviewList: {
    gap: 12,
    padding: 16,
    paddingBottom: 24 + BOTTOM_SAFE_PADDING,
  },
  reviewCard: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    borderRadius: 8,
    borderWidth: 1,
    padding: 15,
  },
  reviewHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  reviewTitleGroup: {
    flex: 1,
  },
  reviewDishName: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 4,
  },
  reviewMeta: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '700',
  },
  reviewContent: {
    color: '#374151',
    fontSize: 14,
    lineHeight: 20,
  },
  reviewFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    marginTop: 12,
  },
  likeButton: {
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db',
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 34,
    minWidth: 76,
    paddingHorizontal: 12,
  },
  activeLikeButton: {
    backgroundColor: '#fff7ed',
    borderColor: '#fb923c',
  },
  likeButtonText: {
    color: '#4b5563',
    fontSize: 13,
    fontWeight: '800',
  },
  activeLikeButtonText: {
    color: '#c2410c',
  },
  likeCount: {
    color: '#6b7280',
    fontSize: 13,
    fontWeight: '700',
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
    maxHeight: '85%',
    padding: 18,
    width: '100%',
  },
  modalScrollContent: {
    paddingBottom: 4,
  },
  modalTitle: {
    color: '#111827',
    fontSize: 19,
    fontWeight: '900',
    marginBottom: 14,
  },
  editorForm: {
    gap: 10,
  },
  editorLabel: {
    color: '#374151',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  editorInput: {
    backgroundColor: '#f9fafb',
    borderColor: '#d1d5db',
    borderRadius: 8,
    borderWidth: 1,
    color: '#111827',
    fontSize: 15,
    minHeight: 46,
    paddingHorizontal: 12,
  },
  disabledInput: {
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
  },
  editorTextArea: {
    minHeight: 86,
    paddingTop: 12,
  },
  coverPreview: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    height: 160,
    width: '100%',
  },
  coverPlaceholder: {
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderColor: '#d1d5db',
    borderRadius: 8,
    borderStyle: 'dashed',
    borderWidth: 1,
    height: 120,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  coverPlaceholderText: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '700',
  },
  coverFileName: {
    color: '#4b5563',
    fontSize: 12,
    fontWeight: '700',
  },
  coverUploadButton: {
    alignItems: 'center',
    backgroundColor: '#ea580c',
    borderColor: '#93c5fd',
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 42,
    paddingHorizontal: 14,
  },
  coverUploadButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  editorError: {
    color: '#dc2626',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 10,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  modalSaveButton: {
    alignItems: 'center',
    backgroundColor: '#ea580c',
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    minHeight: 46,
  },
  modalSaveText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
  },
  modalDeleteButton: {
    alignItems: 'center',
    backgroundColor: '#dc2626',
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    minHeight: 46,
  },
  modalDeleteText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
  },
  disabledActionButton: {
    opacity: 0.65,
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
    backgroundColor: '#ea580c',
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
