
# Gemini

## Getting started

`$ npm install`

1. For each dependency `cd` to the checkout directory and run

`$ npm link`

2. Then cd to this project directory and do

`$ npm link react-native-apdu`

`$ npm link react-native-rsp-es29`

3. Then

`$ react-native link`

Sometimes it doesn't work as expected and you have to link manually
`$ react-native link <module-name>` for each dependency


4. Ensure you have the following lines in your `~/.gradle/gradle.properties`

```
LPA_RELEASE_STORE_FILE=
LPA_RELEASE_STORE_PASSWORD=
LPA_RELEASE_KEY_ALIAS=
LPA_RELEASE_KEY_PASSWORD=
```

with correct values for the keystore file

## Troubleshooting

If you're getting an error about layout-contstraint+ dependency - open Downloads in Android Studio -> SDK Tools and install ConstraintLayout for Android and Solver for ConstraintLayout (https://stackoverflow.com/questions/37992187/gradle-sync-failed-could-not-find-constraint-layout1-0-0-alpha2)

If you're getting weird build errors - try opening gemini/android folder as a project in Android Studio and do Gradle Sync - usually it fixes some problems with split apks.

## Usage

`$ react-native run-android`

## To prepare build

`$ react-native run-android --variant=release`


## Dependencies

### react-native-card-io

This is react-native wrapper for card.io Android SDK (https://github.com/card-io/card.io-Android-SDK). 
It provides ```scanCard()``` method. And can be used as follows:

```
let result = cardio.scanCard().then((result) =>
      {
        let form = {
          cardholder: result.cardholderName,
          cardnumber: result.redactedCardNumber,
          month:  '' + result.expiryYear,
          year: '' + result.expiryMonth,
          cvv: result.cvv
        };
        console.log(form);
      }).catch((error) => .log(error));
```

### react-native-smart-sdk

This is a React Native wrapper around Idcheck SmartSdk https://www.idcheck.io/offer/solutions/developers/.
It provides ```initSdk()``` and ```startSdk()``` methods. Could be used as follows:

```
componentDidMount() {
    smartsdk.initSdk("licence");
}

smartsdk.startSdk()
          .then((result) => {this.onSuccess(result)})
          .catch((error) => {this.onFailure(error)});
```

Check the logs for the returned object fields.

### react-native-apdu

This module uses TelephoneManager API to send APDU commands to the SIM card. Has following native methods:

```
openChannel(String AID, Promise promise)

closeChannel(int channel, Promise promise)

sendCommandLogic(int channel, String command, Promise promise) 

sendCommandBasic(String command, Promise promise)

```

Also it has helper functions that allow to construct different APDU commands:

```
getEid() 

toTLV(tag, input)

authenticateServerApdu(smdpSigned1, smdpSignature1, euiccCiPKIdToBeUsed, cert, ctxParams1) 

prepareDownloadApdu(smdpSigned2, smdpSignature2, hashCc, cert) 

loadBoundProfilePackageApdu(data) 

listProfilesApdu() 

parseListProfiles(resp) // parses response from listProfile command

enableProfileApdu(profile_id, refresh)

disableProfileApdu(profile_id, refresh) 

deleteProfileApdu(profile_id)

resetCardMemoryApdu()

```

### react-native-rsp-es29

Native implementation of RSP ES2 and ES9 functions.

```

downloadOrder(String eid, String iccid, String msisdn, String profileType, Promise promise) 

confirmOrder(String iccid, String eid, String matchingId, String confirmationCode, String smdsAddress, Promise promise) 
  
initiateAuthentication(String euiccChallenge, String euiccInfo1, String smdpAddress, Promise promise) 
  
authenticateClient(String transactionId, String euiccSigned1, String euiccSignature1,
                                                   String euiccCertificate, String eumCertificate, Promise promise) 

cancelSession(String transactionId, String euiccCancelSessionSigned,
                              String euiccCancelSessionSignature) 
  
getBoundProfilePackage(String transactionId, String euiccSigned2, String euiccSignature2, Promise promise) 
  
handleNotification(String profileInstallationResultData, String euiccSignPIR) 

```
