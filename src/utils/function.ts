import { Board } from 'models/types/Board';
import { Column } from 'models/types/Column';
import { Task } from 'models/types/Task';

/**
 * Generates a unique ID based on the specified length and character set.
 * @param {number} length - The length of the generated ID (default is 8 characters).
 * @param {string} charset - The character set to use for generating the ID
 *                          (default includes letters and numbers).
 * @returns {string} The generated unique ID.
 */
export function generateUniqueID(
  length = 8,
  charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
) {
  let id = '';
  const charsetLength = charset.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charsetLength);
    id += charset[randomIndex];
  }

  return id;
}

/**
 * Adds a task to the selected board's matching column.
 *
 * @param {Board[]} boards - An array of Board objects.
 * @param {Task} data - The Task object to add.
 * @return {Board | undefined} An updated Board object with the new task added, or undefined if no changes are made.
 */
export function addTaskToSelectedBoard(
  boards: Board[],
  data: Task
): Board | undefined {
  // Find the selected board
  const currentBoard = boards.find((board: any) => board.isSelected);

  // No selected board found, return the original state
  if (!currentBoard) return;

  // Find the column to which the task should be added
  const matchingColumn = currentBoard.columns.find(
    (column: Column) => column.name === data.status
  );

  // No matching column found, return the original state
  if (!matchingColumn) return;

  // Create a new task object with a unique ID
  const newTask = data;

  // Create an updated board with the new task added to the matching column
  const updatedBoard = {
    ...currentBoard,
    columns: currentBoard.columns.map((column: Column) => {
      if (column.name === data.status) {
        return {
          ...column,
          tasks: [...column.tasks, newTask],
        };
      }
      return column;
    }),
  };

  return updatedBoard;
}

/**
 * Updates a task within the selected board based on the task ID.
 *
 * @param {Board} selectedBoard - The selected Board object.
 * @param {string} taskId - The ID of the task to update.
 * @param {Task} updatedTaskData - The updated task data.
 * @return {Board | undefined} An updated Board object with the task updated, or undefined if no changes are made.
 */
export function updateTaskInSelectedBoard(
  selectedBoard: Board,
  taskId: string,
  updatedTaskData: Task
): Board | undefined {
  // Create a copy of the selected board to avoid mutating the original board
  const updatedBoard: Board = { ...selectedBoard };

  // Iterate through the columns to find and update the task
  updatedBoard.columns = updatedBoard.columns.map((column: Column) => {
    // Check if the task exists in this column
    const taskIndex = column.tasks.findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
      // Update the task with the new data
      column.tasks[taskIndex] = {
        ...column.tasks[taskIndex],
        ...updatedTaskData,
      };
    }
    return column;
  });

  return updatedBoard;
}
