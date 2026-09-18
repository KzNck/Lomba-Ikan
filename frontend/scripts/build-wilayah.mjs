// Regenerates lib/wilayah/*.json from the two public sources below. Run: node scripts/build-wilayah.mjs
//
// - Provinsi & kabupaten/kota: cahyadsn/wilayah (MIT), Kepmendagri No 300.2.2-2138 Tahun 2025.
// - Pelabuhan perikanan: KKP Pusat Informasi Pelabuhan Perikanan (pipp.kkp.go.id), the map data behind
//   its "Profil Pelabuhan" page. Every type is kept (PPS, PPN, PPP, PPI, PP, CP).
import { writeFile } from 'node:fs/promises'

const WILAYAH_SQL = 'https://raw.githubusercontent.com/cahyadsn/wilayah/master/db/wilayah.sql'
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

const { provinsi, kabKota } = await fetchWilayah()
const ports = await fetchPorts()

const kabKotaByName = new Map()
for (const k of kabKota) {
  const key = normalize(k.nama)
  kabKotaByName.set(key, [...(kabKotaByName.get(key) ?? []), k])
}

const unmatched = []
const movedProvince = []
const pelabuhan = ports
  .map((port) => {
    const matches = matchKabKota(port, kabKotaByName)
    if (matches.length === 0) unmatched.push(`${port.nama_pelabuhan} (${port.provinsi} / ${port.kab_kota})`)
    for (const k of matches) {
      if (!port.kode_pelabuhan.split('.')[1] || k.kode.startsWith(`${port.kode_pelabuhan.split('.')[1]}.`)) continue
      movedProvince.push(`${port.nama_pelabuhan}: ${port.provinsi} → ${k.nama} (${k.kode})`)
    }
    return {
      kode: port.kode_pelabuhan,
      nama: port.nama_pelabuhan.trim(),
      jenis: port.jenis_pelabuhan,
      kabKota: matches.map((k) => k.kode),
    }
  })
  .filter((p) => p.kabKota.length > 0)
  .sort((a, b) => a.nama.localeCompare(b.nama, 'id'))

provinsi.sort((a, b) => a.nama.localeCompare(b.nama, 'id'))
kabKota.sort(byPlaceName)

const write = (file, data) => writeFile(new URL(file, OUT_DIR), `${JSON.stringify(data)}\n`)
await write('provinsi.json', provinsi)
await write('kabupaten-kota.json', kabKota)
await write('pelabuhan.json', pelabuhan)

console.log(`provinsi ${provinsi.length}, kabupaten/kota ${kabKota.length}, pelabuhan ${pelabuhan.length}/${ports.length}`)
if (movedProvince.length) console.log(`\nFiled under a newer province than PIPP lists:\n  ${movedProvince.join('\n  ')}`)
if (unmatched.length) {
  console.error(`\nUnmatched (dropped), add to KAB_KOTA_ALIASES:\n  ${unmatched.join('\n  ')}`)
  process.exitCode = 1
}
