// ── Dynamic Story Events ──
// Story events that are generated based on the character's race, world,
// alignment, rank, and current state.
// These overlay and extend the static storyEvents.ts.

import type { StoryEvent, StoryCharacter } from '../types/storyTypes';
import { Rarity } from '../types';
import type { Tag } from '../types';
import { getMatchingLadders, getCurrentRank, getNextRank } from '../data/rankSystem';

// ═══════════════════════════════════════════════
// ─── Helper: Extract build segment IDs ───
// ═══════════════════════════════════════════════

function getSegmentId(character: StoryCharacter, prefix: string): string {
  const seg = character.build.results?.find(r => r.segment.id.startsWith(prefix));
  return seg?.segment.id ?? '';
}

function getWorldId(c: StoryCharacter): string { return getSegmentId(c, 'world-'); }
function getRaceId(c: StoryCharacter): string { return getSegmentId(c, 'race-'); }
function getAlignmentId(c: StoryCharacter): string { return getSegmentId(c, 'align-'); }

// ═══════════════════════════════════════════════
// ─── Event Templates by Category ───
// ═══════════════════════════════════════════════

interface EventTemplate {
  /** Which world IDs trigger this event (empty = universal) */
  worldIds: string[];
  /** Which race IDs trigger this event (empty = any) */
  raceIds: string[];
  /** Which alignment IDs trigger this event (empty = any) */
  alignmentIds: string[];
  /** Minimum rank tier required */
  minRankTier: number;
  /** Maximum rank tier (0 = no limit) */
  maxRankTier: number;
  /** Generate the event for the specific character */
  generate: (character: StoryCharacter, rankLabel: string, nextRankLabel: string | null) => Omit<StoryEvent, 'id'> & { id: string };
}

// ─── Event riskLevel colors for display ───

