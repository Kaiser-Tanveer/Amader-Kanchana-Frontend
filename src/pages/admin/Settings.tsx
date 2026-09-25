import { useState } from "react";
import { Card } from "@/components/common/Card";
import { FieldWrapper, Input, Textarea } from "@/components/common/FormFields";
import Button from "@/components/common/Button";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    orgName: "আমাদের কাঞ্চনা",
    tagline: "আমাদের গ্রাম, আমাদেরই দায়িত্ব।",
    facebook: "facebook.com/amader.kanchana",
    email: "amaderkanchana@gmail.com",
    phone: "",
    address: "কাঞ্চনা, সাতকানিয়া, চট্টগ্রাম",
    description: "",
  });

  const update = (key: keyof typeof settings, value: string) => setSettings((s) => ({ ...s, [key]: value }));

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-forest-900">Settings</h1>
      <p className="text-sm text-slate-500">
        These values connect to the SiteSetting API resource once the backend is wired up. Fields left blank stay
        as placeholders on the public site until real data is entered.
      </p>

      <Card className="max-w-2xl">
        <div className="flex flex-col gap-4">
          <FieldWrapper label="Organization name">
            <Input value={settings.orgName} onChange={(e) => update("orgName", e.target.value)} />
          </FieldWrapper>
          <FieldWrapper label="Tagline">
            <Input value={settings.tagline} onChange={(e) => update("tagline", e.target.value)} />
          </FieldWrapper>
          <FieldWrapper label="Facebook URL">
            <Input value={settings.facebook} onChange={(e) => update("facebook", e.target.value)} />
          </FieldWrapper>
          <FieldWrapper label="Email">
            <Input value={settings.email} onChange={(e) => update("email", e.target.value)} />
          </FieldWrapper>
          <FieldWrapper label="Phone">
            <Input placeholder="Not provided yet" value={settings.phone} onChange={(e) => update("phone", e.target.value)} />
          </FieldWrapper>
          <FieldWrapper label="Address">
            <Input value={settings.address} onChange={(e) => update("address", e.target.value)} />
          </FieldWrapper>
          <FieldWrapper label="Description">
            <Textarea value={settings.description} onChange={(e) => update("description", e.target.value)} />
          </FieldWrapper>
          <Button className="self-start">Save Settings</Button>
        </div>
      </Card>
    </div>
  );
};

export default AdminSettings;
