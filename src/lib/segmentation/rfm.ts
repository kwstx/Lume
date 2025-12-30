export type RFMScore = {
    recency: number; // 1-5
    frequency: number; // 1-5
    monetary: number; // 1-5 (approximated by tier)
    total: number; // 3-15 or normalized 100-500
};

export function calculateRFM(subscriber: {
    joinDate: Date | null;
    lastActive: Date | null;
    totalOpens: number;
    totalClicks: number;
    status: string | null;
    tier: string | null;
}): { score: number; risk: number; engagement: string } {
    const now = new Date();

    // 1. Recency (Last Active)
    // If never active, use join date as proxy or penalize
    const lastInteraction = subscriber.lastActive || subscriber.joinDate || new Date(0);
    const daysSinceActive = Math.floor((now.getTime() - lastInteraction.getTime()) / (1000 * 60 * 60 * 24));

    let recencyScore = 1;
    if (daysSinceActive <= 7) recencyScore = 5;
    else if (daysSinceActive <= 30) recencyScore = 4;
    else if (daysSinceActive <= 60) recencyScore = 3;
    else if (daysSinceActive <= 90) recencyScore = 2;

    // 2. Frequency (Opens + Clicks)
    // This is relative, but let's set some baselines for a newsletter
    // High: > 20 opens, Medium: > 5 opens, Low: 0-5
    const activityCount = (subscriber.totalOpens || 0) + (subscriber.totalClicks || 0) * 2;

    let frequencyScore = 1;
    if (activityCount > 50) frequencyScore = 5;
    else if (activityCount > 20) frequencyScore = 4;
    else if (activityCount > 10) frequencyScore = 3;
    else if (activityCount > 2) frequencyScore = 2;

    // 3. Monetary (Tier/Status)
    let monetaryScore = 1;
    const status = subscriber.status?.toLowerCase() || 'free';
    const tier = subscriber.tier?.toLowerCase() || 'free';

    if (tier.includes('founding')) monetaryScore = 5;
    else if (status === 'paid' && tier.includes('annual')) monetaryScore = 4;
    else if (status === 'paid') monetaryScore = 3;
    else if (status === 'comp') monetaryScore = 2;

    // Total Score (Normalized 0-100 logic for simplicity in DB, or 100-555 like classic RFM)
    // Let's do a weighted average 0-100
    // Recency (40%), Frequency (30%), Monetary (30%)
    const weightedScore = (recencyScore * 40) + (frequencyScore * 30) + (monetaryScore * 30); // Max 500

    // Engagement Label
    let engagement = 'low';
    if (weightedScore >= 400) engagement = 'high';
    else if (weightedScore >= 250) engagement = 'medium';

    // Churn Risk calculation
    // High recency score means low risk. Low monetary means low risk (nothing to lose) or high risk (easy to leave)?
    // Usually Churn Risk is inverse of Recency + Frequency
    let risk = 0;
    if (status === 'paid') {
        if (daysSinceActive > 60) risk = 80;
        else if (daysSinceActive > 30) risk = 50;
        else if (daysSinceActive > 14) risk = 20;
    } else {
        // For free users, churn means unsubscribing or stopping reading
        if (daysSinceActive > 90) risk = 90; // "Zombie"
        else if (daysSinceActive > 45) risk = 60;
    }

    return {
        score: Math.round(weightedScore), // Store as integer
        risk,
        engagement
    };
}
