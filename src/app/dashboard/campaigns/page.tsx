import { auth } from "@/auth";
import { getCampaigns } from "@/actions/campaigns";
import CampaignsPage from "@/components/campaigns/campaigns-list";

export default async function Page() {
    const session = await auth();
    // if (!session) redirect("/login"); // Middleware handles this usually

    const { data: campaigns } = await getCampaigns();

    return <CampaignsPage initialCampaigns={campaigns} />;
}
