import { auth } from "@/auth";
import { getWebhooks } from "@/actions/webhooks";
import WebhooksList from "@/components/settings/webhooks-list";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";

export default async function WebhooksPage() {
    const session = await auth();
    // if (!session) redirect("/login");

    const { data: webhooks } = await getWebhooks();

    return (
        <div className="max-w-5xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Webhooks</h1>
                <p className="text-gray-500">Configure webhooks to receive real-time events in your external systems.</p>
            </div>

            <div className="space-y-8">
                <WebhooksList initialWebhooks={webhooks || []} />
            </div>
        </div>
    );
}
