// Regenerates lib/wilayah/*.json from the two public sources below. Run: node scripts/build-wilayah.mjs
//
// - Provinsi & kabupaten/kota: cahyadsn/wilayah (MIT), Kepmendagri No 300.2.2-2138 Tahun 2025, with each
//   kabupaten/kota's centre point from the same project's level-1-2 table (kabupaten-kota-koordinat.json).
// - Pelabuhan perikanan: KKP Pusat Informasi Pelabuhan Perikanan (pipp.kkp.go.id), the map data behind
//   its "Profil Pelabuhan" page, with each port's own coordinates. Every type is kept (PPS, PPN, PPP, PPI, PP, CP).
import { writeFile } from 'node:fs/promises'

const WILAYAH_SQL = 'https://raw.githubusercontent.com/cahyadsn/wilayah/master/db/wilayah.sql'
const WILAYAH_COORDS_SQL = 'https://raw.githubusercontent.com/cahyadsn/wilayah/master/db/wilayah_level_1_2.sql'
const PIPP_PAGE = 'https://pipp.kkp.go.id/profil-pelabuhan'
const PIPP_PORTS = 'https://pipp.kkp.go.id/profil-pelabuhan/peta-sebaran-pelabuhan-perikanan'
const OUT_DIR = new URL('../lib/wilayah/', import.meta.url)

// PIPP spellings that normalizing alone can't reconcile with Kemendagri names.
const KAB_KOTA_ALIASES = {
  'kabupaten gunungsitoli': ['Kota Gunungsitoli'],
  'kabupaten batubara': ['Kabupaten Batu Bara'],
  'kabupaten tulangbawang': ['Kabupaten Tulang Bawang'],
  'kabupaten pasawaran': ['Kabupaten Pesawaran'],
  'kabupaten palalawan': ['Kabupaten Pelalawan'],
  'kota lhoksumawe': ['Kota Lhokseumawe'],
  'kabupaten gunung kidul': ['Kabupaten Gunungkidul'],
  'kabupaten lewoleba': ['Kabupaten Lembata'], // Lewoleba is Lembata's capital.
  'kabupaten kepulauan ulu siau': ['Kabupaten Kep. Siau Tagulandang Biaro'],
  'kabupaten kepualauan aru': ['Kabupaten Kepulauan Aru'],
  'kabupaten tambarauw': ['Kabupaten Tambrauw'],
  // CP. Banten Selatan straddles both regencies, so it's listed under each.
  'kabupaten pandeglang dan kabupaten lebak': ['Kabupaten Pandeglang', 'Kabupaten Lebak'],
}

// Source coordinates that are plainly wrong. Wakatobi is listed at 23.54°E (in Africa): a dropped leading "1".
const KAB_KOTA_COORD_FIXES = { '74.07': [-5.3283, 123.5389] }

// A port further than this from its kabupaten/kota's centre is taken to be mis-plotted in PIPP (PP. Eri, in Kota
// Ambon, sits 577 km away) and gets the centre instead. Real outliers, islands of a large regency, stay under it.
const MAX_PORT_OFFSET_KM = 250
const INDONESIA = { minLat: -11.5, maxLat: 6.5, minLng: 94, maxLng: 141.5 }

const inIndonesia = ([lat, lng]) =>
  lat >= INDONESIA.minLat && lat <= INDONESIA.maxLat && lng >= INDONESIA.minLng && lng <= INDONESIA.maxLng

// About 1 m of precision, which is all a map pin needs.
const round = (n) => Math.round(n * 1e5) / 1e5

