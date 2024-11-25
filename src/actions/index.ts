import * as appServiceActions from './appServiceActions';
import * as themeActions from './themeActions';
import * as loginActions from './authenticationActions';
import * as homeActions from './homeActions';
const ActionCreators = {
    ...appServiceActions,
    ...themeActions,
    ...loginActions,
    ...homeActions,
};
export default ActionCreators;
