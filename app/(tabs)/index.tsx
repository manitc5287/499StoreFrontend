import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/slices/productSlice";
import { AppDispatch, RootState } from "../../redux/store";

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector(
    (state: RootState) => state.product
  );
  const { totalItems } = useSelector((state: RootState) => state.cart);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (products && products.length > 0) {
      if (searchQuery.trim() === '') {
        setFilteredProducts(products);
      } else {
        const filtered = products.filter(product => {
          const searchLower = searchQuery.toLowerCase();
          return (
            (product.product_name && product.product_name.toLowerCase().includes(searchLower)) ||
            (product.brand && product.brand.toLowerCase().includes(searchLower)) ||
            (product.category && product.category.toLowerCase().includes(searchLower)) ||
            (product.description && product.description.toLowerCase().includes(searchLower))
          );
        });
        setFilteredProducts(filtered);
      }
    }
  }, [products, searchQuery]);

  const handleProductPress = (product) => {
    router.push(`/product/${product._id}`);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#FFD54F" />
        <Text style={styles.loadingText}>Loading amazing products...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={60} color="#FFD54F" />
        <Text style={styles.errorText}>Oops! Something went wrong</Text>
        <Text style={styles.errorSubtext}>Please try again later</Text>
      </View>
    );
  }

  const categories = [
    { name: 'Shirts', icon: 'shirt-outline', color: '#FFD54F' },
    { name: 'T-Shirts', icon: 'shirt-outline', color: '#FFECB3' },
    { name: 'Jeans', icon: 'shirt-outline', color: '#FFF9C4' },
    { name: 'Trousers', icon: 'shirt-outline', color: '#F5F5DC' },
    { name: 'Jackets', icon: 'shirt-outline', color: '#FFF8E1' },
    { name: 'Shoes', icon: 'footsteps-outline', color: '#FFE082' },
  ];

  const renderHorizontalProduct = ({ item }) => (
    <TouchableOpacity 
      style={styles.horizontalProductCard} 
      onPress={() => handleProductPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.horizontalProductImageContainer}>
        {item.image && item.image.length > 0 ? (
          <Image
            source={{ uri: item.image[0] }}
            style={styles.horizontalProductImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.horizontalPlaceholderImage}>
            <Ionicons name="image-outline" size={30} color="#ccc" />
          </View>
        )}
        <TouchableOpacity style={styles.horizontalWishlistButton}>
          <Ionicons name="heart-outline" size={16} color="#FF6B6B" />
        </TouchableOpacity>
        {item.retail_price && item.discounted_price && item.retail_price > item.discounted_price && (
          <View style={styles.horizontalDiscountBadge}>
            <Text style={styles.horizontalDiscountText}>
              {Math.round(((item.retail_price - item.discounted_price) / item.retail_price) * 100)}% OFF
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.horizontalProductInfo}>
        <Text style={styles.horizontalBrandName}>{item.brand || 'Brand'}</Text>
        <Text style={styles.horizontalProductName} numberOfLines={2}>
          {item.product_name || 'Product Name'}
        </Text>
        
        <View style={styles.horizontalPriceContainer}>
          <Text style={styles.horizontalDiscountedPrice}>₹{item.discounted_price || item.retail_price || '0'}</Text>
          {item.retail_price && item.discounted_price && item.retail_price > item.discounted_price && (
            <Text style={styles.horizontalOriginalPrice}>₹{item.retail_price}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }) => (
    <TouchableOpacity 
      style={styles.productCard} 
      onPress={() => handleProductPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.productImageContainer}>
        {item.image && item.image.length > 0 ? (
          <Image
            source={{ uri: item.image[0] }}
            style={styles.productImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="image-outline" size={40} color="#ccc" />
          </View>
        )}
        <TouchableOpacity style={styles.wishlistButton}>
          <Ionicons name="heart-outline" size={18} color="#FF6B6B" />
        </TouchableOpacity>
        {item.retail_price && item.discounted_price && item.retail_price > item.discounted_price && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              {Math.round(((item.retail_price - item.discounted_price) / item.retail_price) * 100)}% OFF
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.productInfo}>
        <Text style={styles.brandName}>{item.brand || 'Brand'}</Text>
        <Text style={styles.productName} numberOfLines={2}>
          {item.product_name || 'Product Name'}
        </Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.discountedPrice}>₹{item.discounted_price || item.retail_price || '0'}</Text>
          {item.retail_price && item.discounted_price && item.retail_price > item.discounted_price && (
            <Text style={styles.originalPrice}>₹{item.retail_price}</Text>
          )}
        </View>
        
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={12} color="#FFD700" />
          <Text style={styles.ratingText}>{item.overall_rating || '4.0'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategory = ({ item }) => (
    <TouchableOpacity style={styles.categoryItem}>
      <View style={[styles.categoryIcon, { backgroundColor: item.color + '20' }]}>
        <Ionicons name={item.icon} size={24} color={item.color} />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color="#FFD54F" />
          <Text style={styles.locationText}>Deliver to</Text>
          <Text style={styles.locationName}>Delhi 110001</Text>
          <Ionicons name="chevron-down" size={14} color="#666" />
        </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="notifications-outline" size={22} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => router.push('/cart')}
            >
              <Ionicons name="bag-outline" size={22} color="#333" />
              {totalItems > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{totalItems}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for products, brands and more"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.name}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Banner */}
        <View style={styles.bannerContainer}>
          <Image 
            source={require("../../assets/Banner.png")} 
            style={styles.bannerImage} 
            resizeMode="cover" 
          />
        </View>

        {/* Sale Banner */}
        <View style={styles.saleBannerContainer}>
          <View style={styles.saleBannerContent}>
            <Text style={styles.saleBannerTitle}>🔥 FLASH SALE</Text>
            <Text style={styles.saleBannerSubtitle}>Up to 70% OFF on Men's Fashion</Text>
            <Text style={styles.saleBannerTimer}>Limited Time Offer</Text>
          </View>
        </View>

        {/* Featured Products */}
        {!searchQuery && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Products</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={filteredProducts.slice(0, 10)}
              renderItem={renderHorizontalProduct}
              keyExtractor={(item) => `featured-${item._id}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalProductsList}
            />
          </View>
        )}

        {/* Newly Added Products */}
        {!searchQuery && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Newly Added</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={[...filteredProducts].sort((a, b) => new Date(b.createdAt || b.crawl_timestamp) - new Date(a.createdAt || a.crawl_timestamp)).slice(0, 10)}
              renderItem={renderHorizontalProduct}
              keyExtractor={(item) => `new-${item._id}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalProductsList}
            />
          </View>
        )}

        {/* Trousers Section */}
        {!searchQuery && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Trousers</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={filteredProducts.filter(product => 
                product.product_name?.toLowerCase().includes('trouser') || 
                product.product_name?.toLowerCase().includes('pant') ||
                product.category?.toLowerCase().includes('trouser')
              ).slice(0, 10)}
              renderItem={renderHorizontalProduct}
              keyExtractor={(item) => `trousers-${item._id}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalProductsList}
            />
          </View>
        )}

        {/* T-Shirts Section */}
        {!searchQuery && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>T-Shirts</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={filteredProducts.filter(product => 
                product.product_name?.toLowerCase().includes('t-shirt') || 
                product.product_name?.toLowerCase().includes('tshirt') ||
                product.product_name?.toLowerCase().includes('tee') ||
                product.category?.toLowerCase().includes('t-shirt')
              ).slice(0, 10)}
              renderItem={renderHorizontalProduct}
              keyExtractor={(item) => `tshirts-${item._id}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalProductsList}
            />
          </View>
        )}

        {/* All Products Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {searchQuery ? `Search Results (${filteredProducts.length})` : 'All Products'}
            </Text>
            {!searchQuery && (
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={filteredProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item._id}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.productsList}
            columnWrapperStyle={styles.productRow}
          />
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  locationName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 4,
    marginRight: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FFD54F',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: '#FFD54F',
    fontWeight: '600',
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
    width: 60,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  bannerContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bannerImage: {
    width: '100%',
    height: 180,
  },
  saleBannerContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: '#FF6B6B',
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  saleBannerContent: {
    alignItems: 'center',
  },
  saleBannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  saleBannerSubtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
    textAlign: 'center',
  },
  saleBannerTimer: {
    fontSize: 14,
    color: '#FFE082',
    fontWeight: '600',
  },
  productsList: {
    paddingHorizontal: 16,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: (width - 48) / 2,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: '#f8f9fa',
    overflow: 'hidden',
    transform: [{ scale: 1 }],
  },
  productImageContainer: {
    position: 'relative',
    height: 240,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#f8f9fa',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  wishlistButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  discountText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  productInfo: {
    padding: 16,
    backgroundColor: '#fff',
  },
  brandName: {
    fontSize: 11,
    color: '#FFD54F',
    marginBottom: 6,
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
    lineHeight: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  discountedPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 13,
    color: '#999',
    textDecorationLine: 'line-through',
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  bottomSpacing: {
    height: 100,
  },
  // Horizontal Product Styles
  horizontalProductsList: {
    paddingHorizontal: 16,
  },
  horizontalProductCard: {
    width: 180,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: '#f8f9fa',
    overflow: 'hidden',
    transform: [{ scale: 1 }],
  },
  horizontalProductImageContainer: {
    position: 'relative',
    height: 180,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#f8f9fa',
  },
  horizontalProductImage: {
    width: '100%',
    height: '100%',
  },
  horizontalPlaceholderImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  horizontalWishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  horizontalDiscountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  horizontalDiscountText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  horizontalProductInfo: {
    padding: 12,
    backgroundColor: '#fff',
  },
  horizontalBrandName: {
    fontSize: 9,
    color: '#FFD54F',
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  horizontalProductName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    lineHeight: 16,
  },
  horizontalPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  horizontalDiscountedPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 6,
  },
  horizontalOriginalPrice: {
    fontSize: 11,
    color: '#999',
    textDecorationLine: 'line-through',
    fontWeight: '500',
  },
});