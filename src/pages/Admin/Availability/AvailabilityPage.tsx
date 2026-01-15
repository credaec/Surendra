import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, List } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { AvailabilityEvent } from '../../../types/schema';
import { mockBackend } from '../../../services/mockBackend';
import AvailabilityHeader from '../../../components/admin/availability/AvailabilityHeader';
import AvailabilityStats from '../../../components/admin/availability/AvailabilityStats';
import AvailabilityCalendar from '../../../components/admin/availability/AvailabilityCalendar';
import AvailabilityList from '../../../components/admin/availability/AvailabilityList';
import AddHolidayModal from '../../../components/admin/availability/AddHolidayModal';
import MarkLeaveModal from '../../../components/admin/availability/MarkLeaveModal';


const AvailabilityPage: React.FC = () => {
    const [events, setEvents] = useState<AvailabilityEvent[]>([]);
    const [viewMode, setViewMode] = useState<'CALENDAR' | 'LIST'>('CALENDAR');
    const [isAddHolidayOpen, setIsAddHolidayOpen] = useState(false);
    const [isMarkLeaveOpen, setIsMarkLeaveOpen] = useState(false);

    useEffect(() => {
        // Load initial data
        const data = mockBackend.getAvailabilityEvents();
        setEvents(data);
    }, []);

    const handleAddHoliday = (data: any) => {
        const newEvent = mockBackend.addAvailabilityEvent(data);
        setEvents(prev => [...prev, newEvent]);
    };

    const handleMarkLeave = (data: any) => {
        const newEvent = mockBackend.addAvailabilityEvent(data);
        setEvents(prev => [...prev, newEvent]);
    };

    const handleDeleteEvent = (id: string) => {
        if (confirm('Are you sure you want to delete this event?')) {
            mockBackend.deleteAvailabilityEvent(id);
            setEvents(prev => prev.filter(e => e.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            <AvailabilityHeader
                onAddHoliday={() => setIsAddHolidayOpen(true)}
                onMarkLeave={() => setIsMarkLeaveOpen(true)}
            />

            <AvailabilityStats events={events} />

            {/* View Toggle Tabs */}
            <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg w-fit mb-4">
                <button
                    onClick={() => setViewMode('CALENDAR')}
                    className={cn(
                        "flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                        viewMode === 'CALENDAR'
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Calendar View
                </button>
                <button
                    onClick={() => setViewMode('LIST')}
                    className={cn(
                        "flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                        viewMode === 'LIST'
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    <List className="h-4 w-4 mr-2" />
                    List View
                </button>
            </div>

            {/* Main Content Area */}
            {viewMode === 'CALENDAR' ? (
                <AvailabilityCalendar
                    events={events}
                    onEventClick={(event) => alert(`Event: ${event.title}\n${event.notes || ''}`)}
                />
            ) : (
                <AvailabilityList
                    events={events}
                    onEdit={(event) => console.log('Edit', event)}
                    onDelete={handleDeleteEvent}
                />
            )}

            {/* Modals */}
            <AddHolidayModal
                isOpen={isAddHolidayOpen}
                onClose={() => setIsAddHolidayOpen(false)}
                onSave={handleAddHoliday}
            />

            <MarkLeaveModal
                isOpen={isMarkLeaveOpen}
                onClose={() => setIsMarkLeaveOpen(false)}
                onSave={handleMarkLeave}
            />
        </div>
    );
};

export default AvailabilityPage;
