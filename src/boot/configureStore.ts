import {configureStore, Middleware} from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../sagas/rootSaga';
import {rootReducer} from '../reducers';

const store = () => {
    const sagaMiddleware = createSagaMiddleware();
    let middlewares: Middleware[] = [sagaMiddleware];
    if (__DEV__) {
        const createDebugger = require('redux-flipper').default;
        middlewares.push(createDebugger());
    }
    const toolkitStore = configureStore({
        reducer: rootReducer,
        middleware: getDefaultMiddleware =>
            getDefaultMiddleware({
                serializableCheck: false,
                immutableCheck: false,
            }).concat(middlewares),
    });
    sagaMiddleware.run(rootSaga);
    return toolkitStore;
};
export type TAppDispatch = ReturnType<typeof configureStore>['dispatch'];
export type TRootState = ReturnType<typeof rootReducer>;
export default store;
