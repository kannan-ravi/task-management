import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import taskReducer from "./features/todo/taskSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { supabaseApi } from "./services/supabaseApi";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  auth: authReducer,
  task: taskReducer,
  [supabaseApi.reducerPath]: supabaseApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(supabaseApi.middleware),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
