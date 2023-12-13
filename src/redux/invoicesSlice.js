import { createSlice } from "@reduxjs/toolkit";

const invoicesSlice = createSlice({
  name: "invoices",
  initialState: [],
  reducers: {
    addInvoice: (state, action) => {
      state.push(action.payload);
    },
    deleteInvoice: (state, action) => {
      return state.filter((invoice) => invoice.id !== action.payload);
    },
    updateInvoice: (state, action) => {
      const index = state.findIndex(
        (invoice) => invoice?.id?.toString() === action?.payload?.id?.toString()
      );
      if (index !== -1) {
        state[index] = action.payload.updatedInvoice;
      }
    },
    bulkEdit: (state, action) => {
      action?.payload?.id.forEach((id, idx) => {
        let index = state.findIndex(
          (invoice) => id.toString() === invoice?.id.toString()
        );
        if (index !== -1) {
          state[index] = action?.payload?.updatedInvoice[idx];
        }
      })
    },
  },
});

export const {
  addInvoice,
  deleteInvoice,
  updateInvoice,
  bulkEdit,
} = invoicesSlice.actions;

export const selectInvoiceList = (state) => state.invoices;

export default invoicesSlice.reducer;
