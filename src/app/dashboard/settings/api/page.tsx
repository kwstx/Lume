import { auth } from "@/auth";
import { getApiKeys } from "@/actions/api-keys";
import ApiKeysList from "@/components/settings/api-keys-list";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default async function ApiKeysPage() {
    const session = await auth();
    // if (!session) redirect("/login");

    const { data: keys } = await getApiKeys();

    return (
        <div className="max-w-5xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">API Access</h1>
                <p className="text-gray-500">Create and manage API keys to access the Stackly Public API.</p>
            </div>

            <div className="space-y-8">
                <ApiKeysList initialKeys={keys || []} />

                <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 rounded-3xl">
                    <h3 className="font-bold text-blue-900 mb-2">Developer Documentation</h3>
                    <p className="text-sm text-blue-800 mb-4">
                        Use your API keys to authenticate requests to the Stackly API.
                        Include the key in the `Authorization` header as a Bearer token.
                    </p>
                    <div className="bg-white/50 p-4 rounded-xl border border-blue-100 font-mono text-xs text-blue-900 overflow-x-auto">
                        curl https://stackly.com/api/v1/subscribers \<br />
                        -H "Authorization: Bearer sk_live_..."
                    </div>
                </Card>
            </div>
        </div>
    );
}
