import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import AuthLayout from './AuthLayout';
import copy from './authCopy';
import styles from './authStyles';
import Field from './Field';

import { login } from '../api/login';
import { useAuth } from '../contexts/AuthContext';

const initialForm = {
  account: '',
  password: '',
};

export default function LoginPage({ navigation }) {
  const { setCurrentUser } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const updateForm = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleLogin = async () => {
    const params = {
      userId: form.account,
      userPassword: form.password,
    };

    try {
      setLoading(true);
      setError('');

      const res = await login(params);

      if (res.code === 400) {
        setError(res.message || res.msg || '账号或密码错误');
        return;
      }

      if (res.data?.userId && res.data?.userType) {
        setCurrentUser({
          userId: res.data.userId,
          userType: res.data.userType,
        });
      }

      if (res.data?.userType === 'admin') {
        navigation.navigate('OrderManagement');
      } else if (res.data?.userType === 'customer') {
        navigation.navigate('Canteen');
      } else {
        setError('登录成功，但用户角色无效');
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : '账号或密码错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      activeRoute="Login"
      hideTabs
      navigation={navigation}
      subtitle={copy.loginSubtitle}
    >
      <View style={styles.form}>
        <Text style={styles.formTitle}>{copy.loginTitle}</Text>
        <Field
          label={copy.account}
          onChangeText={(value) => updateForm('account', value)}
          placeholder={copy.accountPlaceholder}
          value={form.account}
        />
        <Field
          label={copy.password}
          onChangeText={(value) => updateForm('password', value)}
          placeholder={copy.passwordPlaceholder}
          secureTextEntry
          value={form.password}
        />
        <View style={styles.loginLinkRow}>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => navigation.navigate('Register')}
            style={styles.inlineLinkButton}
          >
            <Text style={styles.linkText}>{copy.register}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.inlineLinkButton}
          >
            <Text style={styles.linkText}>{'\u5fd8\u8bb0\u5bc6\u7801'}</Text>
          </TouchableOpacity>
        </View>
        {error ? <Text style={{ color: '#dc2626', fontSize: 14 }}>{error}</Text> : null}
        <TouchableOpacity
          activeOpacity={0.9}
          disabled={loading}
          onPress={handleLogin}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>{loading ? '登录中...' : copy.login}</Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
}
