
# react-native-rsp-es29

## Getting started

`$ npm install react-native-rsp-es29 --save`

### Mostly automatic installation

`$ react-native link react-native-rsp-es29`

### Manual installation

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.truphone.rspes29.RNRspEs29Package;` to the imports at the top of the file
  - Add `new RNRspEs29Package()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-rsp-es29'
  	project(':react-native-rsp-es29').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-rsp-es29/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-rsp-es29')
  	```

## Usage
```javascript
import RNRspEs29 from 'react-native-rsp-es29';

RNRspEs29;
```
  