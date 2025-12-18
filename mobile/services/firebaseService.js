import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    getDoc,
    query,
    where,
    Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebaseConfig';

// ==================== CLIENTS ====================

export const createClient = async (clientData) => {
    try {
        const docRef = await addDoc(collection(db, 'clients'), {
            ...clientData,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        });
        return { id: docRef.id, ...clientData };
    } catch (error) {
        console.error('Error creating client:', error);
        throw error;
    }
};

export const updateClient = async (clientId, clientData) => {
    try {
        const clientRef = doc(db, 'clients', clientId);
        await updateDoc(clientRef, {
            ...clientData,
            updatedAt: Timestamp.now()
        });
        return { id: clientId, ...clientData };
    } catch (error) {
        console.error('Error updating client:', error);
        throw error;
    }
};

export const deleteClient = async (clientId) => {
    try {
        await deleteDoc(doc(db, 'clients', clientId));
    } catch (error) {
        console.error('Error deleting client:', error);
        throw error;
    }
};

export const getClients = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, 'clients'));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting clients:', error);
        throw error;
    }
};

export const getClient = async (clientId) => {
    try {
        const docSnap = await getDoc(doc(db, 'clients', clientId));
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
    } catch (error) {
        console.error('Error getting client:', error);
        throw error;
    }
};

// ==================== SERVICE ORDERS ====================

export const createServiceOrder = async (orderData) => {
    try {
        const docRef = await addDoc(collection(db, 'serviceOrders'), {
            ...orderData,
            status: orderData.status || 'pending',
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        });
        return { id: docRef.id, ...orderData };
    } catch (error) {
        console.error('Error creating service order:', error);
        throw error;
    }
};

export const updateServiceOrder = async (orderId, orderData) => {
    try {
        const orderRef = doc(db, 'serviceOrders', orderId);
        await updateDoc(orderRef, {
            ...orderData,
            updatedAt: Timestamp.now()
        });
        return { id: orderId, ...orderData };
    } catch (error) {
        console.error('Error updating service order:', error);
        throw error;
    }
};

export const deleteServiceOrder = async (orderId) => {
    try {
        await deleteDoc(doc(db, 'serviceOrders', orderId));
    } catch (error) {
        console.error('Error deleting service order:', error);
        throw error;
    }
};

export const getServiceOrders = async (filters = {}) => {
    try {
        let q = collection(db, 'serviceOrders');

        if (filters.status) {
            q = query(q, where('status', '==', filters.status));
        }

        if (filters.clientId) {
            q = query(q, where('clientId', '==', filters.clientId));
        }

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting service orders:', error);
        throw error;
    }
};

export const getServiceOrder = async (orderId) => {
    try {
        const docSnap = await getDoc(doc(db, 'serviceOrders', orderId));
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
    } catch (error) {
        console.error('Error getting service order:', error);
        throw error;
    }
};

// ==================== MATERIALS ====================

export const getMaterials = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, 'materials'));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting materials:', error);
        throw error;
    }
};

// ==================== PHOTO UPLOAD ====================

export const uploadPhoto = async (uri, orderId) => {
    try {
        const response = await fetch(uri);
        const blob = await response.blob();

        const timestamp = Date.now();
        const fileName = `${timestamp}_photo.jpg`;
        const storageRef = ref(storage, `service-orders/${orderId}/${fileName}`);

        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);

        return {
            url: downloadURL,
            name: fileName,
            path: `service-orders/${orderId}/${fileName}`
        };
    } catch (error) {
        console.error('Error uploading photo:', error);
        throw error;
    }
};

export const deletePhoto = async (photoPath) => {
    try {
        const photoRef = ref(storage, photoPath);
        await deleteObject(photoRef);
    } catch (error) {
        console.error('Error deleting photo:', error);
        throw error;
    }
};

// ==================== BUDGETS ====================

export const getBudgets = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, 'budgets'));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting budgets:', error);
        throw error;
    }
};

export const updateBudgetStatus = async (budgetId, status) => {
    try {
        const budgetRef = doc(db, 'budgets', budgetId);
        await updateDoc(budgetRef, { status });
    } catch (error) {
        console.error('Error updating budget status:', error);
        throw error;
    }
};
