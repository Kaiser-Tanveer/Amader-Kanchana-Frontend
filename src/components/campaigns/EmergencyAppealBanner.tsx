import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { fetchEmergencyCampaign, type Campaign } from "@/services/campaignAndMemberService";

// Renders nothing when there's no active emergency campaign, so it's safe to
// leave on the homepage permanently — it only appears when an admin activates
// a flood/disaster appeal.
const EmergencyAppealBanner = () => {
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    fetchEmergencyCampaign()
      .then((res) => setCampaign(res.data))
      .catch(() => setCampaign(null));
  }, []);

  if (!campaign) return null;

  const progress = campaign.goalAmount ? Math.min(100, (campaign.raisedAmount / campaign.goalAmount) * 100) : null;

  return (
    <div className="bg-red-600 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 shrink-0" size={22} />
          <div>
            <p className="font-bold">{campaign.title}</p>
            <p className="text-sm text-red-100">{campaign.description}</p>
            {progress !== null && (
              <div className="mt-2 h-1.5 w-48 overflow-hidden rounded-full bg-red-800">
                <div className="h-full bg-white" style={{ width: `${progress}%` }} />
              </div>
            )}
          </div>
        </div>
        <Link
          to={`/donate?campaign=${campaign._id}`}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-red-700 hover:bg-red-50"
        >
          এখনই সাহায্য করুন
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default EmergencyAppealBanner;
