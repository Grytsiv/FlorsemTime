import {configureStore, Middleware} from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../sagas/rootSaga';
import {rootReducer} from '../reducers';

const sagaMiddleware = createSagaMiddleware();
let middlewares: Middleware[] = [sagaMiddleware];

if (__DEV__) {
    const createDebugger = require('redux-flipper').default;
    middlewares.push(createDebugger());
}

const store = configureStore({
        reducer: rootReducer,
        middleware: getDefaultMiddleware =>
            getDefaultMiddleware({
                serializableCheck: false,
                immutableCheck: false,
            }).concat(middlewares),
});

sagaMiddleware.run(rootSaga);

export type TRootState = ReturnType<typeof store.getState>;
export type TAppDispatch = typeof store.dispatch;

export default store;
