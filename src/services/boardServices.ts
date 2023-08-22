import { Board } from 'models/types/Board';
import { db } from '../config/firebase';
import {
  collection,
  addDoc,
  query,
  where,
  QuerySnapshot,
  DocumentData,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  setDoc,
} from 'firebase/firestore';
import { generateUniqueID } from 'utils/function';

const BoardServices = {
  getAllBoard: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'boards'));
      const boards: Board[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data?.name,
          isActive: data?.isActive,
          userUID: data?.userUID,
          columns: data?.columns,
          isSelected: data?.isSelected,
        };
      });
      return boards;
    } catch (err) {
      throw err;
    }
  },

  getBoardsByUser: async (userUID: string) => {
    try {
      const q = query(
        collection(db, 'boards'),
        where('userUID', '==', userUID)
      );
      const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);
      const boards: Board[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data?.name,
          isActive: data?.isActive,
          userUID: data?.userUID,
          columns: data?.columns,
          isSelected: data?.isSelected,
        };
      });
      return boards;
    } catch (error: any) {
      console.error('Error fetching boards:', error.message);
      throw error;
    }
  },

  createAndSaveBoard: async (newBoard: Board) => {
    try {
      // Create the board object
      const boardData: Board = {
        id: newBoard.id,
        name: newBoard.name,
        isActive: newBoard.isActive,
        userUID: newBoard.userUID,
        columns: newBoard.columns || [],
        isSelected: newBoard.isSelected,
      };

      // Add the new board to Firestore
      // await addDoc(collection(db, 'boards'), boardData);

      const boardRef = doc(db, 'boards', newBoard.id);
      await setDoc(boardRef, boardData);

      // Set isSelected to false for other boards
      const allBoardsSnapshot = await getDocs(collection(db, 'boards'));
      allBoardsSnapshot.forEach((doc) => {
        if (doc.id !== newBoard.id) {
          setDoc(doc.ref, { isSelected: false }, { merge: true });
        }
      });
      console.log(
        'Board created and saved to Firebase Firestore successfully.'
      );
    } catch (error) {
      console.error(
        'Error creating and saving board to Firebase Firestore:',
        error
      );
      throw error;
    }
  },

  updateBoard: async (params: {
    boardId: string;
    updatedBoard: Board;
    userUID: string;
  }) => {
    try {
      // Reference the board document
      const { boardId, updatedBoard, userUID } = params;
      const boardRef = doc(db, 'boards', boardId);

      // Update the board document with the updated data and set isSelected to true
      await updateDoc(boardRef, {
        name: updatedBoard.name,
        isActive: updatedBoard.isActive,
        userUID: updatedBoard.userUID,
        columns: updatedBoard.columns || [],
        isSelected: true,
      });

      BoardServices.updateSelectedBoard({ boardId, userUID });
    } catch (error: any) {
      console.error(
        'Error updating board in Firebase Firestore:',
        error.message
      );
      throw error;
    }
  },

  updateSelectedBoard: async (params: { userUID: string; boardId: string }) => {
    const { userUID, boardId } = params;
    // Query Firestore to find all boards for the user
    const boardsQuery = query(
      collection(db, 'boards'),
      where('userUID', '==', userUID)
    );
    const querySnapshot = await getDocs(boardsQuery);

    // Update all other boards by setting isSelected to false
    const updatePromises = querySnapshot.docs.map(async (doc) => {
      const otherBoardId = doc.id;
      const otherBoardRef = doc.ref;

      // Skip the board being updated
      if (otherBoardId === boardId) {
        return;
      }

      // Update the other board document to set isSelected to false
      await updateDoc(otherBoardRef, {
        isSelected: false,
      });

      return otherBoardId;
    });

    // Wait for all board updates to complete
    await Promise.all(updatePromises);
  },

  deleteBoard: async (boardID: string) => {
    try {
      // Reference the board document
      const boardRef = doc(db, 'boards', boardID);

      // Delete the board document
      await deleteDoc(boardRef);

      console.log(
        `Board with ID ${boardID} deleted from Firebase Firestore successfully.`
      );
    } catch (error: any) {
      console.error(
        'Error deleting board from Firebase Firestore:',
        error.message
      );
      throw error;
    }
  },
};

export default BoardServices;
