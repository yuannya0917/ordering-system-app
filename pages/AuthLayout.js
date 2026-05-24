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
  backTarget,
  children,
  hideTabs,
  navigation,
  subtitle,
}) {
  const isLogin = activeRoute === 'Login';

  return (
    <SafeAreaView style={styles.safeArea}>
      {backTarget && (
        <View style={styles.authTopBar}>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => navigation.navigate(backTarget)}
            style={styles.authTopBarButton}
          >
            <Text style={styles.linkText}>{'\u8fd4\u56de'}</Text>
          </TouchableOpacity>
          <View style={styles.authTopBarTitleSpace} />
          <View style={styles.authTopBarButton} />
        </View>
      )}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
            {!hideTabs && (
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
            )}
            {children}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
