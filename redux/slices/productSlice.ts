import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface Product {
  _id: string;
  uniq_id: string;
  crawl_timestamp: string;
  product_url: string;
  product_name: string;
  product_category_tree: any[];
  pid: string;
  retail_price: number;
  discounted_price: number;
  image: string[];
  is_FK_Advantage_product: boolean;
  description: string;
  product_rating: string;
  overall_rating: string;
  brand: string;
  product_specifications: string;
}

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get<Product[]>("http://10.0.2.2:5000/api/products");
      // Make sure to return the full array
      return response.data; 
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [] as Product[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.products = action.payload; // full array
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});


export default productSlice.reducer;
