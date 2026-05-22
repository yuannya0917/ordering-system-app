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
        <TouchableOpacity activeOpacity={0.9} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>{copy.login}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => navigation.navigate('Register')}
          style={styles.linkButton}
        >
          <Text style={styles.linkText}>{copy.goRegister}</Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
}
