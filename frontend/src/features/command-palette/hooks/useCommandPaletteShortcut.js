import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../../../hooks/index.js';
import {
  closeCommandPalette,
  openCommandPalette,
  selectCommandPaletteOpen,
  toggleCommandPalette,
} from '../store/commandPaletteSlice.js';

export function useCommandPaletteShortcut() {
  const dispatch = useAppDispatch();
  const open = useAppSelector(selectCommandPaletteOpen);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const isModifier = event.metaKey || event.ctrlKey;

      if (isModifier && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        dispatch(toggleCommandPalette());
        return;
      }

      if (event.key === 'Escape' && open) {
        dispatch(closeCommandPalette());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, open]);

  return {
    open,
    openPalette: () => dispatch(openCommandPalette()),
    closePalette: () => dispatch(closeCommandPalette()),
  };
}
