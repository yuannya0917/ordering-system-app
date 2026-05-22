import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import copy from './authCopy';
import styles from './authStyles';

export default function AuthLayout({
  activeRoute,
  children,
  navigation,
  subtitle,
}) {
  const isLogin = activeRoute === 'Login';

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.brand}>{copy.appName}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>

          <View style={styles.formPanel}>
            <View style={styles.tabs}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => navigation.navigate('Login')}
                style={[styles.tabButton, isLogin && styles.activeTabButton]}
              >
                <Text style={[styles.tabText, isLogin && styles.activeTabText]}>
                  {copy.login}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => navigation.navigate('Register')}
                style={[styles.tabButton, !isLogin && styles.activeTabButton]}
              >
                <Text style={[styles.tabText, !isLogin && styles.activeTabText]}>
                  {copy.register}
                </Text>
              </TouchableOpacity>
            </View>
            {children}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
