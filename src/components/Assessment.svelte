<mb-form>
  <!-- Temperature -->
  <mb-quantity
    path="covid_care_daily_sheet/vitals/body_temperature/temperature"
    label="Temperature"
    default="[degF]"
  >
    <mb-unit unit="[degF]" label="°F" />
    <mb-unit unit="Cel" label="Cel" />
  </mb-quantity>
  <mb-context path="covid_care_daily_sheet/vitals/body_temperature/time" />
  <mb-context path="covid_care_daily_sheet/vitals/body_temperature/language" />
  <mb-context path="covid_care_daily_sheet/vitals/body_temperature/encoding" />
  <mb-context path="covid_care_daily_sheet/vitals/body_temperature/subject" />

  <!-- Blood Pressure -->
  <mb-quantity
    path="covid_care_daily_sheet/vitals/blood_pressure/systolic"
    label="Systolic"
    default="mm[Hg]"
  >
    <mb-unit unit="mm[Hg]" label="mm[Hg]" />
  </mb-quantity>
  <mb-quantity
    path="covid_care_daily_sheet/vitals/blood_pressure/diastolic"
    label="Diastolic"
    default="mm[Hg]"
  >
    <mb-unit unit="mm[Hg]" label="mm[Hg]" />
  </mb-quantity>
  <mb-context path="covid_care_daily_sheet/vitals/blood_pressure/time" />
  <mb-context path="covid_care_daily_sheet/vitals/blood_pressure/language" />
  <mb-context path="covid_care_daily_sheet/vitals/blood_pressure/encoding" />
  <mb-context path="covid_care_daily_sheet/vitals/blood_pressure/subject" />

  <!-- Pulse -->
  <mb-quantity
    path="covid_care_daily_sheet/vitals/pulse_heart_beat/rate"
    label="Pulse Rate"
  >
    <mb-unit unit="/min" label="/min" />
  </mb-quantity>
  <mb-context path="covid_care_daily_sheet/vitals/pulse_heart_beat/time" />
  <mb-context path="covid_care_daily_sheet/vitals/pulse_heart_beat/language" />
  <mb-context path="covid_care_daily_sheet/vitals/pulse_heart_beat/encoding" />
  <mb-context path="covid_care_daily_sheet/vitals/pulse_heart_beat/subject" />

  <!-- Saturation  TODO: DV_PROPORTION-->

  <mb-context
    path="covid_care_daily_sheet/vitals/pulse_oximetry/any_event:0/time"
  />
  <mb-context path="covid_care_daily_sheet/vitals/pulse_oximetry/language" />
  <mb-context path="covid_care_daily_sheet/vitals/pulse_oximetry/encoding" />
  <mb-context path="covid_care_daily_sheet/vitals/pulse_oximetry/subject" />

  <!-- Respiratory Rate -->
  <mb-quantity
    path="covid_care_daily_sheet/vitals/respiration/rate"
    label="Respiratory Rate"
  >
    <mb-unit unit="/min" label="/min" />
  </mb-quantity>
  <mb-context path="covid_care_daily_sheet/vitals/respiration/time" />
  <mb-context path="covid_care_daily_sheet/vitals/respiration/language" />
  <mb-context path="covid_care_daily_sheet/vitals/respiration/encoding" />
  <mb-context path="covid_care_daily_sheet/vitals/respiration/subject" />
</mb-form>

<mb-input
  path="covid_care_daily_sheet/lab_results/test_name"
  label="Test name"
  data="Value"
/>
