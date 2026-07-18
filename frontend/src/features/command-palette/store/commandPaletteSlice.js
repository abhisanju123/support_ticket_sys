import { createSlice } from '@reduxjs/toolkit';

const commandPaletteSlice = createSlice({
  name: 'commandPalette',
  initialState: {
    open: false,
  },
  reducers: {
    openCommandPalette(state) {
      state.open = true;
    },
    closeCommandPalette(state) {
      state.open = false;
    },
    toggleCommandPalette(state) {
      state.open = !state.open;
    },
  },
});

export const { openCommandPalette, closeCommandPalette, toggleCommandPalette } =
  commandPaletteSlice.actions;
export const commandPaletteReducer = commandPaletteSlice.reducer;
export const selectCommandPaletteOpen = (state) => state.commandPalette.open;
