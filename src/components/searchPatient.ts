import type {
  SearchFunction,
  SearchResult,
} from "medblocks-ui/dist/src/medblocks/codedtext/searchFunctions";

const searchFn: SearchFunction = async (options) => {
  const { searchString, axios } = options;
  const r = await axios.get(`/Patient`, { params: { name: searchString } });
  const entries = r.data?.entry || [];
  return entries.map(
    (e): SearchResult => ({
      label: e?.resource?.name?.[0]?.given,
      value: e?.resource?.id,
    })
  );
};
export const SearchAllPatients = {
  search: searchFn,
  getConstraints: () => {},
};
