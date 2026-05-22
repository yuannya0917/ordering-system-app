import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import AuthLayout from './AuthLayout';
import copy from './authCopy';
import styles from './authStyles';
import Field from './Field';

const initialForm = {
  account: '',
  password: '',
  securityQuestion: '',
  securityAnswer: '',
};

export default function RegisterPage({ navigation }) {
  const [form, setForm] = useState(initialForm);

  const updateForm = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  return (
    <AuthLayout
      activeRoute="Register"
      navigation={navigation}
      subtitle={copy.registerSubtitle}
    >
      <View style={styles.form}>
        <Text style={styles.formTitle}>{copy.registerTitle}</Text>
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
        <TouchableOpacity activeOpacity={0.9} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>{copy.register}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => navigation.navigate('Login')}
          style={styles.linkButton}
        >
          <Text style={styles.linkText}>{copy.goLogin}</Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
}
