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
import { useToast } from '../../../context/ToastContext';


const AvailabilityPage: React.FC = () => {
    const { showToast } = useToast();
    const [events, setEvents] = useState<AvailabilityEvent[]>([]);
    const [viewMode, setViewMode] = useState<'CALENDAR' | 'LIST'>('CALENDAR');
    const [editingEvent, setEditingEvent] = useState<AvailabilityEvent | null>(null);
    const [isAddHolidayOpen, setIsAddHolidayOpen] = useState(false);
    const [isMarkLeaveOpen, setIsMarkLeaveOpen] = useState(false);

    const loadData = () => {
        const data = mockBackend.getAvailabilityEvents();
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

    const handleSaveHoliday = (data: any) => {
        if (data.id) {
            const updated = mockBackend.updateAvailabilityEvent(data);
            setEvents(prev => prev.map(e => e.id === updated.id ? updated : e));
            showToast('Holiday updated successfully', 'success');
        } else {
            const newEvent = mockBackend.addAvailabilityEvent(data);
            setEvents(prev => [...prev, newEvent]);
            showToast('Holiday added successfully', 'success');
        }
        setEditingEvent(null);
    };

    const handleSaveLeave = (data: any) => {
        if (data.id) {
            const updated = mockBackend.updateAvailabilityEvent(data);
            setEvents(prev => prev.map(e => e.id === updated.id ? updated : e));
            showToast('Leave updated successfully', 'success');
        } else {
            const newEvent = mockBackend.addAvailabilityEvent(data);
            setEvents(prev => [...prev, newEvent]);
            showToast('Leave request submitted', 'success');
        }
        setEditingEvent(null);
    };

    const handleDeleteEvent = (id: string) => {
        if (confirm('Are you sure you want to delete this event?')) {
            mockBackend.deleteAvailabilityEvent(id);
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
                onDelete={() => {
                    if (editingEvent?.id) {
                        if (handleDeleteEvent(editingEvent.id)) {
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
