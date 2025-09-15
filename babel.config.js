module.exports = function (api) {
  api.cache(true);
  return {
    // Expo SDK 50+ uses this preset (includes expo-router automatically)
    presets: ['babel-preset-expo'],
    // Reanimated moved its plugin here:
    plugins: ['react-native-worklets/plugin'],
  };
};
