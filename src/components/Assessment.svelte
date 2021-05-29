<script lang="ts">
  import { calcResp } from "./scores";

  let loading = false;
  function handleSubmit(e) {
    console.log(JSON.stringify(e.detail));
  }
  let onAir = false;

  let resp;
  let spo2;
  let supplemental;
  let temp;
  let heart;
  let bp;

  let respScore: string | undefined;

  $: {
    respScore = calcResp(resp);
    console.log(resp, respScore);
  }
</script>

<mb-form on:mb-submit={handleSubmit} class="flex flex-col gap-3">
  <p class="mt-5 text-xl font-bold text-gray-700">Vitals - {resp}</p>
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
    label="Pulse Rate"
    default="/min"
  >
    <mb-unit unit="/min" label="/min" />
  </mb-quantity>
  <mb-quantity
    default="/min"
    path="covid_care_daily_sheet/vitals/respiration/rate"
    label="Respiratory Rate"
    on:mb-input={(e) => {
      resp = e.target.data?.magnitude;
    }}
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
    data={onAir}
    on:mb-input={(e) => {
      onAir = e.target.data;
    }}
  />
  {#if !onAir}
    <div class="flex gap-3">
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
    </div>
  {/if}
  <!-- NEWS Score -->
  <mb-buttons
    path="covid_care_daily_sheet/vitals/news_uk_rcp/level_of_consciousness"
    label="Consciousness"
  >
    <mb-option value="at0024" label="Alert" ordinal="0" />
    <mb-option value="at0025" label="Not alert" ordinal="3" />
  </mb-buttons>
  <!-- Auto-calculated -->
  <p class="mt-5 text-xl font-bold text-gray-700">EWS Score</p>
  <mb-select
    path="covid_care_daily_sheet/vitals/news_uk_rcp/respiration_rate"
    label="Respiration"
    data={{ code: respScore }}
    on:mb-input={(e) => {
      console.log(e.target.data?.ordinal);
    }}
  >
    <mb-option value="at0018" label="12-20" ordinal="0" />
    <mb-option value="at0019" label="9-11" ordinal="1" />
    <mb-option value="at0020" label="21-24" ordinal="2" />
    <mb-option value="at0021" label="<=8 or >=25" ordinal="3" /></mb-select
  >
  <mb-select
    path="covid_care_daily_sheet/vitals/news_uk_rcp/oxygen_saturation"
    label="Saturation"
  >
    <mb-option value="at0030" label=">= 96" ordinal="0" />
    <mb-option value="at0031" label="94-95" ordinal="1" />
    <mb-option value="at0032" label="92-93" ordinal="2" />
    <mb-option value="at0033" label="<=91" ordinal="3" /></mb-select
  >
  <mb-select
    path="covid_care_daily_sheet/vitals/news_uk_rcp/supplemental_oxygen"
    label="Oxygen"
  >
    <mb-option value="at0036" label="No" ordinal="0" />
    <mb-option value="at0037" label="Yes" ordinal="2" /></mb-select
  >
  <mb-select
    path="covid_care_daily_sheet/vitals/news_uk_rcp/body_temperature"
    label="Temperature"
  >
    <mb-option value="at0022" label="36.1-38.0" ordinal="0" />
    <mb-option value="at0023" label="35.1-36.0 or 38.1-39.0" ordinal="1" />
    <mb-option value="at0038" label=">=39.1" ordinal="2" />
    <mb-option value="at0039" label="<=35.0" ordinal="3" /></mb-select
  >
  <mb-select
    path="covid_care_daily_sheet/vitals/news_uk_rcp/systolic_blood_pressure"
    label="Systolic Blood Pressure"
  >
    <mb-option value="at0014" label="111-219" ordinal="0" />
    <mb-option value="at0015" label="101-110" ordinal="1" />
    <mb-option value="at0016" label="91-100" ordinal="2" />
    <mb-option value="at0017" label="<=90 or >= 220" ordinal="3" /></mb-select
  >
  <mb-select
    path="covid_care_daily_sheet/vitals/news_uk_rcp/heart_rate"
    label="Heart Rate"
  >
    <mb-option value="at0013" label="51-90" ordinal="0" />
    <mb-option value="at0012" label="41-50 or 91-110" ordinal="1" />
    <mb-option value="at0011" label="111-130" ordinal="2" />
    <mb-option value="at0010" label="<=40 or >=131" ordinal="3" /></mb-select
  >

  <!-- Contexts -->
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
