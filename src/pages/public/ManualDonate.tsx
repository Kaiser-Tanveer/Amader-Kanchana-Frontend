import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { CheckCircle2, Copy, Check } from "lucide-react";
import { Section, SectionHeading } from "@/components/common/Layout";
import { Card, Badge } from "@/components/common/Card";
import { FieldWrapper, Input, Select } from "@/components/common/FormFields";
import Button from "@/components/common/Button";
import { LoadingSpinner, ErrorState } from "@/components/common/States";
import {
  getManualPaymentInfo,
  submitManualDonation,
  type ManualMethod,
  type ManualPaymentInfo,
} from "@/services/donationService";
import {
  fetchCampaignById,
  lookupMemberByPhone,
  type Campaign,
  type Member,
} from "@/services/campaignAndMemberService";

const METHOD_LABELS: Record<ManualMethod, string> = {
  BKASH: "bKash",
  NAGAD: "Nagad",
  ROCKET: "Rocket",
  BANK: "ব্যাংক ট্রান্সফার",
};

const emptyForm = {
  amount: "",
  method: "" as ManualMethod | "",
  trxId: "",
  senderNumber: "",
  donorName: "",
  donorPhone: "",
  donorEmail: "",
  isAnonymous: false,
};

const ManualDonate = () => {
  const [params] = useSearchParams();
  const campaignId = params.get("campaign");
  const isMemberDue = params.get("member") === "1";

  const [info, setInfo] = useState<ManualPaymentInfo | null>(null);
  const [infoError, setInfoError] = useState(false);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [lookupPhone, setLookupPhone] = useState("");
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    getManualPaymentInfo()
      .then((res) => setInfo(res.data))
      .catch(() => setInfoError(true));
  }, []);

  useEffect(() => {
    if (campaignId) {
      fetchCampaignById(campaignId)
        .then((res) => setCampaign(res.data))
        .catch(() => setCampaign(null));
    }
  }, [campaignId]);

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const availableMethods: ManualMethod[] = info
    ? [...info.accounts.map((a) => a.method), ...(info.bankDetails ? (["BANK"] as ManualMethod[]) : [])]
    : [];
  const method = form.method || availableMethods[0] || "";
  const effectiveAmount = member ? member.monthlyDueAmount : Number(form.amount);

  const copy = (value: string) => {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        setCopied(value);
        setTimeout(() => setCopied(null), 1500);
      })
      .catch(() => undefined);
  };

  const handleMemberLookup = async () => {
    setLookupError(null);
    try {
      const res = await lookupMemberByPhone(lookupPhone.trim());
      setMember(res.data);
      setForm((f) => ({ ...f, donorName: res.data.name, donorPhone: res.data.phone }));
    } catch {
      setLookupError("এই নম্বরে কোনো সক্রিয় সদস্য পাওয়া যায়নি। সঠিক নম্বর দিয়ে আবার চেষ্টা করুন।");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!method) {
      setError("Please choose how you sent the money.");
      return;
    }
    if (!effectiveAmount || effectiveAmount < 10) {
      setError("Please enter the amount you sent (at least ৳10).");
      return;
    }
    if (!form.trxId.trim()) {
      setError("Please enter the Transaction ID (TrxID) from your payment.");
      return;
    }
    if (!form.donorName.trim() || !form.donorPhone.trim()) {
      setError("Name and phone number are required.");
      return;
    }

    setSubmitting(true);
    try {
      await submitManualDonation({
        amount: effectiveAmount,
        method,
        trxId: form.trxId,
        senderNumber: form.senderNumber || undefined,
        donorName: form.donorName,
        donorPhone: form.donorPhone,
        donorEmail: form.donorEmail || undefined,
        isAnonymous: form.isAnonymous,
        purpose: campaign ? "CAMPAIGN" : isMemberDue ? "MEMBERSHIP_DUE" : "GENERAL",
        campaignId: campaign?._id,
        memberId: member?._id,
      });
      setDone(true);
    } catch (err) {
      const message = axios.isAxiosError(err) ? err.response?.data?.message : null;
      setError(message || "Something went wrong. Please check your details and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (infoError) return <ErrorState />;
  if (!info) {
    return (
      <Section>
        <LoadingSpinner />
      </Section>
    );
  }

  if (done) {
    return (
      <Section>
        <Card className="mx-auto max-w-md text-center">
          <CheckCircle2 className="mx-auto mb-4 text-forest-600" size={48} />
          <h2 className="text-xl font-bold text-forest-900">ধন্যবাদ! আপনার তথ্য জমা হয়েছে</h2>
          <p className="mt-2 text-slate-500">
            আমরা আমাদের অ্যাকাউন্টের সাথে মিলিয়ে দেখে আপনার দান নিশ্চিত করব। এতে কিছু সময় লাগতে পারে।
          </p>
        </Card>
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

  const hasAccounts = info.accounts.length > 0 || Boolean(info.bankDetails);

  return (
    <Section>
      <SectionHeading
        title={campaign ? campaign.title : isMemberDue ? "মাসিক চাঁদা পরিশোধ" : "সরাসরি দান করুন"}
        subtitle={
          campaign
            ? campaign.description
            : isMemberDue
              ? `${member?.name}, আপনার এই মাসের চাঁদা পরিশোধ করুন।`
              : "আমাদের অ্যাকাউন্টে টাকা পাঠিয়ে নিচের ফর্মে Transaction ID জমা দিন — কোনো গেটওয়ে ফি নেই।"
        }
      />

      {campaign?.isEmergency && (
        <div className="mx-auto mb-6 max-w-lg">
          <Badge color="red">জরুরি ত্রাণ আবেদন</Badge>
        </div>
      )}

      <div className="mx-auto flex max-w-lg flex-col gap-6">
        {!hasAccounts ? (
          <Card>
            <p className="text-slate-600">
              পেমেন্টের তথ্য এখনো যোগ করা হয়নি। অনুগ্রহ করে পরে আবার চেষ্টা করুন বা আমাদের সাথে সরাসরি যোগাযোগ করুন।
            </p>
          </Card>
        ) : (
          <>
            <Card>
              <h3 className="mb-3 font-bold text-forest-900">ধাপ ১: টাকা পাঠান</h3>
              <p className="mb-4 text-sm text-slate-600">
                আপনার অ্যাপ থেকে নিচের যেকোনো একটি নম্বরে Send Money করুন।
                {info.accountName && <> অ্যাকাউন্টের নাম: <strong>{info.accountName}</strong></>}
              </p>

              <div className="flex flex-col gap-2">
                {info.accounts.map((a) => (
                  <div
                    key={a.method}
                    className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-400">{a.label}</p>
                      <p className="font-mono text-lg font-bold text-forest-800">{a.number}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => copy(a.number)}
                      className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-forest-700 hover:bg-forest-50"
                    >
                      {copied === a.number ? <Check size={16} /> : <Copy size={16} />}
                      {copied === a.number ? "কপি হয়েছে" : "কপি"}
                    </button>
                  </div>
                ))}

                {info.bankDetails && (
                  <div className="rounded-xl border border-slate-200 px-4 py-3">
                    <p className="text-xs font-semibold text-slate-400">ব্যাংক অ্যাকাউন্ট</p>
                    <p className="whitespace-pre-line text-sm font-medium text-slate-800">{info.bankDetails}</p>
                  </div>
                )}
              </div>

              <p className="mt-4 text-sm text-slate-600">
                <strong>ধাপ ২:</strong> পাঠানোর পর পাওয়া Transaction ID (TrxID) কপি করুন। <br />
                <strong>ধাপ ৩:</strong> নিচের ফর্মে সেই TrxID ও তথ্য জমা দিন।
              </p>
            </Card>

            <Card>
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <FieldWrapper label="কীভাবে পাঠিয়েছেন?" required>
                  <Select value={method} onChange={(e) => update("method", e.target.value as ManualMethod)}>
                    {availableMethods.map((m) => (
                      <option key={m} value={m}>
                        {METHOD_LABELS[m]}
                      </option>
                    ))}
                  </Select>
                </FieldWrapper>

                {member ? (
                  <div className="rounded-xl bg-forest-50 p-4 text-center">
                    <p className="text-sm text-forest-700">এই মাসের নির্ধারিত চাঁদা</p>
                    <p className="text-2xl font-extrabold text-forest-800">৳{member.monthlyDueAmount}</p>
                  </div>
                ) : (
                  <FieldWrapper label="পাঠানো পরিমাণ (৳)" required>
                    <Input
                      type="number"
                      min={10}
                      value={form.amount}
                      onChange={(e) => update("amount", e.target.value)}
                    />
                  </FieldWrapper>
                )}

                <FieldWrapper label="Transaction ID (TrxID)" required>
                  <Input
                    value={form.trxId}
                    onChange={(e) => update("trxId", e.target.value)}
                    placeholder="e.g. 9K3L2M4N5P"
                  />
                </FieldWrapper>

                {method && method !== "BANK" && (
                  <FieldWrapper label="যে নম্বর থেকে পাঠিয়েছেন (ঐচ্ছিক)">
                    <Input value={form.senderNumber} onChange={(e) => update("senderNumber", e.target.value)} />
                  </FieldWrapper>
                )}

                <FieldWrapper label="আপনার নাম" required>
                  <Input
                    value={form.donorName}
                    onChange={(e) => update("donorName", e.target.value)}
                    disabled={!!member}
                  />
                </FieldWrapper>
                <FieldWrapper label="মোবাইল নম্বর" required>
                  <Input
                    value={form.donorPhone}
                    onChange={(e) => update("donorPhone", e.target.value)}
                    disabled={!!member}
                  />
                </FieldWrapper>
                <FieldWrapper label="ইমেইল (ঐচ্ছিক)">
                  <Input type="email" value={form.donorEmail} onChange={(e) => update("donorEmail", e.target.value)} />
                </FieldWrapper>

                {!member && (
                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={form.isAnonymous}
                      onChange={(e) => update("isAnonymous", e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300"
                    />
                    আমার নাম প্রকাশ্যে দেখাবেন না
                  </label>
                )}

                {error && <p className="text-sm text-red-600">{error}</p>}

                <Button type="submit" size="lg" disabled={submitting}>
                  {submitting ? "জমা হচ্ছে…" : "তথ্য জমা দিন"}
                </Button>
              </form>
            </Card>
          </>
        )}
      </div>
    </Section>
  );
};

export default ManualDonate;
