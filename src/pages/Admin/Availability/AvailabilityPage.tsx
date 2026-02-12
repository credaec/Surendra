import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, List } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { AvailabilityEvent } from '../../../types/schema';
import { backendService } from '../../../services/backendService';
import AvailabilityHeader from '../../../components/admin/availability/AvailabilityHeader';
import AvailabilityStats from '../../../components/admin/availability/AvailabilityStats';
import AvailabilityCalendar from '../../../components/admin/availability/AvailabilityCalendar';
import AvailabilityList from '../../../components/admin/availability/AvailabilityList';
import AddHolidayModal from '../../../components/admin/availability/AddHolidayModal';
import MarkLeaveModal from '../../../components/admin/availability/MarkLeaveModal';
import { useToast } from '../../../context/ToastContext';


const AvailabilityPage: React.FC = () => {
    const { showToast } = useToast();
    const [events, setEvents] = useState<AvailabilityEvent[]>([]);
    const [viewMode, setViewMode] = useState<'CALENDAR' | 'LIST'>('CALENDAR');
    const [editingEvent, setEditingEvent] = useState<AvailabilityEvent | null>(null);
    const [isAddHolidayOpen, setIsAddHolidayOpen] = useState(false);
    const [isMarkLeaveOpen, setIsMarkLeaveOpen] = useState(false);

    const loadData = () => {
        const data = backendService.getAvailabilityEvents();
        setEvents(data);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleRefresh = () => {
        loadData();
        showToast('Availability data refreshed', 'success');
    };

    const handleExport = () => {
        if (!events.length) {
            showToast('No events to export', 'error');
            return;
        }

        const headers = ['Type', 'Title', 'Sub Type', 'Start Date', 'End Date', 'Notes'];
        const rows = events.map(e => [
            e.type,
            e.title,
            e.subType || '',
            e.startDate,
            e.endDate,
            e.notes || ''
        ]);

        const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `availability_export_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        showToast('Schedule exported successfully', 'success');
    };

    const handleEditEvent = (event: AvailabilityEvent) => {
        setEditingEvent(event);
        if (event.type === 'HOLIDAY') {
            setIsAddHolidayOpen(true);
        } else {
            setIsMarkLeaveOpen(true);
        }
    };

    const handleSaveHoliday = async (data: any) => {
        if (data.id) {
            const updated = await backendService.updateAvailabilityEvent(data);
            setEvents(prev => prev.map(e => e.id === updated.id ? updated : e));
            showToast('Holiday updated successfully', 'success');
        } else {
            const newEvent = await backendService.addAvailabilityEvent(data);
            setEvents(prev => [...prev, newEvent]);
            showToast('Holiday added successfully', 'success');
        }
        setEditingEvent(null);
    };

    const handleSaveLeave = async (data: any) => {
        if (data.id) {
            const updated = await backendService.updateAvailabilityEvent(data);
            setEvents(prev => prev.map(e => e.id === updated.id ? updated : e));
            showToast('Leave updated successfully', 'success');
        } else {
            const newEvent = await backendService.addAvailabilityEvent(data);
            setEvents(prev => [...prev, newEvent]);
            showToast('Leave request submitted', 'success');
        }
        setEditingEvent(null);
    };

    const handleDeleteEvent = async (id: string) => {
        if (confirm('Are you sure you want to delete this event?')) {
            await backendService.deleteAvailabilityEvent(id);
            setEvents(prev => prev.filter(e => e.id !== id));
            showToast('Event removed', 'info');
            return true;
        }
        return false;
    };

    return (
        <div className="space-y-6">
            <AvailabilityHeader
                onAddHoliday={() => {
                    setEditingEvent(null);
                    setIsAddHolidayOpen(true);
                }}
                onMarkLeave={() => {
                    setEditingEvent(null);
                    setIsMarkLeaveOpen(true);
                }}
                onRefresh={handleRefresh}
                onExport={handleExport}
            />

            <AvailabilityStats events={events} />

            {/* View Toggle Tabs */}
            <div className="flex space-x-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-2xl w-fit mb-6 shadow-sm transition-all duration-300">
                <button
                    onClick={() => setViewMode('CALENDAR')}
                    className={cn(
                        "flex items-center px-6 py-2.5 text-sm font-bold rounded-xl transition-all duration-200",
                        viewMode === 'CALENDAR'
                            ? "bg-blue-600 dark:bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                    )}
                >
                    <CalendarIcon className={cn("h-4 w-4 mr-2", viewMode === 'CALENDAR' ? "text-white" : "text-slate-400 dark:text-slate-500")} />
                    Calendar View
                </button>
                <button
                    onClick={() => setViewMode('LIST')}
                    className={cn(
                        "flex items-center px-6 py-2.5 text-sm font-bold rounded-xl transition-all duration-200",
                        viewMode === 'LIST'
                            ? "bg-blue-600 dark:bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                    )}
                >
                    <List className={cn("h-4 w-4 mr-2", viewMode === 'LIST' ? "text-white" : "text-slate-400 dark:text-slate-500")} />
                    List View
                </button>
            </div>

            {/* Main Content Area */}
            {viewMode === 'CALENDAR' ? (
                <AvailabilityCalendar
                    events={events}
                    onEventClick={handleEditEvent}
                />
            ) : (
                <AvailabilityList
                    events={events}
                    onEdit={handleEditEvent}
                    onDelete={handleDeleteEvent}
                />
            )}

            {/* Modals */}
            <AddHolidayModal
                isOpen={isAddHolidayOpen}
                onClose={() => {
                    setIsAddHolidayOpen(false);
                    setEditingEvent(null);
                }}
                onSave={handleSaveHoliday}
                eventToEdit={editingEvent}
            />

            <MarkLeaveModal
                isOpen={isMarkLeaveOpen}
                onClose={() => {
                    setIsMarkLeaveOpen(false);
                    setEditingEvent(null);
                }}
                onSave={handleSaveLeave}
                onDelete={async () => {
                    if (editingEvent?.id) {
                        if (await handleDeleteEvent(editingEvent.id)) {
                            setIsMarkLeaveOpen(false);
                            setEditingEvent(null);
                        }
                    }
                }}
                eventToEdit={editingEvent}
            />
        </div>
    );
};

export default AvailabilityPage;

