import { useState } from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { changePassword } from '../api/change-password';
import { useAuth } from '../contexts/AuthContext';

const TOP_BAR_PADDING_TOP = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 6 : 0;
const TOP_BAR_MIN_HEIGHT = 58 + TOP_BAR_PADDING_TOP;
const initialForm = {
  account: '',
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export default function ChangePasswordPage({ navigation }) {
  const { userId } = useAuth();
  const [form, setForm] = useState({
    ...initialForm,
    account: userId,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const updateForm = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleChangePassword = async () => {
    if (!form.account || !form.oldPassword || !form.newPassword || !form.confirmPassword) {
      setError('\u8bf7\u5b8c\u6574\u586b\u5199\u4fee\u6539\u5bc6\u7801\u4fe1\u606f');
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError('\u4e24\u6b21\u8f93\u5165\u7684\u65b0\u5bc6\u7801\u4e0d\u4e00\u81f4');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const res = await changePassword({
        userId: form.account,
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      });

      if (res.code === 400) {
        setError(res.message || res.msg || '\u4fee\u6539\u5bc6\u7801\u5931\u8d25');
        return;
      }

      navigation.goBack();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : '\u4fee\u6539\u5bc6\u7801\u5931\u8d25');
    } finally {
      setLoading(false);
    }
  };

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
        <Text style={styles.topBarTitle}>{'\u4fee\u6539\u5bc6\u7801'}</Text>
        <View style={styles.topBarButton} />
      </View>

      <View style={styles.content}>
        <View style={styles.formPanel}>
          <Field
            label={'\u8d26\u53f7'}
            onChangeText={(value) => updateForm('account', value)}
            placeholder={'\u8bf7\u8f93\u5165\u8d26\u53f7'}
            value={form.account}
          />
          <Field
            label={'\u65e7\u5bc6\u7801'}
            onChangeText={(value) => updateForm('oldPassword', value)}
            placeholder={'\u8bf7\u8f93\u5165\u65e7\u5bc6\u7801'}
            secureTextEntry
            value={form.oldPassword}
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
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={loading}
            onPress={handleChangePassword}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? '\u4fee\u6539\u4e2d...' : '\u786e\u8ba4\u4fee\u6539'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

function Field({
  label,
  onChangeText,
  placeholder,
  secureTextEntry,
  value,
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        secureTextEntry={secureTextEntry}
        style={styles.input}
        value={value}
      />
    </View>
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
  topBarTitle: {
    color: '#111827',
    flex: 1,
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: 0,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 18,
  },
  formPanel: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    borderRadius: 8,
    borderWidth: 1,
    gap: 16,
    padding: 16,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '800',
  },
  input: {
    backgroundColor: '#f9fafb',
    borderColor: '#d1d5db',
    borderRadius: 8,
    borderWidth: 1,
    color: '#111827',
    fontSize: 16,
    minHeight: 52,
    paddingHorizontal: 14,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#ea580c',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 52,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '900',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '700',
  },
});
