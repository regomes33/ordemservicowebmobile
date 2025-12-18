import React, { useState, useEffect } from 'react';
import { getClients, deleteClient } from '../services/firebaseService';
import { Plus, Search, Edit, Trash2, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import ClientForm from '../components/ClientForm';

export default function Clients() {
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingClient, setEditingClient] = useState(null);

    useEffect(() => {
        loadClients();
    }, []);

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

    const handleDelete = async (clientId) => {
        if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
            try {
                await deleteClient(clientId);
                loadClients();
            } catch (error) {
                console.error('Error deleting client:', error);
                alert('Erro ao excluir cliente');
            }
        }
    };

    const handleEdit = (client) => {
        setEditingClient(client);
        setShowForm(true);
    };

    const handleFormClose = () => {
        setShowForm(false);
        setEditingClient(null);
        loadClients();
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
                <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={20} />
                    Novo Cliente
                </button>
            </div>

            {/* Search */}
            <div className="card mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por nome, email ou telefone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-field pl-10"
                    />
                </div>
            </div>

            {/* Clients Grid */}
            {filteredClients.length === 0 ? (
                <div className="card text-center py-12">
                    <p className="text-gray-500">Nenhum cliente encontrado</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredClients.map((client) => (
                        <div key={client.id} className="card hover:shadow-lg transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(client)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(client.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600">
                                {client.phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone size={16} />
                                        <span>{client.phone}</span>
                                    </div>
                                )}
                                {client.email && (
                                    <div className="flex items-center gap-2">
                                        <Mail size={16} />
                                        <span>{client.email}</span>
                                    </div>
                                )}
                                {client.address && (
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} />
                                        <span>{client.address}</span>
                                    </div>
                                )}
                            </div>

                            <Link
                                to={`/service-orders?clientId=${client.id}`}
                                className="mt-4 text-sm text-primary-600 hover:text-primary-800 font-medium"
                            >
                                Ver Ordens de Serviço →
                            </Link>
                        </div>
                    ))}
                </div>
            )}

            {/* Client Form Modal */}
            {showForm && (
                <ClientForm
                    client={editingClient}
                    onClose={handleFormClose}
                />
            )}
        </div>
    );
}
