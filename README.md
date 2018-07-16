# PlayKit JS KAnalytics - Kaltura Analytics plugin for the [PlayKit JS Player]

[![Build Status](https://travis-ci.org/kaltura/playkit-js-kanalytics.svg?branch=master)](https://travis-ci.org/kaltura/playkit-js-kanalytics)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

PlayKit JS KAnalytics plugin integrates Kaltura analytics with the [PlayKit JS Player].

PlayKit JS KAnalytics is written in [ECMAScript6], statically analysed using [Flow] and transpiled in ECMAScript5 using [Babel].

More info about Kaltura Analytics:

- [Video-Analytics]
- [Creating and tracking analytics KMC]

[video-analytics]: https://corp.kaltura.com/Products/Features/Video-Analytics
[creating and tracking analytics kmc]: https://knowledge.kaltura.com/creating-and-tracking-analytics-kmc-0
[flow]: https://flow.org/
[ecmascript6]: https://github.com/ericdouglas/ES6-Learning#articles--tutorials
[babel]: https://babeljs.io

## Getting Started

### Prerequisites

The plugin requires [PlayKit JS Player] to be loaded first.

[playkit js player]: https://github.com/kaltura/playkit-js

### Installing

First, clone and run [yarn] to install dependencies:

[yarn]: https://yarnpkg.com/lang/en/

```
git clone https://github.com/kaltura/playkit-js-kanalytics.git
cd playkit-js-kanalytics
yarn install
```

### Building

Then, build the player

```javascript
yarn run build
```

### Embed the library in your test page

Finally, add the bundle as a script tag in your page, and initialize the player

```html
<script type="text/javascript" src="/PATH/TO/FILE/playkit.js"></script>
<script type="text/javascript" src="/PATH/TO/FILE/playkit-kanalytics.js"></script>
<div id="player-placeholder" style="height:360px; width:640px">
<script type="text/javascript">
var playerContainer = document.querySelector("#player-placeholder");
var config = {
 ...
 plugins: {
   kanalytics: {
     serviceUrl: 'http://stats.kaltura.com/api_v3/index.php'
   }
 }
 ...
};
var player = playkit.core.loadPlayer(config);
playerContainer.appendChild(player.getView());
player.play();
</script>
```

## Configuration

| Settings   | Type   | Required           | Description                |
| ---------- | ------ | ------------------ | -------------------------- |
| serviceUrl | string | :white_check_mark: | The Kaltura API server url |

## Running the tests

Tests can be run locally via [Karma], which will run on Chrome, Firefox and Safari

[karma]: https://karma-runner.github.io/1.0/index.html

```
yarn run test
```

You can test individual browsers:

```
yarn run test:chrome
yarn run test:firefox
yarn run test:safari
```

### And coding style tests

We use ESLint [recommended set](http://eslint.org/docs/rules/) with some additions for enforcing [Flow] types and other rules.

See [ESLint config](.eslintrc.json) for full configuration.

We also use [.editorconfig](.editorconfig) to maintain consistent coding styles and settings, please make sure you comply with the styling.

## Compatibility

TBD

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/kaltura/playkit-js-kanalytics/tags).

## License

This project is licensed under the AGPL-3.0 License - see the [LICENSE.md](LICENSE.md) file for details
