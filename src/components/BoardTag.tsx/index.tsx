import BoardIcon from '../../assets/board.svg';

export interface IBoardTagProps {
  tagName: string;
  isBoardSelected?: boolean;
  onClick: (e: React.MouseEvent) => void;
  isCreateTag?: boolean;
}

function BoardTag(props: IBoardTagProps) {
  const { tagName, isBoardSelected, onClick, isCreateTag } = props;
  
  return (
    <div onClick={onClick} className={`flex items-center mr-10 h-16 rounded-e-full  pl-4 cursor-pointer hover:text-sky-500 hover:bg-sky-100 duration-200 ${isBoardSelected ? 'board-tag-selected': ''}`}>
      <img className={`board-tag-img`} src={BoardIcon} alt="" />
      <p className={`board-tag-name ${isCreateTag ? 'text-sky-500' : ''}`}>
        { tagName }
      </p>
    </div>
  )
}

export default BoardTag