function distanceKm([lat1, lng1], [lat2, lng2]) {
  const rad = (deg) => (deg * Math.PI) / 180
  const h = Math.sin(rad(lat2 - lat1) / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(rad(lng2 - lng1) / 2) ** 2
  return 2 * 6371 * Math.asin(Math.sqrt(h))
}

const normalize = (name) =>
  name
    .toLowerCase()
    // "Kab. X", "Kab.X", "Kab X" → "kabupaten x" (without touching "kabupaten" itself).
    .replace(/\bkab(\.\s*|\s+)/g, 'kabupaten ')
    .replace(/\bkep\.\s*/g, 'kepulauan ')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

// Sort "Kabupaten Aceh Besar" and "Kota Banda Aceh" by the place name, not the prefix.
const placeName = (name) => name.replace(/^(Kabupaten|Kota)\s+/, '')
const byPlaceName = (a, b) => placeName(a.nama).localeCompare(placeName(b.nama), 'id')

async function fetchWilayah() {
  const sql = await (await fetch(WILAYAH_SQL)).text()
  const rows = [...sql.matchAll(/\('(\d{2}(?:\.\d{2})?)','((?:[^'\\]|\\.)*)'\)/g)].map(([, kode, nama]) => ({
    kode,
    nama: nama.replace(/\\'/g, "'"),
  }))
  return {
    provinsi: rows.filter((r) => r.kode.length === 2),
    kabKota: rows.filter((r) => r.kode.length === 5),
  }
}

// kode → [lat, lng] for every kabupaten/kota. The table also carries boundary polygons, hence the separate download.
async function fetchKabKotaCoords() {
  const sql = await (await fetch(WILAYAH_COORDS_SQL)).text()
  const coords = Object.fromEntries(
    [...sql.matchAll(/\('(\d{2}\.\d{2})','(?:[^'\\]|\\.)*','(?:[^'\\]|\\.)*',\s*(-?[\d.]+),\s*(-?[\d.]+)/g)].map(([, kode, lat, lng]) => [
      kode,
      [round(Number(lat)), round(Number(lng))],
    ])
  )
  return { ...coords, ...KAB_KOTA_COORD_FIXES }
}

async function fetchPorts() {
  // The JSON endpoint only answers requests that carry the page's session cookie and CSRF token.
  const page = await fetch(PIPP_PAGE)
  const cookie = page.headers.getSetCookie().map((c) => c.split(';')[0]).join('; ')
  const token = (await page.text()).match(/name="csrf-token" content="([^"]+)"/)[1]
  const res = await fetch(PIPP_PORTS, {
    headers: { cookie, 'x-csrf-token': token, 'x-requested-with': 'XMLHttpRequest' },
  })
  return (await res.json()).peta_sebaran_pelabuhan_perikanan
}

function matchKabKota(port, kabKotaByName) {
  const key = normalize(port.kab_kota)
  const names = KAB_KOTA_ALIASES[key]
  if (names) return names.map((n) => kabKotaByName.get(normalize(n))).map((list) => pickByProvince(list, port))

  // Some rows drop the "Kab." prefix entirely ("Kebumen", "Merauke").
  const list =
    kabKotaByName.get(key) ?? kabKotaByName.get(`kabupaten ${key}`) ?? kabKotaByName.get(`kota ${key}`)
  return list ? [pickByProvince(list, port)] : []
}

// kode_pelabuhan is WPP.provinsi.urutan; use its province code to break ties between same-named regencies.
function pickByProvince(list, port) {
  const provinsi = port.kode_pelabuhan.split('.')[1]
  return list.find((k) => k.kode.startsWith(`${provinsi}.`)) ?? list[0]
}

