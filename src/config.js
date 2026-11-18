export const CONFIG = {
    // Jumlah take yang bisa dipilih
    takeOptions: [2, 3, 4, 6],
    defaultTakes: 4,

    countdownSeconds: 3,
    pauseBetweenTakes: 900, // ms jeda setelah flash

    mirror: true,
    photoAspect: 3 / 4, // lebar / tinggi tiap foto

    // Resolusi export strip (px). Layout dan warna ada di templates.js
    stripWidth: 720,

    // Isi awal kolom judul. Kosongkan '' kalau mau mulai tanpa teks
    defaultTitle: 'MERRY CHRISTMAS 2026',

    // Filter. Untuk B&W murni: shadow [0,0,0], highlight [255,255,255]
    filter: {
        contrast: 1.25,
        brightness: 0.02,
        grain: 16,
        shadow: [22, 16, 12],
        highlight: [232, 220, 196],
    },

    // Taruh file di public/audio/. Kosongkan '' untuk mematikan musik
    music: '/audio/last-christmas.mp3',
}