import { useEffect, useState } from 'react';
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

import { changePassword, getSecurityQuestion } from '../api/change-password';
import { useAuth } from '../contexts/AuthContext';

const TOP_BAR_PADDING_TOP = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 6 : 0;
const TOP_BAR_MIN_HEIGHT = 58 + TOP_BAR_PADDING_TOP;
const initialForm = {
  account: '',
  verifyType: 'password',
  oldPassword: '',
  securityAnswer: '',
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
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityQuestionLoading, setSecurityQuestionLoading] = useState(false);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      account: current.account || userId,
    }));
  }, [userId]);

  const updateForm = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  useEffect(() => {
    const account = form.account.trim();
    if (form.verifyType !== 'security') {
      setSecurityQuestion('');
      return undefined;
    }

    if (!account) {
      setSecurityQuestion('');
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

    loadSecurityQuestion();

    return () => {
      ignore = true;
    };
  }, [form.account, form.verifyType]);

  const handleChangePassword = async () => {
    if (!form.account || !form.newPassword || !form.confirmPassword) {
      setError('\u8bf7\u5b8c\u6574\u586b\u5199\u4fee\u6539\u5bc6\u7801\u4fe1\u606f');
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

      const res =
        form.verifyType === 'password'
          ? await changePassword({
              userId: form.account,
              verifyType: 'password',
              oldPassword: form.oldPassword,
              newPassword: form.newPassword,
            })
          : await changePassword({
              userId: form.account,
              verifyType: 'security',
              securityAnswer: form.securityAnswer,
              newPassword: form.newPassword,
            });

      if (res.code && res.code !== 0 && res.code !== 200) {
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
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>{'\u9a8c\u8bc1\u65b9\u5f0f'}</Text>
            <View style={styles.verifyTabs}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => updateForm('verifyType', 'password')}
                style={[
                  styles.verifyTabButton,
                  form.verifyType === 'password' && styles.activeVerifyTabButton,
                ]}
              >
                <Text
                  style={[
                    styles.verifyTabText,
                    form.verifyType === 'password' && styles.activeVerifyTabText,
                  ]}
                >
                  {'\u5bc6\u7801\u9a8c\u8bc1'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => updateForm('verifyType', 'security')}
                style={[
                  styles.verifyTabButton,
                  form.verifyType === 'security' && styles.activeVerifyTabButton,
                ]}
              >
                <Text
                  style={[
                    styles.verifyTabText,
                    form.verifyType === 'security' && styles.activeVerifyTabText,
                  ]}
                >
                  {'\u5bc6\u4fdd\u9a8c\u8bc1'}
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
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>{'\u5bc6\u4fdd\u95ee\u9898'}</Text>
              <View style={styles.securityQuestionBox}>
                <Text style={styles.securityQuestionText}>
                  {securityQuestionLoading
                    ? '\u5bc6\u4fdd\u95ee\u9898\u52a0\u8f7d\u4e2d...'
                    : securityQuestion || '\u8bf7\u5148\u8f93\u5165\u8d26\u53f7'}
                </Text>
              </View>
              <Field
                label={'\u5bc6\u4fdd\u7b54\u6848'}
                onChangeText={(value) => updateForm('securityAnswer', value)}
                placeholder={'\u8bf7\u8f93\u5165\u5bc6\u4fdd\u7b54\u6848'}
                value={form.securityAnswer}
              />
            </View>
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
  verifyTabs: {
    flexDirection: 'row',
    gap: 8,
  },
  verifyTabButton: {
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderColor: '#d1d5db',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 44,
  },
  activeVerifyTabButton: {
    backgroundColor: '#ea580c',
    borderColor: '#ea580c',
  },
  verifyTabText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '800',
  },
  activeVerifyTabText: {
    color: '#ffffff',
  },
  securityQuestionBox: {
    backgroundColor: '#fff7ed',
    borderColor: '#fed7aa',
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 46,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  securityQuestionText: {
    color: '#9a3412',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 20,
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
