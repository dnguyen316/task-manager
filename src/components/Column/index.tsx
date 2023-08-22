import Task from "components/Task";
import { Board } from "models/types/Board";
import { Column as ColumnType } from "models/types/Column";
import { Task as TaskType } from "models/types/Task";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";

export interface IColumnProps {
  colIndex: number;
  data: ColumnType;
}

function Column(props: IColumnProps) {
  const { colIndex, data } = props; 
  const { boards } = useSelector((state: RootState) => state.boardReducer);
  const tasks = data?.tasks;

  return (
    <div className="w-[280px]">
      <h2 className="font-semibold tracking-wider text-lg ">{data.name} ({tasks.length})</h2>
      {
        tasks?.length > 0 && 
          tasks.map((task: TaskType, index) => (
            <Task key={index} data={task} isEdit={true} colIndex={colIndex}/>
          ))
      }
    </div>
  )
}

export default Column