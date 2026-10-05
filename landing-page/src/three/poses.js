// Zielposen fuer die Buehne. Reine Daten ohne three.js-Import, damit die
// Abschnitte sie laden koennen, ohne die 3D-Bibliothek in das Haupt-Bundle zu
// ziehen. Position in mm, Drehung in Grad, s = Skalierung, o = Sichtbarkeit.

export const HERO_POSE = {
  medallion: { p: [-7, 5, 8], r: [-10, -24, -6], s: 1, o: 1 },
  drop: { p: [21, -14, -24], r: [-16, 30, 12], s: 0.9, o: 1 },
}

export const STORY_POSES = [
  // 01 Aufkleben: beide Sticker nebeneinander, leicht gekippt — wie auf dem
  // Weg zum Topf.
  {
    medallion: { p: [-18, 4, 0], r: [-30, 24, -8], s: 0.95, o: 1 },
    drop: { p: [22, -4, -6], r: [-26, -28, 6], s: 0.95, o: 1 },
  },
  // 02 Antippen: das Medaillon dreht sich frontal nach vorn, der Tropfen
  // tritt zurueck.
  {
    medallion: { p: [-4, 0, 34], r: [0, 0, 0], s: 1.05, o: 1 },
    drop: { p: [40, -28, -110], r: [-12, -55, 12], s: 0.7, o: 1 },
  },
  // 03 Giessen loggen: Rollentausch — jetzt kommt der Tropfen nach vorn.
  {
    medallion: { p: [-44, 24, -110], r: [-12, 55, -8], s: 0.7, o: 1 },
    drop: { p: [2, -2, 34], r: [0, 0, 0], s: 1.05, o: 1 },
  },
]

export const MACRO_POSE = {
  medallion: { p: [0, 2, 86], r: [-34, -18, -8], s: 1, o: 1 },
  drop: { p: [0, 0, -200], r: [0, 0, 0], s: 0.5, o: 0 },
}
