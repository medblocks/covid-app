import { openehr } from "../services";

export const formatAql = (aqlResultData): Map<string, any>[] => {
  const { columns, rows } = aqlResultData;
  const data = rows.map((row) => {
    return new Map(
      row.map((item, i) => {
        return [columns[i].name, item];
      })
    );
  });
  return data;
};
export const getCovidResults = async (ehrIds: string[]) => {
  const query = `SELECT 
    c/content[openEHR-EHR-OBSERVATION.laboratory_test_result.v1]/data[at0001]/events[at0002]/data[at0003]/items[openEHR-EHR-CLUSTER.laboratory_test_analyte.v1]/items[at0001]/value as result,
    c/content[openEHR-EHR-OBSERVATION.laboratory_test_result.v1]/data[at0001]/events[at0002]/time as time, 
    e/ehr_id/value as id FROM EHR e 
    CONTAINS COMPOSITION c [openEHR-EHR-COMPOSITION.report-result.v1] 
    where c/archetype_details/template_id/value='MCS.CovidResult.v0' 
    AND e/ehr_id/value MATCHES {${ehrIds.map((id) => `'${id}'`).join(",")}} 
    ORDER BY time DESC`;
  const r = await openehr.post(`/openehr/v1/query/aql`, { q: query });
  return formatAql(r.data);
};

export const allCompositions = async (ehrId) => {
  const query = `
    SELECT 
    c/context/start_time/value as time, 
    c/uid/value as uid, 
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Vitals']/items[openEHR-EHR-OBSERVATION.body_temperature.v2]/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value as Temperature, 
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Vitals']/items[openEHR-EHR-OBSERVATION.pulse.v2]/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value as Pulse,
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Vitals']/items[openEHR-EHR-OBSERVATION.blood_pressure.v2]/data[at0001]/events[at0006]/data[at0003]/items[at0004]/value as Systolic_BP, 
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Vitals']/items[openEHR-EHR-OBSERVATION.blood_pressure.v2]/data[at0001]/events[at0006]/data[at0003]/items[at0005]/value as Diastolic_BP, 
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Vitals']/items[openEHR-EHR-OBSERVATION.pulse_oximetry.v1]/data[at0001]/events[at0002]/data[at0003]/items[at0006]/value as spO2, 
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Vitals']/items[openEHR-EHR-OBSERVATION.news_uk_rcp.v1]/data[at0001]/events[at0002]/data[at0003]/items[at0028]/value as EWS, 
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Vitals']/items[openEHR-EHR-EVALUATION.health_risk.v1,'Other risk factors']/data[at0001]/items[at0016,'Labored Breathing']/items[at0017]/value as Labored_Breathing,
    c/content[openEHR-EHR-OBSERVATION.laboratory_test_result.v1,'Lab Results']/data[at0001]/events[at0002]/data[at0003]/items[openEHR-EHR-CLUSTER.laboratory_test_analyte.v1,'Fasting Glucose']/items[at0001]/value as Glucose_Fasting, 
    c/content[openEHR-EHR-OBSERVATION.laboratory_test_result.v1,'Lab Results']/data[at0001]/events[at0002]/data[at0003]/items[openEHR-EHR-CLUSTER.laboratory_test_analyte.v1,'Postprandial Blood Sugar']/items[at0001]/value as Glucose_Postprandial, 
    c/content[openEHR-EHR-OBSERVATION.laboratory_test_result.v1,'Lab Results']/data[at0001]/events[at0002]/data[at0003]/items[openEHR-EHR-CLUSTER.laboratory_test_analyte.v1,'CRP']/items[at0001]/value as CRP, 
    c/content[openEHR-EHR-OBSERVATION.laboratory_test_result.v1,'Lab Results']/data[at0001]/events[at0002]/data[at0003]/items[openEHR-EHR-CLUSTER.laboratory_test_analyte.v1,'Total WBC']/items[at0001]/value as WBC, 
    c/content[openEHR-EHR-OBSERVATION.laboratory_test_result.v1,'Lab Results']/data[at0001]/events[at0002]/data[at0003]/items[openEHR-EHR-CLUSTER.laboratory_test_analyte.v1,'D-Dimer']/items[at0001]/value as D_Dimer, 
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Management']/items[openEHR-EHR-ACTION.medication.v1,'Dexamethasone'] as Dexamethasone, 
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Management']/items[openEHR-EHR-ACTION.medication.v1,'Enoxaparin'] as Enoxiparin, 
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Management']/items[openEHR-EHR-ACTION.medication.v1,'Tab Paracetamol'] as Paracetamol, 
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Management']/items[openEHR-EHR-ACTION.medication.v1,'Tab Co-Amoxyclav'] as Coamoxiclav, 
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Management']/items[openEHR-EHR-ACTION.medication.v1,'Budesonide Puffs'] as Budesonide, 
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Management']/items[openEHR-EHR-ACTION.procedure.v1,'Steam Inhalation'] as Steam, 
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Management']/items[openEHR-EHR-ACTION.procedure.v1,'Deep Breathing Exercises'] as Deep_Breathing, 
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Management']/items[openEHR-EHR-ACTION.procedure.v1,'Oxygen Therapy'] as Oxygen_Therapy, 
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Management']/items[openEHR-EHR-OBSERVATION.medication_statement.v0,'Other regular medication'] as Regular_Meds,
    c/composer as Entered_By
    from EHR e CONTAINS COMPOSITION c [openEHR-EHR-COMPOSITION.encounter.v1]  
    where c/archetype_details/template_id/value MATCHES {'MCS.CovidCare.DailySheet.v0.1', 'MCS.CovidCare.DailySheet.v0.2'} 
    AND e/ehr_id/value='${ehrId}'
    LIMIT 15
    ORDER BY time DESC
    `;
  const r = await openehr.post(`/openehr/v1/query/aql`, {
    q: query,
  });
  return formatAql(r.data);
};
