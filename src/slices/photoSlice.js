import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import photoService from "../services/photoService";

const initialState = {
  photos: [],
  photo: {},
  error: false,
  success: false,
  loading: false,
  message: null,
};
// Publish photo
export const publishPhoto = createAsyncThunk(
  "photo/publish",

  async (photo, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await photoService.publishPhoto(photo, token);

    // Check if errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }
    return data;
  }
);

// Get user photos
export const getUserPhotos = createAsyncThunk(
  "photo/getUserPhoto",

  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await photoService.getUserPhotos(id, token);

    return data;
  }
);
// Delete photo
export const deletePhoto = createAsyncThunk(
  "photo/deletePhoto",

  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await photoService.deletePhoto(id, token);

    // Check if errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

// Update photo
export const updatePhoto = createAsyncThunk(
  "photo/update",

  async (photoData, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await photoService.updatePhoto(
      { title: photoData.title },
      photoData.id,
      token
    );
    //Check for errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

// Get photo Id
export const getPhotoById = createAsyncThunk(
  "photo/getId",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await photoService.getPhotoById(id, token);

    return data;
  }
);

//Like a photo
export const like = createAsyncThunk("photo/like", async (id, thunkAPI) => {
  const token = thunkAPI.getState().auth.user.token;

  const data = await photoService.like(id, token);

  //Check for errors
  if (data.errors) {
    return thunkAPI.rejectWithValue(data.errors[0]);
  }

  return data;
});

// Comment a photo
export const comment = createAsyncThunk(
  "photo/comment",
  async (commentData, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await photoService.comment(
      { comment: commentData.comment },
      commentData.id,
      token
    );

    // Check for errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

// Get all photos (Home)
export const getPhotos = createAsyncThunk(
  "photos/get",

  async (_, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await photoService.getPhotos(token);

    return data;
  }
);

// Search photos
export const search = createAsyncThunk(
  "photos/search",

  async (query, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await photoService.search(query, token);

    return data;
  }
);

// Reducer
export const photoSlice = createSlice({
  name: "photo",
  initialState,
  reducers: {
    resetMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(publishPhoto.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(publishPhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.photo = action.payload;
        state.photos.unshift(state.photo);
        state.message = "Foto publicada com sucesso!";
      })
      .addCase(getUserPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photos = action.payload;
      })
      .addCase(deletePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.photo = {};
      })
      .addCase(deletePhoto.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(deletePhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.photos = state.photos.filter((photo) => {
          // Map photos array and return photos with different ._id
          // That received at dispatch function
          return photo._id !== action.payload.id;
        });
        state.message = action.payload.message;
      })
      .addCase(updatePhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        state.photos.map((photo) => {
          if (photo._id === action.payload.photo._id) {
            return (photo.title = action.payload.photo.title);
          }
          return photo;
        });

        state.message = action.payload.message;
      })
      .addCase(updatePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.photo = null;
      })
      .addCase(getPhotoById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPhotoById.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photo = action.payload;
      })
      .addCase(like.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(like.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        //Individual like push
        if (state.photo.likes) {
          state.photo.likes.push(action.payload.userId);
        }
        //Home page or search when u have more photos
        state.photos.map((photo) => {
          if (photo._id === action.payload.photoId) {
            return photo.likes.push(action.payload.userId);
          }
          return photo;
        });
        state.message = action.payload.message;
      })
      .addCase(comment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        state.photo.comments.push(action.payload.comment);

        state.message = action.payload.message;
      })
      .addCase(comment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photos = action.payload;
      })
      .addCase(search.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(search.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photos = action.payload;
      });
  },
});

export const { resetMessage } = photoSlice.actions;
export default photoSlice.reducer;
