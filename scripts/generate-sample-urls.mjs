#!/usr/bin/env node
/**
 * Planum – Sample URL Generator
 *
 * Generiert eindeutige UUIDs und URLs für die NFC/QR-Sticker-Bestellung
 * bei Getsmart Technology (Velia Gao).
 *
 * Output:
 *   1. supplier-csv: Spalte URL (Format wie von Velia gefordert, sortiert nach Größe)
 *   2. master-csv:   Interne Referenz (Size, Position, UUID, URL, BatchID, Timestamp)
 *
 * Verwendung:
 *   node scripts/generate-sample-urls.mjs                  # 15 Sample-URLs (Default)
 *   node scripts/generate-sample-urls.mjs --pilot          # 1.300 Pilot-URLs
 *   node scripts/generate-sample-urls.mjs --custom 25:100,30:100,40:50
 *
 * WICHTIG: Vor dem Versenden an Velia die Output-CSVs ins Repo committen
 * UND ein Backup im Passwort-Manager / verschlüsselten Speicher ablegen.
 * Die UUIDs sind essenziell – verloren = Sticker werden zu nutzlosen Plastikscheiben.
 */

import { randomUUID } from 'node:crypto';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, 'output');

const BASE_URL = 'https://app.planum.de/plant';

// Default: Sample-Bestellung
const PRESETS = {
  sample: { '25mm': 5,   '30mm': 5,   '40mm': 5   },   // 15 total
  pilot:  { '25mm': 500, '30mm': 500, '40mm': 300 },   // 1.300 total
};

function parseArgs(argv) {
  if (argv.includes('--pilot')) return PRESETS.pilot;
  const customIdx = argv.indexOf('--custom');
  if (customIdx !== -1 && argv[customIdx + 1]) {
    const spec = argv[customIdx + 1];
    const result = {};
    for (const part of spec.split(',')) {
      const [size, count] = part.split(':');
      result[`${size}mm`] = parseInt(count, 10);
    }
    return result;
  }
  return PRESETS.sample;
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
}

function generateBatch(distribution) {
  const batchId = `planum-${timestamp()}`;
  const records = [];
  for (const [size, count] of Object.entries(distribution)) {
    for (let i = 1; i <= count; i++) {
      const uuid = randomUUID();
      records.push({
        batchId,
        size,
        position: i,
        uuid,
        url: `${BASE_URL}/${uuid}`,
        generatedAt: new Date().toISOString(),
      });
    }
  }
  return { batchId, records };
}

function toCsv(rows, headers) {
  const escape = (val) => {
    const s = String(val);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const head = headers.join(',');
  const body = rows.map((r) => headers.map((h) => escape(r[h])).join(',')).join('\n');
  return `${head}\n${body}\n`;
}

function main() {
  const distribution = parseArgs(process.argv.slice(2));
  const total = Object.values(distribution).reduce((a, b) => a + b, 0);

  console.log(`Generating ${total} URL(s):`);
  for (const [size, count] of Object.entries(distribution)) {
    console.log(`  ${size}: ${count}`);
  }

  const { batchId, records } = generateBatch(distribution);

  mkdirSync(OUT_DIR, { recursive: true });

  // 1. Supplier CSV: nur URL-Spalte, sortiert nach Größe (25 → 30 → 40)
  const supplierRows = records.map((r) => ({ url: r.url }));
  const supplierFile = join(OUT_DIR, `${batchId}-supplier.csv`);
  writeFileSync(supplierFile, toCsv(supplierRows, ['url']));

  // 2. Master CSV: alle Felder für interne Referenz / spätere Supabase-Importe
  const masterFile = join(OUT_DIR, `${batchId}-master.csv`);
  writeFileSync(
    masterFile,
    toCsv(records, ['batchId', 'size', 'position', 'uuid', 'url', 'generatedAt']),
  );

  console.log(`\n✅ ${records.length} URLs erzeugt`);
  console.log(`   Lieferanten-CSV: ${supplierFile}`);
  console.log(`   Master-CSV:      ${masterFile}`);
  console.log(`\n⚠️  Master-CSV sicher aufbewahren – ohne UUIDs ist die Hardware tot.`);
}

main();
