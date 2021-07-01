function getAge(dateString) {
  if (!dateString) {
    return;
  }
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

interface PatientProxy {
  name: string;
  age: number;
  gender: string;
  genderShort: string;
  shortUid: string;
}
const hashToNumber = (id: string) => {
  const chars = [...id].map((a) => a.charCodeAt(0) - 65);
  const positiveChars = chars.map((a) => (a < 0 ? a * -1 : a));
  return positiveChars.join("").padStart(6, "0");
};
export const patientProxy = (patient: any): PatientProxy | undefined => {
  if (!patient) {
    return;
  }
  return {
    name: patient?.name?.[0].given,
    age: getAge(patient?.birthDate),
    gender: patient?.gender,
    genderShort: patient?.gender?.[0]?.toUpperCase(),
    shortUid: hashToNumber(patient?.id.slice(-4, -1)),
  };
};
