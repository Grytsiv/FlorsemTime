import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import type {TRootState, TAppDispatch} from './configureStore';
// Use throughout your app instead of plain `useDispatch` and `useSelector`
type DispatchFunc = () => TAppDispatch;
export const useAppDispatch: DispatchFunc = useDispatch;
export const useAppSelector: TypedUseSelectorHook<TRootState> = useSelector;
