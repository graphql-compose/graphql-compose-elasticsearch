import {
  inputPropertiesToGraphQLTypes,
  convertToSourceTC,
} from '../mappingConverter';
import cvMapping from './cvMapping';

export const CvFieldMap = inputPropertiesToGraphQLTypes(cvMapping);
export const CvTC = convertToSourceTC(cvMapping, 'Cv');
