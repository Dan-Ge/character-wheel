// ── Alignment Wheel ──
// Determines the character's moral alignment / personality.
// Affects story branches, alliances, and available choices.
// Season 1: Cyber Mythic

import { Rarity } from '../../types';
import type { WheelModule } from '../../types';

export const alignmentWheel: WheelModule = {
  id: 'wheel-alignment',
  name: 'Gesinnung',
  category: 'alignment',
  icon: '⚖️',
  visualTheme: 'alignment-dual',
  description: 'Bist du ein Held, ein Schurke, oder etwas dazwischen?',
  order: 2,
  segments: [
    {
      id: 'align-heroic',
      label: 'Heldenhaft',
      rarity: Rarity.Common,
      weight: 25,
      tags: ['holy', 'support', 'charisma'],
      effects: [
        { type: 'passive', description: 'Beschützer: +20 % Bonus-XP für das Retten von NPCs.' },
        { type: 'stat_boost', target: 'charisma', value: 8, description: '+8 CHA. Anführer der Hoffnung.' },
      ],
      lore: 'Du kämpfst für die Schwachen. Klassisch, ehrenhaft, und manchmal nervig.',
    },
    {
      id: 'align-noble',
      label: 'Edel',
      rarity: Rarity.Common,
      weight: 22,
      tags: ['charisma', 'divine', 'precision'],
      effects: [
        { type: 'passive', description: 'Ehrenwort: Allianzen halten länger. NPCs vertrauen dir.' },
        { type: 'stat_boost', target: 'charisma', value: 10, description: '+10 CHA. Adliges Auftreten.' },
      ],
      lore: 'Ehre, Pflicht, und ein verdammt guter Kleidungsstil.',
    },
    {
      id: 'align-neutral',
      label: 'Neutral',
      rarity: Rarity.Common,
      weight: 30,
      tags: ['precision', 'stealth'],
      effects: [
        { type: 'passive', description: 'Pragmatiker: Kann mit allen Fraktionen handeln. Keine Feindschaften.' },
        { type: 'stat_boost', target: 'intelligence', value: 6, description: '+6 INT. Kühler Kopf.' },
      ],
      lore: 'Weder Held noch Schurke. Du tust, was getan werden muss.',
    },
    {
      id: 'align-chaotic',
      label: 'Chaotisch',
      rarity: Rarity.Uncommon,
      weight: 20,
      tags: ['mutation', 'cursed', 'speed'],
      effects: [
        { type: 'passive', description: 'Unberechenbar: 15 % Chance auf Doppel-Ergebnis bei jedem Check.' },
        { type: 'stat_boost', target: 'agility', value: 8, description: '+8 AGI. Chaos ist schnell.' },
      ],
      lore: 'Regeln? Welche Regeln? Du folgst nur einer Stimme — deiner eigenen. Manchmal auch nicht.',
    },
    {
      id: 'align-cunning',
      label: 'Gerissen',
      rarity: Rarity.Uncommon,
      weight: 20,
      tags: ['stealth', 'precision', 'shadow'],
      effects: [
        { type: 'passive', description: 'Taktiker: Sehe die Erfolgswahrscheinlichkeit aller Optionen.' },
        { type: 'stat_boost', target: 'intelligence', value: 10, description: '+10 INT. Immer zwei Schritte voraus.' },
      ],
      lore: 'Du lächelst höflich, während du den perfekten Plan schmiedest.',
    },
    {
      id: 'align-ruthless',
      label: 'Gnadenlos',
      rarity: Rarity.Uncommon,
      weight: 18,
      tags: ['brutal', 'brute', 'melee'],
      effects: [
        { type: 'passive', description: 'Kein Erbarmen: +30 % Schaden gegen verwundete Feinde.' },
        { type: 'stat_boost', target: 'attack', value: 10, description: '+10 ATK. Keine Gnade.' },
      ],
      lore: 'Mitgefühl ist Schwäche. Ergebnisse zählen. Und deine Ergebnisse sprechen für sich.',
    },
    {
      id: 'align-dark-lord',
      label: 'Finster',
      rarity: Rarity.Rare,
      weight: 12,
      tags: ['necro', 'shadow', 'cursed'],
      effects: [
        { type: 'passive', description: 'Dunkle Armee: Besiegte Feinde können als Untote wiederkommen.' },
        { type: 'stat_boost', target: 'attack', value: 14, description: '+14 ATK. Die Dunkelheit ist dein Verbündeter.' },
        { type: 'curse', description: 'Helden-NPCs sind feindlich gesinnt.' },
      ],
      lore: 'Warum Gutes tun, wenn Böses so verdammt effektiv ist?',
    },
    {
      id: 'align-trickster',
      label: 'Trickster',
      rarity: Rarity.Rare,
      weight: 12,
      tags: ['psychic', 'stealth', 'arcane'],
      effects: [
        { type: 'ability', description: 'Illusion: Erzeuge ein Trugbild. Feinde greifen das Phantom an.' },
        { type: 'passive', description: 'Verwirrung: 20 % Chance, dass Feinde sich gegenseitig angreifen.' },
      ],
      lore: 'Die Welt ist eine Bühne, und du bist der Regisseur. Und der Hauptdarsteller. Und der Bösewicht.',
    },
    {
      id: 'align-berserker',
      label: 'Berserker',
      rarity: Rarity.Epic,
      weight: 8,
      tags: ['brutal', 'fire', 'beast'],
      effects: [
        { type: 'stat_boost', target: 'attack', value: 20, description: '+20 ATK. Blinde Wut.' },
        { type: 'passive', description: 'Raserei: Ignoriere Schmerz. Kein Schaden-Feedback für 3 Runden.' },
        { type: 'curse', description: 'Kann Allianzen brechen wenn provoziert.' },
      ],
      lore: 'Wut. Reine, ungefilterte Wut. Und eine erstaunliche Cardio-Ausdauer.',
    },
    {
      id: 'align-balance-keeper',
      label: 'Hüter der Balance',
      rarity: Rarity.Epic,
      weight: 8,
      tags: ['cosmic', 'temporal', 'holy'],
      effects: [
        { type: 'stat_boost', target: 'all', value: 8, description: '+8 alle Stats. Kosmisches Gleichgewicht.' },
        { type: 'passive', description: 'Ausgleich: Wenn ein Stat unter 0 fällt, wird er auf 1 gesetzt.' },
        { type: 'ability', description: 'Harmonie: Stelle alle Stats auf ihren Durchschnitt ein.' },
      ],
      lore: 'Weder Licht noch Schatten. Du bist der Punkt dazwischen — und das ist der mächtigste Ort.',
    },
    {
      id: 'align-primordial-evil',
      label: 'Urzeitliches Böse',
      rarity: Rarity.Legendary,
      weight: 4,
      tags: ['void', 'necro', 'cosmic'],
      effects: [
        { type: 'stat_boost', target: 'all', value: 16, description: '+16 alle Stats. Reines Böse.' },
        { type: 'ability', description: 'Verderbnis: Korrumpiere einen Verbündeten — er wird zu deinem Sklaven.' },
        { type: 'passive', description: 'Furchteinflößend: Schwache NPCs fliehen bei deinem Anblick.' },
      ],
      lore: 'Das Böse hat dich nicht verführt. Du warst schon immer so. Seit vor der Zeit.',
    },
    {
      id: 'align-transcendent',
      label: 'Transzendent',
      rarity: Rarity.Mythic,
      weight: 1.5,
      tags: ['cosmic', 'divine', 'temporal'],
      effects: [
        { type: 'stat_boost', target: 'all', value: 20, description: '+20 alle Stats. Jenseits von Gut und Böse.' },
        { type: 'ability', description: 'Schicksalswende: Ändere den Ausgang eines Events komplett.' },
        { type: 'passive', description: 'Omnipräsenz: Fühle alles, was in der Welt passiert.' },
      ],
      lore: 'Gut? Böse? Diese Konzepte sind unter dir. Du bist einfach… du.',
    },
  ],
};
