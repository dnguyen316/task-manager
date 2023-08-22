import Column from "components/Column";
import Loading from "components/Loading";
import useBoards from "hooks/useBoards";
import { Board } from "models/types/Board";
import EmptyDashboard from "./EmptyDashboard";
// import { useSelector } from "react-redux";
// import { RootState } from "redux/store";

function Dashboard() {
  const { isLoading, boards } = useBoards();
  const selectedBoard: Board = boards.find((board: Board) => board.isSelected === true);
  const columns = selectedBoard?.columns;

  return (
    <>
      { isLoading && <Loading/>}
      <div className="md:ml-[262px] min-w-[1240px] bg-sky-50 h-screen pt-[120px] pl-8 flex gap-8 w-screen md:w-full md:overflow-hidden pr-4">
        {
          columns?.length > 0 ? (
            <>
              { columns.map((column, index) => (
                  <Column key={index} colIndex={index} data={column}/>
                )) 
              }
            </>
          ) : <EmptyDashboard/>
        }
      </div>
    </>
  )
}

export default Dashboard