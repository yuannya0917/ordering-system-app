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
  securityQuestion: '',
  securityAnswer: '',
};

export default function AccountCancelPage({ navigation }) {
  const [form, setForm] = useState(initialForm);
  const [riskChecked, setRiskChecked] = useState(false);

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
          <Field
            label={'\u5bc6\u4fdd\u95ee\u9898'}
            onChangeText={(value) => updateForm('securityQuestion', value)}
            placeholder={'\u8bf7\u8f93\u5165\u5bc6\u4fdd\u95ee\u9898'}
            value={form.securityQuestion}
          />
          <Field
            label={'\u5bc6\u4fdd\u7b54\u6848'}
            onChangeText={(value) => updateForm('securityAnswer', value)}
            placeholder={'\u8bf7\u8f93\u5165\u5bc6\u4fdd\u7b54\u6848'}
            value={form.securityAnswer}
          />
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={!riskChecked}
            style={[
              styles.dangerButton,
              !riskChecked && styles.disabledDangerButton,
            ]}
          >
            <Text style={styles.dangerButtonText}>{'\u786e\u8ba4\u6ce8\u9500\u8d26\u53f7'}</Text>
          </TouchableOpacity>
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
});
