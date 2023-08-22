import useForm, { DataType } from 'hooks/useForm';
import useStatusOptions from 'hooks/useStatusOptions';
import { Task } from 'models/types/Task';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input, initTE, Select } from 'tw-elements';
import BoardActions from 'redux/actions/boardAction';
import BoardServices from 'services/boardServices';
import { RootState } from 'redux/store';
import { Board } from 'models/types/Board';
import { addTaskToSelectedBoard, generateUniqueID, updateTaskInSelectedBoard } from 'utils/function';
import { User } from 'models/types/User';
import { Column } from 'models/types/Column';
import Modals from '.';
import DeleteTask from './DeleteTask';

export interface AddEditTaskModalProps {
  onCloseModal: (e: React.MouseEvent) => void;
  taskData?: Task;
  isEdit?: boolean; 
  colIndex: number;
}

export interface AddTaskFormState {
  title: string;
  description: string;
  status: string;
  dueDate: string;
}

function AddEditTaskModal(props: AddEditTaskModalProps) {

  const { onCloseModal, taskData, isEdit, colIndex } = props;

  const { formData, handleChangeFormData: handleChange, setFormDataWithSpecificFieldValue } = useForm(taskData as DataType)

  const { statusOptions } = useStatusOptions();

  const [isOpenDeleteTaskModal, setIsOpenDeleteTaskModal ] = useState(false);

  const { user }: {user: User} = useSelector((state: RootState) => state.userReducer);
  const { boards }: {boards: Board[]} = useSelector((state: RootState) => state.boardReducer);
  const currentBoard = boards.find((board: any) => board.isSelected);
  const currentColumn = currentBoard?.columns[colIndex]
  const selectedTaskId = taskData?.id ;

  const dispatch = useDispatch();
  useEffect(() => {
    initTE({ Input, Select});
  }, [])

  useEffect(() => {
    if(statusOptions.length > 0){
      if(taskData?.status){
        setFormDataWithSpecificFieldValue('status', taskData.status);
      } else{
        setFormDataWithSpecificFieldValue('status', statusOptions[0]?.name);
      }
    }
  }, [statusOptions]);

  const modalHeaderLabel = isEdit ? 'Save Changes' : 'Add New Task';
  const submitButtonLabel = isEdit ? 'Update' : 'Create Task'

  const handleDeleteTask = () => {
    if(currentColumn){
      
      const newTasks: Task[] = currentColumn.tasks.filter((task: Task) => {
        return task.id !== selectedTaskId
      })
  
      const newCols: Column[] = currentBoard?.columns.map(
        (column: Column, index: number) => {
          if (index === colIndex) {
            // Update the tasks in the current column
            column.tasks = newTasks;
          }
          return column;
        }
      );

      const newBoard: Board = {
        ...currentBoard,
        columns: newCols
      }
  
      const params = {
        boardId: currentBoard.id,
        updatedBoard: newBoard,
        userUID: user.uid,
      };

      // Update the board in Firestore
      BoardServices.updateBoard(params);
      // Dispatch the action to update the task in the Redux store
      dispatch(BoardActions.updateBoard(newBoard));
    }
  }

  const handleUpdateTask = () => {

  const selectedTaskStatus = taskData?.status
  const isStatusTaskChanged = taskData?.status !== formData.status;

  const updatedTask: Task = {
    ...formData as Task,
    id: generateUniqueID(10),
  }

  if(isStatusTaskChanged) {
    //Move this task to the matching column have the name same as the task status
    const matchingColumn = currentBoard?.columns.find((column: Column) => column.name === formData.status);
    if(currentColumn && matchingColumn) {
      // Remove the task from its current column
      currentColumn.tasks = currentColumn.tasks.filter(task => task.id !== selectedTaskId);
      // Push updated task to matching column
      matchingColumn?.tasks?.push(updatedTask);

      const updatedNewBoard = currentBoard.columns.map((column: Column) => {
        if(column.name === formData.status) {
          return matchingColumn
        }
        if(column.name === selectedTaskStatus) {
          // Update the current column with the task removed
          return currentColumn;
        }
        return column;
      });
      // Dispatch the action to update the task in the Redux store
      dispatch(BoardActions.updateBoard(updatedNewBoard));
    }
  } 
  else{
    if (currentBoard && selectedTaskId) {
      // Create an updated board with the task updated
      const updatedBoard: Board | undefined = updateTaskInSelectedBoard(
        currentBoard,
        selectedTaskId,
        {
          title: formData.title,
          status: formData.status,
          description: formData.description,
          dueDate: formData.dueDate,
        } as Task
      );
  
      if (updatedBoard) {
        const params = {
          boardId: currentBoard.id,
          updatedBoard: updatedBoard,
          userUID: user.uid,
        };
  
        // Update the board in Firestore
        BoardServices.updateBoard(params);
        // Dispatch the action to update the task in the Redux store
        dispatch(BoardActions.updateBoard(updatedBoard));
      }
    }
  }
  }
  

  const handleCreateTask = () => {
    const payload = {
      id: generateUniqueID(10),
      title: formData.title,
      status: formData.status,
      description: formData.description,
      dueDate: formData.dueDate, 
    }

    const updatedBoard: Board | undefined = addTaskToSelectedBoard(boards, payload);
    if(currentBoard && updatedBoard) {
      const params = {
        boardId: currentBoard?.id,
        updatedBoard: updatedBoard,
        userUID: user.uid
      }
      BoardServices.updateBoard(params)
    }
    dispatch(BoardActions.addTask(payload))
  }

  const handleSubmitTaskData = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent, isEdit?: boolean) => {
    e.preventDefault();
    if(!isEdit){
      handleCreateTask();
    } else {
      handleUpdateTask();
    }
    onCloseModal(e as React.MouseEvent)
  }

  return (
    <>
    <h3 className="form-header">{modalHeaderLabel}</h3>
    <form className="space-y-6" action="/" onSubmit={(e) => handleSubmitTaskData(e, isEdit)}>
        <div>
            <label htmlFor="title" className="form-label">Task Name</label>
            <input onChange={handleChange} value={formData.title} type="text" name="title" className="form-input" placeholder="e.g Create Firebase Functions" required/>
        </div>
        <div>
            <label htmlFor="description" className="form-label">Description</label>
            <textarea onChange={handleChange} value={formData.description} name="description" placeholder="Develop Firebase Functions for task completion notifications." className="form-input min-h-[200px]" required/>
        </div>
        <div>
            <label htmlFor="status" className="form-label">Current Status</label>
            <select onChange={handleChange} value={formData.status} data-te-select-init name="status" className="form-input">
              {
                statusOptions.map((option, index) => (
                  <option key={option.id}>{option.name}</option>
                ))
              }
            </select>
        </div>
        <div>
          <label htmlFor="dueDate" className="form-label">Due Date</label>
          <input
              type="date"
              name='dueDate'
              value={formData.dueDate}
              min={JSON.stringify(new Date())}
              onChange={handleChange}
              className="form-input"
             />
      </div>
      {
        isEdit && (
          <button className='button w-full bg-red-600' type='button' onClick={() => setIsOpenDeleteTaskModal(!isOpenDeleteTaskModal)}>
            Delete
          </button>
        )
      }
      <button className='button w-full' type='submit'>
        {submitButtonLabel}
      </button>
    </form>
    <Modals 
      content={
      <DeleteTask 
        onCloseModal={() => setIsOpenDeleteTaskModal(!isOpenDeleteTaskModal)}
        taskTitle={taskData?.title!}
        onDeleteTask={handleDeleteTask}
      />} 
      isOpen={isOpenDeleteTaskModal} 
      onCloseModal={() => setIsOpenDeleteTaskModal(!isOpenDeleteTaskModal)}
    />
    </>
  )
}

export default AddEditTaskModal