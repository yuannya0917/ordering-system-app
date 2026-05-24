import { useCallback, useEffect, useState } from 'react';
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

import { getUserInfo, updateUserInfo } from '../api/user-center/inde';
import { useAuth } from '../contexts/AuthContext';

const TOP_BAR_PADDING_TOP = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 6 : 0;
const TOP_BAR_MIN_HEIGHT = 58 + TOP_BAR_PADDING_TOP;

export default function EditProfilePage({ navigation }) {
  const { userId } = useAuth();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadProfile = useCallback(async () => {
    if (!userId) {
      setError('\u5f53\u524d\u7528\u6237\u4fe1\u606f\u4e0d\u5b8c\u6574');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await getUserInfo({
        userId,
        currentUserId: userId,
      });

      if (res.code && res.code !== 0 && res.code !== 200) {
        setError(res.message || res.msg || '\u83b7\u53d6\u4e2a\u4eba\u4fe1\u606f\u5931\u8d25');
        return;
      }

      setUsername(res.data?.username || '');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : '\u83b7\u53d6\u4e2a\u4eba\u4fe1\u606f\u5931\u8d25');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSave = async () => {
    const nextUsername = username.trim();
    if (!userId) {
      setError('\u5f53\u524d\u7528\u6237\u4fe1\u606f\u4e0d\u5b8c\u6574');
      return;
    }

    if (!nextUsername) {
      setError('\u8bf7\u8f93\u5165\u7528\u6237\u540d');
      return;
    }

    try {
      setSaving(true);
      setError('');
      const res = await updateUserInfo({
        userId,
        username: nextUsername,
      });

      if (res.code && res.code !== 0 && res.code !== 200) {
        setError(res.message || res.msg || '\u4fee\u6539\u4e2a\u4eba\u4fe1\u606f\u5931\u8d25');
        return;
      }

      navigation.goBack();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : '\u4fee\u6539\u4e2a\u4eba\u4fe1\u606f\u5931\u8d25');
    } finally {
      setSaving(false);
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
        <Text style={styles.topBarTitle}>{'\u4fee\u6539\u4e2a\u4eba\u4fe1\u606f'}</Text>
        <View style={styles.topBarButton} />
      </View>

      <View style={styles.content}>
        <View style={styles.formPanel}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>{'UID'}</Text>
            <View style={styles.readonlyBox}>
              <Text style={styles.readonlyText}>{userId || '\u672a\u77e5\u7528\u6237'}</Text>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>{'\u7528\u6237\u540d'}</Text>
            <TextInput
              autoCorrect={false}
              editable={!loading && !saving}
              onChangeText={setUsername}
              placeholder={'\u8bf7\u8f93\u5165\u7528\u6237\u540d'}
              placeholderTextColor="#9ca3af"
              style={styles.input}
              value={username}
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            activeOpacity={0.85}
            disabled={loading || saving}
            onPress={handleSave}
            style={[styles.primaryButton, (loading || saving) && styles.disabledButton]}
          >
            <Text style={styles.primaryButtonText}>
              {saving ? '\u4fdd\u5b58\u4e2d...' : loading ? '\u52a0\u8f7d\u4e2d...' : '\u4fdd\u5b58'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
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
  label: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '800',
  },
  readonlyBox: {
    backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db',
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: 14,
  },
  readonlyText: {
    color: '#6b7280',
    fontSize: 16,
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
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '700',
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
  disabledButton: {
    opacity: 0.65,
  },
});
