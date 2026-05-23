import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import AuthLayout from './AuthLayout';
import copy from './authCopy';
import styles from './authStyles';
import Field from './Field';

const initialForm = {
  account: '',
  securityQuestion: '',
  securityAnswer: '',
  newPassword: '',
  confirmPassword: '',
};

export default function ForgotPasswordPage({ navigation }) {
  const [form, setForm] = useState(initialForm);

  const updateForm = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
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
        <TouchableOpacity activeOpacity={0.9} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>{'\u786e\u8ba4\u91cd\u7f6e'}</Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
}
