import {
    timestamp,
    pgTable,
    text,
    uuid,
    integer,
    boolean,
    jsonb,
    index,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

// --- Auth Tables (NextAuth Schema) ---
export const users = pgTable("user", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").notNull().unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
    role: text("role").default("user"), // 'admin', 'user'
    plan: text("plan").default("free"), // 'free', 'pro', 'enterprise'
    password: text("password"),
    substackUrl: text("substack_url"),
    stripeCustomerId: text("stripe_customer_id"),
    newsletterName: text("newsletter_name"),
    timezone: text("timezone").default("UTC"),
    onboardingCompleted: boolean("onboarding_completed").default(false),
    demoMode: boolean("demo_mode").default(false),
    createdAt: timestamp("created_at").defaultNow(),
});

export const accounts = pgTable("account", {
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
}, (account) => [
    // primaryKey({ columns: [account.provider, account.providerAccountId] }),
]);

export const sessions = pgTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable("verification_token", {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
}, (vt) => [
    // primaryKey({ columns: [vt.identifier, vt.token] }),
]);

// --- CRM Tables ---

// Subscribers imported from Substack
export const subscribers = pgTable("subscribers", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    name: text("name"),
    status: text("status").default("free"), // 'free', 'paid', 'comp'
    tier: text("tier").default("free"), // 'founding', 'annual', 'monthly'
    source: text("source"), // 'import', 'api', 'manual', 'substack_sync'
    substackId: text("substack_id"), // Original ID from Substack if available
    joinDate: timestamp("join_date"),
    engagementLevel: text("engagement_level"), // 'high', 'medium', 'low', 'churned'
    totalOpens: integer("total_opens").default(0),
    totalClicks: integer("total_clicks").default(0),
    lastActive: timestamp("last_active"),
    notes: text("notes"),
    tags: jsonb("tags").$type<string[]>(), // e.g. ["interested-in-tech", "vip"]
    rfmScore: integer("rfm_score").default(0), // 100-500 score based on Recency, Frequency, Monetary
    churnRisk: integer("churn_risk").default(0), // 0-100% risk score
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
    index("subscribers_user_id_idx").on(table.userId),
    index("subscribers_email_idx").on(table.email),
    index("subscribers_engagement_idx").on(table.engagementLevel),
]);

// Groups/Segments of subscribers
export const segments = pgTable("segments", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    criteria: jsonb("criteria"), // Logic for auto-segmentation e.g. { "min_opens": 5 }
    type: text("type").default("manual"), // 'manual', 'dynamic', 'behavioral', 'rfm', 'predictive'
    createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
    index("segments_user_id_idx").on(table.userId),
]);

// Mapping subscribers to segments
export const subscriberSegments = pgTable("subscriber_segments", {
    subscriberId: uuid("subscriber_id")
        .references(() => subscribers.id, { onDelete: "cascade" })
        .notNull(),
    segmentId: uuid("segment_id")
        .references(() => segments.id, { onDelete: "cascade" })
        .notNull(),
});

// Reader Personas (AI Generated or Manual)
export const personas = pgTable("personas", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(), // e.g., "Tech Enthusiast Alex"
    description: text("description"),
    traits: jsonb("traits"), // { "age": "30s", "interests": ["tech", "coding"] }
    avatarUrl: text("avatar_url"),
    generatedFromSegmentId: uuid("generated_from_segment_id").references(() => segments.id),
    createdAt: timestamp("created_at").defaultNow(),
});

// Interactions (Opens, Clicks, Comments - detailed log)
export const interactions = pgTable("interactions", {
    id: uuid("id").defaultRandom().primaryKey(),
    subscriberId: uuid("subscriber_id").references(() => subscribers.id, { onDelete: "cascade" }),
    type: text("type").notNull(), // 'open', 'click', 'reply', 'comment'
    date: timestamp("date").defaultNow(),
    details: jsonb("details"), // { "url": "...", "post_title": "..." }
}, (table) => [
    index("interactions_subscriber_id_idx").on(table.subscriberId),
    index("interactions_date_idx").on(table.date),
]);

// Products (Plans/Items sold)
export const products = pgTable("products", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    price: integer("price").notNull(), // In cents
    currency: text("currency").default("USD"),
    type: text("type").default("subscription"), // 'subscription', 'one-time'
    createdAt: timestamp("created_at").defaultNow(),
});

// Payments from Subscribers
export const payments = pgTable("payments", {
    id: uuid("id").defaultRandom().primaryKey(),
    subscriberId: uuid("subscriber_id").references(() => subscribers.id, { onDelete: "set null" }),
    amount: integer("amount").notNull(), // In cents
    currency: text("currency").default("USD"),
    status: text("status").default("succeeded"), // 'succeeded', 'pending', 'failed'
    date: timestamp("date").defaultNow(),
    stripeId: text("stripe_id"), // if referencing external payment
    productId: uuid("product_id").references(() => products.id),
});

// --- New Tables for Balances, Billing, Outreach ---

// Payouts (Withdrawals by the admin)
export const payouts = pgTable("payouts", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
    amount: integer("amount").notNull(), // In cents
    status: text("status").default("pending"), // 'pending', 'completed', 'failed'
    date: timestamp("date").defaultNow(),
    method: text("method"), // 'bank_transfer', 'stripe'
});

// Admin Invoices (Billing for the SaaS user)
export const invoices = pgTable("invoices", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").references(() => users.id),
    amount: integer("amount").notNull(), // In cents
    status: text("status").default("paid"), // 'paid', 'due'
    date: timestamp("date").defaultNow(),
    planName: text("plan_name"), // 'Pro Monthly'
    invoiceUrl: text("invoice_url"),
});

