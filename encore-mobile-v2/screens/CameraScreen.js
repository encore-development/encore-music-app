import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');

export default function CameraScreen({ onClose, onCapture, onMediaCaptured }) {
  const insets = useSafeAreaInsets();
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [9, 16],
        quality: 0.8,
      });

      if (!result.canceled) {
        const media = { ...result.assets[0], type: 'image' };
        if (onMediaCaptured) {
          onMediaCaptured(media);
        } else if (onCapture) {
          onCapture(media);
        }
        onClose();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take picture');
      console.error('Camera error:', error);
    }
  };

  const recordVideo = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'videos',
        allowsEditing: true,
        aspect: [9, 16],
        quality: 1.0,
        videoMaxDuration: 60,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const media = { ...result.assets[0], type: 'video' };
        if (onMediaCaptured) {
          onMediaCaptured(media);
        } else if (onCapture) {
          onCapture(media);
        }
        onClose();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to record video. Please try again.');
      console.error('Video recording error:', error);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-outline" size={64} color="#666" />
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionText}>
          Please enable camera access in your device settings to create posts.
        </Text>
        <TouchableOpacity style={styles.settingsButton} onPress={onClose}>
          <Text style={styles.settingsButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Camera Interface */}
      <LinearGradient
        colors={['#000', '#111', '#000']}
        style={styles.cameraInterface}
      >
        {/* Top Controls */}
        <View style={[styles.topControls, { paddingTop: insets.top }]}>
          <TouchableOpacity style={styles.controlButton} onPress={onClose}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
          
          <Text style={styles.cameraTitle}>Create Content</Text>
          
          <View style={styles.placeholder} />
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>What would you like to create?</Text>
            <Text style={styles.subtitle}>Choose your content type</Text>
          </View>

          {/* Action Cards */}
          <View style={styles.actionCards}>
            {/* Photo Card */}
            <TouchableOpacity style={styles.actionCard} onPress={takePicture}>
              <View style={styles.cardIcon}>
                <Ionicons name="camera" size={32} color="#10b981" />
              </View>
              <Text style={styles.cardTitle}>Photo</Text>
              <Text style={styles.cardDescription}>Take a picture to share</Text>
            </TouchableOpacity>

            {/* Video Card */}
            <TouchableOpacity style={styles.actionCard} onPress={recordVideo}>
              <View style={styles.cardIcon}>
                <Ionicons name="videocam" size={32} color="#ff4757" />
              </View>
              <Text style={styles.cardTitle}>Video</Text>
              <Text style={styles.cardDescription}>Record up to 60 seconds</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickAction}>
              <Ionicons name="images-outline" size={24} color="#666" />
              <Text style={styles.quickActionText}>Choose from Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraInterface: {
    flex: 1,
    justifyContent: 'space-between',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  permissionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  permissionText: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  settingsButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  settingsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  cameraTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 44,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 50,
  },
  mainTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
  },
  actionCards: {
    gap: 20,
    marginBottom: 40,
  },
  actionCard: {
    backgroundColor: '#111',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222',
  },
  cardIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#333',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardDescription: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
  },
  quickActions: {
    alignItems: 'center',
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#0a0a0a',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#333',
  },
  quickActionText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,0,0,0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginBottom: 20,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  recordingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 60,
    marginBottom: 30,
  },
  mediaButton: {
    alignItems: 'center',
    gap: 12,
  },
  photoButtonInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  videoButtonInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ff4757',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#ff4757',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSubtitle: {
    color: '#999',
    fontSize: 12,
    fontWeight: '400',
  },
  additionalOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
  },
  optionButton: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  optionText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '500',
  },
});