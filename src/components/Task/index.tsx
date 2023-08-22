import { Task as TaskType } from "models/types/Task"
import Modals from "components/Modals";
import AddEditTaskModal from "components/Modals/AddEditTask";
import { useState } from "react";

export interface ITaskProps {
  data: TaskType;
  onClick?: (e: React.MouseEvent) => void;
  isEdit?: boolean;
  colIndex: number;
}

function Task(props: ITaskProps) {
  const { data, onClick, isEdit, colIndex } = props;

  const [isOpenEditTaskModal, setIsOpenEditTaskModal] = useState(false);

  const onCloseModal = () => {
    setIsOpenEditTaskModal(!isOpenEditTaskModal)
  }

  return (
    <>
      <div onClick={onCloseModal} className="card">
        <h3 className="card-title">{data.title}</h3>
        <p className="card-description">{data.description}</p>
        <p className="card-due-date">{data.dueDate}</p>
      </div>
      <Modals
        content={
        <AddEditTaskModal 
          taskData={data} 
          onCloseModal={onCloseModal} 
          isEdit={isEdit} 
          colIndex={colIndex}
        />}
        onCloseModal={onCloseModal}
        isOpen={isOpenEditTaskModal}
      />
    </>
  )
}

export default Task