// Outreach Campaigns (Basic version - will be extended)
export const campaigns = pgTable("campaigns", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    status: text("status").default("draft"), // 'draft', 'scheduled', 'sending', 'sent', 'failed'
    type: text("type").default("one-time"), // 'one-time', 'automated'
    subject: text("subject"),
    content: text("content"),
    sentCount: integer("sent_count").default(0),
    openRate: integer("open_rate").default(0),
    clickRate: integer("click_rate").default(0),
    scheduledFor: timestamp("scheduled_for"),
    createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
    index("campaigns_user_id_idx").on(table.userId),
    index("campaigns_status_idx").on(table.status),
]);

// Messages (Inbox/Chat with Subscribers)
export const messages = pgTable("messages", {
    id: uuid("id").defaultRandom().primaryKey(),
    subscriberId: uuid("subscriber_id").references(() => subscribers.id, { onDelete: "cascade" }),
    direction: text("direction").notNull(), // 'inbound' (from sub), 'outbound' (from admin)
    content: text("content").notNull(),
    isRead: boolean("is_read").default(false),
    sentAt: timestamp("sent_at").defaultNow(),
});

// --- NEW TABLES FOR ENHANCED FEATURES ---

// Email Campaign Templates
export const emailTemplates = pgTable("email_templates", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    subject: text("subject"),
    content: text("content").notNull(),
    thumbnail: text("thumbnail"),
    isPublic: boolean("is_public").default(false), // Public templates available to all users
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// Campaign Analytics (detailed tracking)
export const campaignAnalytics = pgTable("campaign_analytics", {
    id: uuid("id").defaultRandom().primaryKey(),
    campaignId: uuid("campaign_id").references(() => campaigns.id, { onDelete: "cascade" }),
    subscriberId: uuid("subscriber_id").references(() => subscribers.id, { onDelete: "cascade" }),
    sent: boolean("sent").default(false),
    opened: boolean("opened").default(false),
    clicked: boolean("clicked").default(false),
    bounced: boolean("bounced").default(false),
    unsubscribed: boolean("unsubscribed").default(false),
    openedAt: timestamp("opened_at"),
    clickedAt: timestamp("clicked_at"),
    sentAt: timestamp("sent_at").defaultNow(),
}, (table) => [
    index("campaign_analytics_campaign_id_idx").on(table.campaignId),
    index("campaign_analytics_subscriber_id_idx").on(table.subscriberId),
]);

// API Keys for integrations
export const apiKeys = pgTable("api_keys", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    key: text("key").notNull().unique(), // Hashed API key
    lastUsed: timestamp("last_used"),
    expiresAt: timestamp("expires_at"),
    createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
    index("api_keys_user_id_idx").on(table.userId),
    index("api_keys_key_idx").on(table.key),
]);

// Webhooks
export const webhooks = pgTable("webhooks", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    events: jsonb("events").$type<string[]>(), // ['subscriber.created', 'payment.succeeded']
    secret: text("secret"), // For webhook signature verification
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
    index("webhooks_user_id_idx").on(table.userId),
]);

// Webhook Events Log
export const webhookEvents = pgTable("webhook_events", {
    id: uuid("id").defaultRandom().primaryKey(),
    webhookId: uuid("webhook_id").references(() => webhooks.id, { onDelete: "cascade" }),
    event: text("event").notNull(),
    payload: jsonb("payload"),
    status: text("status").default("pending"), // 'pending', 'delivered', 'failed'
    attempts: integer("attempts").default(0),
    lastAttemptAt: timestamp("last_attempt_at"),
    deliveredAt: timestamp("delivered_at"),
    createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
    index("webhook_events_webhook_id_idx").on(table.webhookId),
    index("webhook_events_status_idx").on(table.status),
]);

// Third-party Integrations
export const integrations = pgTable("integrations", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
    provider: text("provider").notNull(), // 'slack', 'notion', 'airtable', etc.
    credentials: jsonb("credentials"), // Encrypted credentials
    config: jsonb("config"), // Integration-specific configuration
    isActive: boolean("is_active").default(true),
    lastSyncAt: timestamp("last_sync_at"),
    createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
    index("integrations_user_id_idx").on(table.userId),
]);

// Substack Connections
export const substackConnections = pgTable("substack_connections", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).unique(),
    substackUrl: text("substack_url").notNull(),
    accessToken: text("access_token"), // Encrypted
    refreshToken: text("refresh_token"), // Encrypted
    connectionMethod: text("connection_method"), // 'oauth', 'email_forward', 'csv'
    lastSyncAt: timestamp("last_sync_at"),
    syncStatus: text("sync_status").default("pending"), // 'pending', 'syncing', 'success', 'failed'
    syncError: text("sync_error"),
    createdAt: timestamp("created_at").defaultNow(),
});

// Export Jobs (for background processing)
export const exportJobs = pgTable("export_jobs", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(), // 'subscribers', 'segments', 'campaigns', 'full_account'
    format: text("format").notNull(), // 'csv', 'json'
    status: text("status").default("pending"), // 'pending', 'processing', 'completed', 'failed'
    fileUrl: text("file_url"),
    error: text("error"),
    createdAt: timestamp("created_at").defaultNow(),
    completedAt: timestamp("completed_at"),
}, (table) => [
    index("export_jobs_user_id_idx").on(table.userId),
    index("export_jobs_status_idx").on(table.status),
]);

// Onboarding Progress
export const onboardingProgress = pgTable("onboarding_progress", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).unique(),
    currentStep: integer("current_step").default(0),
    completedSteps: jsonb("completed_steps").$type<string[]>(),
    skipped: boolean("skipped").default(false),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").defaultNow(),
});
