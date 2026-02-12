import React, { useState, useEffect } from 'react';
import { X, Send, Mail } from 'lucide-react';

interface SendInvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSend: (email: string, subject: string, message: string) => void;
    invoiceNo: string;
    clientEmail: string;
}

const SendInvoiceModal: React.FC<SendInvoiceModalProps> = ({ isOpen, onClose, onSend, invoiceNo, clientEmail }) => {
    const [email, setEmail] = useState(clientEmail);
    const [subject, setSubject] = useState(`Invoice ${invoiceNo} from Credence`);
    const [message, setMessage] = useState(`Dear Client,\n\nPlease find attached invoice ${invoiceNo} for your recent project.\n\nThank you,\nCredence Team`);

    useEffect(() => {
        if (isOpen) {
            setEmail(clientEmail);
            setSubject(`Invoice ${invoiceNo} from Credence`);
            // Reset message if needed or keep default
        }
    }, [isOpen, clientEmail, invoiceNo]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSend(email, subject, message);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-semibold text-slate-900 flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-blue-600" />
                        Send Invoice {invoiceNo}
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">To</label>
                        <input
                            type="email"
                            required
                            className="w-full rounded-lg border-slate-200 focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-900"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">Subject</label>
                        <input
                            type="text"
                            required
                            className="w-full rounded-lg border-slate-200 focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-900"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">Message</label>
                        <textarea
                            rows={6}
                            required
                            className="w-full rounded-lg border-slate-200 focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-900"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end pt-2 space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm"
                        >
                            <Send className="h-4 w-4 mr-2" />
                            Send Invoice
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SendInvoiceModal;
