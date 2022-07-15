import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../services/authService";

// 1 - Catch user from localStorage and auth logics
const user = JSON.parse(localStorage.getItem("user"));
// 1 - Inicial state for reducer
const initialState = {
  user: user ? user : null,
  error: false,
  success: false,
  loading: false,
};

// 3 - Register a user and sign in
export const register = createAsyncThunk(
  // Thunk appointment for dispatch
  "auth/register",

  // Await authService request and add params to receive from dispatch
  async (user, thunkAPI) => {
    const data = await authService.register(user);

    // Check for errors and return the most recently (configured in backend)
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

// 3 - Sing in a user
export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
  const data = await authService.login(user);

  // Check for errors
  if (data.errors) {
    return thunkAPI.rejectWithValue(data.errors[0]);
  }

  return data;
});

// 3 - Logout a user
export const logout = createAsyncThunk("auth/logout", async () => {
  await authService.logout();
});

// 1 - "Slice Reducer" catch states with useSelector
export const authSlice = createSlice({
  // Thunk appointment + inicial state , default(reset)
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.error = false;
      state.success = false;
    },
  },
  // custom reducers
  extraReducers: (builder) => {
    builder
      // Thunk appointment.states
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Set user the res value
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.user = action.payload;
      })
      // Set error de res value
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
      });
  },
});

export const { reset } = authSlice.actions;
// 2 - Export authReducer on store 
export default authSlice.reducer;
