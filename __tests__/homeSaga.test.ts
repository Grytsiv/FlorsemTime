import {expectSaga} from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import {throwError} from 'redux-saga-test-plan/providers';
import {HttpStatusCode} from 'axios';
import {getPaymentList} from '../src/sagas/homeSaga';
import {paymentListApi} from '../src/api/api';
import {
  paymentListSuccessResponse,
  paymentListFailureResponse,
  handlePaymentList,
} from '../src/actions/homeActions';
import {
  showLoadingIndicator,
  hideLoadingIndicator,
} from '../src/actions/appServiceActions';
import {ICompanyResponse} from '../src/models/ICreateLicenseModel.ts';
import {IErrors} from '../src/models/IErrorModel.ts';

describe('homeSaga - getPaymentList', () => {
  const mockPayload = {type: 'GET_PAYMENT_LIST_REQUEST'};
  // @ts-ignore
  const mockAction = handlePaymentList(mockPayload);

  const mockState = {
    authenticationReducer: {
      refreshToken: 'test-token',
    },
    profileReducer: {
      user: {id: 1}, // Користувач вже завантажений
    },
    appServiceReducer: {
      netInfoState: {
        isInternetReachable: true,
      },
    },
  };

  it('successfully loading payment list', () => {
    const mockApiResponse = {
      status: HttpStatusCode.Ok,
      data: [
        {
          title: 'Company 1',
          data: {id: 1, type: 0, agBalance: 50, smsBalance: 950.3},
        },
        {
          title: 'Company 2',
          data: {id: 2, type: 1, daysRemained: 15},
        },
      ],
    };

    return (
      expectSaga(getPaymentList, mockAction)
        .withState(mockState)
        .provide([[matchers.call.fn(paymentListApi.get), mockApiResponse]])
        .put(showLoadingIndicator())
        .put(
          paymentListSuccessResponse(
            mockApiResponse.data as ICompanyResponse[],
          ),
        )
        .put(hideLoadingIndicator())
        .silentRun()
    );
  });

  it('handles no internet error', async () => {
    const noInternetState = {
      ...mockState,
      appServiceReducer: {
        netInfoState: {
          isInternetReachable: false,
        },
      },
    };

    const result = await expectSaga(getPaymentList, mockAction)
      .withState(noInternetState)
      .silentRun(5000); // Increase the timeout to 5 seconds

    // Check that noneInternetConnection has been called at least once
    const noneInternetActions = result.effects.put.filter(
      (effect: any) =>
        effect.payload.action.type === 'NONE_INTERNET_CONNECTION',
    );
    expect(noneInternetActions.length).toBeGreaterThan(0);

    // Check that the loader did not start
    const showLoadingActions = result.effects.put.filter(
      (effect: any) => effect.payload.action.type === 'SHOW_LOADING_INDICATOR',
    );
    expect(showLoadingActions.length).toBe(0);
  });

  it('handles API error (not 401)', () => {
    const errorData: IErrors = {
      status: HttpStatusCode.InternalServerError,
      message: ['Server Error'],
      errors: [
        {
          code: HttpStatusCode.InternalServerError.toString(),
          detail: 'Internal Server Error',
          id: '001',
          source: {},
          status: HttpStatusCode.InternalServerError.toString(),
          title: 'Internal Server Error',
        },
      ],
    };

    const error = Object.assign(new Error('Server Error'), errorData);

    return expectSaga(getPaymentList, mockAction)
      .withState(mockState)
      .provide([[matchers.call.fn(paymentListApi.get), throwError(error)]])
      .put(showLoadingIndicator())
      .put(paymentListFailureResponse(error))
      .put(hideLoadingIndicator())
      .silentRun();
  });
});
