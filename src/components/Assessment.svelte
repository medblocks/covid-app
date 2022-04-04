<script lang="ts">
  import { calcResp } from "./scores";
  import { calcSat } from "./scores";
  import { calcTemp } from "./scores";
  import { calcSys } from "./scores";
  import { calcHeart } from "./scores";
  import "@shoelace-style/shoelace/dist/components/details/details";
  import { medications } from "./codes";
  import { openehr } from "../services";
  import { navigate } from "svelte-routing";
  import { onMount } from "svelte";
  export let compositionId: string | undefined = undefined;
  export let ehrId: string;
  export let templateId: string = "MCS.CovidCare.DailySheet.v0.2";
  export let redirectUrl: string | undefined;

  let form;
  let loading = false;
  let onAir;

  let resp, temp, heart, sat, sys: number | undefined;
  let respScore, satScore, tempScore, sysScore, heartScore: string | undefined;

  let scores = {};
  let total;
  let backdate: boolean = false;
  let backdateTime: string;
  let composer_name: string;
  let error = false;
  onMount(async () => {
    if (compositionId) {
      const r = await openehr.get(`/ecis/v1/composition/${compositionId}`, {
        params: { format: "FLAT" },
      });
      const data = r.data?.composition;
      if (data) {
        composer_name = data["covid_care_daily_sheet/composer|name"] || "";
        form.import(data);
      }
    }
  });

  async function handleSubmit(e: CustomEvent) {
    const data = e.detail;
    loading = true;
    console.log(e);
    console.log(ctx);
    try {
      if (compositionId) {
        const r = await openehr.put(
          `/ecis/v1/composition/${compositionId.split(":")[0]}`,
          data,
          {
            params: { format: "FLAT", templateId, ehrId },
          }
        );
      } else {
        const r = await openehr.post("/ecis/v1/composition/", data, {
          params: { format: "FLAT", templateId, ehrId },
        });
        console.log(r);
      }
    } catch (e) {
      error = true;
    }
    loading = false;
    navigate(redirectUrl ?? `/clinical/${ehrId}`, { replace: true });
  }

  $: {
    respScore = calcResp(resp);
    satScore = calcSat(sat);
    tempScore = calcTemp(temp);
    sysScore = calcSys(sys);
    heartScore = calcHeart(heart);
    if (Object.keys(scores).length === 7) {
      total = Object.values(scores)
        .map((ord: any) => ord?.ordinal)
        .reduce((a, b) => a + b);
    } else {
      total = null;
    }
  }
  let ctx;

  $: if (backdateTime) {
    ctx = {
      time: new Date(backdateTime).toISOString(),
      careflow_step: {
        terminology: "local",
        value: "Medication recommended",
        code: "at0109",
      },
      current_state: {
        terminology: "openehr",
        code: "526",
        value: "planned",
      },
    };
  } else {
    ctx = {
      careflow_step: {
        terminology: "local",
        value: "Medication recommended",
        code: "at0109",
      },
      current_state: {
        terminology: "openehr",
        code: "526",
        value: "planned",
      },
    };
  }
</script>

<p class="my-5 text-xl font-semibold text-gray-700">Daily Monitoring</p>
<mb-form
  bind:this={form}
  on:mb-submit={handleSubmit}
  class="flex flex-col gap-3"
  {ctx}
