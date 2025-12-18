import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    ActivityIndicator
} from 'react-native';
import { getServiceOrders, getClients } from '../services/firebaseService';
import { format } from 'date-fns';

export default function ServiceOrdersScreen({ navigation }) {
    const [orders, setOrders] = useState([]);
    const [clients, setClients] = useState({});
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        navigation.addListener('focus', () => {
            loadData();
        });
    }, [navigation]);

    useEffect(() => {
        filterOrders();
    }, [searchTerm, statusFilter, orders]);

    const loadData = async () => {
        try {
            const [ordersData, clientsData] = await Promise.all([
                getServiceOrders(),
                getClients()
            ]);

            setOrders(ordersData);

            const clientsMap = {};
            clientsData.forEach(client => {
                clientsMap[client.id] = client;
            });
            setClients(clientsMap);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterOrders = () => {
        let filtered = orders;

        if (statusFilter !== 'all') {
            filtered = filtered.filter(order => order.status === statusFilter);
        }

        if (searchTerm) {
            filtered = filtered.filter(order => {
                const client = clients[order.clientId];
                return (
                    order.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    client?.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
            });
        }

        setFilteredOrders(filtered);
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: { color: '#eab308', label: 'Pendente' },
            in_progress: { color: '#3b82f6', label: 'Em Andamento' },
            completed: { color: '#22c55e', label: 'Concluída' },
            cancelled: { color: '#ef4444', label: 'Cancelada' }
        };
        return badges[status] || badges.pending;
    };

    const renderOrder = ({ item }) => {
        const client = clients[item.clientId];
        const badge = getStatusBadge(item.status);

        return (
            <TouchableOpacity
                style={styles.orderCard}
                onPress={() => navigation.navigate('ServiceOrderForm', { order: item })}
            >
                <View style={styles.orderHeader}>
                    <Text style={styles.clientName}>{client?.name || 'Cliente não encontrado'}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: badge.color }]}>
                        <Text style={styles.statusText}>{badge.label}</Text>
                    </View>
                </View>
                <Text style={styles.orderDescription} numberOfLines={2}>
                    {item.description}
                </Text>
                <View style={styles.orderFooter}>
                    <Text style={styles.orderDetail}>Tipo: {item.serviceType}</Text>
                    {item.createdAt && (
                        <Text style={styles.orderDetail}>
                            {format(item.createdAt.toDate(), 'dd/MM/yyyy')}
                        </Text>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

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
                <Text style={styles.title}>Ordens de Serviço</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('ServiceOrderForm')}
                >
                    <Text style={styles.addButtonText}>+ Nova</Text>
                </TouchableOpacity>
            </View>

            <TextInput
                style={styles.searchInput}
                placeholder="Buscar por descrição ou cliente..."
                value={searchTerm}
                onChangeText={setSearchTerm}
            />

            <View style={styles.filterContainer}>
                {['all', 'pending', 'in_progress', 'completed'].map(status => (
                    <TouchableOpacity
                        key={status}
                        style={[
                            styles.filterButton,
                            statusFilter === status && styles.filterButtonActive
                        ]}
                        onPress={() => setStatusFilter(status)}
                    >
                        <Text style={[
                            styles.filterButtonText,
                            statusFilter === status && styles.filterButtonTextActive
                        ]}>
                            {status === 'all' ? 'Todas' :
                                status === 'pending' ? 'Pendentes' :
                                    status === 'in_progress' ? 'Em Andamento' : 'Concluídas'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {filteredOrders.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Nenhuma ordem encontrada</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredOrders}
                    renderItem={renderOrder}
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
        marginBottom: 8,
        padding: 12,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#d1d5db',
    },
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 8,
        gap: 8,
    },
    filterButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: '#e5e7eb',
    },
    filterButtonActive: {
        backgroundColor: '#2563eb',
    },
    filterButtonText: {
        fontSize: 12,
        color: '#1f2937',
        fontWeight: '600',
    },
    filterButtonTextActive: {
        color: '#ffffff',
    },
    listContainer: {
        padding: 16,
    },
    orderCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    clientName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1f2937',
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '600',
    },
    orderDescription: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 8,
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    orderDetail: {
        fontSize: 12,
        color: '#9ca3af',
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
