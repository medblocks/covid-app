export const medications: {
  path: string,
  code: any
}[] = [
  {
    path: "covid_care_daily_sheet/management/dexamethasone/medication_item",
    code: {
      code: "1",
      value: "Dexamethasone",
      terminology: "SNOMED-CT",
    },
  },
  {
    code: {
      code: "2",
      value: "Enoxaparin S/C",
      terminology: "SNOMED-CT",
    },
    path: "covid_care_daily_sheet/management/enoxaparin/medication_item",
  },
  {
    code: {
      code: "3",
      value: "Tab Paracetamol",
      terminology: "SNOMED-CT",
    },
    path: "covid_care_daily_sheet/management/tab_paracetamol/medication_item",
  },
  {
    code: {
      code: "4",
      value: "Tab Co-Amoxyclav",
      terminology: "SNOMED-CT",
    },
    path: "covid_care_daily_sheet/management/tab_co-amoxyclav/medication_item",
  },
  {
    code: {
      code: "5",
      value: "Budesonide Puffs",
      terminology: "SNOMED-CT",
    },
    path: "covid_care_daily_sheet/management/budesonide_puffs/medication_item",
  },
  {
    code: {
      code: "6",
      value: "Steam inhalation",
      terminology: "SNOMED-CT",
    },
    path: "covid_care_daily_sheet/management/steam_inhalation/procedure_name",
  },
  {
    code: {
      code: "7",
      value: "Deep breathing exercises",
      terminology: "SNOMED-CT",
    },
    path: "covid_care_daily_sheet/management/deep_breathing_exercises/procedure_name",
  },
  {
    code: "Other medication",
    path: "covid_care_daily_sheet/management/other_regular_medication/medication_item_name",
  },
];
// <sl-checkbox></sl-checkbox>
//   <sl-checkbox></sl-checkbox>
//   <sl-checkbox>Tab Paracetamol</sl-checkbox>
//   <sl-checkbox>Tab Co-Amoxyclav</sl-checkbox>
//   <sl-checkbox>Budesonide Puffs</sl-checkbox>
//   <sl-checkbox>Steam inhalation</sl-checkbox>
//   <sl-checkbox>Deep breathing exercises</sl-checkbox>
//   <sl-checkbox>Other regular medications</sl-checkbox>
