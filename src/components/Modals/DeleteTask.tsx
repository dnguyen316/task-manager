export interface IDeleteTaskProps {
  taskTitle: string;
  onCloseModal: () => void;
  onDeleteTask: () => void;
}

function DeleteTask(props: IDeleteTaskProps) {
  const { taskTitle, onCloseModal, onDeleteTask } = props;

  return (
    <div>
      <h3 className="form-header text-red-600">Delete this task</h3>
      <p className="text-base">Are you sure to delete the "{taskTitle}" task. This action cannot be reversed!</p>
      <div className="mt-4">
        <button className="button w-[120px] bg-red-600 mr-2" onClick={onDeleteTask}>Delete</button>
        <button className="button w-[120px]" onClick={onCloseModal}>Cancel</button>
      </div>
    </div>
  )
}

export default DeleteTask;