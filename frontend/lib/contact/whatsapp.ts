// Tautan wa.me ke nomor yang tersimpan di profil. Profil menyimpan nomor apa
// adanya ("+62 812 3456 7890", "0812-3456-7890"), sedangkan wa.me butuh angka
// saja dengan kode negara di depan.

/** "0812 3456 7890" → "6281234567890". Null kalau bukan nomor Indonesia yang masuk akal. */
export function waNumber(phone: string | null | undefined): string | null {
    if (!phone) return null
    const digits = phone.replace(/\D/g, '')
    const international = digits.startsWith('62') ? digits : digits.startsWith('0') ? `62${digits.slice(1)}` : null
    return international && /^62\d{8,12}$/.test(international) ? international : null
}

/** Tautan chat WhatsApp dengan pesan pembuka yang sudah terisi. */
export function whatsappHref(phone: string | null | undefined, message: string): string | null {
    const number = waNumber(phone)
    return number ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : null
}
