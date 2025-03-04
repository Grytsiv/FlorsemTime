import {all, call, fork} from 'redux-saga/effects';
// sagas
import florsemSaga from './florsemSaga';
import homeSaga from './homeSaga';
import authenticationSaga from './authenticationSaga';

function* logReduxSagaInitialized() {
    yield call([console, 'log'], 'redux-sagas is READY to Run!');
}

export default function* rootSaga() {
    yield all([
        fork(logReduxSagaInitialized),
        fork(authenticationSaga),
        fork(homeSaga),
        fork(florsemSaga),
    ]);
}
