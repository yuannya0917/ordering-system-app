import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import AuthLayout from './AuthLayout';
import copy from './authCopy';
import styles from './authStyles';
import Field from './Field';

const initialForm = {
  account: '',
  password: '',
};

export default function LoginPage({ navigation }) {
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
      hideTabs
      navigation={navigation}
      subtitle={copy.loginSubtitle}
    >
      <View style={styles.form}>
        <Text style={styles.formTitle}>{copy.loginTitle}</Text>
        <Field
          label={copy.account}
          onChangeText={(value) => updateForm('account', value)}
          placeholder={copy.accountPlaceholder}
          value={form.account}
        />
        <Field
          label={copy.password}
          onChangeText={(value) => updateForm('password', value)}
          placeholder={copy.passwordPlaceholder}
          secureTextEntry
          value={form.password}
        />
        <View style={styles.loginLinkRow}>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => navigation.navigate('Register')}
            style={styles.inlineLinkButton}
          >
            <Text style={styles.linkText}>{copy.register}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.inlineLinkButton}
          >
            <Text style={styles.linkText}>{'\u5fd8\u8bb0\u5bc6\u7801'}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate('RoleSelect')}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>{copy.login}</Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
}
