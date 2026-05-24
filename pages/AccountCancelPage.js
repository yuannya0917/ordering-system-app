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

import { deleteAccount } from '../api/account-cancel';
import { useAuth } from '../contexts/AuthContext';

const TOP_BAR_PADDING_TOP = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 6 : 0;
const TOP_BAR_MIN_HEIGHT = 58 + TOP_BAR_PADDING_TOP;
const initialForm = {
  account: '',
};

export default function AccountCancelPage({ navigation }) {
  const { clearCurrentUser, userId } = useAuth();
  const [form, setForm] = useState({
    ...initialForm,
    account: userId,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [riskChecked, setRiskChecked] = useState(false);

  const updateForm = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleDeleteAccount = async () => {
    if (!form.account) {
      setError('\u8bf7\u8f93\u5165\u8d26\u53f7');
      return;
    }

    if (!riskChecked) {
      setError('\u8bf7\u5148\u786e\u8ba4\u6ce8\u9500\u98ce\u9669');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await deleteAccount({
        userId: form.account,
        currentUserId: userId,
      });
      clearCurrentUser();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : '\u6ce8\u9500\u8d26\u53f7\u5931\u8d25');
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
        <Text style={styles.topBarTitle}>{'\u6ce8\u9500\u8d26\u53f7'}</Text>
        <View style={styles.topBarButton} />
      </View>

      <View style={styles.content}>
        <View style={styles.formPanel}>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => setRiskChecked((current) => !current)}
            style={styles.checkboxRow}
          >
            <View style={[styles.checkbox, riskChecked && styles.checkedBox]}>
              {riskChecked && <Text style={styles.checkText}>{'\u2713'}</Text>}
            </View>
            <Text style={styles.riskText}>
              {'\u786e\u8ba4\u8d26\u53f7\u6ce8\u9500\u6240\u6709\u98ce\u9669\uff0c\u786e\u8ba4\u6ce8\u9500'}
            </Text>
          </TouchableOpacity>

          <Field
            label={'\u8d26\u53f7'}
            onChangeText={(value) => updateForm('account', value)}
            placeholder={'\u8bf7\u8f93\u5165\u8d26\u53f7'}
            value={form.account}
          />
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={!riskChecked || loading}
            onPress={handleDeleteAccount}
            style={[
              styles.dangerButton,
              (!riskChecked || loading) && styles.disabledDangerButton,
            ]}
          >
            <Text style={styles.dangerButtonText}>
              {loading ? '\u6ce8\u9500\u4e2d...' : '\u786e\u8ba4\u6ce8\u9500\u8d26\u53f7'}
            </Text>
          </TouchableOpacity>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

function Field({ label, onChangeText, placeholder, value }) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        style={styles.input}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#f7f8f3',
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
    color: '#0f766e',
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
  checkboxRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 10,
  },
  checkbox: {
    alignItems: 'center',
    borderColor: '#d1d5db',
    borderRadius: 5,
    borderWidth: 1,
    height: 22,
    justifyContent: 'center',
    marginTop: 1,
    width: 22,
  },
  checkedBox: {
    backgroundColor: '#dc2626',
    borderColor: '#dc2626',
  },
  checkText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
    lineHeight: 18,
  },
  riskText: {
    color: '#991b1b',
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 20,
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
  dangerButton: {
    alignItems: 'center',
    backgroundColor: '#dc2626',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 52,
  },
  disabledDangerButton: {
    backgroundColor: '#fca5a5',
  },
  dangerButtonText: {
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
