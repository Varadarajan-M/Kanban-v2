import React, { useState, Fragment } from 'react';
import './Boards.scss';
import Icon from '../common/Icon';
import BasicAddForm from '../tasks/AddTaskForm';
import TaskCard from '../tasks/TaskCard';
import { useProjectData, useUI } from '../hooks';
import { isFalsy, removeAndAddToList, reorderList } from '../lib';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Loader from '../common/Loader';
import { toggleElementFromSet } from './helper';
const Boards = () => {
	const [activeBoardIndexes, setActiveBoardIndexes] = useState(new Set([]));
	const [editingBoardIndexes, setEditingBoardIndexes] = useState(new Set([]));
	const [editingTaskIndexes, setEditingTaskIndexes] = useState(new Set([]));
	const [isAddingBoard, setIsAddingBoard] = useState(false);
	const [boardNamesEditTracker, setBoardNamesEditTracker] = useState({});
	const [taskEditTracker, setTaskEditTracker] = useState({});
	const [inputs, setInputs] = useState({});

	const {
		deleteBoardInfo,
		editBoardName,
		addNewBoard,
		setDeletedStack,
		addNewTask,
		deleteTask: deleteTaskContext,
		editTask,
		updateListOrder,
		projectDetails,
		activeProject,
		addToModifiedBoards,
		removeFromModifiedBoards,
		isProjectShared,
	} = useProjectData();

	const { isLoading, showSidebar } = useUI();

	const onAddIconClick = (index) => toggleElementFromSet(activeBoardIndexes, index, setActiveBoardIndexes);

	const onEditIconClick = (index, boardPos) => {
		toggleElementFromSet(editingBoardIndexes, index, setEditingBoardIndexes);
		setBoardNamesEditTracker((tracker) => ({
			...tracker,
			[boardPos]: '',
		}));
	};
	const onBoardDelete = (boardId, boardPosition) => {
		setDeletedStack((stack) => ({
			...stack,
			boards: [...stack.boards, { _id: boardId }],
			tasks: [
				...stack.tasks,
				...projectDetails.boards[boardPosition]?.tasks?.map((t) => ({
					_id: t._id,
				})),
			],
		}));
		removeFromModifiedBoards(boardPosition);
		deleteBoardInfo(boardPosition);
	};

	const boardNamesChangeHandler = (e, boardPosition) => {
		setBoardNamesEditTracker((tracker) => ({
			...tracker,
			[boardPosition]: e.target.value,
		}));
	};

	const boardNamesEditHandler = (boardPosition, index) => {
		onEditIconClick(index, boardPosition);
		editBoardName(boardPosition, boardNamesEditTracker[[boardPosition]]);
	};

	const toggleBoardAdd = () => setIsAddingBoard(!isAddingBoard);

	const addBoardChangeHandler = (e) => {
		setInputs((ip) => ({
			...ip,
			newBoard: e.target.value,
		}));
	};

	const addBoardSubmitHandler = () => {
		addNewBoard(inputs.newBoard);
		addBoardChangeHandler({ target: { value: '' } });
	};

	const addNewTaskChangeHandler = (e, boardPosition) => {
		setInputs((ip) => ({ ...ip, [boardPosition]: e.target.value }));
	};

	const addNewTaskSubmitHandler = (boardPosition, boardIndex) => {
		addNewTask(inputs[boardPosition] ?? '', boardPosition);
		addNewTaskChangeHandler({ target: { value: '' } }, boardPosition);
		onAddIconClick(boardIndex);
	};

	const deleteTask = (task, boardPosition) => {
		setDeletedStack((stack) => ({
			...stack,
			tasks: [...stack.tasks, { _id: task._id }],
		}));
		addToModifiedBoards(boardPosition);
		deleteTaskContext(task, boardPosition);
	};

	const onTaskEditIconClick = (taskId) => toggleElementFromSet(editingTaskIndexes, taskId, setEditingTaskIndexes);

	const taskEditChangeHandler = (e, task_id) => {
		setTaskEditTracker((tracker) => ({
			...tracker,
			[task_id]: e.target.value,
		}));
	};

	const taskEditSubmitHandler = (boardPos, task_id) => {
		editTask(boardPos, task_id, taskEditTracker[task_id]);
		addToModifiedBoards(boardPos);
		onTaskEditIconClick(task_id);
		taskEditChangeHandler({ target: { value: '' } }, task_id);
	};

	const onDragEnd = (e) => {
		if (isProjectShared) return;

		const source = e.source;
		const destination = e.destination;
		if (!destination) return;

		if (source.droppableId === destination.droppableId && source.index !== destination.index) {
			const destinationBoardPosition = destination.droppableId;
			const tasks = [...projectDetails.boards[destinationBoardPosition].tasks];
			const reorderedTasks = reorderList([...tasks], destination.index, tasks[source.index]);
			addToModifiedBoards(destinationBoardPosition);
			updateListOrder(destinationBoardPosition, reorderedTasks);
		} else if (source.droppableId !== destination.droppableId) {
			const sourceIndex = source.index;
			const destinationIndex = destination.index;

			const sourceBoardPosition = source.droppableId;
			const destinationBoardPosition = destination.droppableId;

			const sourceList = [...projectDetails.boards[sourceBoardPosition].tasks];
			const destinationList = [...projectDetails.boards[destinationBoardPosition].tasks];

			sourceList[sourceIndex].boardId = projectDetails.boards[destinationBoardPosition]._id;

			const modifiedList = removeAndAddToList(sourceList, destinationList, destinationIndex, sourceList[sourceIndex]);

			addToModifiedBoards(sourceBoardPosition);
			addToModifiedBoards(destinationBoardPosition);

			updateListOrder(sourceBoardPosition, modifiedList.sourceList);
			updateListOrder(destinationBoardPosition, modifiedList.destList);
		} else {
			return;
		}
	};

	if (isFalsy(activeProject)) {
		return (
			<div
				style={{
					height: '100%',
					width: '100%',
					display: 'grid',
					placeItems: 'center',
					letterSpacing: '1px',
				}}
			>
				<h4
					style={{
						fontWeight: 300,
					}}
				>
					No Projects Available!
					<p className='mt-1'>
						Click <strong> New </strong> to add one.
					</p>
				</h4>
			</div>
		);
	}

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<div className='boards-wrapper' style={{ marginLeft: showSidebar ? '275px' : '35px' }}>
				{!isLoading ? (
					<Fragment>
						{Object.entries(projectDetails?.boards ?? {}).map(([boardPos, column], index) => {
							return (
								<Droppable key={column._id} droppableId={boardPos}>
									{(provided, snapshot) => (
										<div
											tabIndex={column._id}
											className='board'
											{...provided.droppableProps}
											ref={provided.innerRef}
											style={{
												border: snapshot.isDraggingOver ? '2px solid cyan' : '',
											}}
										>
											<div className='board__header'>
												<div className='board__left'>
													<div className='board__items-length'>{column?.tasks?.length}</div>{' '}
													{!isProjectShared && editingBoardIndexes.has(index) ? (
														<div className='board__edit'>
															<input
																onChange={(e) => boardNamesChangeHandler(e, boardPos)}
																defaultValue={column?.name}
															/>
															<Icon
																type={'Done'}
																onClick={() => boardNamesEditHandler(boardPos, index)}
															/>
														</div>
													) : (
														<span>{column.name}</span>
													)}
												</div>
												{!isProjectShared && (
													<div className='board__right'>
														<Icon
															onClick={() => onAddIconClick(index)}
															type={activeBoardIndexes.has(index) ? 'remove' : 'add'}
															tooltip={'Add a new item to the board'}
														/>
														<Icon
															onClick={() => onEditIconClick(index, boardPos)}
															type={editingBoardIndexes.has(index) ? 'close' : 'edit'}
															tooltip={'Edit board name'}
														/>
														<Icon
															onClick={() => onBoardDelete(column._id, boardPos)}
															type='delete'
															tooltip={'Delete board'}
														/>
													</div>
												)}
											</div>

											<div className='board__tasks'>
												{activeBoardIndexes.has(index) ? (
													<BasicAddForm
														value={inputs[boardPos] ?? ''}
														changeHandler={(e) => addNewTaskChangeHandler(e, boardPos)}
														placeholder={'Enter task item'}
														onAddClick={() => addNewTaskSubmitHandler(boardPos, index)}
														onCancelClick={() => onAddIconClick(index)}
													/>
												) : (
													''
												)}

												{column?.tasks?.map((task, idx) => (
													<Draggable key={task._id} draggableId={task._id} index={idx}>
														{(provided, snapshot) => (
															<div
																{...provided.draggableProps}
																{...provided.dragHandleProps}
																ref={provided.innerRef}
																style={{
																	...provided.draggableProps.style,
																}}
															>
																<TaskCard
																	style={{
																		border: snapshot.isDragging ? '2px solid orangered' : '',
																	}}
																	taskItem={task?.item}
																	isEditing={editingTaskIndexes.has(task._id)}
																	onEditIconClick={() => onTaskEditIconClick(task._id)}
																	onEditSubmit={() => taskEditSubmitHandler(boardPos, task._id)}
																	onDeleteIconClick={() => deleteTask(task, boardPos)}
																	changeHandler={(e) => taskEditChangeHandler(e, task._id)}
																/>
															</div>
														)}
													</Draggable>
												))}
											</div>
											<div>{provided.placeholder}</div>
										</div>
									)}
								</Droppable>
							);
						})}

						{!isProjectShared && (
							<div className='board add__new'>
								<div className='title' onClick={toggleBoardAdd}>
									{' '}
									<Icon type={isAddingBoard ? 'Remove' : 'Add'} />
									<span role='button'> Add New Board</span>{' '}
								</div>
								{isAddingBoard ? (
									<BasicAddForm
										value={inputs?.newBoard ?? ''}
										changeHandler={addBoardChangeHandler}
										onAddClick={addBoardSubmitHandler}
										placeholder={'Enter new board name'}
										onCancelClick={toggleBoardAdd}
									/>
								) : (
									''
								)}
							</div>
						)}
					</Fragment>
				) : (
					<Loader />
				)}
			</div>
		</DragDropContext>
	);
};

export default Boards;
