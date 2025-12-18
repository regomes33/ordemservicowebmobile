import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert
} from 'react-native';
import { createClient, updateClient } from '../services/firebaseService';

export default function ClientFormScreen({ route, navigation }) {
    const { client } = route.params || {};
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (client) {
            setFormData({
                name: client.name || '',
                phone: client.phone || '',
                email: client.email || '',
                address: client.address || '',
                notes: client.notes || ''
            });
        }
    }, [client]);

    const handleSubmit = async () => {
        if (!formData.name || !formData.phone) {
            Alert.alert('Erro', 'Nome e telefone são obrigatórios');
            return;
        }

        setLoading(true);
        try {
            if (client) {
                await updateClient(client.id, formData);
            } else {
                await createClient(formData);
            }
            navigation.goBack();
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível salvar o cliente');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>
                {client ? 'Editar Cliente' : 'Novo Cliente'}
            </Text>

            <View style={styles.form}>
                <Text style={styles.label}>Nome *</Text>
                <TextInput
                    style={styles.input}
                    value={formData.name}
                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                    placeholder="Nome do cliente"
                />

                <Text style={styles.label}>Telefone *</Text>
                <TextInput
                    style={styles.input}
                    value={formData.phone}
                    onChangeText={(text) => setFormData({ ...formData, phone: text })}
                    placeholder="(00) 00000-0000"
                    keyboardType="phone-pad"
                />

                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    value={formData.email}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                    placeholder="cliente@email.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <Text style={styles.label}>Endereço</Text>
                <TextInput
                    style={styles.input}
                    value={formData.address}
                    onChangeText={(text) => setFormData({ ...formData, address: text })}
                    placeholder="Rua, número, bairro, cidade"
                />

                <Text style={styles.label}>Observações</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={formData.notes}
                    onChangeText={(text) => setFormData({ ...formData, notes: text })}
                    placeholder="Informações adicionais"
                    multiline
                    numberOfLines={4}
                />

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, styles.cancelButton]}
                        onPress={() => navigation.goBack()}
                        disabled={loading}
                    >
                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.saveButton]}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        <Text style={styles.saveButtonText}>
                            {loading ? 'Salvando...' : 'Salvar'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
        padding: 16,
    },
    form: {
        padding: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
        marginTop: 12,
    },
    input: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#1f2937',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 24,
    },
    button: {
        flex: 1,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#e5e7eb',
    },
    cancelButtonText: {
        color: '#1f2937',
        fontSize: 16,
        fontWeight: '600',
    },
    saveButton: {
        backgroundColor: '#2563eb',
    },
    saveButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
});
