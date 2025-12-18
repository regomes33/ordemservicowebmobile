import React, { useState, useEffect } from 'react';
import { getServiceOrders, getClients } from '../services/firebaseService';
import { BarChart3, TrendingUp, DollarSign, FileText } from 'lucide-react';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

export default function Reports() {
    const [orders, setOrders] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(new Date());

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [ordersData, clientsData] = await Promise.all([
                getServiceOrders(),
                getClients()
            ]);

            setOrders(ordersData);
            setClients(clientsData);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getMonthlyStats = () => {
        const monthStart = startOfMonth(selectedMonth);
        const monthEnd = endOfMonth(selectedMonth);

        const monthlyOrders = orders.filter(order => {
            if (!order.createdAt) return false;
            const orderDate = order.createdAt.toDate();
            return isWithinInterval(orderDate, { start: monthStart, end: monthEnd });
        });

        const completed = monthlyOrders.filter(o => o.status === 'completed');
        const pending = monthlyOrders.filter(o => o.status === 'pending');
        const inProgress = monthlyOrders.filter(o => o.status === 'in_progress');

        const revenue = completed.reduce((sum, order) => {
            const materialsTotal = order.materials?.reduce((s, m) => s + (m.subtotal || 0), 0) || 0;
            const laborCost = order.laborCost || 0;
            return sum + materialsTotal + laborCost;
        }, 0);

        return {
            total: monthlyOrders.length,
            completed: completed.length,
            pending: pending.length,
            inProgress: inProgress.length,
            revenue
        };
    };

    const getServiceTypeBreakdown = () => {
        const breakdown = {};
        orders.forEach(order => {
            const type = order.serviceType || 'other';
            breakdown[type] = (breakdown[type] || 0) + 1;
        });
        return breakdown;
    };

    const stats = getMonthlyStats();
    const serviceTypes = getServiceTypeBreakdown();

    const serviceTypeLabels = {
        maintenance: 'Manutenção',
        repair: 'Reparo',
        installation: 'Instalação',
        cleaning: 'Limpeza',
        other: 'Outros'
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg text-gray-600">Carregando...</div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Relatórios</h1>

            {/* Month Selector */}
            <div className="card mb-6">
                <label className="label">Selecionar Mês</label>
                <input
                    type="month"
                    value={format(selectedMonth, 'yyyy-MM')}
                    onChange={(e) => setSelectedMonth(new Date(e.target.value + '-01'))}
                    className="input-field max-w-xs"
                />
            </div>

            {/* Monthly Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Total de Ordens</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                        <div className="bg-blue-500 p-3 rounded-lg">
                            <FileText className="text-white" size={24} />
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Concluídas</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
                        </div>
                        <div className="bg-green-500 p-3 rounded-lg">
                            <TrendingUp className="text-white" size={24} />
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Em Andamento</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.inProgress}</p>
                        </div>
                        <div className="bg-orange-500 p-3 rounded-lg">
                            <BarChart3 className="text-white" size={24} />
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Receita</p>
                            <p className="text-2xl font-bold text-gray-900">
                                R$ {stats.revenue.toFixed(2)}
                            </p>
                        </div>
                        <div className="bg-primary-500 p-3 rounded-lg">
                            <DollarSign className="text-white" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Service Type Breakdown */}
            <div className="card mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Tipos de Serviço</h2>
                <div className="space-y-3">
                    {Object.entries(serviceTypes).map(([type, count]) => (
                        <div key={type} className="flex items-center justify-between">
                            <span className="text-gray-700">{serviceTypeLabels[type] || type}</span>
                            <div className="flex items-center gap-3">
                                <div className="w-48 bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-primary-600 h-2 rounded-full"
                                        style={{ width: `${(count / orders.length) * 100}%` }}
                                    />
                                </div>
                                <span className="text-gray-900 font-medium w-12 text-right">{count}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Clients */}
            <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Clientes</h2>
                <div className="space-y-2">
                    {clients.slice(0, 5).map((client) => {
                        const clientOrders = orders.filter(o => o.clientId === client.id);
                        return (
                            <div key={client.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                                <span className="text-gray-900">{client.name}</span>
                                <span className="text-gray-600">{clientOrders.length} ordem(ns)</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
