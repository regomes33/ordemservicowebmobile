import React, { useState, useEffect } from 'react';
import { getBudgets, updateBudgetStatus, getServiceOrders, getClients } from '../services/firebaseService';
import { DollarSign, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function Budgets() {
    const [budgets, setBudgets] = useState([]);
    const [orders, setOrders] = useState({});
    const [clients, setClients] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [budgetsData, ordersData, clientsData] = await Promise.all([
                getBudgets(),
                getServiceOrders(),
                getClients()
            ]);

            setBudgets(budgetsData);

            // Create lookup objects
            const ordersMap = {};
            ordersData.forEach(order => {
                ordersMap[order.id] = order;
            });
            setOrders(ordersMap);

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

    const handleStatusUpdate = async (budgetId, status) => {
        try {
            await updateBudgetStatus(budgetId, status);
            loadData();
        } catch (error) {
            console.error('Error updating budget status:', error);
            alert('Erro ao atualizar status do orçamento');
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendente' },
            approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Aprovado' },
            rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejeitado' }
        };

        const badge = badges[status] || badges.pending;

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                {badge.label}
            </span>
        );
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
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Orçamentos</h1>

            {budgets.length === 0 ? (
                <div className="card text-center py-12">
                    <p className="text-gray-500">Nenhum orçamento encontrado</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {budgets.map((budget) => {
                        const order = orders[budget.serviceOrderId];
                        const client = order ? clients[order.clientId] : null;

                        return (
                            <div key={budget.id} className="card hover:shadow-lg transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {client?.name || 'Cliente não encontrado'}
                                            </h3>
                                            {getStatusBadge(budget.status)}
                                        </div>

                                        <p className="text-gray-600 mb-2">
                                            {order?.description || 'Ordem não encontrada'}
                                        </p>

                                        {budget.createdAt && (
                                            <p className="text-sm text-gray-500">
                                                Criado em: {format(budget.createdAt.toDate(), 'dd/MM/yyyy HH:mm')}
                                            </p>
                                        )}
                                    </div>

                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-primary-600">
                                            R$ {budget.total?.toFixed(2) || '0.00'}
                                        </p>
                                    </div>
                                </div>

                                {/* Budget Items */}
                                {budget.items && budget.items.length > 0 && (
                                    <div className="border-t pt-4 mb-4">
                                        <h4 className="font-medium text-gray-900 mb-2">Itens:</h4>
                                        <div className="space-y-1">
                                            {budget.items.map((item, index) => (
                                                <div key={index} className="flex justify-between text-sm">
                                                    <span className="text-gray-600">
                                                        {item.name} x {item.quantity}
                                                    </span>
                                                    <span className="text-gray-900 font-medium">
                                                        R$ {item.subtotal.toFixed(2)}
                                                    </span>
                                                </div>
                                            ))}
                                            {budget.laborCost > 0 && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Mão de Obra</span>
                                                    <span className="text-gray-900 font-medium">
                                                        R$ {budget.laborCost.toFixed(2)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                {budget.status === 'pending' && (
                                    <div className="flex gap-2 border-t pt-4">
                                        <button
                                            onClick={() => handleStatusUpdate(budget.id, 'approved')}
                                            className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle size={18} />
                                            Aprovar
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(budget.id, 'rejected')}
                                            className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center justify-center gap-2"
                                        >
                                            <XCircle size={18} />
                                            Rejeitar
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
