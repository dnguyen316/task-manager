
interface IModalsProps {
  isOpen?: boolean;
  content?: JSX.Element;
  onCloseModal: (e: React.MouseEvent) => void;
}
function Modals(props: IModalsProps) {
  const { isOpen, onCloseModal, content } = props;

  const handleOnCloseWrapperModal = (e: React.MouseEvent) => {
      if(e.target !== e.currentTarget) return;
      onCloseModal(e);
  }

  return (
    <>
    {
      isOpen && (
        <div onClick={(e) => handleOnCloseWrapperModal(e)} className="shadow-md fixed top-0 left-0 right-0 flex items-center justify-center bg-[#00000080] z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
            <div className="relative w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <button onClick={onCloseModal} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-full text-sm w-8 h-8 ml-auto inline-flex justify-center items-center" data-modal-hide="authentication-modal">
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                    </button>
                    <div className="px-6 py-6 lg:px-8">
                      {content}
                    </div>
                </div>
            </div>
        </div> 
      )
    }
    </>
  )
}

export default Modals;