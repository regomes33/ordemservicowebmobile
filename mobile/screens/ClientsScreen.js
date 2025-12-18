import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    ActivityIndicator,
    Alert
} from 'react-native';
import { getClients, deleteClient } from '../services/firebaseService';

export default function ClientsScreen({ navigation }) {
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadClients();
    }, []);

    useEffect(() => {
        navigation.addListener('focus', () => {
            loadClients();
        });
    }, [navigation]);

    useEffect(() => {
        if (searchTerm) {
            const filtered = clients.filter(client =>
                client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.phone?.includes(searchTerm)
            );
            setFilteredClients(filtered);
        } else {
            setFilteredClients(clients);
        }
    }, [searchTerm, clients]);

    const loadClients = async () => {
        try {
            const data = await getClients();
            setClients(data);
            setFilteredClients(data);
        } catch (error) {
            console.error('Error loading clients:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (clientId, clientName) => {
        Alert.alert(
            'Excluir Cliente',
            `Tem certeza que deseja excluir ${clientName}?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteClient(clientId);
                            loadClients();
                        } catch (error) {
                            Alert.alert('Erro', 'Não foi possível excluir o cliente');
                        }
                    }
                }
            ]
        );
    };

    const renderClient = ({ item }) => (
        <TouchableOpacity
            style={styles.clientCard}
            onPress={() => navigation.navigate('ClientForm', { client: item })}
        >
            <View style={styles.clientInfo}>
                <Text style={styles.clientName}>{item.name}</Text>
                {item.phone && <Text style={styles.clientDetail}>📞 {item.phone}</Text>}
                {item.email && <Text style={styles.clientDetail}>✉️ {item.email}</Text>}
            </View>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id, item.name)}
            >
                <Text style={styles.deleteButtonText}>🗑️</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2563eb" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Clientes</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('ClientForm')}
                >
                    <Text style={styles.addButtonText}>+ Novo</Text>
                </TouchableOpacity>
            </View>

            <TextInput
                style={styles.searchInput}
                placeholder="Buscar por nome, email ou telefone..."
                value={searchTerm}
                onChangeText={setSearchTerm}
            />

            {filteredClients.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Nenhum cliente encontrado</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredClients}
                    renderItem={renderClient}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContainer}
                />
            )}
        </View>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    addButton: {
        backgroundColor: '#2563eb',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    addButtonText: {
        color: '#ffffff',
        fontWeight: '600',
    },
    searchInput: {
        margin: 16,
        padding: 12,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#d1d5db',
    },
    listContainer: {
        padding: 16,
    },
    clientCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    clientInfo: {
        flex: 1,
    },
    clientName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 4,
    },
    clientDetail: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 2,
    },
    deleteButton: {
        padding: 8,
    },
    deleteButtonText: {
        fontSize: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    emptyText: {
        fontSize: 16,
        color: '#9ca3af',
    },
});
