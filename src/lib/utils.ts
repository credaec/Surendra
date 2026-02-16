import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDuration(val: number, unit: 'minutes' | 'seconds' = 'minutes'): string {
    const totalMinutes = unit === 'seconds' ? Math.floor(val / 60) : val;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);

    if (hours > 0) {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}hr`;
    }
    return `${minutes}mins`;
}
