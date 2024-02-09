module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          components: './src/components',
          screens: './src/screens',
          assets: './src/assets',
          constants: './src/constants',
          locatorId: './store/utils/locatorId',
        },
      },
    ],
  ],
};
