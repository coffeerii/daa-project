export type Medicine = {
  medicine_id: number;
  medicine_name: string;
  normalized_name: string;
};

export type Pharmacy = {
  pharmacy_id: number;
  pharmacy_name: string;
  address: string;
  contact: string | null;
  latitude: number;
  longitude: number;
};

export type InventoryRecord = {
  inventory_id: number;
  medicine_id: number;
  pharmacy_id: number;
  availability_status: string;
};

export type PharmacyResult = Pharmacy & {
  availability_status: string;
  distanceKm: number;
};

export type WorkflowStep = {
  title: string;
  value: string;
};