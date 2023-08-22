import { Board } from "models/types/Board";
import { BoardTypes } from "redux/actions/boardAction";
import { addTaskToSelectedBoard } from "utils/function";

const initialState = {
  isLoading: true,
  boards: [] as Board[],
};

const boardReducer = (state = initialState, action: any) => {
  const { isLoading, boards, payload } = action;

  switch (action.type) {
    case BoardTypes.GET_BOARDS:
      return {
        ...state,
        isLoading,
      };

    case BoardTypes.GET_BOARDS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        boards,
      };

    case BoardTypes.ADD_TASK:
      const updatedBoardWithNewTask = addTaskToSelectedBoard(state.boards, payload);
      if(updatedBoardWithNewTask) {
        const newBoards = state.boards.map((board: Board) => {
          if(board.id === updatedBoardWithNewTask.id) return updatedBoardWithNewTask;
          return board;
        })
        return {
          ...state,
          boards: newBoards
        }
      } else {
        return state
      }
      case BoardTypes.ADD_BOARD:
        // Create a new board object
        const newBoard = payload;

        // Create a new array with the new board added
        const newBoards = [...state.boards, newBoard];

        // Set isSelected to false for other boards
        const updatedBoards = newBoards.map((board: Board) => ({
          ...board,
          isSelected: board.id === newBoard.id, // Set isSelected to true only for the new board
        }));

        return {
          ...state,
          boards: updatedBoards,
        };
      case BoardTypes.UPDATE_BOARD:
        const newUpdatedBoard = payload;

        const newUpdatedBoards = state.boards.map((board: Board) => {
          if(board.id === newUpdatedBoard.id) return newUpdatedBoard
          return board
        })
        return {
          ...state,
          boards: newUpdatedBoards
        }

    default:
      return state;
  }
};

export default boardReducer;