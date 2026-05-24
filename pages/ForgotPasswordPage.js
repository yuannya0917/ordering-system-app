import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import AuthLayout from './AuthLayout';
import copy from './authCopy';
import styles from './authStyles';
import Field from './Field';

import { forgotPassword, getSecurityQuestion } from '../api/forget-password';

const initialForm = {
  account: '',
  securityAnswer: '',
  newPassword: '',
  confirmPassword: '',
};

export default function ForgotPasswordPage({ navigation }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityQuestionLoading, setSecurityQuestionLoading] = useState(false);

  const updateForm = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  useEffect(() => {
    const account = form.account.trim();
    setSecurityQuestion('');
    setSecurityQuestionLoading(false);

    if (!account) {
      return undefined;
    }

    let ignore = false;

    const loadSecurityQuestion = async () => {
      try {
        setSecurityQuestionLoading(true);
        setError('');
        const question = await getSecurityQuestion(account);
        if (!ignore) {
          setSecurityQuestion(question || '\u6682\u672a\u8bbe\u7f6e\u5bc6\u4fdd\u95ee\u9898');
        }
      } catch (requestError) {
        if (!ignore) {
          setSecurityQuestion('');
          setError(requestError instanceof Error ? requestError.message : '\u83b7\u53d6\u5bc6\u4fdd\u95ee\u9898\u5931\u8d25');
        }
      } finally {
        if (!ignore) {
          setSecurityQuestionLoading(false);
        }
      }
    };

    const timer = setTimeout(() => {
      loadSecurityQuestion();
    }, 500);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [form.account]);

  const handleResetPassword = async () => {
    if (!form.account || !form.newPassword || !form.confirmPassword) {
      setError('\u8bf7\u5b8c\u6574\u586b\u5199\u627e\u56de\u5bc6\u7801\u4fe1\u606f');
      return;
    }

    if (!form.securityAnswer) {
      setError('\u8bf7\u8f93\u5165\u5bc6\u4fdd\u7b54\u6848');
      return;
    }

    if (form.newPassword.length < 6) {
      setError('\u65b0\u5bc6\u7801\u81f3\u5c116\u4f4d');
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError('\u4e24\u6b21\u8f93\u5165\u7684\u65b0\u5bc6\u7801\u4e0d\u4e00\u81f4');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const res = await forgotPassword({
        userId: form.account.trim(),
        securityAnswer: form.securityAnswer,
        newPassword: form.newPassword,
      });

      if (res.code && res.code !== 0 && res.code !== 200) {
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
          <Text style={styles.label}>{'\u5bc6\u4fdd\u95ee\u9898'}</Text>
          <View
            style={{
              backgroundColor: '#fff7ed',
              borderColor: '#fed7aa',
              borderRadius: 8,
              borderWidth: 1,
              justifyContent: 'center',
              minHeight: 46,
              paddingHorizontal: 12,
              paddingVertical: 10,
            }}
          >
            <Text
              style={{
                color: '#9a3412',
                fontSize: 14,
                fontWeight: '800',
                lineHeight: 20,
              }}
            >
              {securityQuestionLoading
                ? '\u5bc6\u4fdd\u95ee\u9898\u52a0\u8f7d\u4e2d...'
                : securityQuestion || '\u8bf7\u5148\u8f93\u5165\u8d26\u53f7'}
            </Text>
          </View>
        </View>
        <Field
          label={copy.securityAnswer}
          onChangeText={(value) => updateForm('securityAnswer', value)}
          placeholder={copy.answerPlaceholder}
          value={form.securityAnswer}
        />
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
