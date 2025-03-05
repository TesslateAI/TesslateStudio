import React, { useState, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

const DraggableChatItem = ({ chat, isActive, onSelect, onRename, onDelete, onDrop, index }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(chat.name);
  const [showMenu, setShowMenu] = useState(false);
  const inputRef = useRef(null);
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CHAT',
    item: { id: chat.id, type: 'chat', index, projectId: chat.projectId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'CHAT',
    hover: (item, monitor) => {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      onDrop(item.id, chat.projectId, dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [index]);

  const dragDropRef = drag(drop(ref));

  const handleStartEdit = () => {
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSaveEdit = () => {
    if (editName.trim()) {
      onRename(chat.id, editName);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditName(chat.name);
      setIsEditing(false);
    }
  };

  return (
    <div 
      ref={dragDropRef}
      className={`flex items-center justify-between p-2 rounded cursor-pointer group ${
        isActive ? 'bg-gray-300' : isOver ? 'bg-gray-100' : 'hover:bg-gray-200'
      } ${isDragging ? 'opacity-50' : 'opacity-100'} transform transition-transform`}
      onClick={() => onSelect(chat.id)}
    >
      <div className="flex items-center gap-2 flex-grow">
        <ion-icon name="chatbubble-outline" className="text-gray-600"></ion-icon>
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={handleKeyDown}
            className="bg-white p-1 rounded border flex-grow"
            autoFocus
          />
        ) : (
          <span className="truncate">{chat.name}</span>
        )}
      </div>
      {!isEditing && (
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity relative">
          <button 
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} 
            className="text-gray-500 hover:text-gray-700"
            aria-label="Chat menu"
          >
            <ion-icon name="ellipsis-vertical-outline" size="small"></ion-icon>
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-8 bg-white shadow-lg rounded-md py-1 z-20">
              <button 
                onClick={(e) => { e.stopPropagation(); handleStartEdit(); setShowMenu(false); }} 
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
              >
                <ion-icon name="pencil-outline" size="small"></ion-icon>
                Rename
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(chat.id); }} 
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500 flex items-center gap-2"
              >
                <ion-icon name="trash-outline" size="small"></ion-icon>
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DraggableChatItem;