const TEMPLATES: EventTemplate[] = [
  // ════════════════════════════════════════
  // KINGDOM EVENTS
  // ════════════════════════════════════════
  {
    worldIds: ['world-iron-kingdom'],
    raceIds: [],
    alignmentIds: [],
    minRankTier: 0,
    maxRankTier: 2,
    generate: (_char, rank, nextRank) => ({
      id: `dyn-kingdom-training-${Date.now()}`,
      title: 'Militärisches Training',
      description: `Als ${rank} im Eisernen Königreich wirst du zum Übungsplatz gerufen. Der Ausbilder mustert dich kritisch.`,
      category: 'combat',
      triggerTags: ['melee', 'heavy'] as Tag[],
      minTier: 'novice',
      maxTier: 'veteran',
      regions: ['iron-kingdom'],
      rarity: Rarity.Common,
      repeatable: true,
      flavor: 'Schweiß und Stahl — der Geruch des Fortschritts.',
      choices: [
        {
          id: 'kingdom-train-fight',
          label: 'Im Duell kämpfen',
          description: 'Zeige deine Stärke im Schwertkampf.',
          riskLevel: 'medium' as const,
          check: { type: 'combat' as const, target: 'strength', difficulty: 7, tagBonus: ['melee', 'heavy'] as Tag[] },
          successOutcomes: [{
            id: 'kingdom-train-win', description: 'Beeindruckend!',
            effects: [
              { type: 'xp_gain' as const, value: 35, description: '+35 XP' },
              { type: 'reputation_change' as const, target: 'iron-kingdom', value: 5, description: '+5 Ruf' },
            ],
            narrative: `Der Ausbilder nickt anerkennend. "Nicht schlecht für einen ${rank}. ${nextRank ? `Bald wirst du ${nextRank}.` : 'Du bist der Beste.'}"`,
          }],
          failureOutcomes: [{
            id: 'kingdom-train-lose', description: 'Noch viel zu lernen.',
            effects: [
              { type: 'hp_change' as const, value: -10, description: '-10 HP' },
              { type: 'xp_gain' as const, value: 10, description: '+10 XP (Erfahrung)' },
            ],
            narrative: 'Du landest im Staub. Aber jeder Fall ist eine Lektion.',
          }],
        },
        {
          id: 'kingdom-train-inspire',
          label: 'Rede an die Truppen halten',
          description: 'Zeige deine Führungsqualitäten.',
          riskLevel: 'low' as const,
          check: { type: 'social' as const, target: 'charisma', difficulty: 6, tagBonus: ['charisma'] as Tag[] },
          successOutcomes: [{
            id: 'kingdom-inspire-win', description: 'Sie jubeln!',
            effects: [
              { type: 'xp_gain' as const, value: 25, description: '+25 XP' },
              { type: 'reputation_change' as const, target: 'iron-kingdom', value: 8, description: '+8 Ruf' },
            ],
            narrative: 'Deine Worte entzünden ein Feuer in ihren Herzen. Sie chanten deinen Namen.',
          }],
          failureOutcomes: [{
            id: 'kingdom-inspire-fail', description: 'Peinliche Stille.',
            effects: [
              { type: 'reputation_change' as const, target: 'iron-kingdom', value: -3, description: '-3 Ruf' },
            ],
            narrative: 'Deine Rede endet mit verlegenem Schweigen. Jemand hustet.',
          }],
        },
      ],
    }),
  },

  // Kingdom — Rank Up Event
  {
    worldIds: ['world-iron-kingdom'],
    raceIds: [],
    alignmentIds: [],
    minRankTier: 2,
    maxRankTier: 5,
    generate: (_char, rank, nextRank) => ({
      id: `dyn-kingdom-politics-${Date.now()}`,
      title: 'Politische Intrige',
      description: `Als ${rank} wirst du in die politischen Ränkespiele des Hofes hineingezogen. Ein Lord bietet dir eine Allianz an — aber zu welchem Preis?`,
      category: 'social',
      triggerTags: ['charisma', 'precision'] as Tag[],
      minTier: 'veteran',
      maxTier: 'legend',
      regions: ['iron-kingdom'],
      rarity: Rarity.Uncommon,
      repeatable: true,
      choices: [
        {
          id: 'kingdom-politics-ally',
          label: 'Allianz annehmen',
          description: 'Der Lord ist mächtig. Sein Schutz wäre wertvoll.',
          riskLevel: 'medium' as const,
          check: { type: 'social' as const, target: 'charisma', difficulty: 9, tagBonus: ['charisma', 'precision'] as Tag[] },
          successOutcomes: [{
            id: 'kingdom-ally-win', description: 'Mächtige Verbündete!',
            effects: [
              { type: 'xp_gain' as const, value: 60, description: '+60 XP' },
              { type: 'reputation_change' as const, target: 'iron-kingdom', value: 15, description: '+15 Ruf' },
            ],
            narrative: `Die Allianz festigt deine Position. ${nextRank ? `Der Weg zum ${nextRank} wird klarer.` : 'Deine Macht ist unangreifbar.'}`,
          }],
          failureOutcomes: [{
            id: 'kingdom-ally-fail', description: 'Es war eine Falle.',
            effects: [
              { type: 'hp_change' as const, value: -20, description: '-20 HP (Hinterhalt)' },
              { type: 'reputation_change' as const, target: 'iron-kingdom', value: -10, description: '-10 Ruf' },
            ],
            narrative: 'Der Lord hat dich benutzt. Sein Lächeln war eine Klinge.',
          }],
        },
        {
          id: 'kingdom-politics-expose',
          label: 'Korruption aufdecken',
          description: 'Nutze dein Wissen, um den Lord bloßzustellen.',
          riskLevel: 'high' as const,
          check: { type: 'tag' as const, target: 'precision', difficulty: 11, tagBonus: ['stealth', 'psychic'] as Tag[] },
          successOutcomes: [{
            id: 'kingdom-expose-win', description: 'Gerechtigkeit!',
            effects: [
              { type: 'xp_gain' as const, value: 100, description: '+100 XP' },
              { type: 'reputation_change' as const, target: 'iron-kingdom', value: 25, description: '+25 Ruf' },
            ],
            narrative: 'Die Beweise sind erdrückend. Der Lord wird in Ketten abgeführt. Du bist der Held des Tages.',
          }],
          failureOutcomes: [{
            id: 'kingdom-expose-fail', description: 'Zu viele Feinde.',
            effects: [
              { type: 'hp_change' as const, value: -35, description: '-35 HP' },
              { type: 'reputation_change' as const, target: 'iron-kingdom', value: -15, description: '-15 Ruf' },
            ],
            narrative: 'Der Lord ist mächtiger als gedacht. Du wirst zum Feind des Hofes.',
          }],
        },
      ],
    }),
  },

  // ════════════════════════════════════════
  // NEON NEXUS EVENTS
  // ════════════════════════════════════════
  {
    worldIds: ['world-neon-nexus'],
    raceIds: [],
    alignmentIds: [],
    minRankTier: 0,
    maxRankTier: 3,
    generate: (_char, rank) => ({
      id: `dyn-nexus-job-${Date.now()}`,
      title: 'Job vom Schwarzmarkt',
      description: `Dein Ruf als ${rank} hat sich herumgesprochen. Ein Fixer hat einen Job für dich — riskant, aber lukrativ.`,
      category: 'exploration',
      triggerTags: ['tech', 'stealth'] as Tag[],
      minTier: 'novice',
      maxTier: 'champion',
      regions: ['neon-nexus'],
      rarity: Rarity.Common,
      repeatable: true,
      choices: [
        {
          id: 'nexus-job-hack',
          label: 'Daten hacken',
          description: 'Infiltriere das Firmennetzwerk.',
          riskLevel: 'medium' as const,
          check: { type: 'tag' as const, target: 'tech', difficulty: 8, tagBonus: ['cyber', 'tech'] as Tag[] },
          successOutcomes: [{
            id: 'nexus-hack-win', description: 'Clean exit.',
            effects: [
              { type: 'xp_gain' as const, value: 40, description: '+40 XP' },
              { type: 'score_change' as const, value: 20, description: '+20 Credits' },
            ],
            narrative: 'Die Daten fließen wie Neonlicht. Dein Fixer ist beeindruckt.',
          }],
          failureOutcomes: [{
            id: 'nexus-hack-fail', description: 'Alarm!',
            effects: [
              { type: 'hp_change' as const, value: -20, description: '-20 HP (Sicherheitsdrohne)' },
            ],
            narrative: 'Die Firewall war eine Falle. Drohnen jagen dich durch die Gassen.',
          }],
        },
        {
          id: 'nexus-job-stealth',
          label: 'Einbrechen',
          description: 'Geh physisch rein und stiehl die Hardware.',
          riskLevel: 'high' as const,
          check: { type: 'tag' as const, target: 'stealth', difficulty: 9, tagBonus: ['stealth', 'speed'] as Tag[] },
          successOutcomes: [{
            id: 'nexus-steal-win', description: 'Geisterhaft.',
            effects: [
              { type: 'xp_gain' as const, value: 55, description: '+55 XP' },
              { type: 'item_gain' as const, stringValue: 'stolen-hardware', description: 'Gestohlene Hardware' },
            ],
            narrative: 'Rein, raus, keine Spuren. Professionell.',
          }],
          failureOutcomes: [{
            id: 'nexus-steal-fail', description: 'Erwischt!',
            effects: [
              { type: 'hp_change' as const, value: -30, description: '-30 HP' },
              { type: 'reputation_change' as const, target: 'neon-nexus', value: -8, description: '-8 Ruf' },
            ],
            narrative: 'Security hat dich auf Kamera. Du musst die Stadt für eine Weile meiden.',
          }],
        },
        {
          id: 'nexus-job-negotiate',
          label: 'Bessere Bezahlung verhandeln',
          description: 'Der Fixer kann mehr zahlen. Du weißt es.',
          riskLevel: 'low' as const,
          check: { type: 'social' as const, target: 'charisma', difficulty: 7, tagBonus: ['charisma'] as Tag[] },
          successOutcomes: [{
            id: 'nexus-nego-win', description: 'Deal!',
            effects: [
              { type: 'xp_gain' as const, value: 25, description: '+25 XP' },
              { type: 'score_change' as const, value: 50, description: '+50 Credits' },
            ],
            narrative: '"Okay, okay. Du kriegst mehr. Aber nächstes Mal schulde ich dir nichts."',
          }],
          failureOutcomes: [{
            id: 'nexus-nego-fail', description: 'Kein Deal.',
            effects: [
              { type: 'reputation_change' as const, target: 'neon-nexus', value: -5, description: '-5 Ruf' },
            ],
            narrative: '"Du bist gierig, Kid. Vergiss den Job." Er legt auf.',
          }],
        },
      ],
    }),
  },

  // ════════════════════════════════════════
  // MYSTIC WILDLANDS EVENTS
  // ════════════════════════════════════════
  {
    worldIds: ['world-mystic-wildlands'],
    raceIds: [],
    alignmentIds: [],
    minRankTier: 0,
    maxRankTier: 4,
    generate: (_char, rank) => ({
      id: `dyn-wild-beast-${Date.now()}`,
      title: 'Das Biest im Wald',
      description: `Die Wildnis testet dich, ${rank}. Ein mächtiges Wesen blockiert deinen Pfad.`,
      category: 'combat',
      triggerTags: ['nature', 'beast'] as Tag[],
      minTier: 'novice',
      maxTier: 'hero',
      regions: ['mystic-wildlands'],
      rarity: Rarity.Common,
      repeatable: true,
      choices: [
        {
          id: 'wild-beast-tame',
          label: 'Das Biest zähmen',
          description: 'Nutze deine Naturverbundenheit.',
          riskLevel: 'medium' as const,
          check: { type: 'tag' as const, target: 'beast', difficulty: 8, tagBonus: ['nature', 'beast', 'support'] as Tag[] },
          successOutcomes: [{
            id: 'wild-tame-win', description: 'Ein neuer Verbündeter!',
            effects: [
              { type: 'xp_gain' as const, value: 50, description: '+50 XP' },
              { type: 'trait_gain' as const, stringValue: 'beast-companion', description: 'Tierbegleiter erhalten!' },
            ],
            narrative: 'Das Biest senkt den Kopf. Es hat einen neuen Meister gewählt.',
          }],
          failureOutcomes: [{
            id: 'wild-tame-fail', description: 'Es greift an!',
            effects: [
              { type: 'hp_change' as const, value: -25, description: '-25 HP' },
            ],
            narrative: 'Deine Verbindung zur Natur reicht nicht. Das Biest schlägt zu.',
          }],
        },
        {
          id: 'wild-beast-fight',
          label: 'Das Biest bekämpfen',
          description: 'Zeige, wer der Stärkere ist.',
          riskLevel: 'high' as const,
          check: { type: 'combat' as const, target: 'strength', difficulty: 10, tagBonus: ['brute', 'melee'] as Tag[] },
          successOutcomes: [{
            id: 'wild-fight-win', description: 'Sieg!',
            effects: [
              { type: 'xp_gain' as const, value: 70, description: '+70 XP' },
              { type: 'reputation_change' as const, target: 'mystic-wildlands', value: 10, description: '+10 Ruf' },
            ],
            narrative: 'Das Biest fällt. Der Wald respektiert dich.',
          }],
          failureOutcomes: [{
            id: 'wild-fight-lose', description: 'Verwundet!',
            effects: [
              { type: 'hp_change' as const, value: -40, description: '-40 HP' },
            ],
            narrative: 'Das Biest ist stärker als du dachtest. Du ziehst dich blutend zurück.',
          }],
        },
      ],
    }),
  },

  // ════════════════════════════════════════
  // CELESTIAL CITADEL EVENTS
  // ════════════════════════════════════════
  {
    worldIds: ['world-celestial-citadel'],
    raceIds: [],
    alignmentIds: [],
    minRankTier: 0,
    maxRankTier: 4,
    generate: (_char, rank) => ({
      id: `dyn-citadel-trial-${Date.now()}`,
      title: 'Prüfung der Tugend',
      description: `Als ${rank} der Himmelszitadelle musst du deine Würdigkeit beweisen. Ein göttliches Tribunal beobachtet.`,
      category: 'social',
      triggerTags: ['holy', 'divine'] as Tag[],
      minTier: 'novice',
      maxTier: 'hero',
      regions: ['celestial-citadel'],
      rarity: Rarity.Uncommon,
      repeatable: true,
      choices: [
        {
          id: 'citadel-trial-prayer',
          label: 'Durch Gebet bestehen',
          description: 'Rufe die göttliche Kraft an.',
          riskLevel: 'low' as const,
          check: { type: 'tag' as const, target: 'holy', difficulty: 6, tagBonus: ['holy', 'divine'] as Tag[] },
          successOutcomes: [{
            id: 'citadel-prayer-win', description: 'Gesegnet!',
            effects: [
              { type: 'xp_gain' as const, value: 40, description: '+40 XP' },
              { type: 'hp_change' as const, value: 20, description: '+20 HP (göttliche Heilung)' },
            ],
            narrative: 'Licht umhüllt dich. Das Tribunal nickt weise.',
          }],
          failureOutcomes: [{
            id: 'citadel-prayer-fail', description: 'Stille.',
            effects: [
              { type: 'xp_gain' as const, value: 10, description: '+10 XP' },
            ],
            narrative: 'Die Götter schweigen. Vielleicht musst du noch wachsen.',
          }],
        },
        {
          id: 'citadel-trial-combat',
          label: 'Heiliger Kampf',
          description: 'Beweise dich im rituellen Zweikampf.',
          riskLevel: 'medium' as const,
          check: { type: 'combat' as const, target: 'strength', difficulty: 9, tagBonus: ['melee', 'holy'] as Tag[] },
          successOutcomes: [{
            id: 'citadel-combat-win', description: 'Würdig!',
            effects: [
              { type: 'xp_gain' as const, value: 60, description: '+60 XP' },
              { type: 'reputation_change' as const, target: 'celestial-citadel', value: 12, description: '+12 Ruf' },
            ],
            narrative: 'Du besiegst deinen Gegner mit Ehre. Das Tribunal erhebt sich.',
          }],
          failureOutcomes: [{
            id: 'citadel-combat-fail', description: 'Nicht bereit.',
            effects: [
              { type: 'hp_change' as const, value: -20, description: '-20 HP' },
            ],
            narrative: 'Dein Gegner ist dir überlegen. Aber der Fall war ehrenhaft.',
          }],
        },
      ],
    }),
  },

  // ════════════════════════════════════════
  // SHADOW UNDERCITY EVENTS
  // ════════════════════════════════════════
  {
    worldIds: ['world-shadow-undercity'],
    raceIds: [],
    alignmentIds: [],
    minRankTier: 0,
    maxRankTier: 4,
    generate: (_char, rank) => ({
      id: `dyn-shadow-contract-${Date.now()}`,
      title: 'Auftrag aus dem Schatten',
      description: `Die Gilde hat einen neuen Auftrag für dich, ${rank}. Ein Ziel muss verschwinden.`,
      category: 'combat',
      triggerTags: ['stealth', 'shadow'] as Tag[],
      minTier: 'novice',
      maxTier: 'hero',
      regions: ['shadow-undercity'],
      rarity: Rarity.Common,
      repeatable: true,
      choices: [
        {
          id: 'shadow-assassinate',
          label: 'Leise eliminieren',
          description: 'Nutze die Schatten.',
          riskLevel: 'medium' as const,
          check: { type: 'tag' as const, target: 'stealth', difficulty: 8, tagBonus: ['stealth', 'shadow', 'precision'] as Tag[] },
          successOutcomes: [{
            id: 'shadow-kill-win', description: 'Sauber.',
            effects: [
              { type: 'xp_gain' as const, value: 55, description: '+55 XP' },
              { type: 'score_change' as const, value: 30, description: '+30 Credits' },
            ],
            narrative: 'Niemand hat etwas gehört. Niemand hat etwas gesehen. Perfekt.',
          }],
          failureOutcomes: [{
            id: 'shadow-kill-fail', description: 'Alarm!',
            effects: [
              { type: 'hp_change' as const, value: -25, description: '-25 HP' },
              { type: 'reputation_change' as const, target: 'shadow-undercity', value: -5, description: '-5 Ruf' },
            ],
            narrative: 'Das Ziel war vorbereitet. Wachen überall. Du musst fliehen.',
          }],
        },
        {
          id: 'shadow-spare',
          label: 'Das Ziel verschonen',
          description: 'Vielleicht ist es mehr wert, lebendig.',
          riskLevel: 'high' as const,
          check: { type: 'social' as const, target: 'charisma', difficulty: 10, tagBonus: ['charisma', 'psychic'] as Tag[] },
          successOutcomes: [{
            id: 'shadow-spare-win', description: 'Neuer Informant!',
            effects: [
              { type: 'xp_gain' as const, value: 40, description: '+40 XP' },
              { type: 'trait_gain' as const, stringValue: 'informant-network', description: 'Informanten-Netzwerk' },
            ],
            narrative: '"Okay, okay! Ich sag dir alles. Nur lass mich leben!" Informationen sind mehr wert als Blut.',
          }],
          failureOutcomes: [{
            id: 'shadow-spare-fail', description: 'Betrogen!',
            effects: [
              { type: 'hp_change' as const, value: -30, description: '-30 HP' },
              { type: 'reputation_change' as const, target: 'shadow-undercity', value: -10, description: '-10 Ruf (Gilde ist sauer)' },
            ],
            narrative: 'Das Ziel flieht und die Gilde bestraft dich für den Verrat am Auftrag.',
          }],
        },
      ],
    }),
  },

  // ════════════════════════════════════════
  // UNIVERSAL: ALLIANCE EVENT
  // ════════════════════════════════════════
  {
    worldIds: [],
    raceIds: [],
    alignmentIds: [],
    minRankTier: 1,
    maxRankTier: 0,
    generate: (_char, rank) => ({
      id: `dyn-alliance-${Date.now()}`,
      title: 'Angebot einer Allianz',
      description: `Ein mächtiger Fremder erkennt deinen Rang als ${rank}. Er bietet dir eine Partnerschaft an.`,
      category: 'social',
      triggerTags: ['charisma'] as Tag[],
      minTier: 'adventurer',
      maxTier: 'ascendant',
      regions: [],
      rarity: Rarity.Uncommon,
      repeatable: true,
      choices: [
        {
          id: 'alliance-accept',
          label: 'Allianz eingehen',
          description: 'Gemeinsam seid ihr stärker.',
          riskLevel: 'low' as const,
          check: { type: 'social' as const, target: 'charisma', difficulty: 6 },
          successOutcomes: [{
            id: 'alliance-yes', description: 'Starke Verbündete!',
            effects: [
              { type: 'xp_gain' as const, value: 30, description: '+30 XP' },
              { type: 'trait_gain' as const, stringValue: 'powerful-ally', description: 'Mächtiger Verbündeter' },
            ],
            narrative: 'Ihr schüttelt die Hände. Eine neue Ära beginnt.',
          }],
          failureOutcomes: [{
            id: 'alliance-awkward', description: 'Missverständnis.',
            effects: [
              { type: 'xp_gain' as const, value: 10, description: '+10 XP' },
            ],
            narrative: 'Irgendwas ging schief bei den Verhandlungen. Aber kein harter Bruch.',
          }],
        },
        {
          id: 'alliance-refuse',
          label: 'Ablehnen — allein kämpfen',
          description: 'Du brauchst niemanden.',
          riskLevel: 'safe' as const,
          successOutcomes: [{
            id: 'alliance-no', description: 'Lone Wolf.',
            effects: [
              { type: 'xp_gain' as const, value: 15, description: '+15 XP (Respekt)' },
            ],
            narrative: '"Ich kämpfe allein." Der Fremde zieht den Hut und geht.',
          }],
        },
        {
          id: 'alliance-betray',
          label: 'Annehmen und ausnutzen',
          description: 'Sein Vertrauen ist deine Waffe.',
          riskLevel: 'extreme' as const,
          requiredTags: ['cursed', 'shadow'] as Tag[],
          check: { type: 'tag' as const, target: 'shadow', difficulty: 12, tagBonus: ['stealth', 'psychic'] as Tag[] },
          successOutcomes: [{
            id: 'alliance-betray-win', description: 'Meisterhaft.',
            effects: [
              { type: 'xp_gain' as const, value: 80, description: '+80 XP' },
              { type: 'score_change' as const, value: 100, description: '+100 Credits' },
            ],
            narrative: 'Du nimmst alles und verschwindest. Kalt, effektiv, gewissenlos.',
          }],
          failureOutcomes: [{
            id: 'alliance-betray-fail', description: 'Entdeckt!',
            effects: [
              { type: 'hp_change' as const, value: -40, description: '-40 HP' },
              { type: 'reputation_change' as const, target: 'general', value: -20, description: '-20 Ruf' },
            ],
            narrative: 'Er war kein Narr. Der Hinterhalt trifft DICH.',
          }],
        },
      ],
    }),
  },

  // ════════════════════════════════════════
  // UNIVERSAL: RANK-UP TRIAL
  // ════════════════════════════════════════
  {
    worldIds: [],
    raceIds: [],
    alignmentIds: [],
    minRankTier: 0,
    maxRankTier: 0,
    generate: (_char, rank, nextRank) => ({
      id: `dyn-rank-trial-${Date.now()}`,
      title: nextRank ? `Aufstiegsprüfung: ${nextRank}` : 'Ultimative Prüfung',
      description: nextRank
        ? `Du stehst vor der Prüfung zum ${nextRank}. Alles, was du gelernt hast, wird auf die Probe gestellt.`
        : `Als ${rank} gibt es keine höhere Stufe — aber die ultimative Herausforderung wartet.`,
      category: 'combat',
      triggerTags: [] as Tag[],
      minTier: 'novice',
      maxTier: 'ascendant',
      regions: [],
      rarity: Rarity.Rare,
      repeatable: false,
      choices: [
        {
          id: 'rank-trial-accept',
          label: 'Prüfung annehmen',
          description: 'Zeige, dass du bereit bist.',
          riskLevel: 'high' as const,
          check: { type: 'combat' as const, target: 'strength', difficulty: 12, tagBonus: [] as Tag[] },
          successOutcomes: [{
            id: 'rank-trial-win', description: nextRank ? `Aufstieg zum ${nextRank}!` : 'Legende!',
            effects: [
              { type: 'xp_gain' as const, value: 120, description: '+120 XP' },
              { type: 'hp_change' as const, value: 30, description: '+30 HP (Erholung)' },
            ],
            narrative: nextRank
              ? `Du hast es geschafft! Du bist jetzt ${nextRank}. Eine neue Ära beginnt.`
              : 'Es gibt nichts mehr zu beweisen. Du bist eine Legende.',
          }],
          failureOutcomes: [{
            id: 'rank-trial-fail', description: 'Noch nicht bereit.',
            effects: [
              { type: 'hp_change' as const, value: -30, description: '-30 HP' },
              { type: 'xp_gain' as const, value: 30, description: '+30 XP (Erfahrung)' },
            ],
            narrative: 'Die Prüfung ist zu hart. Du fällst, aber du stehst wieder auf.',
          }],
        },
        {
          id: 'rank-trial-decline',
          label: 'Noch nicht bereit',
          description: 'Du brauchst mehr Training.',
          riskLevel: 'safe' as const,
          successOutcomes: [{
            id: 'rank-trial-wait', description: 'Weises Warten.',
            effects: [
              { type: 'xp_gain' as const, value: 10, description: '+10 XP' },
            ],
            narrative: 'Du wartest. Die Prüfung wird wieder kommen, wenn du bereit bist.',
          }],
        },
      ],
    }),
  },

  // ════════════════════════════════════════
  // RACE-SPECIFIC EVENTS
  // ════════════════════════════════════════

  // Demon — Corruption Event
  {
    worldIds: [],
    raceIds: ['race-demon'],
    alignmentIds: [],
    minRankTier: 0,
    maxRankTier: 0,
    generate: (_char, _rank) => ({
      id: `dyn-demon-corruption-${Date.now()}`,
      title: 'Ruf der Dunkelheit',
      description: 'Dein dämonisches Blut brodelt. Eine dunkle Stimme flüstert dir zu — nimm mehr Macht, aber bezahle den Preis.',
      category: 'curse',
      triggerTags: ['fire', 'cursed'] as Tag[],
      minTier: 'novice',
      maxTier: 'ascendant',
      regions: [],
      rarity: Rarity.Uncommon,
      repeatable: true,
      choices: [
        {
          id: 'demon-embrace',
          label: 'Dunkelheit annehmen',
          description: 'Mehr Macht. Mehr Verderbnis.',
          riskLevel: 'extreme' as const,
          check: { type: 'luck' as const, target: 'willpower', difficulty: 10 },
          successOutcomes: [{
            id: 'demon-power-win', description: 'Kontrollierte Dunkelheit!',
            effects: [
              { type: 'xp_gain' as const, value: 80, description: '+80 XP' },
              { type: 'trait_gain' as const, stringValue: 'dark-power', description: 'Dunkle Macht erlangt!' },
            ],
            narrative: 'Du nimmst die Dunkelheit an und kontrollierst sie. Für jetzt.',
          }],
          failureOutcomes: [{
            id: 'demon-power-fail', description: 'Kontrollverlust!',
            effects: [
              { type: 'hp_change' as const, value: -40, description: '-40 HP' },
              { type: 'status_change' as const, stringValue: 'corrupted', description: 'Korrumpiert!' },
            ],
            narrative: 'Die Dunkelheit verschlingt dich. Du verlierst kurzzeitig die Kontrolle.',
          }],
        },
        {
          id: 'demon-resist',
          label: 'Widerstehen',
          description: 'Du bist stärker als die Stimme.',
          riskLevel: 'safe' as const,
          successOutcomes: [{
            id: 'demon-resist-ok', description: 'Willensstark.',
            effects: [
              { type: 'xp_gain' as const, value: 25, description: '+25 XP' },
              { type: 'hp_change' as const, value: 10, description: '+10 HP (innere Ruhe)' },
            ],
            narrative: 'Du schließt die Augen und drückst die Stimme zurück. Heute nicht.',
          }],
        },
      ],
    }),
  },

  // Angel — Divine Mission
  {
    worldIds: [],
    raceIds: ['race-angel'],
    alignmentIds: [],
    minRankTier: 0,
    maxRankTier: 0,
    generate: (_char, _rank) => ({
      id: `dyn-angel-mission-${Date.now()}`,
      title: 'Göttlicher Auftrag',
      description: 'Ein himmlischer Bote erscheint. Du sollst eine heilige Aufgabe erfüllen — rette die Unschuldigen.',
      category: 'divine',
      triggerTags: ['holy', 'divine'] as Tag[],
      minTier: 'novice',
      maxTier: 'ascendant',
      regions: [],
      rarity: Rarity.Uncommon,
      repeatable: true,
      choices: [
        {
          id: 'angel-save',
          label: 'Die Mission erfüllen',
          description: 'Rette sie. Es ist deine Pflicht.',
          riskLevel: 'medium' as const,
          check: { type: 'combat' as const, target: 'strength', difficulty: 9, tagBonus: ['holy', 'divine'] as Tag[] },
          successOutcomes: [{
            id: 'angel-save-win', description: 'Gerettet!',
            effects: [
              { type: 'xp_gain' as const, value: 60, description: '+60 XP' },
              { type: 'hp_change' as const, value: 30, description: '+30 HP (göttlicher Segen)' },
              { type: 'reputation_change' as const, target: 'celestial', value: 15, description: '+15 Himmlischer Ruf' },
            ],
            narrative: 'Die Unschuldigen sind gerettet. Das Licht erstrahlt um dich.',
          }],
          failureOutcomes: [{
            id: 'angel-save-fail', description: 'Zu spät...',
            effects: [
              { type: 'hp_change' as const, value: -20, description: '-20 HP' },
              { type: 'reputation_change' as const, target: 'celestial', value: -5, description: '-5 Himmlischer Ruf' },
            ],
            narrative: 'Trotz deiner Bemühungen — es waren zu viele. Aber du hast es versucht.',
          }],
        },
        {
          id: 'angel-question',
          label: 'Die göttlichen Befehle hinterfragen',
          description: 'Warum sollst du blind gehorchen?',
          riskLevel: 'high' as const,
          check: { type: 'social' as const, target: 'charisma', difficulty: 11, tagBonus: ['psychic', 'cosmic'] as Tag[] },
          successOutcomes: [{
            id: 'angel-question-win', description: 'Erleuchtung!',
            effects: [
              { type: 'xp_gain' as const, value: 100, description: '+100 XP (Weisheit)' },
              { type: 'trait_gain' as const, stringValue: 'free-will', description: 'Freier Wille erlangt!' },
            ],
            narrative: 'Der Bote schweigt. Dann lächelt er. "Du bist bereit für die höhere Wahrheit."',
          }],
          failureOutcomes: [{
            id: 'angel-question-fail', description: 'Ketzerei!',
            effects: [
              { type: 'hp_change' as const, value: -35, description: '-35 HP (göttlicher Zorn)' },
            ],
            narrative: 'Die Götter sind nicht erfreut über deine Fragen. Ein Blitz trifft dich.',
          }],
        },
      ],
    }),
  },

  // Cyborg — System Upgrade
  {
    worldIds: [],
    raceIds: ['race-cyborg'],
    alignmentIds: [],
    minRankTier: 0,
    maxRankTier: 0,
    generate: (_char, _rank) => ({
      id: `dyn-cyborg-upgrade-${Date.now()}`,
      title: 'System-Upgrade verfügbar',
      description: 'Dein interner Diagnostik-Scan zeigt ein verfügbares Upgrade. Aber die Installation ist riskant.',
      category: 'exploration',
      triggerTags: ['cyber', 'tech'] as Tag[],
      minTier: 'novice',
      maxTier: 'ascendant',
      regions: [],
      rarity: Rarity.Uncommon,
      repeatable: true,
      choices: [
        {
          id: 'cyborg-upgrade',
          label: 'Upgrade installieren',
          description: 'Mehr Leistung. Mehr Risiko.',
          riskLevel: 'medium' as const,
          check: { type: 'tag' as const, target: 'tech', difficulty: 8, tagBonus: ['cyber', 'tech'] as Tag[] },
          successOutcomes: [{
            id: 'cyborg-up-win', description: 'Upgrade erfolgreich!',
            effects: [
              { type: 'xp_gain' as const, value: 45, description: '+45 XP' },
              { type: 'trait_gain' as const, stringValue: 'system-upgrade', description: 'System-Upgrade aktiv!' },
            ],
            narrative: 'UPGRADE COMPLETE. Alle Systeme optimal. Du bist schneller, stärker, besser.',
          }],
          failureOutcomes: [{
            id: 'cyborg-up-fail', description: 'Systemfehler!',
            effects: [
              { type: 'hp_change' as const, value: -20, description: '-20 HP (Überhitzung)' },
            ],
            narrative: 'ERROR: CRITICAL FAILURE. Notfall-Shutdown eingeleitet. Das hat wehgetan.',
          }],
        },
        {
          id: 'cyborg-skip',
          label: 'Upgrade ablehnen',
          description: 'Lieber kein Risiko.',
          riskLevel: 'safe' as const,
          successOutcomes: [{
            id: 'cyborg-skip-ok', description: 'Sicher ist sicher.',
            effects: [
              { type: 'xp_gain' as const, value: 5, description: '+5 XP' },
            ],
            narrative: 'UPGRADE POSTPONED. Manchmal ist das alte System das bessere.',
          }],
        },
      ],
    }),
  },
];

