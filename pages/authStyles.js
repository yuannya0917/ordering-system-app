import { Platform, StatusBar, StyleSheet } from 'react-native';

const TOP_BAR_PADDING_TOP = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 6 : 0;
const TOP_BAR_MIN_HEIGHT = 58 + TOP_BAR_PADDING_TOP;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff7ed',
  },
  authTopBar: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: TOP_BAR_MIN_HEIGHT,
    paddingTop: TOP_BAR_PADDING_TOP,
    paddingHorizontal: 16,
  },
  authTopBarButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
    minWidth: 50,
  },
  authTopBarTitleSpace: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingVertical: 32,
  },
  header: {
    marginBottom: 28,
  },
  brand: {
    color: '#1f2937',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 0,
  },
  subtitle: {
    color: '#6b7280',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  formPanel: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 18,
    shadowColor: '#111827',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 5,
  },
  tabs: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    flexDirection: 'row',
    marginBottom: 24,
    padding: 4,
  },
  tabButton: {
    alignItems: 'center',
    borderRadius: 6,
    flex: 1,
    justifyContent: 'center',
    minHeight: 44,
  },
  activeTabButton: {
    backgroundColor: '#ffffff',
    shadowColor: '#111827',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  tabText: {
    color: '#6b7280',
    fontSize: 15,
    fontWeight: '700',
  },
  activeTabText: {
    color: '#ea580c',
  },
  form: {
    gap: 16,
  },
  formTitle: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '800',
  },
  formTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  centerFormTitle: {
    flex: 1,
    textAlign: 'center',
  },
  formTitleSideButton: {
    justifyContent: 'center',
    minHeight: 36,
    width: 52,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '700',
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
    backgroundColor: '#ea580c',
    borderRadius: 8,
    justifyContent: 'center',
    marginTop: 4,
    minHeight: 52,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
  },
  linkButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  loginLinkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inlineLinkButton: {
    justifyContent: 'center',
    minHeight: 36,
  },
  linkText: {
    color: '#ea580c',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default styles;
