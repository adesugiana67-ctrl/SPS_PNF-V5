import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const akreditasi = pgTable("akreditasi", {
  id: serial("id").primaryKey(),
  npsn: varchar("npsn", { length: 32 }).notNull(),
  namaSekolah: text("nama_sekolah").notNull(),
  alamatSekolah: text("alamat_sekolah").notNull(),
  kepalaSekolah: text("kepala_sekolah").notNull(),
  akreditasi: varchar("akreditasi", { length: 8 }).notNull(), // A, B, C, TT, Belum
  tahunAkreditasi: integer("tahun_akreditasi").notNull(),
  berakhirTahun: integer("berakhir_tahun").notNull(),
  nomorSk: text("nomor_sk").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const pesertaDidik = pgTable("peserta_didik", {
  id: serial("id").primaryKey(),
  npsn: varchar("npsn", { length: 32 }).notNull(),
  namaSekolah: text("nama_sekolah").notNull(),
  alamatSekolah: text("alamat_sekolah").notNull(),
  wilKecamatan: text("wil_kecamatan").notNull(),
  zonasiKelDesa: text("zonasi_kel_desa").notNull(),
  lakiLaki: integer("laki_laki").notNull().default(0),
  perempuan: integer("perempuan").notNull().default(0),
  verval: varchar("verval", { length: 16 }).notNull(), // Sudah / Belum
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const eRapor = pgTable("e_rapor", {
  id: serial("id").primaryKey(),
  npsn: varchar("npsn", { length: 32 }).notNull(),
  namaLembaga: text("nama_lembaga").notNull(),
  skl: integer("skl").notNull().default(0),
  sIsi: integer("s_isi").notNull().default(0),
  sProses: integer("s_proses").notNull().default(0),
  sPenilaian: integer("s_penilaian").notNull().default(0),
  sPtk: integer("s_ptk").notNull().default(0),
  sSapras: integer("s_sapras").notNull().default(0),
  sPengelolaan: integer("s_pengelolaan").notNull().default(0),
  sPembiayaan: integer("s_pembiayaan").notNull().default(0),
  keterisian: varchar("keterisian", { length: 32 }).notNull(), // LENGKAP / BELUM LENGKAP
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Akreditasi = typeof akreditasi.$inferSelect;
export type NewAkreditasi = typeof akreditasi.$inferInsert;
export type PesertaDidik = typeof pesertaDidik.$inferSelect;
export type NewPesertaDidik = typeof pesertaDidik.$inferInsert;
export type ERapor = typeof eRapor.$inferSelect;
export type NewERapor = typeof eRapor.$inferInsert;
