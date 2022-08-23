import React from 'react';
import { XCircleIcon, CheckCircleIcon } from '@heroicons/react/outline';

// unused right now
export function Success({ success }: { success: string }): JSX.Element {
    return (
        <div className="rounded-md bg-green-50 p-4 mb-4">
            <div className="flex">
                <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">{success}</h3>
                </div>
            </div>
        </div>
    );
}

export function Error({ error }: { error: string }): JSX.Element {
    return (
        <div className="rounded-md bg-red-50 p-4 mb-4">
            <div className="flex">
                <div className="flex-shrink-0">
                    <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
            </div>
        </div>
    );
}
