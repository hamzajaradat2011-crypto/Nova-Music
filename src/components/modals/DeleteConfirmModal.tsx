import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  title: string;
  itemType?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  title,
  itemType = 'song',
  onConfirm,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-red-500/30 w-full max-w-sm rounded-[32px] p-5 space-y-4 shadow-2xl relative text-white text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-300 transition"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="w-12 h-12 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 mx-auto flex items-center justify-center pt-0.5">
          <Trash2 className="w-6 h-6 text-red-400" />
        </div>

        <div>
          <h3 className="text-sm font-bold text-white">Delete {itemType}?</h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
            Are you sure you want to remove <strong className="text-zinc-200">"{title}"</strong> from your library?
          </p>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={onClose}
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-2.5 rounded-2xl text-xs font-bold transition border border-zinc-700/50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2.5 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-lg shadow-red-900/40"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
