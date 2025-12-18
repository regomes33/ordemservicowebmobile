import React, { useState, useEffect } from 'react';
import { getServiceOrders, deleteServiceOrder, getClients } from '../services/firebaseService';
import { Plus, Search, Edit, Trash2, Eye, Filter } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';

export default function ServiceOrders() {
    const [orders, setOrders] = useState([]);
    const [clients, setClients] = useState({});
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        const status = searchParams.get('status');
        if (status) {
            setStatusFilter(status);
        }
    }, [searchParams]);

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

            // Create clients lookup object
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

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(order => order.status === statusFilter);
        }

        // Filter by search term
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

    const handleDelete = async (orderId) => {
        if (window.confirm('Tem certeza que deseja excluir esta ordem de serviço?')) {
            try {
                await deleteServiceOrder(orderId);
                loadData();
            } catch (error) {
                console.error('Error deleting order:', error);
                alert('Erro ao excluir ordem de serviço');
            }
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: 'bg-yellow-100 text-yellow-800',
            in_progress: 'bg-blue-100 text-blue-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };

        const labels = {
            pending: 'Pendente',
            in_progress: 'Em Andamento',
            completed: 'Concluída',
            cancelled: 'Cancelada'
        };

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status]}`}>
                {labels[status]}
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
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Ordens de Serviço</h1>
                <Link
                    to="/service-orders/new"
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={20} />
                    Nova Ordem
                </Link>
            </div>

            {/* Filters */}
            <div className="card mb-6 space-y-4">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por descrição ou cliente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-field pl-10"
                    />
                </div>

                {/* Status Filter */}
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={() => setStatusFilter('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === 'all'
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Todas
                    </button>
                    <button
                        onClick={() => setStatusFilter('pending')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === 'pending'
                                ? 'bg-yellow-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Pendentes
                    </button>
                    <button
                        onClick={() => setStatusFilter('in_progress')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === 'in_progress'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Em Andamento
                    </button>
                    <button
                        onClick={() => setStatusFilter('completed')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === 'completed'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Concluídas
                    </button>
                </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="card text-center py-12">
                    <p className="text-gray-500">Nenhuma ordem de serviço encontrada</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map((order) => {
                        const client = clients[order.clientId];
                        return (
                            <div key={order.id} className="card hover:shadow-lg transition-shadow">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {client?.name || 'Cliente não encontrado'}
                                            </h3>
                                            {getStatusBadge(order.status)}
                                        </div>

                                        <p className="text-gray-600 mb-2">{order.description}</p>

                                        <div className="flex gap-4 text-sm text-gray-500">
                                            <span>Tipo: {order.serviceType}</span>
                                            {order.createdAt && (
                                                <span>
                                                    Criada em: {format(order.createdAt.toDate(), 'dd/MM/yyyy')}
                                                </span>
                                            )}
                                            {order.photos && (
                                                <span>{order.photos.length} foto(s)</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-2 ml-4">
                                        <Link
                                            to={`/service-orders/${order.id}`}
                                            className="text-blue-600 hover:text-blue-800 p-2"
                                            title="Ver detalhes"
                                        >
                                            <Eye size={20} />
                                        </Link>
                                        <Link
                                            to={`/service-orders/edit/${order.id}`}
                                            className="text-green-600 hover:text-green-800 p-2"
                                            title="Editar"
                                        >
                                            <Edit size={20} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(order.id)}
                                            className="text-red-600 hover:text-red-800 p-2"
                                            title="Excluir"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
