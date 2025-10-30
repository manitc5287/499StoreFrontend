import React, { useMemo } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { AppDispatch, RootState } from "../redux/store";

// NOTE: adjust these imports if your cart slice uses different names/paths
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../redux/slices/cartSlice";

const API_BASE =
  Platform.OS === "android" ? "http://10.0.2.2:5000" : "http://localhost:5000";

function getImageSource(img: any) {
  if (!img) return { uri: "https://via.placeholder.com/300" };
  if (typeof img === "string") {
    if (img.startsWith("http")) return { uri: img };
    return { uri: `${API_BASE}${img}` };
  }
  return { uri: "https://via.placeholder.com/300" };
}

export default function CartScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // expects cart slice shape: { items: Array<{ _id, product_name, price, discounted_price, image: string[] , quantity }>}
  const cartItems = useSelector((s: RootState) => (s as any).cart?.items ?? []);
  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum: number, it: any) =>
          sum + (it.discounted_price ?? it.price ?? 0) * (it.quantity ?? 1),
        0
      ),
    [cartItems]
  );
  const shipping = subtotal > 1000 || subtotal === 0 ? 0 : 40;
  const tax = +(subtotal * 0.05).toFixed(2);
  const total = +(subtotal + shipping + tax).toFixed(2);

  const onIncrease = (id: string) => {
    dispatch(updateQuantity({ id, delta: 1 } as any));
  };
  const onDecrease = (id: string, qty: number) => {
    if (qty <= 1) {
      // confirm removal
      Alert.alert("Remove item", "Remove this item from cart?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => dispatch(removeFromCart(id as any)),
        },
      ]);
      return;
    }
    dispatch(updateQuantity({ id, delta: -1 } as any));
  };

  const onRemove = (id: string) => {
    Alert.alert("Remove item", "Remove this item from cart?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => dispatch(removeFromCart(id as any)),
      },
    ]);
  };

  const onClear = () => {
    if (cartItems.length === 0) return;
    Alert.alert("Clear cart", "Remove all items from cart?", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear", style: "destructive", onPress: () => dispatch(clearCart() as any) },
    ]);
  };

  const onCheckout = () => {
    // check auth token (web: sessionStorage, native: AsyncStorage)
    let token: string | null = null;
    try {
      if (typeof sessionStorage !== "undefined") token = sessionStorage.getItem("authToken");
    } catch {}
    if (!token) {
      // redirect to login
      router.replace("/login" as any);
      return;
    }
    // navigate to checkout
    router.push("/checkout" as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Your Cart</Text>
        <TouchableOpacity onPress={onClear} style={styles.clearBtn}>
          <Ionicons name="trash-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Your cart is empty.</Text>
          <TouchableOpacity style={styles.shopBtn} onPress={() => router.replace("/(tabs)" as any)}>
            <Text style={styles.shopBtnText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item: any) => item._id || item.id}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 24 }}
            renderItem={({ item }: { item: any }) => {
              const price = item.discounted_price ?? item.retail_price ?? item.price ?? 0;
              return (
                <View style={styles.itemRow}>
                  <Image source={getImageSource(item.image?.[0])} style={styles.itemImage} />
                  <View style={styles.itemBody}>
                    <Text style={styles.itemName} numberOfLines={2}>
                      {item.product_name ?? item.name}
                    </Text>
                    <Text style={styles.itemBrand}>{item.brand}</Text>
                    <View style={styles.priceRow}>
                      <Text style={styles.itemPrice}>₹{price}</Text>
                      <View style={styles.qtyRow}>
                        <TouchableOpacity onPress={() => onDecrease(item._id, item.quantity)} style={styles.qtyBtn}>
                          <Ionicons name="remove" size={16} color="#333" />
                        </TouchableOpacity>
                        <Text style={styles.qtyText}>{item.quantity ?? 1}</Text>
                        <TouchableOpacity onPress={() => onIncrease(item._id)} style={styles.qtyBtn}>
                          <Ionicons name="add" size={16} color="#333" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity onPress={() => onRemove(item._id)} style={styles.removeBtn}>
                    <Ionicons name="close" size={20} color="#888" />
                  </TouchableOpacity>
                </View>
              );
            }}
          />

          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text>Subtotal</Text>
              <Text>₹{subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text>Shipping</Text>
              <Text>{shipping === 0 ? "Free" : `₹${shipping}`}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text>Tax (5%)</Text>
              <Text>₹{tax.toFixed(2)}</Text>
            </View>

            <View style={styles.summaryRowTotal}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
            </View>

            <TouchableOpacity style={styles.checkoutBtn} onPress={onCheckout}>
              <Text style={styles.checkoutText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  title: { fontSize: 20, fontWeight: "700" },
  clearBtn: { backgroundColor: "#f44336", padding: 8, borderRadius: 8 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyText: { fontSize: 16, color: "#666", marginBottom: 12 },
  shopBtn: { backgroundColor: "#007AFF", paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10 },
  shopBtnText: { color: "#fff", fontWeight: "600" },

  itemRow: { flexDirection: "row", alignItems: "center", marginBottom: 12, backgroundColor: "#fff", padding: 8, borderRadius: 10, elevation: 2 },
  itemImage: { width: 90, height: 90, borderRadius: 8, marginRight: 10, resizeMode: "cover" },
  itemBody: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: "600", color: "#222" },
  itemBrand: { fontSize: 12, color: "#666", marginTop: 4 },
  priceRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  itemPrice: { fontSize: 16, fontWeight: "700", color: "#FFC107" },
  qtyRow: { flexDirection: "row", alignItems: "center" },
  qtyBtn: { width: 28, height: 28, borderRadius: 6, backgroundColor: "#eee", alignItems: "center", justifyContent: "center" },
  qtyText: { marginHorizontal: 8, minWidth: 20, textAlign: "center" },

  removeBtn: { padding: 8 },

  summary: { paddingTop: 12, borderTopWidth: 1, borderTopColor: "#eee", marginTop: 8 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  summaryRowTotal: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, alignItems: "center" },
  totalLabel: { fontSize: 16, fontWeight: "700" },
  totalValue: { fontSize: 18, fontWeight: "800", color: "#222" },

  checkoutBtn: { marginTop: 10, backgroundColor: "#007AFF", paddingVertical: 12, borderRadius: 10, alignItems: "center" },
  checkoutText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
