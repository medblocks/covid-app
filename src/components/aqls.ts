import { openehr } from "../utils/openehr";

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
  const { columns, rows } = r.data;
  const data = rows.map((row) => {
    return Object.fromEntries(
      row.map((item, i) => {
        return [columns[i].name, item];
      })
    );
  });
  let results = {};
  console.log(data);
  data.forEach((result) => {
    if (!results[result.id]) {
      const r = result.result;
      results[result.id] = r.value;
    }
  });
  return results;
};