// PIPP reuses some kode_pelabuhan for different ports (e.g. PP. Panarukan and PP. Pondok Mimbo are both
// 712.35.31), and its id_pelabuhan is re-encrypted on every request. So each port gets a stable id of our own:
// the code when it's unique, otherwise the code plus a slug of the name ("712.35.31-panarukan").
const slug = (name) =>
  name
    .replace(/^[A-Z]+\.\s*/, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

function assignIds(ports) {
  const perKode = new Map()
  for (const p of ports) perKode.set(p.kode, (perKode.get(p.kode) ?? 0) + 1)
  const withIds = ports.map((p) => ({ id: perKode.get(p.kode) > 1 ? `${p.kode}-${slug(p.nama)}` : p.kode, ...p }))

  const seen = new Set()
  for (const { id } of withIds) {
    if (seen.has(id)) throw new Error(`Duplicate pelabuhan id ${id}; extend slug() to tell these ports apart.`)
    seen.add(id)
  }
  return withIds
}

const { provinsi, kabKota } = await fetchWilayah()
const [ports, kabKotaCoords] = await Promise.all([fetchPorts(), fetchKabKotaCoords()])

const kabKotaByName = new Map()
for (const k of kabKota) {
  const key = normalize(k.nama)
  kabKotaByName.set(key, [...(kabKotaByName.get(key) ?? []), k])
}

const unmatched = []
const movedProvince = []
const replotted = []

// The port's own coordinates, or its kabupaten/kota's centre when PIPP's are missing or implausible.
function portCoords(port, kabKotaKode) {
  const own = [Number(port.lintang), Number(port.bujur)]
  const centre = kabKotaCoords[kabKotaKode]
  if (port.lintang && port.bujur && inIndonesia(own) && (!centre || distanceKm(own, centre) <= MAX_PORT_OFFSET_KM)) {
    return own.map(round)
  }
  replotted.push(`${port.nama_pelabuhan.trim()} (${port.lintang}, ${port.bujur})`)
  return centre ?? null
}
const matchedPorts = ports
  .map((port) => {
    const matches = matchKabKota(port, kabKotaByName)
    if (matches.length === 0) unmatched.push(`${port.nama_pelabuhan} (${port.provinsi} / ${port.kab_kota})`)
    for (const k of matches) {
      if (!port.kode_pelabuhan.split('.')[1] || k.kode.startsWith(`${port.kode_pelabuhan.split('.')[1]}.`)) continue
      movedProvince.push(`${port.nama_pelabuhan}: ${port.provinsi} → ${k.nama} (${k.kode})`)
    }
    const coords = matches.length > 0 ? portCoords(port, matches[0].kode) : null
    return {
      kode: port.kode_pelabuhan,
      nama: port.nama_pelabuhan.trim(),
      jenis: port.jenis_pelabuhan,
      kabKota: matches.map((k) => k.kode),
      lat: coords?.[0] ?? null,
      lng: coords?.[1] ?? null,
    }
  })
  .filter((p) => p.kabKota.length > 0)
  .sort((a, b) => a.nama.localeCompare(b.nama, 'id'))
const pelabuhan = assignIds(matchedPorts)

provinsi.sort((a, b) => a.nama.localeCompare(b.nama, 'id'))
kabKota.sort(byPlaceName)

const write = (file, data) => writeFile(new URL(file, OUT_DIR), `${JSON.stringify(data)}\n`)
await write('provinsi.json', provinsi)
await write('kabupaten-kota.json', kabKota)
await write('pelabuhan.json', pelabuhan)
// Only the kabupaten/kota the app knows, keyed by kode.
const missingCoords = kabKota.filter((k) => !kabKotaCoords[k.kode]).map((k) => `${k.nama} (${k.kode})`)
await write('kabupaten-kota-koordinat.json', Object.fromEntries(kabKota.filter((k) => kabKotaCoords[k.kode]).map((k) => [k.kode, kabKotaCoords[k.kode]])))

console.log(`provinsi ${provinsi.length}, kabupaten/kota ${kabKota.length}, pelabuhan ${pelabuhan.length}/${ports.length}`)
if (movedProvince.length) console.log(`\nFiled under a newer province than PIPP lists:\n  ${movedProvince.join('\n  ')}`)
if (replotted.length) console.log(`\nPlaced at their kabupaten/kota's centre (PIPP coordinates missing or implausible):\n  ${replotted.join('\n  ')}`)
if (missingCoords.length) console.log(`\nNo centre point (distances from these fall back to none):\n  ${missingCoords.join('\n  ')}`)
if (unmatched.length) {
  console.error(`\nUnmatched (dropped), add to KAB_KOTA_ALIASES:\n  ${unmatched.join('\n  ')}`)
  process.exitCode = 1
}
