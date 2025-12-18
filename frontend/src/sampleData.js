// Script para adicionar materiais de exemplo ao Firestore
// Execute este arquivo no console do navegador após fazer login

import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';

const sampleMaterials = [
    { name: 'Gás R22', price: 150.00, unit: 'kg' },
    { name: 'Gás R410A', price: 180.00, unit: 'kg' },
    { name: 'Filtro de Ar', price: 25.00, unit: 'unidade' },
    { name: 'Capacitor 35µF', price: 45.00, unit: 'unidade' },
    { name: 'Capacitor 45µF', price: 50.00, unit: 'unidade' },
    { name: 'Contator 25A', price: 85.00, unit: 'unidade' },
    { name: 'Termostato Digital', price: 120.00, unit: 'unidade' },
    { name: 'Mangueira de Drenagem', price: 15.00, unit: 'metro' },
    { name: 'Fita Isolante', price: 8.00, unit: 'rolo' },
    { name: 'Suporte de Parede', price: 35.00, unit: 'par' },
    { name: 'Cabo Elétrico 2,5mm', price: 12.00, unit: 'metro' },
    { name: 'Disjuntor 20A', price: 25.00, unit: 'unidade' },
    { name: 'Limpador de Serpentina', price: 35.00, unit: 'litro' },
    { name: 'Óleo Lubrificante', price: 45.00, unit: 'litro' },
    { name: 'Sensor de Temperatura', price: 65.00, unit: 'unidade' }
];

async function addSampleMaterials() {
    console.log('Adicionando materiais de exemplo...');

    for (const material of sampleMaterials) {
        try {
            await addDoc(collection(db, 'materials'), {
                ...material,
                createdAt: new Date()
            });
            console.log(`✓ Adicionado: ${material.name}`);
        } catch (error) {
            console.error(`✗ Erro ao adicionar ${material.name}:`, error);
        }
    }

    console.log('Concluído!');
}

// Para executar, cole no console:
// addSampleMaterials();

export { addSampleMaterials, sampleMaterials };
