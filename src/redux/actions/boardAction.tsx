import { createActions } from "reduxsauce";

const { Types, Creators } = createActions({
  getBoards: ['isLoading'],
  getBoardsSuccess: ['boards'],
  addTask: ['payload'],
  deleteTask: ['payload'],
  editTask: ['payload'],
  addBoard: ['payload'],
  updateBoard: ['payload']
});
export const BoardTypes = Types;
export default Creators;