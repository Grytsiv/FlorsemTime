// 1. Mock Native Modules at the top
const RN = require('react-native');
RN.NativeModules.RNASafeAreaContext = {
  getConstants: () => ({
    initialWindowMetrics: {
      insets: { top: 0, left: 0, right: 0, bottom: 0 },
      frame: { x: 0, y: 0, width: 390, height: 844 },
    },
  }),
};

// 2.0 Final attempt at the Safe Area Context to make it bulletproof
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const insets = { top: 0, left: 0, right: 0, bottom: 0 };
  const frame = { x: 0, y: 0, width: 390, height: 844 };
  const metrics = { insets, frame };

  // Create proper contexts with Provider and Consumer
  const SafeAreaContext = React.createContext(metrics);
  const SafeAreaInsetsContext = React.createContext(insets);
  const SafeAreaFrameContext = React.createContext(frame);

  return {
    SafeAreaProvider: ({ children }) =>
      React.createElement(
        SafeAreaInsetsContext.Provider,
        { value: insets },
        React.createElement(SafeAreaFrameContext.Provider, { value: frame }, children)
      ),
    SafeAreaView: ({ children }) => children,
    useSafeAreaInsets: () => insets,
    useSafeAreaFrame: () => frame,
    SafeAreaContext: SafeAreaContext,
    SafeAreaInsetsContext: SafeAreaInsetsContext,
    SafeAreaFrameContext: SafeAreaFrameContext,
    initialWindowMetrics: metrics,
  };
});

// Mock react-native-device-info
jest.mock('react-native-device-info', () => {
  return {
    getUniqueId: jest.fn(() => 'mock-unique-id'),
    getManufacturer: jest.fn(() => 'mock-manufacturer'),
    // Add other methods if you use them in your code
  };
});

// Mock react-native-keychain
jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn(),
  getGenericPassword: jest.fn(),
  resetGenericPassword: jest.fn(),
}));

// Mock NetInfo (since you have it in package.json)
jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(),
  fetch: jest.fn(),
}));

// Mock react-native-localize
jest.mock('react-native-localize', () => ({
  getLocales: () => [
    { countryCode: 'US', languageTag: 'en-US', languageCode: 'en', isRTL: false },
  ],
  getNumberFormatSettings: () => ({
    decimalSeparator: '.',
    groupingSeparator: ',',
  }),
  getCalendar: () => 'gregorian',
  getCountry: () => 'US',
  getCurrencies: () => ['USD'],
  getTemperatureUnit: () => 'celsius',
  getTimeZone: () => 'America/New_York',
  uses24HourClock: () => false,
  usesMetricSystem: () => true,
  findBestAvailableLanguage: (languages) => ({
    languageTag: languages[0],
    isRTL: false,
  }),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

// Mock Sentry
jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  captureEvent: jest.fn(),
  addBreadcrumb: jest.fn(),
  setUser: jest.fn(),
  setTag: jest.fn(),
  setExtra: jest.fn(),
  setContext: jest.fn(),
  wrap: (c) => c,
}));

// Mock redux-flipper to return a proper Redux middleware
jest.mock('redux-flipper', () => {
  const mockMiddleware = () => (next) => (action) => {
    return next(action);
  };
  return {
    __esModule: true,
    default: () => mockMiddleware,
  };
});

// Mock react-native-flipper (just in case it's imported elsewhere)
jest.mock('react-native-flipper', () => ({
  addPlugin: jest.fn(),
}));

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  return {
    State: {},
    PanGestureHandler: 'PanGestureHandler',
    BaseButton: 'BaseButton',
    RectButton: 'RectButton',
    BorderlessButton: 'BorderlessButton',
    Directions: {},
  };
});

// Mock react-native-reanimated (Required by navigation)
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock react-native-screens (Required by navigation)
jest.mock('react-native-screens', () => ({
  enableScreens: jest.fn(),
  ScreenContainer: 'ScreenContainer',
  Screen: 'Screen',
  NativeScreen: 'NativeScreen',
  NativeScreenContainer: 'NativeScreenContainer',
  ScreenStack: 'ScreenStack',
  ScreenStackHeaderConfig: 'ScreenStackHeaderConfig',
  ScreenStackHeaderSubset: 'ScreenStackHeaderSubset',
  ScreenStackHeaderItem: 'ScreenStackHeaderItem',
  ScreenStackHeaderLeftView: 'ScreenStackHeaderLeftView',
  ScreenStackHeaderCenterView: 'ScreenStackHeaderCenterView',
  ScreenStackHeaderRightView: 'ScreenStackHeaderRightView',
  ScreenStackHeaderSearchBarView: 'ScreenStackHeaderSearchBarView',
  SearchBar: 'SearchBar',
  FullWindowOverlay: 'FullWindowOverlay',
}));

jest.mock('react-native-paper-dates', () => ({
  registerTranslation: jest.fn(),
  DatePickerModal: 'DatePickerModal',
  TimePickerModal: 'TimePickerModal',
}));

// A more aggressive mock for React Navigation Stack to bypass the 'top' error
jest.mock('@react-navigation/stack', () => {
  const React = require('react');
  return {
    createStackNavigator: jest.fn(() => ({
      Navigator: ({ children }) => <>{children}</>,
      Screen: ({ children }) => <>{children}</>,
    })),
    Header: () => null,
    StackView: ({ children }) => <>{children}</>,
    CardStack: () => null,
  };
});

// Mock the Drawer too, just in case
jest.mock('@react-navigation/drawer', () => {
  return {
    createDrawerNavigator: jest.fn(() => ({
      Navigator: ({ children }) => <>{children}</>,
      Screen: ({ children }) => <>{children}</>,
    })),
  };
});

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

// Add this to handle the NativeEventEmitter error specifically
RN.NativeModules.RNDeviceInfo = {
  uniqueId: 'mock-id',
};