>
  <sl-input
    label="Volunteer"
    value={composer_name || ""}
    on:sl-input={(e) => {
      composer_name = e.target.value;
    }}
  />
  <sl-checkbox
    checked={backdate}
    on:sl-change={(e) => {
      console.log(e);
      backdate = e.target.checked;
    }}>Backdate</sl-checkbox
  >
  {#if backdate}
    <mb-date
      time
      on:mb-input={(e) => (backdateTime = e.target.data)}
      label="Backdate"
    />
  {/if}
  <p class=" text-2xl font-bold text-gray-700">Vitals</p>
  <mb-buttons
    on:mb-input={(e) => {
      scores = { ...scores, Consciousness: e.target.data };
    }}
    path="covid_care_daily_sheet/vitals/news_uk_rcp/level_of_consciousness"
    label="Consciousness"
  >
    <mb-option value="at0024" label="Alert" ordinal="0" />
    <mb-option value="at0025" label="Not alert" ordinal="3" />
  </mb-buttons>
  <mb-quantity
    path="covid_care_daily_sheet/vitals/body_temperature/temperature"
    label="Temperature"
    default="[degF]"
    on:mb-input={(e) => {
      temp = e.target.data?.magnitude;
    }}
  >
    <mb-unit unit="[degF]" label="°F" />
  </mb-quantity>
  <mb-quantity
    path="covid_care_daily_sheet/vitals/blood_pressure/systolic"
    label="Systolic Blood Pressure"
    default="mm[Hg]"
    on:mb-input={(e) => {
      sys = e.target.data?.magnitude;
    }}
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
    on:mb-input={(e) => {
      heart = e.target.data?.magnitude;
    }}
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
    required
    path="covid_care_daily_sheet/vitals/pulse_oximetry/any_event:0/spo"
    label="SpO₂ (%)"
    on:mb-input={(e) => {
      sat = e.target.data?.numerator;
    }}
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
    <div class="flex flex-col gap-3">
      <mb-percent
        path="covid_care_daily_sheet/vitals/pulse_oximetry/any_event:0/inspired_oxygen/percent_o"
        label="Percent O₂"
      />
      <mb-quantity
        path="covid_care_daily_sheet/vitals/pulse_oximetry/any_event:0/inspired_oxygen/flow_rate"
        label="Flow rate"
        default="l/min"
        max="50"
        min="0"
      >
        <mb-unit unit="ml/min" label="ml/min" />
        <mb-unit unit="l/min" label="l/min" />
      </mb-quantity>
    </div>
  {/if}
  <mb-checkbox-any
    path="covid_care_daily_sheet/vitals/other_risk_factors/labored_breathing:0/presence"
    label="Labored Breathing"
    bind={{ code: "at0018", value: "Present", terminology: "local" }}
  />
  <!-- NEWS Score -->

  <!-- Auto-calculated -->

  <p class="mt-5 text-xl text-gray-700">
    Early Warning Score -
    {#if total != null}
      <span class="font-bold text-2xl">{total}</span><span class="text-2xl"
        >/20</span
      >
      <mb-context
        class="hidden"
        path="covid_care_daily_sheet/vitals/news_uk_rcp/total_score"
        data={total}
      />
    {:else}
      <span>Needs more details</span>
    {/if}
  </p>
  <div class="hidden">
    <mb-select
      on:mb-input={(e) => {
        scores = { ...scores, Respiration: e.target.data };
      }}
      path="covid_care_daily_sheet/vitals/news_uk_rcp/respiration_rate"
      label="Respiration"
      data={{ code: respScore }}
    >
      <mb-option value="at0018" label="12-20" ordinal="0" />
      <mb-option value="at0019" label="9-11" ordinal="1" />
      <mb-option value="at0020" label="21-24" ordinal="2" />
      <mb-option value="at0021" label="<=8 or >=25" ordinal="3" /></mb-select
    >
    <mb-select
      on:mb-input={(e) => {
        scores = { ...scores, Saturation: e.target.data };
      }}
      path="covid_care_daily_sheet/vitals/news_uk_rcp/oxygen_saturation"
      label="Saturation"
      data={{ code: satScore }}
    >
      <mb-option value="at0030" label=">= 96" ordinal="0" />
      <mb-option value="at0031" label="94-95" ordinal="1" />
      <mb-option value="at0032" label="92-93" ordinal="2" />
      <mb-option value="at0033" label="<=91" ordinal="3" /></mb-select
    >
    <mb-select
      on:mb-input={(e) => {
        scores = { ...scores, "On Oxygen": e.target.data };
      }}
      path="covid_care_daily_sheet/vitals/news_uk_rcp/supplemental_oxygen"
      label="On Oxygen"
      data={{ code: onAir ? "at0036" : "at0037" }}
    >
      <mb-option value="at0036" label="No" ordinal="0" />
      <mb-option value="at0037" label="Yes" ordinal="2" /></mb-select
    >
    <mb-select
      on:mb-input={(e) => {
        scores = { ...scores, Temperature: e.target.data };
      }}
      path="covid_care_daily_sheet/vitals/news_uk_rcp/body_temperature"
      label="Temperature"
      data={{ code: tempScore }}
    >
      <mb-option value="at0022" label="36.1-38.0" ordinal="0" />
      <mb-option value="at0023" label="35.1-36.0 or 38.1-39.0" ordinal="1" />
      <mb-option value="at0038" label=">=39.1" ordinal="2" />
      <mb-option value="at0039" label="<=35.0" ordinal="3" /></mb-select
    >
    <mb-select
      on:mb-input={(e) => {
        scores = { ...scores, "Systolic Blood Pressure": e.target.data };
      }}
      path="covid_care_daily_sheet/vitals/news_uk_rcp/systolic_blood_pressure"
      label="Systolic Blood Pressure"
      data={{ code: sysScore }}
    >
      <mb-option value="at0014" label="111-219" ordinal="0" />
      <mb-option value="at0015" label="101-110" ordinal="1" />
      <mb-option value="at0016" label="91-100" ordinal="2" />
      <mb-option value="at0017" label="<=90 or >= 220" ordinal="3" /></mb-select
    >
    <mb-select
      on:mb-input={(e) => {
        scores = { ...scores, "Heart Rate": e.target.data };
      }}
      path="covid_care_daily_sheet/vitals/news_uk_rcp/heart_rate"
      label="Heart Rate"
      data={{ code: heartScore }}
    >
      <mb-option value="at0013" label="51-90" ordinal="0" />
      <mb-option value="at0012" label="41-50 or 91-110" ordinal="1" />
      <mb-option value="at0011" label="111-130" ordinal="2" />
      <mb-option value="at0010" label="<=40 or >=131" ordinal="3" /></mb-select
    >
  </div>
  <sl-details summary="Calculation details">
    {#each Object.keys(scores) as key}
      {#if scores[key]?.ordinal != null}
        <p>
          <span class="font-semibold">{scores[key]?.ordinal}</span> - {key}: {scores[
            key
          ].value}
        </p>
      {/if}
    {/each}
  </sl-details>
  <!-- Labs -->
  <p class="mt-5 text-2xl font-bold text-gray-700">Labs</p>

  <mb-quantity
    default="mg/dl"
    path="covid_care_daily_sheet/lab_results/fasting_glucose:0/analyte_result"
    label="Fasting Glucose"
  >
    <mb-unit unit="mg/dl" label="mg/dl" />
  </mb-quantity>

  <mb-quantity
    default="mg/dl"
    path="covid_care_daily_sheet/lab_results/postprandial_blood_sugar/analyte_result"
    label="Postprandial Glucose"
  >
    <mb-unit unit="mg/dl" label="mg/dl" />
  </mb-quantity>

  <mb-quantity
    default="mg/L"
    path="covid_care_daily_sheet/lab_results/crp/analyte_result"
    label="C-Reactive Protein"
  >
    <mb-unit unit="mg/L" label="mg/L" />
  </mb-quantity>
  <mb-quantity
    default="1/mm3"
    path="covid_care_daily_sheet/lab_results/total_wbc/analyte_result"
    label="Total WBC"
  >
    <mb-unit unit="1/mm3" label="/mm3" />
  </mb-quantity>
  <mb-quantity
    default="ug/ml"
    path="covid_care_daily_sheet/lab_results/d-dimer/analyte_result:0"
    label="D-Dimer"
  >
    <mb-unit unit="ug/ml" label="ug/ml" />
  </mb-quantity>
  <!-- Management -->
  <p class="mt-5 text-2xl font-bold text-gray-700">Management</p>
  {#each medications as med}
    <mb-checkbox-any
      path={med.path}
      label={med.code?.value || med.code}
      bind={med.code}
    />
  {/each}
  <mb-checkbox-any
    disabled
    checked={onAir===false}
    path="covid_care_daily_sheet/management/oxygen_therapy/procedure_name"
    label={`On Oxygen ('On Air' ${!onAir ? "uncheck" : "checked"})`}
    bind={{
      code: "8",
      value: "Oxygen Therapy",
      terminology: "SNOMED-CT",
    }}
  />

  <!-- Contexts -->
  <div class="hidden">
    <mb-context
      path="covid_care_daily_sheet/vitals/other_risk_factors/labored_breathing:0/risk_factor"
      label="Risk factor"
      data={"Labored Breathing"}
    />
    <mb-context
      path="covid_care_daily_sheet/vitals/other_risk_factors/health_risk"
      label="Health risk"
      data={"Other health risks"}
    />
    <mb-context
      path="covid_care_daily_sheet/vitals/other_risk_factors/subject"
    />
    <mb-context
      path="covid_care_daily_sheet/vitals/other_risk_factors/language"
    />
    <mb-context
      path="covid_care_daily_sheet/vitals/other_risk_factors/encoding"
    />
    <mb-context
      path="covid_care_daily_sheet/lab_results/total_wbc/analyte_name"
      label="Analyte name"
    />
    <mb-context
      path="covid_care_daily_sheet/lab_results/d-dimer/analyte_name"
      label="Analyte name"
    />
    <mb-context
      path="covid_care_daily_sheet/lab_results/postprandial_blood_sugar/analyte_name"
      label="Analyte name"
    />
    <mb-context
      path="covid_care_daily_sheet/lab_results/test_name"
      label="Test name"
      data="Covid Screening Panel"
    />
    <mb-context
      path="covid_care_daily_sheet/lab_results/fasting_glucose:0/analyte_name"
      label="Analyte name"
    />
    <mb-context
      path="covid_care_daily_sheet/lab_results/crp/analyte_name"
      label="Analyte name"
    />
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
    <mb-context
      path="covid_care_daily_sheet/management/dexamethasone/subject"
    />
    <mb-context
      path="covid_care_daily_sheet/management/dexamethasone/language"
    />
    <mb-context
      path="covid_care_daily_sheet/management/dexamethasone/encoding"
    />
    <mb-context path="covid_care_daily_sheet/management/dexamethasone/time" />
    <mb-context
      path="covid_care_daily_sheet/management/dexamethasone/ism_transition/careflow_step"
    />
    <mb-context
      path="covid_care_daily_sheet/management/dexamethasone/ism_transition/current_state"
    />
    <mb-context
      path="covid_care_daily_sheet/management/dexamethasone/ism_transition/transition"
    />
    <mb-context path="covid_care_daily_sheet/management/enoxaparin/subject" />
    <mb-context path="covid_care_daily_sheet/management/enoxaparin/language" />
    <mb-context path="covid_care_daily_sheet/management/enoxaparin/encoding" />
    <mb-context path="covid_care_daily_sheet/management/enoxaparin/time" />
    <mb-context
      path="covid_care_daily_sheet/management/enoxaparin/ism_transition/careflow_step"
    />
    <mb-context
      path="covid_care_daily_sheet/management/enoxaparin/ism_transition/current_state"
    />
    <mb-context
      path="covid_care_daily_sheet/management/enoxaparin/ism_transition/transition"
    />
    <mb-context
      path="covid_care_daily_sheet/management/tab_paracetamol/subject"
    />
    <mb-context
      path="covid_care_daily_sheet/management/tab_paracetamol/language"
    />
    <mb-context
      path="covid_care_daily_sheet/management/tab_paracetamol/encoding"
    />
    <mb-context path="covid_care_daily_sheet/management/tab_paracetamol/time" />
    <mb-context
      path="covid_care_daily_sheet/management/tab_paracetamol/ism_transition/careflow_step"
    />
    <mb-context
      path="covid_care_daily_sheet/management/tab_paracetamol/ism_transition/current_state"
    />
    <mb-context
      path="covid_care_daily_sheet/management/tab_paracetamol/ism_transition/transition"
    />
    <mb-context
      path="covid_care_daily_sheet/management/tab_co-amoxyclav/subject"
    />
    <mb-context
      path="covid_care_daily_sheet/management/tab_co-amoxyclav/language"
    />
    <mb-context
      path="covid_care_daily_sheet/management/tab_co-amoxyclav/encoding"
    />
    <mb-context
      path="covid_care_daily_sheet/management/tab_co-amoxyclav/time"
    />
    <mb-context
      path="covid_care_daily_sheet/management/tab_co-amoxyclav/ism_transition/careflow_step"
    />
    <mb-context
      path="covid_care_daily_sheet/management/tab_co-amoxyclav/ism_transition/current_state"
    />
    <mb-context
      path="covid_care_daily_sheet/management/tab_co-amoxyclav/ism_transition/transition"
    />
    <mb-context
      path="covid_care_daily_sheet/management/budesonide_puffs/subject"
    />
    <mb-context
      path="covid_care_daily_sheet/management/budesonide_puffs/language"
    />
    <mb-context
      path="covid_care_daily_sheet/management/budesonide_puffs/encoding"
    />
    <mb-context
      path="covid_care_daily_sheet/management/budesonide_puffs/time"
    />
    <mb-context
      path="covid_care_daily_sheet/management/budesonide_puffs/ism_transition/careflow_step"
    />
    <mb-context
      path="covid_care_daily_sheet/management/budesonide_puffs/ism_transition/current_state"
    />
    <mb-context
      path="covid_care_daily_sheet/management/budesonide_puffs/ism_transition/transition"
    />
    <mb-context
      path="covid_care_daily_sheet/management/steam_inhalation/subject"
    />
    <mb-context
      path="covid_care_daily_sheet/management/steam_inhalation/language"
    />
    <mb-context
      path="covid_care_daily_sheet/management/steam_inhalation/encoding"
    />
    <mb-context
      path="covid_care_daily_sheet/management/steam_inhalation/time"
    />
    <mb-context
      path="covid_care_daily_sheet/management/steam_inhalation/ism_transition/careflow_step"
    />
    <mb-context
      path="covid_care_daily_sheet/management/steam_inhalation/ism_transition/current_state"
    />
    <mb-context
      path="covid_care_daily_sheet/management/steam_inhalation/ism_transition/transition"
    />
    <mb-context
      path="covid_care_daily_sheet/management/deep_breathing_exercises/subject"
    />
    <mb-context
      path="covid_care_daily_sheet/management/deep_breathing_exercises/language"
    />
    <mb-context
      path="covid_care_daily_sheet/management/deep_breathing_exercises/encoding"
    />
    <mb-context
      path="covid_care_daily_sheet/management/deep_breathing_exercises/time"
    />
    <mb-context
      path="covid_care_daily_sheet/management/deep_breathing_exercises/ism_transition/careflow_step"
    />
    <mb-context
      path="covid_care_daily_sheet/management/deep_breathing_exercises/ism_transition/current_state"
    />
    <mb-context
      path="covid_care_daily_sheet/management/deep_breathing_exercises/ism_transition/transition"
    />
    <mb-context
      path="covid_care_daily_sheet/management/oxygen_therapy/subject"
    />
    <mb-context
      path="covid_care_daily_sheet/management/oxygen_therapy/language"
    />
    <mb-context
      path="covid_care_daily_sheet/management/oxygen_therapy/encoding"
    />
    <mb-context path="covid_care_daily_sheet/management/oxygen_therapy/time" />
    <mb-context
      path="covid_care_daily_sheet/management/oxygen_therapy/ism_transition/careflow_step"
    />
    <mb-context
      path="covid_care_daily_sheet/management/oxygen_therapy/ism_transition/current_state"
    />
    <mb-context
      path="covid_care_daily_sheet/management/oxygen_therapy/ism_transition/transition"
    />
    <mb-context
      path="covid_care_daily_sheet/management/other_regular_medication/time"
    />
    <mb-context
      path="covid_care_daily_sheet/management/other_regular_medication/subject"
    />
    <mb-context
      path="covid_care_daily_sheet/management/other_regular_medication/language"
    />
    <mb-context
      path="covid_care_daily_sheet/management/other_regular_medication/encoding"
    />

    <mb-context path="covid_care_daily_sheet/language" />
    <mb-context path="covid_care_daily_sheet/territory" />
    <mb-context
      path="covid_care_daily_sheet/composer"
      data={composer_name ? { name: composer_name } : undefined}
    />
  </div>
  {#if error}
    <p class="text-red-600 font-semibold">
      Something went wrong. Please make sure all the fields are correctly filled
      up.
    </p>
  {/if}
  <mb-submit>
    <sl-button size="large" class="mt-4 w-full" {loading} type="neutral">
      Save
    </sl-button>
  </mb-submit>
</mb-form>
