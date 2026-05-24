import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import AuthLayout from './AuthLayout';
import copy from './authCopy';
import styles from './authStyles';
import Field from './Field';

import { forgotPassword } from '../api/forget-password';

const initialForm = {
  account: '',
  verifyType: 'security',
  oldPassword: '',
  securityAnswer: '',
  newPassword: '',
  confirmPassword: '',
};

export default function ForgotPasswordPage({ navigation }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const updateForm = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleResetPassword = async () => {
    if (!form.account || !form.newPassword || !form.confirmPassword) {
      setError('\u8bf7\u5b8c\u6574\u586b\u5199\u627e\u56de\u5bc6\u7801\u4fe1\u606f');
      return;
    }

    if (form.verifyType === 'password' && !form.oldPassword) {
      setError('\u8bf7\u8f93\u5165\u539f\u5bc6\u7801');
      return;
    }

    if (form.verifyType === 'security' && !form.securityAnswer) {
      setError('\u8bf7\u8f93\u5165\u5bc6\u4fdd\u7b54\u6848');
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError('\u4e24\u6b21\u8f93\u5165\u7684\u65b0\u5bc6\u7801\u4e0d\u4e00\u81f4');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const res =
        form.verifyType === 'password'
          ? await forgotPassword({
              userId: form.account,
              verifyType: 'password',
              oldPassword: form.oldPassword,
              newPassword: form.newPassword,
            })
          : await forgotPassword({
              userId: form.account,
              verifyType: 'security',
              securityAnswer: form.securityAnswer,
              newPassword: form.newPassword,
            });

      if (res.code === 400) {
        setError(res.message || res.msg || '\u91cd\u7f6e\u5bc6\u7801\u5931\u8d25');
        return;
      }

      navigation.navigate('Login');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : '\u91cd\u7f6e\u5bc6\u7801\u5931\u8d25');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      activeRoute="Login"
      backTarget="Login"
      hideTabs
      navigation={navigation}
      subtitle={'\u901a\u8fc7\u5bc6\u4fdd\u4fe1\u606f\u627e\u56de\u5bc6\u7801'}
    >
      <View style={styles.form}>
        <View style={styles.formTitleRow}>
          <Text style={[styles.formTitle, styles.centerFormTitle]}>
            {'\u627e\u56de\u5bc6\u7801'}
          </Text>
        </View>
        <Field
          label={copy.account}
          onChangeText={(value) => updateForm('account', value)}
          placeholder={copy.accountPlaceholder}
          value={form.account}
        />
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{'\u627e\u56de\u65b9\u5f0f'}</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => updateForm('verifyType', 'password')}
              style={{
                alignItems: 'center',
                backgroundColor: form.verifyType === 'password' ? '#ea580c' : '#f9fafb',
                borderColor: form.verifyType === 'password' ? '#ea580c' : '#d1d5db',
                borderRadius: 8,
                borderWidth: 1,
                flex: 1,
                justifyContent: 'center',
                minHeight: 44,
              }}
            >
              <Text
                style={{
                  color: form.verifyType === 'password' ? '#ffffff' : '#374151',
                  fontSize: 14,
                  fontWeight: '700',
                }}
              >
                {'\u5bc6\u7801\u627e\u56de'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => updateForm('verifyType', 'security')}
              style={{
                alignItems: 'center',
                backgroundColor: form.verifyType === 'security' ? '#ea580c' : '#f9fafb',
                borderColor: form.verifyType === 'security' ? '#ea580c' : '#d1d5db',
                borderRadius: 8,
                borderWidth: 1,
                flex: 1,
                justifyContent: 'center',
                minHeight: 44,
              }}
            >
              <Text
                style={{
                  color: form.verifyType === 'security' ? '#ffffff' : '#374151',
                  fontSize: 14,
                  fontWeight: '700',
                }}
              >
                {'\u5bc6\u4fdd\u627e\u56de'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {form.verifyType === 'password' ? (
          <Field
            label={'\u539f\u5bc6\u7801'}
            onChangeText={(value) => updateForm('oldPassword', value)}
            placeholder={'\u8bf7\u8f93\u5165\u539f\u5bc6\u7801'}
            secureTextEntry
            value={form.oldPassword}
          />
        ) : (
          <Field
            label={copy.securityAnswer}
            onChangeText={(value) => updateForm('securityAnswer', value)}
            placeholder={copy.answerPlaceholder}
            value={form.securityAnswer}
          />
        )}
        <Field
          label={'\u65b0\u5bc6\u7801'}
          onChangeText={(value) => updateForm('newPassword', value)}
          placeholder={'\u8bf7\u8f93\u5165\u65b0\u5bc6\u7801'}
          secureTextEntry
          value={form.newPassword}
        />
        <Field
          label={'\u786e\u8ba4\u65b0\u5bc6\u7801'}
          onChangeText={(value) => updateForm('confirmPassword', value)}
          placeholder={'\u8bf7\u518d\u6b21\u8f93\u5165\u65b0\u5bc6\u7801'}
          secureTextEntry
          value={form.confirmPassword}
        />
        {error ? <Text style={{ color: '#dc2626', fontSize: 14 }}>{error}</Text> : null}
        <TouchableOpacity
          activeOpacity={0.9}
          disabled={loading}
          onPress={handleResetPassword}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? '\u91cd\u7f6e\u4e2d...' : '\u786e\u8ba4\u91cd\u7f6e'}
          </Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
}
