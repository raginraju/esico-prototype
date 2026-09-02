export interface CertificateData {
  reportNo: string;
  docType: "certificate" | "idCard";
  examDate: string;
  issueDate: string;
  employer: string;
  location: string;
  sticker: string;
  standards: string;
  equipmentId: string;
  equipmentDesc: {
    title: string;
    model: string;
    operatingMass: string;
    staticLinerLoad: string;
    compactionWidth: string;
  };
  safeWorkingLoad: string;
  manufactureDate: string;
  manufacturer: string;
  status: "Safe to operate" | "Needs Attention";
  nextInspectionDate: string;
  inspectorName: string;
}

export const MOCK_CERTIFICATES: Record<string, CertificateData> = {
  "ESICO-LFT-R26-8491": {
    reportNo: "ESICO-LFT-R26-8491",
    docType: "certificate",
    examDate: "21-04-2026",
    issueDate: "21-04-2026",
    employer: "PRIVATE",
    location: "JUBAIL",
    sticker: "10143",
    standards: "SASO ISO 20474- 1:2017",
    equipmentId: "1019-ZAA OR\n10000153C0E002781",
    equipmentDesc: {
      title: "ROLLER COMPACTOR",
      model: "CA250D",
      operatingMass: "10450 kg",
      staticLinerLoad: "38 kg/cm",
      compactionWidth: "2130mm",
    },
    safeWorkingLoad: "Static Liner Load:\n38 kg/cm",
    manufactureDate: "2015",
    manufacturer: "DYNAPAC",
    status: "Safe to operate",
    nextInspectionDate: "20-04-2027",
    inspectorName: "BUVANESH VIJAYARAYAN",
  },
  "ESICO-LFT-R26-1022": {
    reportNo: "ESICO-LFT-R26-1022",
    docType: "certificate",
    examDate: "15-03-2026",
    issueDate: "15-03-2026",
    employer: "ARAMCO CONTRACTOR",
    location: "RAS TANURA",
    sticker: "09812",
    standards: "ASME B30.5",
    equipmentId: "CRANE-0491",
    equipmentDesc: {
      title: "MOBILE CRANE",
      model: "TEREX RT555",
      operatingMass: "34000 kg",
      staticLinerLoad: "N/A",
      compactionWidth: "N/A",
    },
    safeWorkingLoad: "55 Metric Tons",
    manufactureDate: "2018",
    manufacturer: "TEREX",
    status: "Safe to operate",
    nextInspectionDate: "14-03-2027",
    inspectorName: "BUVANESH VIJAYARAYAN",
  },
};