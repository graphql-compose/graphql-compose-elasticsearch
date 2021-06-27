import { schemaComposer } from 'graphql-compose';
import { inputPropertiesToGraphQLTypes, convertToSourceTC } from '../mappingConverter';
import cvMapping from './cvMapping';

export const CvFieldMap = inputPropertiesToGraphQLTypes(cvMapping);
export const CvTC = convertToSourceTC<any>(schemaComposer, cvMapping, 'Cv');
