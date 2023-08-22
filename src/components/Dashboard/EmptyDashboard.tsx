import Modals from 'components/Modals';
import AddEditBoardModal from 'components/Modals/AddEditBoardModal';
import { useState } from 'react'

function EmptyDashboard() {
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  return (
    <div className=" bg-white h-screen w-screen flex flex-col  items-center justify-center">
      <h3 className=" text-gray-500 font-bold">
        "This board is empty. Create a new column to get started."
      </h3>
      <button
        onClick={() => {
          setIsBoardModalOpen(true);
        }}
        className="w-full items-center max-w-xs font-bold hover:opacity-70 mt-8 relative text-white bg-sky-50 py-2 rounded-full"
      >
      </button>

       {/* Add Edit Board Modal */}
       <Modals
        isOpen={isBoardModalOpen} 
        content={
          <AddEditBoardModal
            onCloseModal={() => setIsBoardModalOpen(!isBoardModalOpen)}
          />} 
        onCloseModal={() => setIsBoardModalOpen(!isBoardModalOpen)}
      />
    </div>
  );
}

export default EmptyDashboard