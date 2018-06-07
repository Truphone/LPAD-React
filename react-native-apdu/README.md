
# react-native-apdu

## Getting started

`$ npm install react-native-apdu --save`

### Mostly automatic installation

`$ react-native link react-native-apdu`

### Manual installation


#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.truphone.apdu.RNApduPackage;` to the imports at the top of the file
  - Add `new RNApduPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-apdu'
  	project(':react-native-apdu').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-apdu/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-apdu')
  	```


## Usage
```javascript
import RNApdu from 'react-native-apdu';

RNApdu;
```
  