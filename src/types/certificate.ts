export interface CertificateRecord {
  id: string;
  unique_id: string;
  report_number: string;
  certificate_title: string;
  revision_number: string;
  as_name: string | null;
  inspector_name: string;
  inspected_by: string;
  signature: string;
  selected_date: string;
  next_date: string;
  date_of_issue: string;
  sel_date: string;
  nex_date: string;
  applied_standards: string;
  sticker_number: string;
  employer_name_address: string;
  location: string;
  equipment_id: string;
  equipment_description: string;
  equipment_description_pdf: string;
  safe_working_loads: string;
  manufacturer_name: string;
  manufacture_date: string;
  first_examined: string;
  installed_correctly: string;
  months_interval: string;
  six_months_interval: string;
  twelve_months_interval: string;
  exam_scheme: string;
  after_occur: string;
  defect: string;
  defect2: string;
  iminent_danger: string;
  repair_renewal: string;
  any_tests_carried: string;
  observation: string;
  safe_to_operate: string;
  checklist_type: string;
  show_in_certificate: string;
  status: string;
  created_on: string;
  updated_on: string;
}

export interface CertificateApiResponse {
  status: "success" | "error";
  message: string;
  data: CertificateRecord | null;
}