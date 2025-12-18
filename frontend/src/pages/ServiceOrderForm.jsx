import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    createServiceOrder,
    updateServiceOrder,
    getServiceOrder,
    getClients
} from '../services/firebaseService';
import PhotoUploader from '../components/PhotoUploader';
import MaterialSelector from '../components/MaterialSelector';
import { ArrowLeft } from 'lucide-react';

export default function ServiceOrderForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        clientId: '',
        serviceType: 'maintenance',
        description: '',
        status: 'pending',
        photos: [],
        materials: [],
        laborCost: 0,
        notes: ''
    });

    useEffect(() => {
        loadClients();
        if (isEditing) {
            loadOrder();
        }
    }, [id]);

    const loadClients = async () => {
        try {
            const data = await getClients();
            setClients(data);
        } catch (error) {
            console.error('Error loading clients:', error);
        }
    };

    const loadOrder = async () => {
        try {
            const order = await getServiceOrder(id);
            if (order) {
                setFormData({
                    clientId: order.clientId || '',
                    serviceType: order.serviceType || 'maintenance',
                    description: order.description || '',
                    status: order.status || 'pending',
                    photos: order.photos || [],
                    materials: order.materials || [],
                    laborCost: order.laborCost || 0,
                    notes: order.notes || ''
                });
            }
        } catch (error) {
            console.error('Error loading order:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const orderData = {
                ...formData,
                laborCost: parseFloat(formData.laborCost) || 0
            };

            if (isEditing) {
                await updateServiceOrder(id, orderData);
            } else {
                await createServiceOrder(orderData);
            }

            navigate('/service-orders');
        } catch (error) {
            console.error('Error saving order:', error);
            alert('Erro ao salvar ordem de serviço');
        } finally {
            setLoading(false);
        }
    };

    const calculateTotal = () => {
        const materialsTotal = formData.materials.reduce((sum, m) => sum + m.subtotal, 0);
        const laborCost = parseFloat(formData.laborCost) || 0;
        return materialsTotal + laborCost;
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate('/service-orders')}
                    className="text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-3xl font-bold text-gray-900">
                    {isEditing ? 'Editar Ordem de Serviço' : 'Nova Ordem de Serviço'}
                </h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Client Selection */}
                <div className="card">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Informações do Cliente</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="label">Cliente *</label>
                            <select
                                name="clientId"
                                value={formData.clientId}
                                onChange={handleChange}
                                className="input-field"
                                required
                            >
                                <option value="">Selecione um cliente</option>
                                {clients.map(client => (
                                    <option key={client.id} value={client.id}>
                                        {client.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="label">Tipo de Serviço *</label>
                            <select
                                name="serviceType"
                                value={formData.serviceType}
                                onChange={handleChange}
                                className="input-field"
                                required
                            >
                                <option value="maintenance">Manutenção</option>
                                <option value="repair">Reparo</option>
                                <option value="installation">Instalação</option>
                                <option value="cleaning">Limpeza</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Service Details */}
                <div className="card">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Detalhes do Serviço</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="label">Descrição *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="input-field"
                                rows="4"
                                placeholder="Descreva o serviço a ser realizado..."
                                required
                            />
                        </div>

                        <div>
                            <label className="label">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="input-field"
                            >
                                <option value="pending">Pendente</option>
                                <option value="in_progress">Em Andamento</option>
                                <option value="completed">Concluída</option>
                                <option value="cancelled">Cancelada</option>
                            </select>
                        </div>

                        <div>
                            <label className="label">Observações</label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                className="input-field"
                                rows="3"
                                placeholder="Observações adicionais..."
                            />
                        </div>
                    </div>
                </div>

                {/* Photos */}
                <div className="card">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Fotos</h2>
                    <PhotoUploader
                        photos={formData.photos}
                        onChange={(photos) => setFormData(prev => ({ ...prev, photos }))}
                        orderId={id}
                    />
                </div>

                {/* Materials */}
                <div className="card">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Materiais</h2>
                    <MaterialSelector
                        materials={formData.materials}
                        onChange={(materials) => setFormData(prev => ({ ...prev, materials }))}
                    />
                </div>

                {/* Costs */}
                <div className="card">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Custos</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="label">Mão de Obra (R$)</label>
                            <input
                                type="number"
                                name="laborCost"
                                value={formData.laborCost}
                                onChange={handleChange}
                                className="input-field"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                            />
                        </div>

                        <div className="border-t pt-4">
                            <div className="flex justify-between items-center text-lg font-semibold">
                                <span>Total Geral:</span>
                                <span className="text-primary-600">
                                    R$ {calculateTotal().toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/service-orders')}
                        className="btn-secondary"
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Salvando...' : 'Salvar Ordem de Serviço'}
                    </button>
                </div>
            </form>
        </div>
    );
}
