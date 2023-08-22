import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import BoardTag from 'components/BoardTag.tsx';
import { Board } from 'models/types/Board';
import BoardActions from 'redux/actions/boardAction';
import Modals from 'components/Modals';
import { useState } from 'react';
import AddEditBoardModal from 'components/Modals/AddEditBoardModal';

function Sidebar() {
  const { boards } = useSelector((state: RootState) => state.boardReducer);
  const [isOpenCreateBoardModal, setIsOpenCreateBoardModal] = useState(false);
  const dispatch = useDispatch();

  const boardNumber: number = boards?.length;

  const handleSelectingBoard = (boardID: string) => {
    const selectedBoard = boards.map((board: Board) => {
      if (board.id === boardID) {
        return { ...board, isSelected: true };
      } else {
        return { ...board, isSelected: false };
      }
    });
    dispatch(BoardActions.getBoardsSuccess(selectedBoard));
  }

  const handleOpenCreateBoardModal = () => {
    setIsOpenCreateBoardModal(!isOpenCreateBoardModal)
  }

  return (
    <div className="fixed min-w-[262px] h-screen py-4 top-[100px] bg-white shadow-md hidden md:block">
      <h3 className="text-xl font-semibold mx-4 mb-4 text-gray-600">All boards ({boardNumber})</h3> 
      <div>
        {
          boards?.length > 0 && 
          boards.map((board: Board) => (
            <BoardTag key={board.id} onClick={() => handleSelectingBoard(board.id)} tagName={board.name} isBoardSelected={board.isSelected} />
          ))
        }
        <BoardTag isCreateTag={true} tagName='Create New Board' onClick={handleOpenCreateBoardModal}/>
      </div>
      <Modals isOpen={isOpenCreateBoardModal} onCloseModal={handleOpenCreateBoardModal} content={<AddEditBoardModal onCloseModal={handleOpenCreateBoardModal}/>}/>
    </div>
  )
}

export default Sidebar