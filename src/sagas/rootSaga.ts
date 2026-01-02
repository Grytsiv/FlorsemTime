import {all, call, fork} from 'redux-saga/effects';
// sagas
import authenticationSaga from './authenticationSaga';
import homeSaga from './homeSaga';
import florsemSaga from './florsemSaga';
import khymcorSaga from './khymcorSaga';

function* logReduxSagaInitialized() {
    yield call([console, 'log'], 'redux-sagas is READY to Run!');
}

export default function* rootSaga() {
  yield all([
    fork(logReduxSagaInitialized),
    fork(authenticationSaga),
    fork(homeSaga),
    fork(florsemSaga),
    fork(khymcorSaga),
  ]);
}
