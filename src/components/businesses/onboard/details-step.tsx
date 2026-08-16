import { FormField, SelectField, TextareaField } from "./form-field";
import { PRICE_OPTIONS, type OnboardBusinessData } from "./types";

export function DetailsStep({
  data,
  onChange,
}: {
  data: OnboardBusinessData;
  onChange: (patch: Partial<OnboardBusinessData>) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-2">
      <FormField
        id="phone-number"
        label="Phone Number"
        placeholder="+233 9876435578"
        value={data.phone}
        onChange={(e) => onChange({ phone: e.target.value })}
      />
      <FormField
        id="wait-time"
        label="Wait Time"
        value={data.waitTime}
        onChange={(e) => onChange({ waitTime: e.target.value })}
      />

      <FormField
        id="email-address"
        label="Email Address"
        type="email"
        placeholder="Info@gmail.com"
        value={data.email}
        onChange={(e) => onChange({ email: e.target.value })}
      />
      <FormField
        id="city-area"
        label="City/Area"
        value={data.cityArea}
        onChange={(e) => onChange({ cityArea: e.target.value })}
      />

      <FormField
        id="website"
        label="Website"
        placeholder="www."
        value={data.website}
        onChange={(e) => onChange({ website: e.target.value })}
      />
      <FormField
        id="operating-hours"
        label="Operating Hours"
        placeholder="Food & Dining"
        value={data.operatingHours}
        onChange={(e) => onChange({ operatingHours: e.target.value })}
      />

      <SelectField
        id="price"
        label="Price"
        options={PRICE_OPTIONS}
        value={data.price}
        onChange={(e) => onChange({ price: e.target.value })}
      />
      <TextareaField
        id="amenities"
        label="Amenities ( eg. swimming pool, breakfast in bed, etc )"
        placeholder="Pub, swimming pool"
        rows={4}
        value={data.amenities}
        onChange={(e) => onChange({ amenities: e.target.value })}
      />

      <FormField
        id="business-address"
        label="Business Address"
        value={data.businessAddress}
        onChange={(e) => onChange({ businessAddress: e.target.value })}
      />
    </div>
  );
}
