import { useState, useRef } from 'react';
import { sipService } from '../services/sipService';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';

export function useCall() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isCalling, setIsCalling] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const recordingRef = useRef<Audio.Recording | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleDial = (num: string) => {
    if (phoneNumber.length < 15) {
      setPhoneNumber(prev => prev + num);
    }
  };

  const handleDelete = () => {
    setPhoneNumber(prev => prev.slice(0, -1));
  };

  const startRecording = async () => {
    try {
      if (Platform.OS !== 'web') {
        const { granted } = await Audio.requestPermissionsAsync();
        if (!granted) return;

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
            Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        recordingRef.current = recording;
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecordingAndUpload = async () => {
    try {
      if (recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync();
        const uri = recordingRef.current.getURI();
        recordingRef.current = null;
        console.log('Recording stopped and stored at', uri);

        // TODO: Send to Backend mapping to task 2.3
        if (uri) {
           uploadAudioToServer(uri);
        }
      }
    } catch (error) {
       console.error('Failed to stop recording', error);
    }
  };

  const uploadAudioToServer = async (fileUri: string) => {
    try {
        console.log('Uploading audio to backend server (S3 mock)...');
        const formData = new FormData();
        // Append file...
        const fileExt = Platform.OS === 'ios' ? 'm4a' : 'caf';
        formData.append('audioFile', {
             uri: fileUri,
             type: 'audio/' + fileExt,
             name: `call-record-${Date.now()}.${fileExt}`
        } as any);
        
        // Example push to our AI ENGINE backend later (FastAPI)
        // const response = await fetch('http://localhost:8000/api/analyze-audio', {
        //    method: 'POST',
        //    body: formData,
        //    headers: { 'Content-Type': 'multipart/form-data' }
        // });
        // const result = await response.json();
    } catch (e) {
        console.error('Upload error', e);
    }
  };

  const makeCall = async () => {
    if (!phoneNumber) return;

    try {
      setIsCalling(true);
      // Ensure connected to SIP PBX beforehand in a real app or connect dynamically here:
      // await sipService.connect('sip.provider.com', 'user_extension', 'password');

      await sipService.makeCall(
        phoneNumber, 
        'sip.provider.com',
        async () => {
            // Call Connected
            setIsConnected(true);
            timerRef.current = setInterval(() => setCallDuration(p => p + 1), 1000);
            
            // Start recording audio for Backend
            await startRecording();
        },
        async () => {
            // Call Disconnected
            await terminateCall();
        }
      );
    } catch (e) {
      console.error(e);
      await terminateCall();
    }
  };

  const hangUp = async () => {
    await sipService.hangup();
    await terminateCall();
  };

  const terminateCall = async () => {
    setIsCalling(false);
    setIsConnected(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setCallDuration(0);
    await stopRecordingAndUpload();
  };

  return {
    phoneNumber,
    setPhoneNumber,
    isCalling,
    isConnected,
    callDuration,
    handleDial,
    handleDelete,
    makeCall,
    hangUp
  };
}
