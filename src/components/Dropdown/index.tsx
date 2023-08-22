import { Dispatch, SetStateAction } from "react";

export interface IDropdownProps {
  content?: JSX.Element;
  setIsOpenUserDropdownMenu?: Dispatch<SetStateAction<boolean>>
}

function Dropdown(props: IDropdownProps) {
  const { content } = props;

  return (
    <div className="absolute top-full right-0 bg-white rounded-md min-w-[200px] py-3 px-3 shadow-md">
      {content}
    </div>
  )
}

export default Dropdown