import { getSupabaseClient } from "../lib/supabaseClient";
import type { InventoryRecord, Medicine, Pharmacy } from "../types/models";

const fallbackMedicines: Medicine[] = [
  {
    medicine_id: 1,
    medicine_name: "Paracetamol",
    normalized_name: "paracetamol",
  },
  {
    medicine_id: 2,
    medicine_name: "Metoprolol",
    normalized_name: "metoprolol",
  },
  {
    medicine_id: 3,
    medicine_name: "Metformin",
    normalized_name: "metformin",
  },
  {
    medicine_id: 4,
    medicine_name: "Ibuprofen",
    normalized_name: "ibuprofen",
  },
  {
    medicine_id: 5,
    medicine_name: "Amoxicillin",
    normalized_name: "amoxicillin",
  },
];

const fallbackPharmacies: Pharmacy[] = [
  {
    pharmacy_id: 101,
    pharmacy_name: "Mercury Drug - Manila",
    address: "Manila City",
    contact: "09123456789",
    latitude: 14.5995,
    longitude: 120.9842,
  },
  {
    pharmacy_id: 102,
    pharmacy_name: "Watsons - Manila",
    address: "Manila City",
    contact: "09987654321",
    latitude: 14.6042,
    longitude: 120.9822,
  },
  {
    pharmacy_id: 103,
    pharmacy_name: "Southstar Drug - Manila",
    address: "Manila City",
    contact: "09111111111",
    latitude: 14.5908,
    longitude: 120.9847,
  },
];

const fallbackInventory: InventoryRecord[] = [
  {
    inventory_id: 1,
    medicine_id: 1,
    pharmacy_id: 101,
    availability_status: "Listed",
  },
  {
    inventory_id: 2,
    medicine_id: 1,
    pharmacy_id: 102,
    availability_status: "Listed",
  },
  {
    inventory_id: 3,
    medicine_id: 1,
    pharmacy_id: 103,
    availability_status: "Listed",
  },
  {
    inventory_id: 4,
    medicine_id: 2,
    pharmacy_id: 102,
    availability_status: "Listed",
  },
  {
    inventory_id: 5,
    medicine_id: 3,
    pharmacy_id: 103,
    availability_status: "Listed",
  },
  {
    inventory_id: 6,
    medicine_id: 4,
    pharmacy_id: 101,
    availability_status: "Listed",
  },
  {
    inventory_id: 7,
    medicine_id: 5,
    pharmacy_id: 102,
    availability_status: "Listed",
  },
];

export async function fetchMedicines(): Promise<Medicine[]> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    console.warn("Using fallback medicines.");
    return fallbackMedicines;
  }

  try {
    const { data, error } = await supabase
      .from("medicines")
      .select("*")
      .order("medicine_name", { ascending: true });

    if (error) {
      console.error("Failed to fetch medicines:", error.message);
      return fallbackMedicines;
    }

    return data && data.length > 0 ? data : fallbackMedicines;
  } catch (error) {
    console.error("Medicine fetch crashed:", error);
    return fallbackMedicines;
  }
}

export async function fetchPharmacies(): Promise<Pharmacy[]> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    console.warn("Using fallback pharmacies.");
    return fallbackPharmacies;
  }

  try {
    const { data, error } = await supabase
      .from("pharmacies")
      .select("*")
      .order("pharmacy_name", { ascending: true });

    if (error) {
      console.error("Failed to fetch pharmacies:", error.message);
      return fallbackPharmacies;
    }

    return data && data.length > 0 ? data : fallbackPharmacies;
  } catch (error) {
    console.error("Pharmacy fetch crashed:", error);
    return fallbackPharmacies;
  }
}

export async function fetchInventory(): Promise<InventoryRecord[]> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    console.warn("Using fallback inventory.");
    return fallbackInventory;
  }

  try {
    const { data, error } = await supabase.from("inventory").select("*");

    if (error) {
      console.error("Failed to fetch inventory:", error.message);
      return fallbackInventory;
    }

    return data && data.length > 0 ? data : fallbackInventory;
  } catch (error) {
    console.error("Inventory fetch crashed:", error);
    return fallbackInventory;
  }
}