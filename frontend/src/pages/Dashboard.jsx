import React, { useState, useEffect } from 'react';
import { getClients, getServiceOrders } from '../services/firebaseService';
import { Users, FileText, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
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

    const statCards = [
        {
            title: 'Total de Clientes',
            value: stats.totalClients,
            icon: Users,
            color: 'bg-blue-500',
            link: '/clients'
        },
        {
            title: 'Ordens Pendentes',
            value: stats.pendingOrders,
            icon: Clock,
            color: 'bg-yellow-500',
            link: '/service-orders?status=pending'
        },
        {
            title: 'Ordens em Andamento',
            value: stats.activeOrders,
            icon: FileText,
            color: 'bg-orange-500',
            link: '/service-orders?status=in_progress'
        },
        {
            title: 'Ordens Concluídas',
            value: stats.completedOrders,
            icon: CheckCircle,
            color: 'bg-green-500',
            link: '/service-orders?status=completed'
        }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg text-gray-600">Carregando...</div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Link
                            key={index}
                            to={stat.link}
                            className="card hover:shadow-lg transition-shadow cursor-pointer"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">
                                        {stat.title}
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {stat.value}
                                    </p>
                                </div>
                                <div className={`${stat.color} p-3 rounded-lg`}>
                                    <Icon className="text-white" size={24} />
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                        to="/clients/new"
                        className="btn-primary text-center"
                    >
                        Novo Cliente
                    </Link>
                    <Link
                        to="/service-orders/new"
                        className="btn-primary text-center"
                    >
                        Nova Ordem de Serviço
                    </Link>
                    <Link
                        to="/reports"
                        className="btn-secondary text-center"
                    >
                        Ver Relatórios
                    </Link>
                </div>
            </div>
        </div>
    );
}
