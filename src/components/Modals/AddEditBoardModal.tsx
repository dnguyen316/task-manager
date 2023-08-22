import useForm, { DataType } from 'hooks/useForm'
import { Board } from 'models/types/Board'
import { Column } from 'models/types/Column'
import { User } from 'models/types/User';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { generateUniqueID } from 'utils/function';
import BoardActions from 'redux/actions/boardAction';
import BoardServices from 'services/boardServices';

export interface AddEditBoardModalProps {
  boardData?: Board;
  isEdit?: boolean;
  onCloseModal: (e: React.MouseEvent | React.FormEvent<HTMLFormElement>) => void;
}

function AddEditBoardModal(props: AddEditBoardModalProps) {
  const { boardData, isEdit, onCloseModal } = props;

  const { formData, handleChangeFormData: handleChange, setFormDataWithSpecificFieldValue } = useForm(boardData as DataType)
  const { user: currentUser }: {user: User} = useSelector((state: RootState) => state.userReducer);
  const dispatch = useDispatch();

  const [newColumns, setNewColumns] = useState<Column[]>([
    { name: 'Todo', tasks: [], id: generateUniqueID(10)},
    { name: 'In Progress', tasks: [], id: generateUniqueID(10)},
    { name: 'Blocked', tasks: [], id: generateUniqueID(10)},
    { name: 'Done', tasks: [], id: generateUniqueID(10)},
  ])

  useEffect(() => {
    if(boardData){
      setFormDataWithSpecificFieldValue('title', boardData.name)
      setNewColumns(boardData.columns);
    }
  }, [boardData])

  const submitButtonLabel = isEdit ? 'Save Changes' : 'Create';
  const formHeader = isEdit ? 'Update Board' : 'Create New Board';

  const handleAddNewColumn = () => {
    setNewColumns((state) => [
      ...state,
      { name: '', tasks: [], id: generateUniqueID(10)},
    ]);
  }

  const handleDeleteColumnInput = (columnID: string) => {
    if(!!columnID) {
      const newCols = newColumns.filter((column: Column) => column.id !== columnID);
      setNewColumns(newCols);
    }
  }

  const onChangeNewColumnsValue = (id: string, newValue: string) => {
    setNewColumns((prevState) => {
      const newState = [...prevState];
      const column = newState.find((col) => col.id === id);
      if(column && Object.keys(column).length > 0 ) column.name = newValue;
      return newState;
    });
  };

  const handleCreateNewBoard = () => {
    const newBoard: Board = {
      id: isEdit ? formData.id : generateUniqueID(10), 
      name: formData.title,
      isActive: true, 
      userUID: currentUser.uid ?? '', 
      columns: newColumns,
      isSelected: true, 
    };
    dispatch(BoardActions.addBoard(newBoard));
    BoardServices.createAndSaveBoard(newBoard);
  }

  const handleUpdateBoard = () => {
    if(boardData){
      const newBoard = {
        ...boardData,
        name: formData.title,
        columns: newColumns
      }
  
      const params = {
        boardId: boardData.id,
        updatedBoard: newBoard,
        userUID: currentUser.uid,
      };

      // Update the board in Firestore
      BoardServices.updateBoard(params);
      // Dispatch the action to update the task in the Redux store
      dispatch(BoardActions.updateBoard(newBoard));
    }
  }

  const handleSubmitBoard = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent) => {
    e.preventDefault();
    if(isEdit){
      handleUpdateBoard();
    } else {
      handleCreateNewBoard();
    }
    onCloseModal(e)
  };

  return (
    <>
    <h3 className="form-header">{formHeader}</h3>
    <form className="space-y-6" action="/" onSubmit={handleSubmitBoard}>
      <div>
          <label htmlFor="title" className="form-label">Board Name</label>
          <input onChange={handleChange} value={formData.title} type="text" name="title" className="form-input" placeholder="e.g Create Firebase Functions" required/>
      </div>
      <div>
        <label htmlFor="column" className="form-label">Board Columns</label>
        {/* {
         isEdit ? newColumns.map((column: Column, index) => (
            <div key={column.id} className='flex items-center mt-4'>
              <input onChange={(e) => onChangeNewColumnsValue(column.id, e.target.value)} value={column.name} type="text" className="form-input" placeholder="Add your status"/>
              <button onClick={() => handleDeleteColumnInput(column.id)} type="button" className=" text-gray-500 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-full text-lg w-8 h-8 ml-2 inline-flex justify-center items-center">
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                  </svg>
              </button>
            </div>
          ))
          : <></>
        } */}
        {
          newColumns.map((column: Column, index) => (
            <div key={column.id} className='flex items-center mt-4'>
              <input onChange={(e) => onChangeNewColumnsValue(column.id, e.target.value)} value={column.name} type="text" className="form-input" placeholder="Add your status"/>
              <button onClick={() => handleDeleteColumnInput(column.id)} type="button" className=" text-gray-500 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-full text-lg w-8 h-8 ml-2 inline-flex justify-center items-center">
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                  </svg>
              </button>
            </div>
          ))
        }
        <button onClick={handleAddNewColumn} className='button w-full mt-4' type='button'>
          + Add New Column
        </button>
      </div>
      <button className='button w-full' type='submit'>
        {submitButtonLabel}
      </button>
    </form>
    </>
  )
}

export default AddEditBoardModal;