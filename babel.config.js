module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      "babel-preset-expo",
      // **MOVE nativewind/babel HERE**
      "nativewind/babel", 
    ],
    // The plugins array should now be empty or contain other specific plugins
    plugins: [],
  };
};