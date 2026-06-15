import React, { useState } from'react';
import { useAuthStore } from'../store/authStore';
import { useToast } from'../components/Toast';
import { Modal } from'../components/Modal';
import { AchievementBadge } from'../features/actions/AchievementBadge';

export function Profile() {
  const { user, logout } = useAuthStore();
  const { toast } = useToast();
  const [goal, setGoal] = useState(2300);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const handleExport = () => {
    toast({ type:'info', message:'Generating export file...' });
    setTimeout(() => {
      toast({ type:'success', message:'Data exported as JSON' });
    }, 1000);
  };

  const handleDelete = () => {
    if (deleteConfirm !== user?.email) {
      toast({ type:'error', message:'Email does not match' });
      return;
    }
    toast({ type:'success', message:'Account deleted' });
    setDeleteModalOpen(false);
    logout();
  };

  const badges = [
    { id:'1', tier:'bronze' as const, label:'First 100 kg', requiredKg: 100 },
    { id:'2', tier:'silver' as const, label:'500 kg saved', requiredKg: 500 },
    { id:'3', tier:'gold' as const, label:'1 tonne saved', requiredKg: 1000 },
  ];

  const currentSavings = 216;

  return (
    <div className="max-w-3xl mx-auto w-full px-4 animate-in fade-in">
      <h1 className="text-h1 mb-8">Profile & Settings</h1>

      <div className="bg-white  rounded-2xl border border-gray-200  p-6 sm:p-8 mb-8">
        <h2 className="text-h2 mb-4">Personal info</h2>
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
          <div className="w-16 h-16 rounded-full bg-[#e8f0fe]  border border-[#8ab4f8]  flex items-center justify-center text-[20px] font-medium text-[#1967d2]">
            {user?.name ? user.name.substring(0,2).toUpperCase() :'ME'}
          </div>
          <div>
            <div className="text-[15px] font-medium text-gray-900">{user?.name ||'Guest User'}</div>
            <div className="text-[13px] text-gray-500">{user?.email}</div>
          </div>
        </div>

        <h2 className="text-h2 mt-8 mb-4">Goal setting</h2>
        <div className="mb-6">
          <label className="block text-[12px] text-gray-500 mb-4">My annual CO₂e goal</label>
          <div className="flex gap-4 items-center mb-2">
            <input 
              type="range"
              className="flex-1 accent-[#1a73e8]"
              min={500} 
              max={10000} 
              step={100}
              value={goal}
              onChange={e => setGoal(parseInt(e.target.value))}
            />
            <span className="text-[15px] font-medium text-gray-900  min-w-[70px] text-right">{goal.toLocaleString()} kg</span>
          </div>
          <div className="flex justify-between text-[11px] text-gray-400">
            <span>500 kg</span>
            <span className="text-[#1e8e3e]">1.5°C target → 2,300 kg</span>
            <span>10,000 kg</span>
          </div>
        </div>

        <h2 className="text-h2 mt-12 mb-4">Achievements</h2>
        <div className="flex flex-wrap gap-4 mb-8">
          {badges.map(b => (
            <AchievementBadge key={b.id} badge={b} currentSavings={currentSavings} />
          ))}
        </div>

        <h2 className="text-h2 mt-12 mb-4">Data management</h2>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <button 
            onClick={handleExport}
            className="px-4 py-2 border border-gray-200  rounded-xl text-[13px] font-medium text-gray-700  hover:bg-gray-50 :bg-white/5 transition-colors"
            aria-label="Download my data as JSON"
          >
            Export data (JSON)
          </button>
          <button 
            onClick={() => setDeleteModalOpen(true)}
            className="px-4 py-2 bg-red-50 hover:bg-red-100  :bg-red-900/40 text-red-600  rounded-xl text-[13px] font-medium transition-colors"
          >
            Delete account
          </button>
        </div>
      </div>

      <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete account">
        <p className="text-[14px] text-gray-600  mb-6 leading-relaxed">
          This action is permanent. All your emission data, history, and goals will be permanently deleted.
        </p>
        <div className="bg-[#fce8e6]  border-l-2 border-[#d93025]  p-3 text-[13px] text-[#d93025]  mb-6 rounded-r-lg">
          Please type <strong className="font-semibold">{user?.email ||'your email'}</strong> to confirm.
        </div>
        <input 
          type="text"
          value={deleteConfirm}
          onChange={e => setDeleteConfirm(e.target.value)}
          placeholder={user?.email}
          className="w-full h-10 px-3 bg-white  border border-gray-300  rounded-lg text-[13px] mb-6 focus:border-red-500 outline-none"
        />
        <div className="flex gap-3 justify-end items-center">
          <button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 :text-gray-100">Cancel</button>
          <button 
            onClick={handleDelete}
            disabled={deleteConfirm !== user?.email}
            className="px-4 py-2 bg-[#d93025] text-white rounded-lg text-[13px] font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            Permanently delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
