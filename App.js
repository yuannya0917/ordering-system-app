import { useMemo, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import { AuthContext } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CanteenPage from './pages/CanteenPage';
import CartPage from './pages/CartPage';
import AccountCancelPage from './pages/AccountCancelPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import DishReviewsPage from './pages/DishReviewsPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import MyReviewsPage from './pages/MyReviewsPage';
import OrderManagementPage from './pages/OrderManagementPage';
import MyOrdersPage from './pages/OrderHistoryPage';
import OrderReviewPage from './pages/OrderReviewPage';
import RevenuePage from './pages/RevenuePage';
import RoleSelectPage from './pages/RoleSelectPage';
import UserCenterPage from './pages/UserCenterPage';
import UserQueryPage from './pages/UserQueryPage';

const Stack = createNativeStackNavigator();

export default function App() {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState('');
  const [usertype, setUsertype] = useState('customer');

  const handleLoginSuccess = (user) => {
    setUserId(user.userId);
    setUsertype(user.userType);
  };

  const clearCurrentUser = () => {
    setUserId('');
    setUsertype('customer');
  };

  const addToCart = (dish) => {
    setCartItems((current) => {
      const existingItem = current.find((item) => item.id === dish.id);

      if (existingItem) {
        return current.map((item) =>
          item.id === dish.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...current,
        {
          ...dish,
          quantity: 1,
        },
      ];
    });
  };

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const cartTotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0
      ),
    [cartItems]
  );

  return (
    <AuthContext.Provider
      value={{
        userId,
        usertype,
        setCurrentUser: handleLoginSuccess,
        clearCurrentUser,
      }}
    >
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: '#f7f8f3',
            },
          }}
        >
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="Register" component={RegisterPage} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordPage} />
          <Stack.Screen name="RoleSelect">
            {(props) => (
              <RoleSelectPage
                {...props}
                onSelectUsertype={setUsertype}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Canteen">
            {(props) => (
              <CanteenPage
                {...props}
                cartCount={cartCount}
                cartTotal={cartTotal}
                onAddDish={addToCart}
                userId={userId}
                usertype={usertype}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Cart">
            {(props) => (
              <CartPage
                {...props}
                cartItems={cartItems}
                cartTotal={cartTotal}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="UserCenter">
            {(props) => (
              <UserCenterPage
                {...props}
                userId={userId}
                usertype={usertype}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="DishReviews" component={DishReviewsPage} />
          <Stack.Screen name="OrderManagement">
            {(props) => (
              <OrderManagementPage
                {...props}
                userId={userId}
                usertype={usertype}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="MyOrders" component={MyOrdersPage} />
          <Stack.Screen name="OrderReview" component={OrderReviewPage} />
          <Stack.Screen name="Revenue" component={RevenuePage} />
          <Stack.Screen name="MyReviews" component={MyReviewsPage} />
          <Stack.Screen name="ChangePassword" component={ChangePasswordPage} />
          <Stack.Screen name="AccountCancel" component={AccountCancelPage} />
          <Stack.Screen name="UserQuery" component={UserQueryPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
