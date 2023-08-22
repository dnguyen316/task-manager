import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions({
  showToastMsg:['payload'],
});

export const BaseTypes = Types;
export default Creators;
