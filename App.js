import { useMemo, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CanteenPage from './pages/CanteenPage';
import CartPage from './pages/CartPage';
import AccountCancelPage from './pages/AccountCancelPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import MyReviewsPage from './pages/MyReviewsPage';
import MyOrdersPage from './pages/OrderHistoryPage';
import OrderReviewPage from './pages/OrderReviewPage';
import RoleSelectPage from './pages/RoleSelectPage';
import UserCenterPage from './pages/UserCenterPage';
import UserQueryPage from './pages/UserQueryPage';

const Stack = createNativeStackNavigator();

export default function App() {
  const [cartItems, setCartItems] = useState([]);
  const [usertype, setUsertype] = useState('customer');

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
        <Stack.Screen name="UserCenter" component={UserCenterPage} />
        <Stack.Screen name="MyOrders" component={MyOrdersPage} />
        <Stack.Screen name="OrderReview" component={OrderReviewPage} />
        <Stack.Screen name="MyReviews" component={MyReviewsPage} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordPage} />
        <Stack.Screen name="AccountCancel" component={AccountCancelPage} />
        <Stack.Screen name="UserQuery" component={UserQueryPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
