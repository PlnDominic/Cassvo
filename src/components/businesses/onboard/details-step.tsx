import { FormField } from "./form-field";
import type { OnboardBusinessData } from "./types";

export function DetailsStep({
  data,
  onChange,
}: {
  data: OnboardBusinessData;
  onChange: (patch: Partial<OnboardBusinessData>) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <FormField
        id="business-address"
        label="Address"
        placeholder="15 Third Street, Osu"
        value={data.address}
        onChange={(e) => onChange({ address: e.target.value })}
      />
      <FormField
        id="business-city"
        label="City"
        placeholder="Accra"
        value={data.city}
        onChange={(e) => onChange({ city: e.target.value })}
      />
      <FormField
        id="business-region"
        label="Region"
        placeholder="Greater Accra"
        value={data.region}
        onChange={(e) => onChange({ region: e.target.value })}
      />
      <FormField
        id="business-phone"
        label="Phone"
        placeholder="+233 20 125 4567"
        value={data.phone}
        onChange={(e) => onChange({ phone: e.target.value })}
      />
      <FormField
        id="business-email"
        label="Email"
        type="email"
        placeholder="info@business.com"
        value={data.email}
        onChange={(e) => onChange({ email: e.target.value })}
      />
      <FormField
        id="business-website"
        label="Website"
        placeholder="www.business.com"
        value={data.website}
        onChange={(e) => onChange({ website: e.target.value })}
      />
      <FormField
        id="business-open-hours"
        label="Open Hours"
        placeholder="9:00 AM – 10:00 PM"
        value={data.openHours}
        onChange={(e) => onChange({ openHours: e.target.value })}
      />
    </div>
  );
}
