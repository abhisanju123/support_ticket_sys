import { useDispatch, useSelector } from 'react-redux';

/** @returns {import('./store.js').AppDispatch} */
export const useAppDispatch = () => useDispatch();

/** @type {import('react-redux').TypedUseSelectorHook<import('./store.js').RootState>} */
export const useAppSelector = useSelector;
