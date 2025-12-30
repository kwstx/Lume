/**
 * Convert data to JSON string with pretty printing option
 */
export function toJson(data: any, pretty: boolean = true): string {
    return JSON.stringify(data, null, pretty ? 2 : 0);
}

/**
 * Prepare full account export structure
 */
export interface AccountExport {
    version: string;
    timestamp: string;
    account: {
        id: string;
        email: string;
        name: string | null;
    };
    subscribers: any[];
    segments: any[];
    campaigns: any[];
    interactions: any[];
}

export function formatAccountExport(data: Partial<AccountExport>): AccountExport {
    return {
        version: "1.0",
        timestamp: new Date().toISOString(),
        account: {
            id: "",
            email: "",
            name: "",
            ...data.account
        },
        subscribers: data.subscribers || [],
        segments: data.segments || [],
        campaigns: data.campaigns || [],
        interactions: data.interactions || [],
    };
}
