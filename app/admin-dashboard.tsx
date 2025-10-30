import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { logout } from '../redux/slices/userSlice';
import { useToast } from '../contexts/ToastContext';
import { router } from 'expo-router';
import { BASE_URL } from '../utils/APIENDPOINTS.js';

export default function AdminDashboard() {
  const { user, loggedIn } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const { showToast } = useToast();
  
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [productData, setProductData] = useState({
    product_name: '',
    brand: '',
    description: '',
    retail_price: '',
    discounted_price: '',
    category: '',
    image: '',
    sizes: '',
    colors: '',
    material: '',
    stock: '',
    tags: '',
  });

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            dispatch(logout());
            showToast('Logged out successfully', 'info');
            router.replace('/login');
          }
        },
      ]
    );
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length === 10 && /^[6-9]\d{9}$/.test(cleanPhone);
  };

  const handleCreateAdmin = async () => {
    if (!adminData.name || !adminData.email || !adminData.phone || !adminData.password) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    if (!validateEmail(adminData.email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    if (!validatePhone(adminData.phone)) {
      showToast('Please enter a valid 10-digit mobile number starting with 6-9', 'error');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}api/users/create-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...adminData,
          role: 'admin',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast('Admin created successfully!', 'success');
        setShowCreateAdminModal(false);
        setAdminData({ name: '', email: '', phone: '', password: '' });
      } else {
        showToast(data.message || 'Failed to create admin', 'error');
      }
    } catch (error) {
      console.error('Create admin error:', error);
      showToast('Network error. Please try again.', 'error');
    }
  };

  const handleAddProduct = async () => {
    if (!productData.product_name || !productData.brand || !productData.description || !productData.discounted_price || !productData.category) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    // Process sizes and colors from comma-separated strings
    const sizes = productData.sizes ? productData.sizes.split(',').map(s => s.trim()).filter(s => s) : [];
    const colors = productData.colors ? productData.colors.split(',').map(c => c.trim()).filter(c => c) : [];
    const tags = productData.tags ? productData.tags.split(',').map(t => t.trim()).filter(t => t) : [];

    try {
      const response = await fetch(`${BASE_URL}api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...productData,
          sizes,
          colors,
          tags,
          stock: parseInt(productData.stock) || 0,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast('Product added successfully!', 'success');
        setShowAddProductModal(false);
        setProductData({
          product_name: '',
          brand: '',
          description: '',
          retail_price: '',
          discounted_price: '',
          category: '',
          image: '',
          sizes: '',
          colors: '',
          material: '',
          stock: '',
          tags: '',
        });
      } else {
        showToast(data.message || 'Failed to add product', 'error');
      }
    } catch (error) {
      console.error('Add product error:', error);
      showToast('Network error. Please try again.', 'error');
    }
  };

  if (!loggedIn || !user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notLoggedIn}>
          <Ionicons name="shield-outline" size={80} color="#ccc" />
          <Text style={styles.notLoggedInText}>Please login to access admin dashboard</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Role guard: only admins and superadmins should access this screen
  if (user && user.role !== 'admin' && user.role !== 'superadmin') {
    // redirect non-admin users back to the main tabs
    router.replace('/(tabs)' as any);
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Admin Dashboard</Text>
            <Text style={styles.subtitle}>Welcome, {user.name}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={20} color="#FF6B6B" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Admin Role Badge */}
        <View style={styles.roleBadge}>
          <Ionicons name="shield" size={16} color="#FFC107" />
          <Text style={styles.roleText}>
            {user.role === 'superadmin' ? 'Super Admin' : 'Admin'}
          </Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="people-outline" size={24} color="#4CAF50" />
            <Text style={styles.statNumber}>1,234</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="cube-outline" size={24} color="#2196F3" />
            <Text style={styles.statNumber}>567</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="cart-outline" size={24} color="#FF9800" />
            <Text style={styles.statNumber}>89</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
        </View>

        {/* Admin Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setShowAddProductModal(true)}
          >
            <Ionicons name="add-circle-outline" size={24} color="#FFC107" />
            <Text style={styles.actionButtonText}>Add Product</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="list-outline" size={24} color="#4CAF50" />
            <Text style={styles.actionButtonText}>Manage Products</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="people-outline" size={24} color="#2196F3" />
            <Text style={styles.actionButtonText}>Manage Users</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="analytics-outline" size={24} color="#9C27B0" />
            <Text style={styles.actionButtonText}>Analytics</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          {user.role === 'superadmin' && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setShowCreateAdminModal(true)}
            >
              <Ionicons name="person-add-outline" size={24} color="#FF5722" />
              <Text style={styles.actionButtonText}>Create Admin</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Create Admin Modal */}
      <Modal
        visible={showCreateAdminModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreateAdminModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Admin</Text>
              <TouchableOpacity onPress={() => setShowCreateAdminModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name *</Text>
                <TextInput
                  style={styles.input}
                  value={adminData.name}
                  onChangeText={(text) => setAdminData(prev => ({ ...prev, name: text }))}
                  placeholder="Enter admin name"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email *</Text>
                <TextInput
                  style={styles.input}
                  value={adminData.email}
                  onChangeText={(text) => setAdminData(prev => ({ ...prev, email: text }))}
                  placeholder="Enter admin email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone *</Text>
                <TextInput
                  style={styles.input}
                  value={adminData.phone}
                  onChangeText={(text) => {
                    const cleanText = text.replace(/\D/g, '').slice(0, 10);
                    setAdminData(prev => ({ ...prev, phone: cleanText }));
                  }}
                  placeholder="Enter 10-digit mobile number"
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password *</Text>
                <TextInput
                  style={styles.input}
                  value={adminData.password}
                  onChangeText={(text) => setAdminData(prev => ({ ...prev, password: text }))}
                  placeholder="Enter admin password"
                  secureTextEntry
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={() => setShowCreateAdminModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.createButton} 
                  onPress={handleCreateAdmin}
                >
                  <Text style={styles.createButtonText}>Create Admin</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Add Product Modal */}
      <Modal
        visible={showAddProductModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddProductModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Product</Text>
              <TouchableOpacity onPress={() => setShowAddProductModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Product Name *</Text>
                <TextInput
                  style={styles.input}
                  value={productData.product_name}
                  onChangeText={(text) => setProductData(prev => ({ ...prev, product_name: text }))}
                  placeholder="Enter product name"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Brand *</Text>
                <TextInput
                  style={styles.input}
                  value={productData.brand}
                  onChangeText={(text) => setProductData(prev => ({ ...prev, brand: text }))}
                  placeholder="Enter brand name"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={productData.description}
                  onChangeText={(text) => setProductData(prev => ({ ...prev, description: text }))}
                  placeholder="Enter product description"
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>Retail Price</Text>
                  <TextInput
                    style={styles.input}
                    value={productData.retail_price}
                    onChangeText={(text) => setProductData(prev => ({ ...prev, retail_price: text }))}
                    placeholder="₹0"
                    keyboardType="numeric"
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.inputLabel}>Discounted Price *</Text>
                  <TextInput
                    style={styles.input}
                    value={productData.discounted_price}
                    onChangeText={(text) => setProductData(prev => ({ ...prev, discounted_price: text }))}
                    placeholder="₹0"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Category *</Text>
                <TextInput
                  style={styles.input}
                  value={productData.category}
                  onChangeText={(text) => setProductData(prev => ({ ...prev, category: text }))}
                  placeholder="e.g., Electronics, Clothing"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Image URL</Text>
                <TextInput
                  style={styles.input}
                  value={productData.image}
                  onChangeText={(text) => setProductData(prev => ({ ...prev, image: text }))}
                  placeholder="Enter image URL"
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>Sizes (comma-separated)</Text>
                  <TextInput
                    style={styles.input}
                    value={productData.sizes}
                    onChangeText={(text) => setProductData(prev => ({ ...prev, sizes: text }))}
                    placeholder="S, M, L, XL"
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.inputLabel}>Colors (comma-separated)</Text>
                  <TextInput
                    style={styles.input}
                    value={productData.colors}
                    onChangeText={(text) => setProductData(prev => ({ ...prev, colors: text }))}
                    placeholder="Red, Blue, Green"
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>Material</Text>
                  <TextInput
                    style={styles.input}
                    value={productData.material}
                    onChangeText={(text) => setProductData(prev => ({ ...prev, material: text }))}
                    placeholder="Cotton, Polyester, etc."
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.inputLabel}>Stock *</Text>
                  <TextInput
                    style={styles.input}
                    value={productData.stock}
                    onChangeText={(text) => setProductData(prev => ({ ...prev, stock: text }))}
                    placeholder="0"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Tags (comma-separated)</Text>
                <TextInput
                  style={styles.input}
                  value={productData.tags}
                  onChangeText={(text) => setProductData(prev => ({ ...prev, tags: text }))}
                  placeholder="trending, summer, casual"
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={() => setShowAddProductModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.createButton} 
                  onPress={handleAddProduct}
                >
                  <Text style={styles.createButtonText}>Add Product</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  notLoggedIn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  notLoggedInText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  logoutText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFF9E6',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFC107',
  },
  roleText: {
    color: '#FFC107',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  actionsContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '100%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  createButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#FFC107',
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
