import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Heart, ShieldCheck } from "lucide-react";
import { Section, SectionHeading } from "@/components/common/Layout";
import { Card, Badge } from "@/components/common/Card";
import { FieldWrapper, Input } from "@/components/common/FormFields";
import Button from "@/components/common/Button";
import { LoadingSpinner } from "@/components/common/States";
import { initiateDonation, getManualPaymentInfo } from "@/services/donationService";
import {
  fetchCampaignById,
  lookupMemberByPhone,
  type Campaign,
  type Member,
} from "@/services/campaignAndMemberService";

const PRESET_AMOUNTS = [200, 500, 1000, 2500];

const Donate = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const campaignId = params.get("campaign");
  const isMemberDue = params.get("member") === "1";

  const [gatewayChecked, setGatewayChecked] = useState(false);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [amount, setAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState("");
  const [type, setType] = useState<"ONE_TIME" | "MONTHLY">("ONE_TIME");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [member, setMember] = useState<Member | null>(null);
  const [lookupPhone, setLookupPhone] = useState("");
  const [lookupError, setLookupError] = useState<string | null>(null);

  // Until the SSLCommerz gateway is configured on the backend, send everyone to
  // the free manual-payment page (keeping ?campaign= / ?member= in the URL).
  useEffect(() => {
    getManualPaymentInfo()
      .then((res) => {
        if (!res.data.gatewayEnabled) {
          navigate(`/donate/manual${location.search}`, { replace: true });
        } else {
          setGatewayChecked(true);
        }
      })
      .catch(() => setGatewayChecked(true));
  }, [navigate, location.search]);

  useEffect(() => {
    if (campaignId) {
      fetchCampaignById(campaignId)
        .then((res) => setCampaign(res.data))
        .catch(() => setCampaign(null));
    }
  }, [campaignId]);

  const effectiveAmount = member ? member.monthlyDueAmount : customAmount ? Number(customAmount) : amount;

  const handleMemberLookup = async () => {
    setLookupError(null);
    try {
      const res = await lookupMemberByPhone(lookupPhone.trim());
      setMember(res.data);
      setDonorName(res.data.name);
      setDonorPhone(res.data.phone);
    } catch {
      setLookupError("এই নম্বরে কোনো সক্রিয় সদস্য পাওয়া যায়নি। সঠিক নম্বর দিয়ে আবার চেষ্টা করুন।");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!effectiveAmount || effectiveAmount < 10) {
      setError("Please enter a donation amount of at least ৳10.");
      return;
    }
    if (!donorName.trim() || !donorEmail.trim() || !donorPhone.trim()) {
      setError("Name, email and phone are required.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await initiateDonation({
        amount: effectiveAmount,
        type: isMemberDue ? "MONTHLY" : type,
        donorName,
        donorEmail,
        donorPhone,
        isAnonymous,
        purpose: campaign ? "CAMPAIGN" : isMemberDue ? "MEMBERSHIP_DUE" : "GENERAL",
        campaignId: campaign?._id,
        memberId: member?._id,
      });
      window.location.href = res.data.gatewayUrl;
    } catch {
      setError("Something went wrong starting your donation. Please try again.");
      setSubmitting(false);
    }
  };

  if (!gatewayChecked) {
    return (
      <Section>
        <LoadingSpinner />
      </Section>
    );
  }

  if (isMemberDue && !member) {
    return (
      <Section>
        <SectionHeading title="মাসিক চাঁদা পরিশোধ" subtitle="আপনার নিবন্ধিত মোবাইল নম্বর দিন" />
        <Card className="mx-auto max-w-sm">
          <FieldWrapper label="মোবাইল নম্বর" required>
            <Input value={lookupPhone} onChange={(e) => setLookupPhone(e.target.value)} />
          </FieldWrapper>
          {lookupError && <p className="mt-2 text-sm text-red-600">{lookupError}</p>}
          <Button className="mt-4 w-full" onClick={handleMemberLookup}>
            খুঁজুন
          </Button>
        </Card>
      </Section>
    );
  }

  return (
    <Section>
      <SectionHeading
        title={campaign ? campaign.title : isMemberDue ? "মাসিক চাঁদা পরিশোধ" : "আমাদের সঙ্গে দান করুন"}
        subtitle={
          campaign
            ? campaign.description
            : isMemberDue
              ? `${member?.name}, আপনার এই মাসের চাঁদা পরিশোধ করুন।`
              : "bKash, Nagad, Rocket, কার্ড ও ব্যাংক — যেকোনো মাধ্যমে দান করতে পারবেন।"
        }
      />

      {campaign?.isEmergency && (
        <div className="mx-auto mb-6 max-w-lg">
          <Badge color="red">জরুরি ত্রাণ আবেদন</Badge>
        </div>
      )}

      <Card className="mx-auto max-w-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {!campaign && !isMemberDue && (
            <div className="flex gap-2">
              {(["ONE_TIME", "MONTHLY"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${
                    type === t ? "border-forest-600 bg-forest-50 text-forest-700" : "border-slate-200 text-slate-500"
                  }`}
                >
                  {t === "ONE_TIME" ? "এককালীন দান" : "মাসিক দান"}
                </button>
              ))}
            </div>
          )}

          {!member && (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">পরিমাণ (৳)</label>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_AMOUNTS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setAmount(preset);
                      setCustomAmount("");
                    }}
                    className={`rounded-xl border px-2 py-2 text-sm font-semibold transition-colors ${
                      !customAmount && amount === preset
                        ? "border-forest-600 bg-forest-50 text-forest-700"
                        : "border-slate-200 text-slate-600"
                    }`}
                  >
                    ৳{preset}
                  </button>
                ))}
              </div>
              <Input
                className="mt-2"
                type="number"
                min={10}
                placeholder="অথবা নিজের মতো পরিমাণ লিখুন"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
              />
            </div>
          )}

          {member && (
            <div className="rounded-xl bg-forest-50 p-4 text-center">
              <p className="text-sm text-forest-700">এই মাসের নির্ধারিত চাঁদা</p>
              <p className="text-2xl font-extrabold text-forest-800">৳{member.monthlyDueAmount}</p>
            </div>
          )}

          <FieldWrapper label="নাম" required>
            <Input value={donorName} onChange={(e) => setDonorName(e.target.value)} disabled={!!member} />
          </FieldWrapper>
          <FieldWrapper label="ইমেইল" required>
            <Input type="email" value={donorEmail} onChange={(e) => setDonorEmail(e.target.value)} />
          </FieldWrapper>
          <FieldWrapper label="মোবাইল নম্বর" required>
            <Input value={donorPhone} onChange={(e) => setDonorPhone(e.target.value)} disabled={!!member} />
          </FieldWrapper>

          {!member && (
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300"
              />
              আমার নাম প্রকাশ্যে দেখাবেন না
            </label>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <p className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck size={14} />
            পেমেন্ট SSLCommerz-এর নিরাপদ গেটওয়ের মাধ্যমে সম্পন্ন হবে।
          </p>

          <Button type="submit" size="lg" disabled={submitting}>
            <Heart size={16} />
            {submitting ? "প্রস্তুত হচ্ছে…" : `৳${effectiveAmount || 0} দান করুন`}
          </Button>
        </form>
      </Card>

      <p className="mt-4 text-center text-sm text-slate-500">
        <Link to={`/donate/manual${location.search}`} className="font-medium text-forest-700 underline">
          গেটওয়ে ফি ছাড়া সরাসরি bKash / Nagad / Rocket-এ পাঠাতে চান?
        </Link>
      </p>
    </Section>
  );
};

export default Donate;
