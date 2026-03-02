// ── Race Wheel ──
// Determines the character's species/race.
// Season 1: Cyber Mythic — from humans to cosmic entities.

import { Rarity } from '../../types';
import type { WheelModule } from '../../types';

export const raceWheel: WheelModule = {
  id: 'wheel-race',
  name: 'Rasse',
  category: 'race',
  icon: '🧬',
  visualTheme: 'race-gradient',
  description: 'Was bist du? Deine Spezies bestimmt dein Schicksal.',
  order: 0,
  segments: [
    {
      id: 'race-human',
      label: 'Mensch',
      rarity: Rarity.Common,
      weight: 40,
      tags: ['charisma', 'precision'],
      effects: [
        { type: 'passive', description: 'Anpassungsfähig: +10 % XP-Bonus aus allen Quellen.' },
        { type: 'stat_boost', target: 'charisma', value: 5, description: '+5 CHA. Diplomatie liegt im Blut.' },
      ],
      lore: 'Gewöhnlich? Vielleicht. Aber Könige, Generäle und Legenden — die meisten waren Menschen.',
    },
    {
      id: 'race-elf',
      label: 'Elf',
      rarity: Rarity.Common,
      weight: 35,
      tags: ['arcane', 'nature', 'precision'],
      effects: [
        { type: 'stat_boost', target: 'intelligence', value: 8, description: '+8 INT. Jahrhunderte des Wissens.' },
        { type: 'passive', description: 'Nachtsicht: Keine Nachteile bei Dunkelheit.' },
      ],
      lore: 'Unsterblich, elegant, und ein wenig arrogant. Aber sie haben es sich verdient.',
    },
    {
      id: 'race-orc',
      label: 'Ork',
      rarity: Rarity.Common,
      weight: 35,
      tags: ['brute', 'melee', 'brutal'],
      effects: [
        { type: 'stat_boost', target: 'strength', value: 12, description: '+12 STR. Rohe Gewalt.' },
        { type: 'passive', description: 'Kriegsrausch: Bei unter 30 % HP +25 % Schaden.' },
      ],
      lore: 'Grün, groß, und grundsätzlich wütend. Orks fragen nicht — sie nehmen.',
    },
    {
      id: 'race-dwarf',
      label: 'Zwerg',
      rarity: Rarity.Uncommon,
      weight: 25,
      tags: ['heavy', 'tech', 'tank'],
      effects: [
        { type: 'stat_boost', target: 'vitality', value: 10, description: '+10 VIT. Hart wie Granit.' },
        { type: 'passive', description: 'Meisterschmied: Waffen-Upgrades kosten 50 % weniger.' },
      ],
      lore: 'Klein, sturköpfig, und Meister des Bieres und der Schmiedekunst.',
    },
    {
      id: 'race-demon',
      label: 'Dämon',
      rarity: Rarity.Uncommon,
      weight: 20,
      tags: ['fire', 'cursed', 'brutal'],
      effects: [
        { type: 'stat_boost', target: 'attack', value: 14, description: '+14 ATK. Höllenfeuer im Blut.' },
        { type: 'passive', description: 'Feuerresistenz: Immun gegen Feuer-Schaden.' },
        { type: 'curse', description: 'Heilige Orte brennen dich: -5 HP pro Runde in Tempeln.' },
      ],
      lore: 'Aus den Tiefen der Hölle geboren. Charismatisch, mächtig, und absolut nicht vertrauenswürdig.',
    },
    {
      id: 'race-angel',
      label: 'Engel',
      rarity: Rarity.Uncommon,
      weight: 20,
      tags: ['holy', 'divine', 'support'],
      effects: [
        { type: 'stat_boost', target: 'charisma', value: 15, description: '+15 CHA. Göttliche Aura.' },
        { type: 'passive', description: 'Regeneration: Heile 5 HP pro Runde außerhalb des Kampfes.' },
      ],
      lore: 'Flügel aus Licht. Ein Wesen der Ordnung, herabgestiegen um… naja, wir werden sehen.',
    },
    {
      id: 'race-undead',
      label: 'Untoter',
      rarity: Rarity.Rare,
      weight: 15,
      tags: ['necro', 'cursed', 'shadow'],
      effects: [
        { type: 'passive', description: 'Unsterblich: Einmal pro Kapitel den Tod ignorieren (1 HP statt Tod).' },
        { type: 'stat_boost', target: 'vitality', value: 15, description: '+15 VIT. Der Tod ist nur ein Zustand.' },
        { type: 'curse', description: 'Lebende NPCs misstrauen dir: -5 auf soziale Checks.' },
      ],
      lore: 'Gestorben, auferstanden, und etwas genervt davon. Riecht auch nicht mehr so gut.',
    },
    {
      id: 'race-dragon-kin',
      label: 'Drachenblut',
      rarity: Rarity.Rare,
      weight: 12,
      tags: ['fire', 'beast', 'cosmic'],
      effects: [
        { type: 'stat_boost', target: 'all', value: 6, description: '+6 alle Stats. Drachenblut.' },
        { type: 'ability', description: 'Feueratem: AoE Feuer-Attacke einmal pro Kampf.' },
        { type: 'passive', description: 'Schuppen-Rüstung: Natürlicher Schutz von 15 %.' },
      ],
      lore: 'Halb Mensch, halb Drache. Ganz Legende. Kann auch sehr schlecht parkieren.',
    },
    {
      id: 'race-cyborg',
      label: 'Cyborg',
      rarity: Rarity.Rare,
      weight: 15,
      tags: ['cyber', 'tech', 'mecha'],
      effects: [
        { type: 'stat_boost', target: 'intelligence', value: 10, description: '+10 INT. Prozessor im Kopf.' },
        { type: 'stat_boost', target: 'attack', value: 8, description: '+8 ATK. Eingebaute Waffen.' },
        { type: 'passive', description: 'Hacking: Kann Terminals und Mech-Feinde hacken.' },
      ],
      lore: 'Mehr Maschine als Mensch. Mehr Mensch als die meisten Menschen.',
    },
    {
      id: 'race-celestial',
      label: 'Himmlischer',
      rarity: Rarity.Epic,
      weight: 8,
      tags: ['cosmic', 'holy', 'psychic'],
      effects: [
        { type: 'stat_boost', target: 'all', value: 10, description: '+10 alle Stats. Kosmische Macht.' },
        { type: 'ability', description: 'Sternenschlag: Beschwört einen Meteoriteneinschlag.' },
        { type: 'passive', description: 'Schweben: Ignoriert Terrain-Effekte.' },
      ],
      lore: 'Ein Wesen aus dem Raum zwischen den Sternen. Die Schwerkraft ist nur ein Vorschlag.',
    },
    {
      id: 'race-shapeshifter',
      label: 'Gestaltwandler',
      rarity: Rarity.Epic,
      weight: 8,
      tags: ['mutation', 'beast', 'stealth'],
      effects: [
        { type: 'ability', description: 'Verwandlung: Nimmt die Form des letzten besiegten Feindes an.' },
        { type: 'passive', description: 'Tarnung: Kann sich als NPC ausgeben. Perfekte Infiltration.' },
      ],
      lore: 'Niemand weiß, wie du wirklich aussiehst. Auch du nicht mehr.',
    },
    {
      id: 'race-void-entity',
      label: 'Void-Wesen',
      rarity: Rarity.Legendary,
      weight: 4,
      tags: ['void', 'cosmic', 'psychic'],
      effects: [
        { type: 'stat_boost', target: 'all', value: 15, description: '+15 alle Stats. Jenseits der Realität.' },
        { type: 'ability', description: 'Dimensionsriss: Teleportiert dich und Feinde in den Void.' },
        { type: 'passive', description: 'Phasenverschiebung: 20 % Chance, physischen Schaden zu ignorieren.' },
      ],
      lore: 'Ein Wesen aus dem Nichts. Du existierst, weil das Universum zu höflich ist, dich rauszuwerfen.',
    },
    {
      id: 'race-primordial',
      label: 'Urwesen',
      rarity: Rarity.Mythic,
      weight: 1.5,
      tags: ['cosmic', 'temporal', 'divine'],
      effects: [
        { type: 'stat_boost', target: 'all', value: 22, description: '+22 alle Stats. Älter als die Zeit.' },
        { type: 'ability', description: 'Genesis: Erschaffe kurzzeitig Terrain oder Verbündete aus dem Nichts.' },
        { type: 'passive', description: 'Allwissend: Sehe alle versteckten Informationen in Events.' },
      ],
      lore: 'Du warst hier, bevor es ein "hier" gab. Du bist müde.',
    },
  ],
};
