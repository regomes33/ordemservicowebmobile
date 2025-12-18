import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import { getClients, getServiceOrders } from '../services/firebaseService';

export default function DashboardScreen({ navigation }) {
    const [stats, setStats] = useState({
        totalClients: 0,
        activeOrders: 0,
        completedOrders: 0,
        pendingOrders: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const clients = await getClients();
            const orders = await getServiceOrders();

            setStats({
                totalClients: clients.length,
                activeOrders: orders.filter(o => o.status === 'in_progress').length,
                completedOrders: orders.filter(o => o.status === 'completed').length,
                pendingOrders: orders.filter(o => o.status === 'pending').length
            });
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, color, onPress }) => (
        <TouchableOpacity style={[styles.card, { borderLeftColor: color }]} onPress={onPress}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardValue}>{value}</Text>
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
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Dashboard</Text>

            <View style={styles.statsGrid}>
                <StatCard
                    title="Total de Clientes"
                    value={stats.totalClients}
                    color="#3b82f6"
                    onPress={() => navigation.navigate('Clients')}
                />
                <StatCard
                    title="Ordens Pendentes"
                    value={stats.pendingOrders}
                    color="#eab308"
                    onPress={() => navigation.navigate('ServiceOrders')}
                />
                <StatCard
                    title="Em Andamento"
                    value={stats.activeOrders}
                    color="#f97316"
                    onPress={() => navigation.navigate('ServiceOrders')}
                />
                <StatCard
                    title="Concluídas"
                    value={stats.completedOrders}
                    color="#22c55e"
                    onPress={() => navigation.navigate('ServiceOrders')}
                />
            </View>

            <View style={styles.actionsContainer}>
                <Text style={styles.sectionTitle}>Ações Rápidas</Text>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('ClientForm')}
                >
                    <Text style={styles.actionButtonText}>Novo Cliente</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('ServiceOrderForm')}
                >
                    <Text style={styles.actionButtonText}>Nova Ordem de Serviço</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.secondaryButton]}
                    onPress={() => navigation.navigate('Reports')}
                >
                    <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
                        Ver Relatórios
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 20,
    },
    statsGrid: {
        marginBottom: 24,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 8,
    },
    cardValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    actionsContainer: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 16,
    },
    actionButton: {
        backgroundColor: '#2563eb',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        alignItems: 'center',
    },
    actionButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        backgroundColor: '#e5e7eb',
    },
    secondaryButtonText: {
        color: '#1f2937',
    },
});
