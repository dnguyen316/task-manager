import { createActions } from "reduxsauce";

const { Types, Creators } = createActions({
  login: ['isLoading'],
  loginSuccess: ['user'],
  signOut: [''],
  register: ['isLoading'],
  registerSuccess: [''],
});
export const UserTypes = Types;
export default Creators;