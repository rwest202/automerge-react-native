# Automerge React Native Test (iOS)

`react-native-webassembly` fails on Expo Go app, running on iOS directly.

To run:
```bash
npm i
# Replace `/node_modules/react-native-webassembly/react-native-webassembly.podspec` with `replace.podspec`
npx expo prebuild --platform ios
cd ios
pod install
cd ..
npx expo run:ios
```

I attempted to install automerge into a base React Native project. The call to WebAssembly.initialize is made, but unhelpfully fails with `Error: Failed to instantiate WebAssembly.`

The import happens in `/app/(tabs)/write.tsx`
- import `crypto.getRandomValues` polyfill, unsure if this is needed.
- import `WebAssembly` from `react-native-webassembly`.
- Apply to global object, I was able to confirm from logging that it was used from `initializeWasm`
- Call `initializeWasm` with the result of a fetch and... fails. I get the same error when I import wasm directly so this issue seems to be in the actual loading of the module.

```TypeScript
import "react-native-get-random-values";

import * as WebAssembly from "react-native-webassembly";

import { initializeWasm } from "@automerge/automerge/slim";

if (!global.WebAssembly) {
  global.WebAssembly = WebAssembly;
}

initializeWasm(
  fetch("https://esm.sh/@automerge/automerge@3.1.2/dist/automerge.wasm")
    .then((resp) => resp.arrayBuffer())
    .then((data) => new Uint8Array(data))
);
```

metro.config.js - This was required to fix import errors.
```TypeScript
const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const { resolver } = config;

  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.concat(["wasm"]),
    resolveRequest: (context, moduleName, platform) => {
      if (moduleName.includes("automerge")) {
        const result = require.resolve(moduleName); // gets CommonJS version
        return context.resolveRequest(context, result, platform);
      }
      // otherwise chain to the standard Metro resolver.
      return context.resolveRequest(context, moduleName, platform);
    },
  };

  return config;
})();

```

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
