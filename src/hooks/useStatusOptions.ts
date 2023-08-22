import { Board } from 'models/types/Board';
import { Column } from 'models/types/Column';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';

export interface IStatusOptions {
  id: string;
  name: string;
}

const useStatusOptions = () => {
  const { boards } = useSelector((state: RootState) => state.boardReducer);
  const currentBoard = boards.filter((board: Board) => board.isSelected)[0];
  const columns = currentBoard?.columns;

  const [statusOptions, setStatusOptions] = useState<IStatusOptions[]>([]);

  useEffect(() => {
    if (columns?.length > 0) {
      const newStatusOptions = columns.map((column: Column) => ({
        name: column.name,
        id: column.id,
      }));
      setStatusOptions(newStatusOptions);
    }
  }, [columns]);

  return {
    statusOptions,
  };
};

export default useStatusOptions;
