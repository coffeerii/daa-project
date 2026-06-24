import type { InventoryRecord, Medicine, Pharmacy } from "../types/models";

export function buildMedicineNameToIdMap(medicines: Medicine[]) {
  const map = new Map<string, number>();

  for (const medicine of medicines) {
    map.set(medicine.normalized_name, medicine.medicine_id);
  }

  return map;
}

export function buildMedicineIdToNameMap(medicines: Medicine[]) {
  const map = new Map<number, Medicine>();

  for (const medicine of medicines) {
    map.set(medicine.medicine_id, medicine);
  }

  return map;
}

export function buildMedicineToPharmaciesMap(inventory: InventoryRecord[]) {
  const map = new Map<number, InventoryRecord[]>();

  for (const record of inventory) {
    const existingRecords = map.get(record.medicine_id) ?? [];
    existingRecords.push(record);
    map.set(record.medicine_id, existingRecords);
  }

  return map;
}

export function buildPharmacyDetailsMap(pharmacies: Pharmacy[]) {
  const map = new Map<number, Pharmacy>();

  for (const pharmacy of pharmacies) {
    map.set(pharmacy.pharmacy_id, pharmacy);
  }

  return map;
}