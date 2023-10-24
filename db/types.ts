import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface _CfKV {
  key: string;
  value: Buffer | null;
}

export interface Cut {
  id: Generated<number>;
  label: string;
  start: string;
  video_id: number;
}

export interface D1Migrations {
  applied_at: Generated<string>;
  id: Generated<number | null>;
  name: string | null;
}

export interface User {
  id: string;
  username: string;
}

export interface UserKey {
  hashed_password: string | null;
  id: string;
  user_id: string;
}

export interface UserSession {
  active_expires: string;
  id: string;
  idle_expires: string;
  user_id: string;
}

export interface Video {
  createdAt: Generated<string | null>;
  day: number;
  hash: string;
  id: Generated<number>;
  month: number;
  show: string;
  title: string;
  updatedAt: string | null;
}

export interface DB {
  _cf_KV: _CfKV;
  cut: Cut;
  d1_migrations: D1Migrations;
  user: User;
  user_key: UserKey;
  user_session: UserSession;
  video: Video;
}
