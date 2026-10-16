import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { Section } from "@/components/common/Layout";
import { Card } from "@/components/common/Card";
import { LoadingSpinner } from "@/components/common/States";
import Button from "@/components/common/Button";
import { getDonationStatus } from "@/services/donationService";

const DonationResult = () => {
  const [params] = useSearchParams();
  const tranId = params.get("tran_id");
  const [status, setStatus] = useState<"PENDING" | "SUCCESS" | "FAILED" | "CANCELLED" | null>(null);
  const [amount, setAmount] = useState<number | null>(null);

  useEffect(() => {
    if (!tranId) return;
    // SSLCommerz's server-to-server IPN can arrive a moment after the
    // browser redirect, so we poll briefly rather than trusting the first check.
    let attempts = 0;
    const poll = async () => {
      const res = await getDonationStatus(tranId);
      setStatus(res.data.status);
      setAmount(res.data.amount);
      attempts += 1;
      if (res.data.status === "PENDING" && attempts < 6) {
        setTimeout(poll, 2000);
      }
    };
    poll();
  }, [tranId]);

  return (
    <Section>
      <Card className="mx-auto max-w-md text-center">
        {status === null && <LoadingSpinner label="নিশ্চিত করা হচ্ছে…" />}

        {status === "SUCCESS" && (
          <>
            <CheckCircle2 className="mx-auto mb-4 text-forest-600" size={48} />
            <h2 className="text-xl font-bold text-forest-900">ধন্যবাদ! আপনার দান সফল হয়েছে</h2>
            {amount && <p className="mt-2 text-slate-500">৳{amount} সফলভাবে গৃহীত হয়েছে।</p>}
          </>
        )}

        {(status === "FAILED" || status === "CANCELLED") && (
          <>
            <XCircle className="mx-auto mb-4 text-red-500" size={48} />
            <h2 className="text-xl font-bold text-red-700">
              {status === "CANCELLED" ? "দান বাতিল করা হয়েছে" : "দান সম্পন্ন হয়নি"}
            </h2>
            <p className="mt-2 text-slate-500">কোনো টাকা কাটা হয়নি। আবার চেষ্টা করতে পারেন।</p>
          </>
        )}

        {status === "PENDING" && (
          <>
            <Clock className="mx-auto mb-4 text-amber-500" size={48} />
            <h2 className="text-xl font-bold text-amber-700">নিশ্চিতকরণের অপেক্ষায়</h2>
            <p className="mt-2 text-slate-500">কিছুক্ষণের মধ্যে নিশ্চিত হবে। পেজটি বন্ধ করবেন না।</p>
          </>
        )}

        <Link to="/donate" className="mt-6 inline-block">
          <Button variant="outline">আবার দান করুন / ফিরে যান</Button>
        </Link>
      </Card>
    </Section>
  );
};

export default DonationResult;
