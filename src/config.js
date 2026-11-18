export const CONFIG = {
    // Jumlah take yang bisa dipilih
    takeOptions: [2, 3, 4, 6],
    defaultTakes: 4,

    countdownSeconds: 3,
    pauseBetweenTakes: 900, // ms jeda setelah flash

    mirror: true,
    photoAspect: 3 / 4, // lebar / tinggi tiap foto

    // Layout strip (px, resolusi export)
    stripWidth: 720,
    stripPadding: 40,
    stripGap: 28,
    footerHeight: 130,
    footerText: 'MERRY CHRISTMAS 2026', // '' untuk tanpa footer
    paper: '#f4f1ea',
    ink: '#2a2520',

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