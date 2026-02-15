// ── World Wheel ──
// Determines the character's home world / realm.
// Each world opens different story branches, ranks, and alliances.
// Season 1: Cyber Mythic

import { Rarity } from '../../types';
import type { WheelModule } from '../../types';

export const worldWheel: WheelModule = {
  id: 'wheel-world',
  name: 'Welt',
  category: 'world',
  icon: '🌍',
  visualTheme: 'world-cosmic',
  description: 'In welcher Welt wurdest du geboren? Dies bestimmt deinen Weg.',
  order: 1,
  segments: [
    {
      id: 'world-iron-kingdom',
      label: 'Eisernes Königreich',
      rarity: Rarity.Common,
      weight: 35,
      tags: ['heavy', 'melee', 'charisma'],
      effects: [
        { type: 'passive', description: 'Rang-System: Starte als Rekrut. Steige auf durch Taten.' },
        { type: 'stat_boost', target: 'defense', value: 8, description: '+8 DEF. Rüstungskultur.' },
      ],
      lore: 'Ein Königreich aus Stahl und Ehre. Hier werden Krieger zu Rittern, Ritter zu Königen.',
    },
    {
      id: 'world-neon-nexus',
      label: 'Neon Nexus',
      rarity: Rarity.Common,
      weight: 35,
      tags: ['cyber', 'tech', 'stealth'],
      effects: [
        { type: 'passive', description: 'Untergrund: Zugang zu Schwarzmarkt und Hacker-Netzwerk.' },
        { type: 'stat_boost', target: 'agility', value: 8, description: '+8 AGI. Stadtgeist.' },
      ],
      lore: 'Eine Stadt, die niemals schläft. Neon, Chrom und Korruption — Zuhause, süßes Zuhause.',
    },
    {
      id: 'world-mystic-wildlands',
      label: 'Mystische Wildnis',
      rarity: Rarity.Common,
      weight: 30,
      tags: ['nature', 'beast', 'arcane'],
      effects: [
        { type: 'passive', description: 'Naturverbunden: Tiere und Geister sind Verbündete.' },
        { type: 'stat_boost', target: 'vitality', value: 10, description: '+10 VIT. Die Wildnis stählt.' },
      ],
      lore: 'Endlose Wälder, sprechende Tiere, und Bäume die älter sind als Zivilisationen.',
    },
    {
      id: 'world-shadow-undercity',
      label: 'Schattenstadt',
      rarity: Rarity.Uncommon,
      weight: 22,
      tags: ['shadow', 'stealth', 'cursed'],
      effects: [
        { type: 'passive', description: 'Schattenwandler: Unsichtbar bei Nacht. Bonus-Schaden aus dem Versteck.' },
        { type: 'stat_boost', target: 'agility', value: 12, description: '+12 AGI. Überleben heißt schnell sein.' },
      ],
      lore: 'Eine Stadt unter der Stadt. Hier regieren Diebe, Assassinen und die, die offiziell nicht existieren.',
    },
    {
      id: 'world-celestial-citadel',
      label: 'Himmelszitadelle',
      rarity: Rarity.Uncommon,
      weight: 22,
      tags: ['holy', 'divine', 'cosmic'],
      effects: [
        { type: 'passive', description: 'Göttlicher Schutz: Starte mit einem Schutzschild (1 Hit absorbieren).' },
        { type: 'stat_boost', target: 'charisma', value: 10, description: '+10 CHA. Heiliges Ansehen.' },
      ],
      lore: 'Eine Festung über den Wolken. Hier residieren die Paladine, Priester und himmlischen Wächter.',
    },
    {
      id: 'world-volcanic-forge',
      label: 'Vulkanschmiede',
      rarity: Rarity.Uncommon,
      weight: 20,
      tags: ['fire', 'heavy', 'tech'],
      effects: [
        { type: 'passive', description: 'Feuerschmied: Waffen können mit Feuer-Elementar aufgewertet werden.' },
        { type: 'stat_boost', target: 'strength', value: 10, description: '+10 STR. Gehärtet in Lava.' },
      ],
      lore: 'Eine Zivilisation am Rand eines aktiven Vulkans. Die Schmieden brennen ewig.',
    },
    {
      id: 'world-frozen-wastes',
      label: 'Eisöde',
      rarity: Rarity.Rare,
      weight: 15,
      tags: ['ice', 'beast', 'tank'],
      effects: [
        { type: 'passive', description: 'Frostresistenz: Immun gegen Kälte-Schaden und Verlangsamung.' },
        { type: 'stat_boost', target: 'vitality', value: 14, description: '+14 VIT. Überlebenskünstler.' },
      ],
      lore: 'Endloser Winter. Nur die Härtesten überleben — und die, die gute Mäntel haben.',
    },
    {
      id: 'world-abyssal-depths',
      label: 'Abgrundtiefen',
      rarity: Rarity.Rare,
      weight: 12,
      tags: ['void', 'necro', 'shadow'],
      effects: [
        { type: 'passive', description: 'Dunkle Sicht: Sehe in absoluter Dunkelheit. Resistenz gegen Angst.' },
        { type: 'stat_boost', target: 'intelligence', value: 12, description: '+12 INT. Die Tiefe lehrt.' },
        { type: 'curse', description: 'Sonnenlicht schwächt dich: -3 auf alle Checks bei Tageslicht.' },
      ],
      lore: 'Tief unter der Erde, wo Licht ein Mythos ist. Hier flüstern die alten Dinge.',
    },
    {
      id: 'world-titan-foundry',
      label: 'Titanenfabrik',
      rarity: Rarity.Rare,
      weight: 12,
      tags: ['mecha', 'tech', 'heavy'],
      effects: [
        { type: 'passive', description: 'Mech-Pilot: Kann Kampfmechs steuern. Bonus-STR in Mechs.' },
        { type: 'stat_boost', target: 'attack', value: 12, description: '+12 ATK. Industrielle Kriegsmaschine.' },
      ],
      lore: 'Eine Fabrik so groß wie eine Stadt. Hier werden die Kriegsmaschinen der Zukunft gebaut.',
    },
    {
      id: 'world-arcane-academy',
      label: 'Arkane Akademie',
      rarity: Rarity.Epic,
      weight: 8,
      tags: ['arcane', 'psychic', 'cosmic'],
      effects: [
        { type: 'stat_boost', target: 'intelligence', value: 20, description: '+20 INT. Magisches Studium.' },
        { type: 'passive', description: 'Zauberbuch: Starte mit 2 zufälligen Zaubersprüchen.' },
        { type: 'ability', description: 'Arkaner Schild: Blockt einen magischen Angriff vollständig.' },
      ],
      lore: 'Die älteste Universität der Magie. Jeder Stein pulsiert vor arkaner Energie.',
    },
    {
      id: 'world-void-between',
      label: 'Das Zwischen',
      rarity: Rarity.Legendary,
      weight: 4,
      tags: ['void', 'temporal', 'psychic'],
      effects: [
        { type: 'stat_boost', target: 'all', value: 12, description: '+12 alle Stats. Zwischen den Welten.' },
        { type: 'ability', description: 'Dimensionstor: Reise sofort in jede bekannte Region.' },
        { type: 'passive', description: 'Zeitlos: Alterung und Vergiftung haben keine Wirkung.' },
      ],
      lore: 'Der Raum zwischen den Dimensionen. Keine Zeit, kein Ort — nur Möglichkeiten.',
    },
    {
      id: 'world-creators-throne',
      label: 'Thron des Schöpfers',
      rarity: Rarity.Mythic,
      weight: 1.5,
      tags: ['cosmic', 'divine', 'temporal'],
      effects: [
        { type: 'stat_boost', target: 'all', value: 25, description: '+25 alle Stats. Göttliches Erbe.' },
        { type: 'ability', description: 'Schicksalswebung: Ändere das Ergebnis eines Checks pro Kapitel.' },
        { type: 'passive', description: 'Allgegenwärtig: Kann überall gleichzeitig sein.' },
      ],
      lore: 'Der Ort, an dem die Realität geschmiedet wird. Du sitzt dort, wo Götter knien.',
    },
  ],
};
