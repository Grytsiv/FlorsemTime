module.exports = {
  preset: 'react-native',
  setupFiles: ['./jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(|@react-native|react-native|@react-navigation|react-redux|@reduxjs|immer|react-native-paper|react-native-vector-icons|@sentry|redux-flipper|react-native-flipper|react-native-gesture-handler|react-native-reanimated|react-native-screens|react-native-drawer-layout|react-native-safe-area-context)/)',
  ],
};
