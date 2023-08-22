import { useDispatch, useSelector } from 'react-redux';
import BoardAction from 'redux/actions/boardAction';
import { RootState } from 'redux/store';

import { useEffect, useMemo } from 'react';
import { mockBoardsData } from 'services/mockdata/mockBoardsdata';
import BoardService from '../services/boardServices';
import { User } from 'models/types/User';

const useBoards = () => {
  const { isLoading, boards } = useSelector(
    (state: RootState) => state.boardReducer
  );

  const { user }: { user: User } = useSelector(
    (state: RootState) => state.userReducer
  );

  const dispatch = useDispatch();
  const getBoards = async () => {
    try {
      dispatch(BoardAction.getBoards(true));
      if (user.uid) {
        const boardData = await BoardService.getBoardsByUser(user.uid);
        const response = boardData;
        if (response.length > 0) {
          dispatch(BoardAction.getBoardsSuccess(response));
        }
      }
    } catch (err) {
      throw err;
    } finally {
      dispatch(BoardAction.getBoards(false));
    }
  };

  useEffect(() => {
    getBoards();
  }, [user]);

  return useMemo(
    () => ({
      isLoading,
      boards,
    }),
    [isLoading, boards]
  );
};

export default useBoards;
