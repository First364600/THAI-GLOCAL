// Types re-exported from dataStore for backward compatibility
export type { Center, Activity, Session, Booking } from "../store/dataStore";

// DEPRECATED - use useDataStore() hook instead.
// These empty arrays are kept only so existing imports don't break at compile time.
export const centers: any[] = [];
export const activities: any[] = [];
export const categories = ["All"];
export const provinces = ["All Provinces"];
