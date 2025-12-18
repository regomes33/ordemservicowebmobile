import React, { useState, useEffect } from 'react';
import { getMaterials } from '../services/firebaseService';
import { Plus, Trash2, Search } from 'lucide-react';

export default function MaterialSelector({ materials = [], onChange }) {
    const [availableMaterials, setAvailableMaterials] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSelector, setShowSelector] = useState(false);
    const [selectedMaterials, setSelectedMaterials] = useState(materials);

    useEffect(() => {
        loadMaterials();
    }, []);

    useEffect(() => {
        setSelectedMaterials(materials);
    }, [materials]);

    const loadMaterials = async () => {
        try {
            const data = await getMaterials();
            setAvailableMaterials(data);
        } catch (error) {
            console.error('Error loading materials:', error);
        }
    };

    const filteredMaterials = availableMaterials.filter(material =>
        material.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addMaterial = (material) => {
        const exists = selectedMaterials.find(m => m.id === material.id);
        if (exists) {
            alert('Material já adicionado');
            return;
        }

        const newMaterial = {
            ...material,
            quantity: 1,
            subtotal: material.price
        };

        const updated = [...selectedMaterials, newMaterial];
        setSelectedMaterials(updated);
        onChange(updated);
        setShowSelector(false);
        setSearchTerm('');
    };

    const updateQuantity = (index, quantity) => {
        const updated = [...selectedMaterials];
        updated[index].quantity = parseInt(quantity) || 0;
        updated[index].subtotal = updated[index].price * updated[index].quantity;
        setSelectedMaterials(updated);
        onChange(updated);
    };

    const removeMaterial = (index) => {
        const updated = selectedMaterials.filter((_, i) => i !== index);
        setSelectedMaterials(updated);
        onChange(updated);
    };

    const calculateTotal = () => {
        return selectedMaterials.reduce((sum, material) => sum + material.subtotal, 0);
    };

    return (
        <div className="space-y-4">
            {/* Selected Materials */}
            {selectedMaterials.length > 0 && (
                <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Materiais Selecionados</h4>
                    <div className="border rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Material</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Preço Unit.</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qtd.</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                                    <th className="px-4 py-2"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {selectedMaterials.map((material, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-2 text-sm text-gray-900">{material.name}</td>
                                        <td className="px-4 py-2 text-sm text-gray-600">
                                            R$ {material.price.toFixed(2)}
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="number"
                                                min="1"
                                                value={material.quantity}
                                                onChange={(e) => updateQuantity(index, e.target.value)}
                                                className="w-20 px-2 py-1 border rounded"
                                            />
                                        </td>
                                        <td className="px-4 py-2 text-sm font-medium text-gray-900">
                                            R$ {material.subtotal.toFixed(2)}
                                        </td>
                                        <td className="px-4 py-2">
                                            <button
                                                onClick={() => removeMaterial(index)}
                                                className="text-red-600 hover:text-red-800"
                                                type="button"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-gray-50">
                                <tr>
                                    <td colSpan="3" className="px-4 py-2 text-right font-medium text-gray-900">
                                        Total:
                                    </td>
                                    <td className="px-4 py-2 text-sm font-bold text-gray-900">
                                        R$ {calculateTotal().toFixed(2)}
                                    </td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            )}

            {/* Add Material Button */}
            <button
                onClick={() => setShowSelector(!showSelector)}
                className="btn-secondary flex items-center gap-2"
                type="button"
            >
                <Plus size={20} />
                Adicionar Material
            </button>

            {/* Material Selector */}
            {showSelector && (
                <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="mb-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Buscar material..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input-field pl-10"
                            />
                        </div>
                    </div>

                    <div className="max-h-60 overflow-y-auto space-y-2">
                        {filteredMaterials.length === 0 ? (
                            <p className="text-gray-500 text-sm text-center py-4">
                                Nenhum material encontrado
                            </p>
                        ) : (
                            filteredMaterials.map((material) => (
                                <button
                                    key={material.id}
                                    onClick={() => addMaterial(material)}
                                    className="w-full text-left p-3 bg-white rounded border hover:border-primary-500 hover:bg-primary-50 transition-colors"
                                    type="button"
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium text-gray-900">{material.name}</p>
                                            <p className="text-sm text-gray-600">{material.unit}</p>
                                        </div>
                                        <p className="font-semibold text-gray-900">
                                            R$ {material.price.toFixed(2)}
                                        </p>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
