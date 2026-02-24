// Mock for antd and antd-style to reduce bundle size
// This project doesn't use antd directly, but @lobehub/icons has it as a dependency

export const useThemeMode = () => ({ themeMode: 'light', setThemeMode: () => {} });

export default {
  useThemeMode,
};
