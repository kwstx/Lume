import Papa from 'papaparse';

/**
 * Convert array of objects to CSV string
 */
export function toCsv(data: any[]): string {
    return Papa.unparse(data, {
        quotes: true, // Force quotes around fields to handle commas in content
        header: true,
    });
}

/**
 * Clean data for export (remove sensitive/internal fields)
 */
export function cleanSubscriberForExport(subscriber: any) {
    // Create a copy to avoid mutating original
    const clean = { ...subscriber };

    // Remove internal IDs if preferred, or keep them for re-import
    // clean.id = undefined;

    // Format dates
    if (clean.joinDate) clean.joinDate = new Date(clean.joinDate).toISOString();
    if (clean.lastActive) clean.lastActive = new Date(clean.lastActive).toISOString();
    if (clean.createdAt) clean.createdAt = new Date(clean.createdAt).toISOString();
    if (clean.updatedAt) clean.updatedAt = new Date(clean.updatedAt).toISOString();

    // Flatten tags if array
    if (Array.isArray(clean.tags)) {
        clean.tags = clean.tags.join(', ');
    }

    return clean;
}
