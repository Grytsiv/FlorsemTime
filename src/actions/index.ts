import * as appServiceActions from './appServiceActions';
import * as loginActions from './authenticationActions';
import * as homeActions from './homeActions';
import * as profileActions from './profileActions';
import * as themeActions from './themeActions';
const ActionCreators = {
    ...appServiceActions,
    ...loginActions,
    ...homeActions,
    ...profileActions,
    ...themeActions,
};
export default ActionCreators;
