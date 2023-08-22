import Logo from '../../assets/logo.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faTrash, faUser } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import Modals from 'components/Modals';
import Dropdown from 'components/Dropdown';
import UserServices from 'services/userServices';
import { useDispatch, useSelector } from 'react-redux';
import UserActions from 'redux/actions/userAction';
import { RootState } from 'redux/store';
import { Board } from 'models/types/Board';
import AddEditTaskModal from 'components/Modals/AddEditTask';
import AddEditBoardModal from 'components/Modals/AddEditBoardModal';
import DeleteBoard from 'components/Modals/DeleteBoard';
import BoardActions from 'redux/actions/boardAction';
import BoardServices from 'services/boardServices';

function Header() {
  const [isTaskModalOpen, setIsTaskModalOpen ] = useState(false);
  const [isOpenUserDropdownMenu, setIsOpenUserDropdownMenu] = useState(false);
  const [isOpenEditBoardModal, setIsOpenEditBoardModal] = useState(false);
  const [isOpenDeleteBoardModal, setIsOpenDeleteTaskModal] = useState(false);

  const { boards }: {boards: Board[]} = useSelector((state: RootState) => state.boardReducer);
  const [selectedBoardName, setSelectedBoardName] = useState('');
  const dispatch = useDispatch();
  
  const currentBoard = boards.find((board: any) => board.isSelected);

  useEffect(() => {
    const selectedBoardName = getSelectedBoardName(boards);
    setSelectedBoardName(selectedBoardName || '');
  }, [boards])

  function getSelectedBoardName(boards: Board[]): string | '' {
    for (const board of boards) {
      if (board.isSelected === true) {
        return board.name;
      }
    }
    return '';
  }

  const handleCloseModal = () => {
    setIsTaskModalOpen(!isTaskModalOpen);
  }

  const handleOpenUserDropdown = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpenUserDropdownMenu(!isOpenUserDropdownMenu)
  }

  const handleSignOut = () => {
    dispatch(UserActions.signOut());
    UserServices.signOut();
  }

  const handleDeleteBoard = () => {
    if(currentBoard?.id){
      const currentBoardID = currentBoard?.id
      const newBoard = boards.filter((board: Board) => {
        return board.id !== currentBoard?.id
      })
      dispatch(BoardActions.getBoardsSuccess(newBoard));
      BoardServices.deleteBoard(currentBoardID)
      setIsOpenDeleteTaskModal(!isOpenDeleteBoardModal)
    }
  }

  const userDropdownContent = () => {
    return (
      <ul className='w-[200px] cursor-pointer'>
        <li onClick={handleSignOut} className='w-full h-10 cursor-pointer text-lg tracking-wide'>Log Out</li>
      </ul>
    )
  }

  return (
    <>
      <div className='fixed top-0 left-0 right-0 bg-white flex items-center justify-between shadow-sm'>
        <div className='flex items-center'>
          <img
            src={Logo}
            className='w-[100px]'
          />
          <div className='font-sans font-bold text-2xl hidden md:block'>
            TaskMagnet
          </div>
        </div>
        <div className='flex-1 ml-10'>
          <p className='text-2xl font-semibold w-fit flex items-center'>
            {selectedBoardName}
            {selectedBoardName && (
              <div>
                <button onClick={() => setIsOpenEditBoardModal(!isOpenEditBoardModal)} className='button ml-4 text-lg text-white bg-sky-300'>
                  <FontAwesomeIcon icon={faPencil} />
                </button>
                <button onClick={() => setIsOpenDeleteTaskModal(!isOpenDeleteBoardModal)} className='button ml-2 text-lg text-white bg-red-300'>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            )}  
          </p>
        </div>
        <div className=''>
          <button className='button py-2 px-3 text-xl' onClick={handleCloseModal}>+ Add More Task</button>
          <div className='inline-block relative'>
            <button className='button py-2 px-3 text-xl ml-3 mr-3' onClick={handleOpenUserDropdown}>
              <FontAwesomeIcon icon={faUser} />
            </button>
            {
            !!isOpenUserDropdownMenu && (
              <Dropdown content={userDropdownContent()} setIsOpenUserDropdownMenu={setIsOpenUserDropdownMenu}/>
            )}
          </div>
        </div>
      </div>

      {/* Task Modal */}
      <Modals 
        isOpen={isTaskModalOpen} 
        content={
          <AddEditTaskModal 
            onCloseModal={handleCloseModal} 
            colIndex={0}
          />} 
        onCloseModal={handleCloseModal}/>
      
      {/* Add Edit Board Modal */}
      <Modals 
        isOpen={isOpenEditBoardModal} 
        content={
          <AddEditBoardModal 
            onCloseModal={() => setIsOpenEditBoardModal(!isOpenEditBoardModal)}
            isEdit={true}
            boardData={currentBoard}
          />} 
        onCloseModal={() => setIsOpenEditBoardModal(!isOpenEditBoardModal)}
      />

      {/* Delete Board Modal */}
      <Modals 
        isOpen={isOpenDeleteBoardModal} 
        content={
          <DeleteBoard 
            onCloseModal={() => setIsOpenDeleteTaskModal(!isOpenDeleteBoardModal)}
            boardName={currentBoard?.name!}
            onDeleteBoard={handleDeleteBoard}
          />} 
        onCloseModal={() => setIsOpenDeleteTaskModal(!isOpenDeleteBoardModal)}
      />
    
    </>
  )
}

export default Header