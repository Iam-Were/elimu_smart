import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, X, AlertCircle } from 'lucide-react';
import { useAvailability } from '../../hooks/counselor/useAvailability';

interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
}

export const AvailabilityScheduler: React.FC = () => {
  const { setAvailability, blockTimeSlot, getAvailabilitySchedule, isLoading, error } = useAvailability();
  
  const [schedule, setSchedule] = useState<{ [key: string]: string[] }>({});
  const [blockedSlots, setBlockedSlots] = useState<{ startTime: string; endTime: string; reason: string }[]>([]);
  const [newSlot, setNewSlot] = useState<TimeSlot>({ day: 'monday', startTime: '09:00', endTime: '17:00' });
  const [blockSlot, setBlockSlot] = useState({ startDate: '', startTime: '09:00', endTime: '10:00', reason: '' });

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  useEffect(() => {
    loadCurrentSchedule();
  }, []);

  const loadCurrentSchedule = async () => {
    try {
      const result = await getAvailabilitySchedule();
      if (result.hasSchedule) {
        setSchedule(result.schedule || {});
      }
    } catch (err) {
      console.error('Failed to load schedule:', err);
    }
  };

  const handleAddSlot = () => {
    const { day, startTime, endTime } = newSlot;
    const timeRange = `${startTime}-${endTime}`;
    
    setSchedule(prev => ({
      ...prev,
      [day]: [...(prev[day] || []), timeRange]
    }));
    
    setNewSlot({ day: 'monday', startTime: '09:00', endTime: '17:00' });
  };

  const handleRemoveSlot = (day: string, index: number) => {
    setSchedule(prev => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index)
    }));
  };

  const handleSaveSchedule = async () => {
    try {
      await setAvailability(schedule);
      alert('Availability schedule saved successfully!');
    } catch (err: any) {
      alert(`Failed to save schedule: ${err.message}`);
    }
  };

  const handleBlockTime = async () => {
    const { startDate, startTime, endTime, reason } = blockSlot;
    
    if (!startDate || !reason) {
      alert('Please fill all required fields');
      return;
    }

    try {
      const startDateTime = new Date(`${startDate}T${startTime}`);
      const endDateTime = new Date(`${startDate}T${endTime}`);
      
      await blockTimeSlot({
        startTime: startDateTime,
        endTime: endDateTime,
        reason
      });
      
      setBlockedSlots(prev => [...prev, { startTime: startDateTime.toISOString(), endTime: endDateTime.toISOString(), reason }]);
      setBlockSlot({ startDate: '', startTime: '09:00', endTime: '10:00', reason: '' });
      alert('Time slot blocked successfully!');
    } catch (err: any) {
      alert(`Failed to block time: ${err.message}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-yellow-600" />
            <h2 className="text-2xl font-bold text-gray-800">Availability Scheduler</h2>
          </div>
          <p className="text-gray-600 mt-2">Set your weekly availability for student sessions</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Schedule */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Schedule</h3>
            <div className="space-y-3">
              {daysOfWeek.map(day => (
                <div key={day} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-700 capitalize">{day}</span>
                    <span className="text-sm text-gray-500">{schedule[day]?.length || 0} slots</span>
                  </div>
                  <div className="space-y-2">
                    {schedule[day]?.map((slot, index) => (
                      <div key={index} className="flex items-center justify-between bg-yellow-50 p-2 rounded">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm text-gray-700">{slot}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveSlot(day, index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )) || <p className="text-sm text-gray-400">No slots set</p>}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={handleSaveSchedule}
              disabled={isLoading}
              className="mt-4 w-full bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : 'Save Schedule'}
            </button>
          </div>

          {/* Add New Slot */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Time Slot</h3>
            <div className="border border-gray-200 rounded-lg p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Day</label>
                <select
                  value={newSlot.day}
                  onChange={(e) => setNewSlot({ ...newSlot, day: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                >
                  {daysOfWeek.map(day => (
                    <option key={day} value={day} className="capitalize">{day}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                  <input
                    type="time"
                    value={newSlot.startTime}
                    onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                  <input
                    type="time"
                    value={newSlot.endTime}
                    onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              </div>
              <button
                onClick={handleAddSlot}
                className="w-full bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg hover:bg-yellow-200 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Slot
              </button>
            </div>

            {/* Block Time */}
            <h3 className="text-lg font-semibold text-gray-800 mb-4 mt-6">Block Specific Time</h3>
            <div className="border border-gray-200 rounded-lg p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={blockSlot.startDate}
                  onChange={(e) => setBlockSlot({ ...blockSlot, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                  <input
                    type="time"
                    value={blockSlot.startTime}
                    onChange={(e) => setBlockSlot({ ...blockSlot, startTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                  <input
                    type="time"
                    value={blockSlot.endTime}
                    onChange={(e) => setBlockSlot({ ...blockSlot, endTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                <input
                  type="text"
                  value={blockSlot.reason}
                  onChange={(e) => setBlockSlot({ ...blockSlot, reason: e.target.value })}
                  placeholder="e.g., Personal appointment, Conference"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <button
                onClick={handleBlockTime}
                disabled={isLoading}
                className="w-full bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 disabled:opacity-50"
              >
                {isLoading ? 'Blocking...' : 'Block Time Slot'}
              </button>
            </div>

            {/* Blocked Slots List */}
            {blockedSlots.length > 0 && (
              <div className="mt-6">
                <h4 className="text-md font-semibold text-gray-800 mb-3">Recently Blocked Slots</h4>
                <div className="space-y-2">
                  {blockedSlots.slice(-5).map((slot, index) => (
                    <div key={index} className="bg-red-50 p-3 rounded border-l-4 border-red-500">
                      <p className="text-sm font-medium text-gray-800">{slot.reason}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {new Date(slot.startTime).toLocaleString()} - {new Date(slot.endTime).toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
