import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Alert,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadPhoto, deletePhoto } from '../services/firebaseService';

export default function PhotoCapture({ photos = [], onChange, orderId }) {
    const [uploading, setUploading] = useState(false);

    const requestPermissions = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar a câmera');
            return false;
        }
        return true;
    };

    const takePhoto = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        try {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                await handlePhotoUpload(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error taking photo:', error);
            Alert.alert('Erro', 'Não foi possível tirar a foto');
        }
    };

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsMultipleSelection: true,
                quality: 0.8,
            });

            if (!result.canceled && result.assets.length > 0) {
                for (const asset of result.assets) {
                    await handlePhotoUpload(asset.uri);
                }
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Erro', 'Não foi possível selecionar a imagem');
        }
    };

    const handlePhotoUpload = async (uri) => {
        if (!orderId) {
            // Se não tem orderId, apenas adiciona localmente
            const newPhotos = [...photos, { uri, uploading: false }];
            onChange(newPhotos);
            return;
        }

        setUploading(true);
        try {
            const photoData = await uploadPhoto(uri, orderId);
            const newPhotos = [...photos, photoData];
            onChange(newPhotos);
        } catch (error) {
            console.error('Error uploading photo:', error);
            Alert.alert('Erro', 'Não foi possível fazer upload da foto');
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = async (index) => {
        const photo = photos[index];

        Alert.alert(
            'Excluir Foto',
            'Tem certeza que deseja excluir esta foto?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            if (photo.path) {
                                await deletePhoto(photo.path);
                            }
                            const updatedPhotos = photos.filter((_, i) => i !== index);
                            onChange(updatedPhotos);
                        } catch (error) {
                            Alert.alert('Erro', 'Não foi possível excluir a foto');
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.cameraButton]}
                    onPress={takePhoto}
                    disabled={uploading}
                >
                    <Text style={styles.buttonText}>📷 Tirar Foto</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.galleryButton]}
                    onPress={pickImage}
                    disabled={uploading}
                >
                    <Text style={styles.buttonText}>🖼️ Galeria</Text>
                </TouchableOpacity>
            </View>

            {uploading && (
                <View style={styles.uploadingContainer}>
                    <ActivityIndicator size="small" color="#2563eb" />
                    <Text style={styles.uploadingText}>Enviando foto...</Text>
                </View>
            )}

            {photos.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosContainer}>
                    {photos.map((photo, index) => (
                        <View key={index} style={styles.photoWrapper}>
                            <Image
                                source={{ uri: photo.url || photo.uri }}
                                style={styles.photo}
                            />
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => handleRemove(index)}
                            >
                                <Text style={styles.deleteButtonText}>✕</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 12,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    button: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cameraButton: {
        backgroundColor: '#2563eb',
    },
    galleryButton: {
        backgroundColor: '#6b7280',
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: '600',
    },
    uploadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        backgroundColor: '#eff6ff',
        borderRadius: 8,
        marginBottom: 12,
    },
    uploadingText: {
        marginLeft: 8,
        color: '#2563eb',
    },
    photosContainer: {
        marginTop: 8,
    },
    photoWrapper: {
        position: 'relative',
        marginRight: 12,
    },
    photo: {
        width: 120,
        height: 120,
        borderRadius: 8,
    },
    deleteButton: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: '#ef4444',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
