import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Platform,
  Linking,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import Modal from 'react-native-modal';
import {RNCamera} from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import {
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';

function App() {
  const handleCameraPermission = async (handle) => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          handle(true);
        } else {
          Alert.alert(
            '카메라 권한 거절',
            '앱을 사용하기 위해서는 반드시 카메라 권한을 허용해야 합니다.\n 확인을 누르신 뒤 설정에서 카메라 권한을 켜십시오.',
            [
              {
                text: '취소',
                style: 'cancel',
              },
              {
                text: '확인',
                onPress: () => {
                  openSettings();
                },
              },
            ],
          );
        }
      } else {
        const permission = await request(PERMISSIONS.IOS.CAMERA);
        if (permission === RESULTS.GRANTED) {
          handle(true);
        } else {
          Alert.alert(
            '카메라 권한 거절',
            '앱을 사용하기 위해서는 반드시 카메라 권한을 허용해야 합니다.\n 확인을 누르신 뒤 설정에서 카메라 권한을 켜십시오.',
            [
              {
                text: '취소',
                style: 'cancel',
              },
              {
                text: '확인',
                onPress: () => {
                  Linking.openURL('app-settings:');
                },
              },
            ],
          );
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const [cameraModalOpen, setCameraModalOpen] = useState<boolean>(false);

  const handleBarCodeScanned = (codenumber) => {
    console.log(codenumber);
  };

  return (
    <>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity
          onPress={() => {
            console.log('Pressed');
            setCameraModalOpen(true);
          }}>
          <Text style={{fontSize: 24, color: 'red'}}>
            QR 복사방지 카메라 테스트
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        isVisible={cameraModalOpen}
        style={{margin: 0}}
        onBackdropPress={() => setCameraModalOpen(false)}
        onRequestClose={() => setCameraModalOpen(false)}>
        <RNCamera
          style={{flex: 1, alignItems: 'center'}}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.off}
          autoFocus={RNCamera.Constants.AutoFocus.on}
          captureAudio={false}
          onFacesDetected={() => {}}
          onFocusChanged={() => {}}
          onZoomChanged={() => {}}
          onBarCodeRead={({data}) => handleBarCodeScanned(data)}>
          <BarcodeMask
            width={300}
            height={300}
            outerMaskOpacity={0.8}
            edgeColor={'white'}
            edgeBorderWidth={2}
            showAnimatedLine={false}
          />
          <View
            style={{
              width: '100%',
              height: 60,
              position: 'absolute',
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'green',
            }}
            onPress={() => setCameraModalOpen(false)}>
            <Text
              style={{
                color: '#ffffff',
                fontSize: 14,
                textAlign: 'center',
                alignSelf: 'center',
              }}>
              닫기
            </Text>
          </View>
        </RNCamera>
      </Modal>
    </>
  );
}

export default App;