// ═══════════════════════════════════════════════
// ─── Dynamic Event Generator ───
// ═══════════════════════════════════════════════

/**
 * Generate a dynamic story event based on the character's current state.
 * Considers world, race, alignment, and rank to pick a fitting event template.
 */
export function generateDynamicEvent(character: StoryCharacter): StoryEvent | null {
  const worldId = getWorldId(character);
  const raceId = getRaceId(character);
  const alignmentId = getAlignmentId(character);

  // Get current rank info
  const ladders = getMatchingLadders(worldId, raceId, alignmentId);
  let rankLabel = 'Abenteurer';
  let nextRankLabel: string | null = null;
  let rankTier = 0;

  if (ladders.length > 0) {
    const ladder = ladders[0];
    const rank = getCurrentRank(ladder, character.xp, character.level);
    const next = getNextRank(ladder, character.xp, character.level);
    rankLabel = rank.label;
    rankTier = rank.tier;
    nextRankLabel = next?.label ?? null;
  }

  // Filter eligible templates
  const eligible = TEMPLATES.filter(t => {
    const worldMatch = t.worldIds.length === 0 || t.worldIds.includes(worldId);
    const raceMatch  = t.raceIds.length === 0 || t.raceIds.includes(raceId);
    const alignMatch = t.alignmentIds.length === 0 || t.alignmentIds.includes(alignmentId);
    const tierMin    = rankTier >= t.minRankTier;
    const tierMax    = t.maxRankTier === 0 || rankTier <= t.maxRankTier;
    return worldMatch && raceMatch && alignMatch && tierMin && tierMax;
  });

  if (eligible.length === 0) return null;

  // Pick a random template (weighted towards world-specific)
  const worldSpecific = eligible.filter(t => t.worldIds.length > 0 || t.raceIds.length > 0);
  const pool = worldSpecific.length > 0 && Math.random() < 0.7 ? worldSpecific : eligible;
  const template = pool[Math.floor(Math.random() * pool.length)];

  return template.generate(character, rankLabel, nextRankLabel);
}
