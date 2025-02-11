export type Todos = {
  id: string;
  title: string;
  date: string;
  status: string;
  category: string;
};

export type TaskStatus = "to-do" | "in-progress" | "completed";

export type TodoTableData = {
  id: TaskStatus;
  title: string;
  bgColor: string;
  data: Todos[];
};

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      movies: {
        Row: {
          id: number;
          name: string;
          data: Json | null;
        };
        Insert: {
          id?: never;
          name: string;
          data?: Json | null;
        };
        Update: {
          id?: never;
          name?: string;
          data?: Json | null;
        };
      };
    };
  };
}
