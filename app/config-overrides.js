/* config-overrides.js */
const path = require("path");
const appSrc = path.resolve(__dirname, "src");

module.exports = function override (config, env) {
  //do stuff with the webpack config...
  const isEnvDevelopment = env === "development";
  const isEnvProduction = env === "production";
  /**
   * 分支拆解
   * @param {{production: *,development: *}}conf
   * @returns {*}
   */
  const branch = (conf) => {
    if (isEnvProduction) return conf.production;
    if (isEnvDevelopment) return conf.development;
  };
  config.devtool = branch({
    production: false,
    development: "eval-source-map"
  });
  config.output.devtoolModuleFilenameTemplate = branch({
    production: info => path.relative(appSrc, info.absoluteResourcePath).replace(/\\/g, "/"),
    development: info => "webpack://source/" + path.relative(appSrc, info.absoluteResourcePath).replace(/\\/g, "/").replace(/\.jsx/, ".js?x")
  });
  config.output.filename = branch({
    production: `static/js/[name].[contenthash:8].js`,
    development: `static/js/[name].js`
  });
  config.output.chunkFilename = branch({
    production: `static/js/[name].[contenthash:8].js`,
    development: `static/js/[name].js`
  });
  config.resolve.alias.src = appSrc;
  const oneOfRules = config.module.rules[1].oneOf;
  oneOfRules.forEach(rule => {
    if (rule.test instanceof RegExp && rule.test.test("x.module.sass")) {
      rule.test = /\.module\.less$/;
      rule.use[rule.use.length - 1].loader = require.resolve("less-loader");
    } else if (rule.test instanceof RegExp && rule.test.test("x.sass")) {
      rule.test = /\.less$/;
      rule.exclude = /\.module\.less$/;
      rule.use[rule.use.length - 1].loader = require.resolve("less-loader");
    }
  });
  return config;
};
