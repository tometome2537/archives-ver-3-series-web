// import { PostgrestResponse, SupabaseClient } from "@supabase/supabase-js";

// async function count(
//   this: SupabaseClient,
//   tableName: string,
// ): Promise<number | null> {
//   try {
//     const { data, error, count }: PostgrestResponse<any> = await this.from(
//       tableName,
//     ).select("*", { count: "exact", head: true });

//     if (error) {
//       throw error;
//     }

//     return count;
//   } catch (error) {
//     console.error("Error occurred while counting rows:", error);
//     throw error;
//   }
// }

// declare module "@supabase/supabase-js" {
//   interface SupabaseClient {
//     count: (tableName: string) => Promise<number | null>;
//   }
// }

// SupabaseClient.prototype.count = count;
