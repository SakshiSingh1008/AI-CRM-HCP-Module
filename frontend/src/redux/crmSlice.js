import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formData: {},
  messages: [],
  dashboard: {},
  selectedId: null,
};

const crmSlice = createSlice({
  name: "crm",
  initialState,
  reducers: {
    setFormData: (state, action) => {
      state.formData = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setDashboard: (state, action) => {
      state.dashboard = action.payload;
    },
    setSelectedId: (state, action) => {
      state.selectedId = action.payload;
    },
  },
});

export const {
  setFormData,
  setMessages,
  setDashboard,
  setSelectedId,
} = crmSlice.actions;

export default crmSlice.reducer;