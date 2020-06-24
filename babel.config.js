const presets = [
  [
    "@babel/env",
    {
      targets: { // Last update: 2019-11-15
        edge: "17",
        firefox: "70",
        chrome: "77",
        safari: "13",
        ie: "11",
      },
      useBuiltIns: "usage",
      corejs: "3",
    },
  ],
];

module.exports = {
  presets,
  plugins: [
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator',
  ],
};


