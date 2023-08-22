export interface IDeleteBoardProps {
  boardName: string;
  onCloseModal: () => void;
  onDeleteBoard: () => void;
}

function DeleteBoard(props: IDeleteBoardProps) {
  const { boardName, onCloseModal, onDeleteBoard } = props;

  return (
    <div>
      <h3 className="form-header text-red-600">Delete this board</h3>
      <p className="text-base">Are you sure to delete the "{boardName}" board. This action cannot be reversed!</p>
      <div className="mt-4">
        <button className="button w-[120px] bg-red-600 mr-2" onClick={onDeleteBoard}>Delete</button>
        <button className="button w-[120px]" onClick={onCloseModal}>Cancel</button>
      </div>
    </div>
  )
}

export default DeleteBoard;