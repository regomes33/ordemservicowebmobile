import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    ActivityIndicator
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { createServiceOrder, updateServiceOrder, getClients } from '../services/firebaseService';
import PhotoCapture from '../components/PhotoCapture';

export default function ServiceOrderFormScreen({ route, navigation }) {
    const { order } = route.params || {};
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingClients, setLoadingClients] = useState(true);
    const [formData, setFormData] = useState({
        clientId: '',
        serviceType: 'maintenance',
        description: '',
        status: 'pending',
        photos: [],
        laborCost: '0',
        notes: ''
    });

    useEffect(() => {
        loadClients();
        if (order) {
            setFormData({
                clientId: order.clientId || '',
                serviceType: order.serviceType || 'maintenance',
                description: order.description || '',
                status: order.status || 'pending',
                photos: order.photos || [],
                laborCost: String(order.laborCost || 0),
                notes: order.notes || ''
            });
        }
    }, [order]);

    const loadClients = async () => {
        try {
            const data = await getClients();
            setClients(data);
        } catch (error) {
            console.error('Error loading clients:', error);
        } finally {
            setLoadingClients(false);
        }
    };

    const handleSubmit = async () => {
        if (!formData.clientId || !formData.description) {
            Alert.alert('Erro', 'Cliente e descrição são obrigatórios');
            return;
        }

        setLoading(true);
        try {
            const orderData = {
                ...formData,
                laborCost: parseFloat(formData.laborCost) || 0,
                materials: [] // Simplificado - pode ser expandido depois
            };

            if (order) {
                await updateServiceOrder(order.id, orderData);
            } else {
                await createServiceOrder(orderData);
            }
            navigation.goBack();
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível salvar a ordem de serviço');
        } finally {
            setLoading(false);
        }
    };

    if (loadingClients) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2563eb" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>
                {order ? 'Editar Ordem' : 'Nova Ordem de Serviço'}
            </Text>

            <View style={styles.form}>
                <Text style={styles.sectionTitle}>Informações do Cliente</Text>

                <Text style={styles.label}>Cliente *</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={formData.clientId}
                        onValueChange={(value) => setFormData({ ...formData, clientId: value })}
                        style={styles.picker}
                    >
                        <Picker.Item label="Selecione um cliente" value="" />
                        {clients.map(client => (
                            <Picker.Item key={client.id} label={client.name} value={client.id} />
                        ))}
                    </Picker>
                </View>

                <Text style={styles.label}>Tipo de Serviço *</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={formData.serviceType}
                        onValueChange={(value) => setFormData({ ...formData, serviceType: value })}
                        style={styles.picker}
                    >
                        <Picker.Item label="Manutenção" value="maintenance" />
                        <Picker.Item label="Reparo" value="repair" />
                        <Picker.Item label="Instalação" value="installation" />
                        <Picker.Item label="Limpeza" value="cleaning" />
                    </Picker>
                </View>

                <Text style={styles.sectionTitle}>Detalhes do Serviço</Text>

                <Text style={styles.label}>Descrição *</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={formData.description}
                    onChangeText={(text) => setFormData({ ...formData, description: text })}
                    placeholder="Descreva o serviço a ser realizado..."
                    multiline
                    numberOfLines={4}
                />

                <Text style={styles.label}>Status</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={formData.status}
                        onValueChange={(value) => setFormData({ ...formData, status: value })}
                        style={styles.picker}
                    >
                        <Picker.Item label="Pendente" value="pending" />
                        <Picker.Item label="Em Andamento" value="in_progress" />
                        <Picker.Item label="Concluída" value="completed" />
                        <Picker.Item label="Cancelada" value="cancelled" />
                    </Picker>
                </View>

                <Text style={styles.label}>Mão de Obra (R$)</Text>
                <TextInput
                    style={styles.input}
                    value={formData.laborCost}
                    onChangeText={(text) => setFormData({ ...formData, laborCost: text })}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                />

                <Text style={styles.label}>Observações</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={formData.notes}
                    onChangeText={(text) => setFormData({ ...formData, notes: text })}
                    placeholder="Observações adicionais..."
                    multiline
                    numberOfLines={3}
                />

                <Text style={styles.sectionTitle}>Fotos</Text>
                <PhotoCapture
                    photos={formData.photos}
                    onChange={(photos) => setFormData({ ...formData, photos })}
                    orderId={order?.id}
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1f2937',
        marginTop: 16,
        marginBottom: 12,
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
    pickerContainer: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 24,
        marginBottom: 32,
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
