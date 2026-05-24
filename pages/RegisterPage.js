import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import AuthLayout from './AuthLayout';
import copy from './authCopy';
import styles from './authStyles';
import Field from './Field';

import { customerRegister } from '../api/register';

const initialForm = {
  account: '',
  password: '',
  securityQuestion: '',
  securityAnswer: '',
};

export default function RegisterPage({ navigation }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const updateForm = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleRegister = async () => {
    if (!form.account || !form.password) {
      setError('\u8bf7\u8f93\u5165\u8d26\u53f7\u548c\u5bc6\u7801');
      return;
    }

    if (!form.securityQuestion || !form.securityAnswer) {
      setError('\u8bf7\u586b\u5199\u5bc6\u4fdd\u95ee\u9898\u548c\u5bc6\u4fdd\u7b54\u6848');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const res = await customerRegister({
        userId: form.account,
        userPassword: form.password,
        userType: 'customer',
        securityQuestion: form.securityQuestion,
        securityAnswer: form.securityAnswer,
      });

      if (res.code === 400) {
        setError(res.message || res.msg || '\u6ce8\u518c\u5931\u8d25');
        return;
      }

      navigation.navigate('Login');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : '\u6ce8\u518c\u5931\u8d25');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      activeRoute="Register"
      backTarget="Login"
      hideTabs
      navigation={navigation}
      subtitle={copy.registerSubtitle}
    >
      <View style={styles.form}>
        <View style={styles.formTitleRow}>
          <Text style={[styles.formTitle, styles.centerFormTitle]}>
            {copy.registerTitle}
          </Text>
        </View>
        <Field
          label={copy.account}
          onChangeText={(value) => updateForm('account', value)}
          placeholder={copy.setAccountPlaceholder}
          value={form.account}
        />
        <Field
          label={copy.password}
          onChangeText={(value) => updateForm('password', value)}
          placeholder={copy.setPasswordPlaceholder}
          secureTextEntry
          value={form.password}
        />

        <Field
          label={copy.securityQuestion}
          onChangeText={(value) => updateForm('securityQuestion', value)}
          placeholder={copy.questionPlaceholder}
          value={form.securityQuestion}
        />
        <Field
          label={copy.securityAnswer}
          onChangeText={(value) => updateForm('securityAnswer', value)}
          placeholder={copy.answerPlaceholder}
          value={form.securityAnswer}
        />

        {error ? <Text style={{ color: '#dc2626', fontSize: 14 }}>{error}</Text> : null}
        <TouchableOpacity
          activeOpacity={0.9}
          disabled={loading}
          onPress={handleRegister}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? '\u6ce8\u518c\u4e2d...' : copy.register}
          </Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
}
