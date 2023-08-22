import { createActions } from "reduxsauce";

const { Types, Creators } = createActions({
  login: ['isLoading'],
  loginSuccess: ['user'],
  signOut: [''],
  register: [''],
  registerSuccess: [''],
});
export const UserTypes = Types;
export default Creators;