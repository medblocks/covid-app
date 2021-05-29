<script lang="ts">
  let loading = false;
  function handleSubmit(e) {
    console.log(JSON.stringify(e.detail));
  }
</script>

<mb-form on:mb-submit={handleSubmit} class="flex flex-col gap-3">
  <mb-quantity
    path="covid_care_daily_sheet/vitals/body_temperature/temperature"
    label="Temperature"
    default="[degF]"
  >
    <mb-unit unit="[degF]" label="°F" />
    <mb-unit unit="Cel" label="°C" />
  </mb-quantity>
  <mb-quantity
    path="covid_care_daily_sheet/vitals/blood_pressure/systolic"
    label="Systolic Blood Pressure"
    default="mm[Hg]"
  >
    <mb-unit unit="mm[Hg]" label="mm[Hg]" />
  </mb-quantity>
  <mb-quantity
    path="covid_care_daily_sheet/vitals/blood_pressure/diastolic"
    label="Diastolic Blood Pressure"
    default="mm[Hg]"
  >
    <mb-unit unit="mm[Hg]" label="mm[Hg]" />
  </mb-quantity>
  <mb-quantity
    path="covid_care_daily_sheet/vitals/pulse_heart_beat/rate"
    label="Pulse"
    default="/min"
  >
    <mb-unit unit="/min" label="/min" />
  </mb-quantity>
  <mb-percent
    path="covid_care_daily_sheet/vitals/pulse_oximetry/any_event:0/spo"
    label="SpO₂ (%)"
  />
  <mb-checkbox
    label="On air"
    path="covid_care_daily_sheet/vitals/pulse_oximetry/any_event:0/inspired_oxygen/on_air"
  />
  <mb-percent
    path="covid_care_daily_sheet/vitals/pulse_oximetry/any_event:0/inspired_oxygen/percent_o"
    label="Percent O₂"
  />
  <mb-quantity
    path="covid_care_daily_sheet/vitals/pulse_oximetry/any_event:0/inspired_oxygen/flow_rate"
    label="Flow rate"
    default="ml/min"
  >
    <mb-unit unit="ml/min" label="ml/min" />
    <mb-unit unit="l/min" label="l/min" />
  </mb-quantity>
  <div class="hidden">
    <mb-context path="covid_care_daily_sheet/category" />
    <mb-context path="covid_care_daily_sheet/context/start_time" />
    <mb-context path="covid_care_daily_sheet/context/setting" />
    <mb-context path="covid_care_daily_sheet/vitals/body_temperature/time" />
    <mb-context path="covid_care_daily_sheet/vitals/body_temperature/subject" />
    <mb-context
      path="covid_care_daily_sheet/vitals/body_temperature/language"
    />
    <mb-context
      path="covid_care_daily_sheet/vitals/body_temperature/encoding"
    />
    <mb-context path="covid_care_daily_sheet/vitals/blood_pressure/time" />
    <mb-context path="covid_care_daily_sheet/vitals/blood_pressure/subject" />
    <mb-context path="covid_care_daily_sheet/vitals/blood_pressure/language" />
    <mb-context path="covid_care_daily_sheet/vitals/blood_pressure/encoding" />
    <mb-context path="covid_care_daily_sheet/vitals/pulse_heart_beat/time" />
    <mb-context path="covid_care_daily_sheet/vitals/pulse_heart_beat/subject" />
    <mb-context
      path="covid_care_daily_sheet/vitals/pulse_heart_beat/language"
    />
    <mb-context
      path="covid_care_daily_sheet/vitals/pulse_heart_beat/encoding"
    />
    <mb-context path="covid_care_daily_sheet/vitals/news_uk_rcp/time" />
    <mb-context path="covid_care_daily_sheet/vitals/news_uk_rcp/subject" />
    <mb-context path="covid_care_daily_sheet/vitals/news_uk_rcp/language" />
    <mb-context path="covid_care_daily_sheet/vitals/news_uk_rcp/encoding" />
    <mb-context
      path="covid_care_daily_sheet/vitals/pulse_oximetry/any_event:0/time"
    />
    <mb-context path="covid_care_daily_sheet/vitals/pulse_oximetry/subject" />
    <mb-context path="covid_care_daily_sheet/vitals/pulse_oximetry/language" />
    <mb-context path="covid_care_daily_sheet/vitals/pulse_oximetry/encoding" />
    <mb-context path="covid_care_daily_sheet/vitals/respiration/time" />
    <mb-context path="covid_care_daily_sheet/vitals/respiration/subject" />
    <mb-context path="covid_care_daily_sheet/vitals/respiration/language" />
    <mb-context path="covid_care_daily_sheet/vitals/respiration/encoding" />
    <mb-context path="covid_care_daily_sheet/lab_results/time" />
    <mb-context path="covid_care_daily_sheet/lab_results/subject" />
    <mb-context path="covid_care_daily_sheet/lab_results/language" />
    <mb-context path="covid_care_daily_sheet/lab_results/encoding" />
    <mb-context path="covid_care_daily_sheet/medication_management:0/subject" />
    <mb-context
      path="covid_care_daily_sheet/medication_management:0/language"
    />
    <mb-context
      path="covid_care_daily_sheet/medication_management:0/encoding"
    />
    <mb-context path="covid_care_daily_sheet/medication_management:0/time" />
    <mb-context
      path="covid_care_daily_sheet/medication_management:0/ism_transition/careflow_step"
    />
    <mb-context
      path="covid_care_daily_sheet/medication_management:0/ism_transition/current_state"
    />
    <mb-context
      path="covid_care_daily_sheet/medication_management:0/ism_transition/transition"
    />
    <mb-context path="covid_care_daily_sheet/composer" />
    <mb-context path="covid_care_daily_sheet/language" />
    <mb-context path="covid_care_daily_sheet/territory" />
  </div>

  <mb-submit>
    <sl-button size="large" class="mt-4 w-full" {loading} type="info">
      Save
    </sl-button>
  </mb-submit>
</mb-form>
