import { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const initialForm = {
  account: '',
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export default function ChangePasswordPage({ navigation }) {
  const [form, setForm] = useState(initialForm);

  const updateForm = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
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
          <TouchableOpacity activeOpacity={0.85} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>{'\u786e\u8ba4\u4fee\u6539'}</Text>
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
    backgroundColor: '#f7f8f3',
    flex: 1,
  },
  topBar: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomColor: '#e5e7eb',
    borderBottomWidth: 1,
    flexDirection: 'row',
    minHeight: 58,
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
    backgroundColor: '#0f766e',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 52,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '900',
  },
});
