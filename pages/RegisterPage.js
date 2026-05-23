import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import AuthLayout from './AuthLayout';
import copy from './authCopy';
import styles from './authStyles';
import Field from './Field';

import { adminRegister, customerRegister } from '../api/register';

const initialForm = {
  account: '',
  password: '',
  userType: 'customer',
  merchantName: '',
  securityQuestion: '',
  securityAnswer: '',
};

export default function RegisterPage({ navigation }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [typeMenuVisible, setTypeMenuVisible] = useState(false);

  const updateForm = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const userTypeLabel = form.userType === 'admin' ? '\u5546\u5bb6' : '\u987e\u5ba2';

  const handleRegister = async () => {
    if (!form.account || !form.password) {
      setError('\u8bf7\u8f93\u5165\u8d26\u53f7\u548c\u5bc6\u7801');
      return;
    }

    if (form.userType === 'admin' && !form.merchantName) {
      setError('\u8bf7\u8f93\u5165\u5546\u5bb6\u540d\u79f0');
      return;
    }

    if (
      form.userType === 'customer' &&
      (!form.securityQuestion || !form.securityAnswer)
    ) {
      setError('\u8bf7\u586b\u5199\u5bc6\u4fdd\u95ee\u9898\u548c\u5bc6\u4fdd\u7b54\u6848');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const res =
        form.userType === 'admin'
          ? await adminRegister({
              userId: form.account,
              userPassword: form.password,
              userType: 'admin',
              merchantName: form.merchantName,
            })
          : await customerRegister({
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

        <View style={[styles.fieldGroup, { elevation: 20, zIndex: 9999 }]}>
          <Text style={styles.label}>{'\u7528\u6237\u7c7b\u578b'}</Text>
          <View style={{ elevation: 20, position: 'relative', zIndex: 9999 }}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setTypeMenuVisible((current) => !current)}
              style={{
                alignItems: 'center',
                backgroundColor: '#f9fafb',
                borderColor: '#d1d5db',
                borderRadius: 8,
                borderWidth: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                minHeight: 52,
                paddingHorizontal: 14,
              }}
            >
              <Text style={{ color: '#111827', fontSize: 16 }}>{userTypeLabel}</Text>
              <Text style={{ color: '#6b7280', fontSize: 14 }}>{typeMenuVisible ? '^' : 'v'}</Text>
            </TouchableOpacity>
            {typeMenuVisible ? (
              <View
                style={{
                  backgroundColor: '#ffffff',
                  borderColor: '#d1d5db',
                  borderRadius: 8,
                  borderWidth: 1,
                  elevation: 20,
                  left: 0,
                  marginTop: 8,
                  overflow: 'hidden',
                  position: 'absolute',
                  right: 0,
                  top: 52,
                  zIndex: 9999,
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => {
                    updateForm('userType', 'customer');
                    setTypeMenuVisible(false);
                  }}
                  style={{
                    justifyContent: 'center',
                    minHeight: 44,
                    paddingHorizontal: 14,
                  }}
                >
                  <Text style={{ color: '#111827', fontSize: 15 }}>{'\u987e\u5ba2'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => {
                    updateForm('userType', 'admin');
                    setTypeMenuVisible(false);
                  }}
                  style={{
                    borderTopColor: '#e5e7eb',
                    borderTopWidth: 1,
                    justifyContent: 'center',
                    minHeight: 44,
                    paddingHorizontal: 14,
                  }}
                >
                  <Text style={{ color: '#111827', fontSize: 15 }}>{'\u5546\u5bb6'}</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </View>

        <View style={{ zIndex: 1 }}>
          {form.userType === 'admin' ? (
            <Field
              label={'\u5546\u5bb6\u540d\u79f0'}
              onChangeText={(value) => updateForm('merchantName', value)}
              placeholder={'\u8bf7\u8f93\u5165\u5546\u5bb6\u540d\u79f0'}
              value={form.merchantName}
            />
          ) : (
            <>
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
            </>
          )}
        </View>

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
