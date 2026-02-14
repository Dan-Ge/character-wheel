// ── Story Events Data ──
// Encounter templates for all story event categories.
// Events are matched to characters based on tags, region, and power tier.
// Season 1: Cyber Mythic theme.

import type { StoryEvent } from '../types/storyTypes';

// ═══════════════════════════════════════════════
// ─── Combat Events ───
// ═══════════════════════════════════════════════

const COMBAT_EVENTS: StoryEvent[] = [
  {
    id: 'combat-street-ambush',
    title: 'Street Ambush',
    description: 'Neon-lit figures emerge from the smoke. They want what you have.',
    category: 'combat',
    triggerTags: ['tech', 'stealth', 'speed'],
    minTier: 'novice',
    maxTier: 'veteran',
    regions: ['neon-nexus', 'shadow-undercity'],
    rarity: 'common',
    repeatable: true,
    flavor: 'The alley smells like ozone and bad decisions.',
    visualTheme: 'dark_neon',
    choices: [
      {
        id: 'combat-street-fight',
        label: 'Fight them head-on',
        description: 'Draw your weapon and charge.',
        riskLevel: 'medium',
        check: { type: 'combat', target: 'strength', difficulty: 8, tagBonus: ['melee', 'brutal'] },
        successOutcomes: [
          {
            id: 'combat-street-win',
            description: 'You scatter the thugs.',
            effects: [
              { type: 'xp_gain', value: 30, description: '+30 XP' },
              { type: 'reputation_change', target: 'neon-nexus', value: 5, description: 'Street cred +5' },
            ],
            narrative: 'They didn\'t expect someone who fights back. The survivors scatter into the smoke, leaving behind a few credits and a lot of fear.',
          },
        ],
        failureOutcomes: [
          {
            id: 'combat-street-lose',
            description: 'They overpower you.',
            effects: [
              { type: 'hp_change', value: -25, description: '-25 HP' },
              { type: 'item_loss', stringValue: 'random', description: 'Lost a random item' },
            ],
            narrative: 'Too many of them, too fast. You take a beating and lose some gear before you manage to crawl away.',
          },
        ],
      },
      {
        id: 'combat-street-stealth',
        label: 'Slip into the shadows',
        description: 'Try to evade before they spot you.',
        riskLevel: 'low',
        requiredTags: ['stealth'],
        check: { type: 'tag', target: 'stealth', difficulty: 6 },
        successOutcomes: [
          {
            id: 'combat-street-evade',
            description: 'You vanish like a ghost.',
            effects: [
              { type: 'xp_gain', value: 15, description: '+15 XP' },
            ],
            narrative: 'You melt into the darkness. They never even knew you were there.',
          },
        ],
        failureOutcomes: [
          {
            id: 'combat-street-caught',
            description: 'Spotted!',
            effects: [
              { type: 'hp_change', value: -15, description: '-15 HP' },
            ],
            narrative: 'A scanner picks you up. You take a hit before you can get away.',
          },
        ],
      },
      {
        id: 'combat-street-bribe',
        label: 'Buy your way out',
        description: 'Offer credits for safe passage.',
        riskLevel: 'safe',
        check: { type: 'social', target: 'charisma', difficulty: 5 },
        successOutcomes: [
          {
            id: 'combat-street-bribe-ok',
            description: 'Credits change hands. Everyone leaves alive.',
            effects: [
              { type: 'score_change', value: -10, description: '-10 Score (bribe cost)' },
            ],
            narrative: 'A handful of credits and they melt away. Cheap for keeping your blood inside your body.',
          },
        ],
      },
    ],
  },
  {
    id: 'combat-rogue-mech',
    title: 'Rogue Mech',
    description: 'A malfunctioning war machine stomps through the district. Someone has to stop it.',
    category: 'combat',
    triggerTags: ['tech', 'mech', 'ranged', 'heavy'],
    minTier: 'adventurer',
    maxTier: 'champion',
    regions: ['neon-nexus', 'titan-foundry'],
    rarity: 'uncommon',
    repeatable: true,
    flavor: 'Its targeting laser sweeps the crowd like a drunk lighthouse.',
    visualTheme: 'industrial_fire',
    choices: [
      {
        id: 'combat-mech-hack',
        label: 'Hack its systems',
        description: 'Use tech skills to shut it down remotely.',
        riskLevel: 'medium',
        requiredTags: ['tech'],
        check: { type: 'tag', target: 'tech', difficulty: 12 },
        successOutcomes: [
          {
            id: 'combat-mech-hacked',
            description: 'You override its cortex.',
            effects: [
              { type: 'xp_gain', value: 60, description: '+60 XP' },
              { type: 'item_gain', stringValue: 'mech-core-salvage', description: 'Salvaged Mech Core' },
              { type: 'reputation_change', target: 'titan-foundry', value: 10, description: 'Foundry rep +10' },
            ],
            narrative: 'Your fingers dance across the holographic interface. The mech freezes mid-step, then powers down with a whine. The crowd cheers.',
          },
        ],
        failureOutcomes: [
          {
            id: 'combat-mech-hack-fail',
            description: 'It detected your intrusion.',
            effects: [
              { type: 'hp_change', value: -40, description: '-40 HP' },
              { type: 'status_effect', stringValue: 'system_shock', duration: 2, description: 'System Shock for 2 events' },
            ],
            narrative: 'The mech\'s ICE countermeasures fry your connection. A feedback pulse hits you like a truck.',
          },
        ],
      },
      {
        id: 'combat-mech-fight',
        label: 'Engage it directly',
        description: 'Find its weak point and attack.',
        riskLevel: 'high',
        check: { type: 'combat', target: 'strength', difficulty: 14 },
        successOutcomes: [
          {
            id: 'combat-mech-destroyed',
            description: 'You topple the war machine.',
            effects: [
              { type: 'xp_gain', value: 80, description: '+80 XP' },
              { type: 'title_gain', stringValue: 'Mech Slayer', description: 'Title: Mech Slayer' },
              { type: 'reputation_change', target: 'neon-nexus', value: 15, description: 'Street legend +15' },
            ],
            narrative: 'You find the gap in its armor and strike true. The mech crumbles in a shower of sparks. Legends are born like this.',
            isCritical: true,
          },
        ],
        failureOutcomes: [
          {
            id: 'combat-mech-crushed',
            description: 'The mech is too powerful.',
            effects: [
              { type: 'hp_change', value: -60, description: '-60 HP' },
              { type: 'status_change', stringValue: 'injured', description: 'Severely injured' },
            ],
            narrative: 'Steel meets flesh. Steel wins. You barely drag yourself out of the wreckage.',
            isCritical: true,
          },
        ],
      },
      {
        id: 'combat-mech-run',
        label: 'Evacuate the area',
        description: 'Get everyone out. Let the militia handle it.',
        riskLevel: 'low',
        check: { type: 'stat', target: 'speed', difficulty: 7 },
        successOutcomes: [
          {
            id: 'combat-mech-evacuated',
            description: 'You save civilian lives.',
            effects: [
              { type: 'xp_gain', value: 20, description: '+20 XP' },
              { type: 'reputation_change', target: 'neon-nexus', value: 5, description: 'Good samaritan +5' },
            ],
            narrative: 'You guide people to safety as the mech rampages. Someone else will deal with it, but you saved lives.',
          },
        ],
      },
    ],
  },
  {
    id: 'combat-void-creature',
    title: 'Void Breach Spawn',
    description: 'A tear in reality vomits forth something that should not exist. It has too many angles.',
    category: 'combat',
    triggerTags: ['arcane', 'void', 'cosmic', 'divine'],
    minTier: 'veteran',
    regions: ['void-rift', 'crystal-wastes', 'cosmic-shore'],
    rarity: 'rare',
    repeatable: true,
    flavor: 'Your eyes hurt from trying to look at it. Geometry was never supposed to scream.',
    visualTheme: 'void_horror',
    choices: [
      {
        id: 'combat-void-banish',
        label: 'Channel arcane energy to banish it',
        description: 'Use your mystical power to seal the rift.',
        riskLevel: 'high',
        requiredTags: ['arcane'],
        check: { type: 'tag', target: 'arcane', difficulty: 15 },
        successOutcomes: [
          {
            id: 'combat-void-sealed',
            description: 'You seal the breach.',
            effects: [
              { type: 'xp_gain', value: 120, description: '+120 XP' },
              { type: 'trait_gain', stringValue: 'voidtouched', description: 'Trait: Voidtouched' },
              { type: 'reputation_change', target: 'void-rift', value: 20, description: 'Void reputation +20' },
            ],
            narrative: 'Words that predate language flow from your lips. The rift screams and closes. The creature dissolves. You feel... different now.',
            isCritical: true,
          },
        ],
        failureOutcomes: [
          {
            id: 'combat-void-corrupted',
            description: 'The void touches your mind.',
            effects: [
              { type: 'hp_change', value: -50, description: '-50 HP' },
              { type: 'status_change', stringValue: 'corrupted', description: 'Touched by the Void' },
            ],
            narrative: 'The void looks back. It doesn\'t just look. It reaches inside. Something cold takes root.',
            isCritical: true,
          },
        ],
      },
      {
        id: 'combat-void-flee',
        label: 'RUN.',
        description: 'Some fights are not meant to be fought.',
        riskLevel: 'medium',
        check: { type: 'luck', target: 'luck', difficulty: 10 },
        successOutcomes: [
          {
            id: 'combat-void-escaped',
            description: 'You outrun the impossible.',
            effects: [
              { type: 'xp_gain', value: 20, description: '+20 XP' },
            ],
            narrative: 'You run until you can\'t hear the screaming geometry anymore. Smart.',
          },
        ],
        failureOutcomes: [
          {
            id: 'combat-void-caught',
            description: 'It\'s faster than reality.',
            effects: [
              { type: 'hp_change', value: -70, description: '-70 HP' },
              { type: 'status_effect', stringValue: 'void_sickness', duration: 3, description: 'Void Sickness for 3 events' },
            ],
            narrative: 'Distance doesn\'t mean what you think it means near a void rift.',
            isCritical: true,
          },
        ],
      },
    ],
  },
];

// ═══════════════════════════════════════════════
// ─── Social Events ───
// ═══════════════════════════════════════════════

const SOCIAL_EVENTS: StoryEvent[] = [
  {
    id: 'social-info-broker',
    title: 'The Info Broker',
    description: 'A figure in a mirrored mask offers secrets. Everything has a price.',
    category: 'social',
    triggerTags: ['stealth', 'tech', 'psychic'],
    minTier: 'novice',
    regions: ['neon-nexus', 'shadow-undercity', 'deep-net'],
    rarity: 'common',
    repeatable: true,
    flavor: 'Their mask reflects your face, but wrong. Like it knows a version of you that hasn\'t happened yet.',
    visualTheme: 'noir_digital',
    choices: [
      {
        id: 'social-broker-buy',
        label: 'Pay for intel',
        description: 'Credits for forbidden knowledge.',
        riskLevel: 'low',
        check: { type: 'social', target: 'charisma', difficulty: 6 },
        successOutcomes: [
          {
            id: 'social-broker-intel',
            description: 'You learn a secret route.',
            effects: [
              { type: 'region_unlock', stringValue: 'random', description: 'New region revealed' },
              { type: 'xp_gain', value: 25, description: '+25 XP' },
            ],
            narrative: 'The broker slides a data chip across the table. On it: coordinates to a place you didn\'t know existed.',
          },
        ],
        failureOutcomes: [
          {
            id: 'social-broker-scam',
            description: 'Fraudulent data.',
            effects: [
              { type: 'score_change', value: -5, description: 'Wasted credits' },
            ],
            narrative: 'The data was garbage. Expensive garbage. You won\'t make that mistake again.',
          },
        ],
      },
      {
        id: 'social-broker-hack',
        label: 'Hack their systems to steal the info',
        description: 'Why pay when you can take?',
        riskLevel: 'high',
        requiredTags: ['tech'],
        check: { type: 'tag', target: 'tech', difficulty: 13 },
        successOutcomes: [
          {
            id: 'social-broker-heist',
            description: 'You drain their entire database.',
            effects: [
              { type: 'xp_gain', value: 60, description: '+60 XP' },
              { type: 'region_unlock', stringValue: 'random', description: 'Multiple secrets revealed' },
              { type: 'spawn_rival', stringValue: 'info-broker', description: 'The Broker becomes a rival' },
            ],
            narrative: 'Their entire network opens like a flower. But now they know your face. Or whatever they use instead of faces.',
          },
        ],
        failureOutcomes: [
          {
            id: 'social-broker-caught',
            description: 'Counter-hacked!',
            effects: [
              { type: 'hp_change', value: -20, description: '-20 HP (neural backlash)' },
              { type: 'reputation_change', target: 'deep-net', value: -15, description: 'Rep damaged in Deep Net' },
            ],
            narrative: 'Their ICE is military-grade. The backlash leaves you tasting copper and seeing double.',
          },
        ],
      },
      {
        id: 'social-broker-trade',
        label: 'Offer a trade — your secrets for theirs',
        description: 'Information is currency.',
        riskLevel: 'medium',
        check: { type: 'social', target: 'wisdom', difficulty: 10 },
        successOutcomes: [
          {
            id: 'social-broker-deal',
            description: 'A fair exchange.',
            effects: [
              { type: 'xp_gain', value: 40, description: '+40 XP' },
              { type: 'relationship_change', target: 'info-broker-npc', value: 20, description: 'Broker respects you' },
            ],
            narrative: 'You offer something they didn\'t know. Their mask tilts — surprised. A rare thing. "We\'ll do business again."',
          },
        ],
        failureOutcomes: [
          {
            id: 'social-broker-bad-deal',
            description: 'They got the better end.',
            effects: [
              { type: 'reputation_change', target: 'shadow-undercity', value: -10, description: 'Leaked info damages rep' },
            ],
            narrative: 'Your intel was worth more than you realized. They profit. You learn a lesson about negotiations.',
          },
        ],
      },
    ],
  },
  {
    id: 'social-ancient-oracle',
    title: 'The Ancient Oracle',
    description: 'In the depths of a crumbling temple, an oracle who has lived for centuries offers a prophecy.',
    category: 'social',
    triggerTags: ['arcane', 'divine', 'psychic', 'cosmic'],
    minTier: 'adventurer',
    regions: ['temple-forgotten-gods', 'crystal-wastes'],
    rarity: 'uncommon',
    repeatable: false,
    flavor: 'Their eyes are galaxies compressed into human sockets.',
    visualTheme: 'mystical_ancient',
    choices: [
      {
        id: 'social-oracle-listen',
        label: 'Listen to the prophecy',
        description: 'Open your mind to cosmic truth.',
        riskLevel: 'medium',
        check: { type: 'tag', target: 'psychic', difficulty: 10 },
        successOutcomes: [
          {
            id: 'social-oracle-vision',
            description: 'You receive a true vision.',
            effects: [
              { type: 'xp_gain', value: 80, description: '+80 XP' },
              { type: 'trait_gain', stringValue: 'prophetic_sight', description: 'Trait: Prophetic Sight' },
              { type: 'status_effect', stringValue: 'foresight', duration: 5, description: 'Foresight for 5 events' },
            ],
            narrative: 'Time fractures. You see yourself in ten, a hundred, a thousand futures. Most end badly. But in one — in ONE — you shine like a star.',
            isCritical: true,
          },
        ],
        failureOutcomes: [
          {
            id: 'social-oracle-madness',
            description: 'Too much truth too fast.',
            effects: [
              { type: 'hp_change', value: -30, description: '-30 HP' },
              { type: 'status_effect', stringValue: 'temporal_migraine', duration: 3, description: 'Temporal Migraine' },
            ],
            narrative: 'The visions come too fast. Past, present, future blur. You scream until you don\'t remember why.',
          },
        ],
      },
      {
        id: 'social-oracle-reject',
        label: 'Refuse the prophecy',
        description: 'Your future is your own to write.',
        riskLevel: 'safe',
        successOutcomes: [
          {
            id: 'social-oracle-respect',
            description: 'The oracle respects your will.',
            effects: [
              { type: 'xp_gain', value: 20, description: '+20 XP' },
              { type: 'trait_gain', stringValue: 'iron_will', description: 'Trait: Iron Will' },
            ],
            narrative: '"Interesting," the oracle smiles. "Very few refuse. Perhaps that is your prophecy." The words stay with you.',
          },
        ],
      },
    ],
  },
];

// ═══════════════════════════════════════════════
// ─── Exploration Events ───
// ═══════════════════════════════════════════════

const EXPLORATION_EVENTS: StoryEvent[] = [
  {
    id: 'explore-hidden-cache',
    title: 'Hidden Cache',
    description: 'Your sensors pick up a faint signal. Something is buried here.',
    category: 'exploration',
    triggerTags: ['tech', 'stealth', 'nature'],
    minTier: 'novice',
    regions: ['crystal-wastes', 'wild-sprawl', 'shadow-undercity'],
    rarity: 'common',
    repeatable: true,
    flavor: 'X marks the spot. Or in this case, a barely visible frequency blip.',
    visualTheme: 'treasure_hunt',
    choices: [
      {
        id: 'explore-cache-dig',
        label: 'Dig it up',
        description: 'Get your hands dirty.',
        riskLevel: 'low',
        check: { type: 'luck', target: 'luck', difficulty: 7 },
        successOutcomes: [
          {
            id: 'explore-cache-found',
            description: 'Salvage jackpot!',
            effects: [
              { type: 'item_gain', stringValue: 'salvage-crate', description: 'Found: Salvage Crate' },
              { type: 'xp_gain', value: 25, description: '+25 XP' },
            ],
            narrative: 'Under the rubble, a sealed crate. Pre-war tech. This could be worth a fortune — or save your life.',
          },
        ],
        failureOutcomes: [
          {
            id: 'explore-cache-trap',
            description: 'Booby-trapped!',
            effects: [
              { type: 'hp_change', value: -20, description: '-20 HP' },
            ],
            narrative: 'The cache was bait. An old mine detonates. Whoever left this had a sick sense of humor.',
          },
        ],
      },
      {
        id: 'explore-cache-scan',
        label: 'Scan carefully first',
        description: 'Use tech to check for traps.',
        riskLevel: 'safe',
        requiredTags: ['tech'],
        check: { type: 'tag', target: 'tech', difficulty: 5 },
        successOutcomes: [
          {
            id: 'explore-cache-safe',
            description: 'Trap disarmed, loot secured.',
            effects: [
              { type: 'item_gain', stringValue: 'salvage-crate', description: 'Found: Salvage Crate' },
              { type: 'xp_gain', value: 35, description: '+35 XP (extra for caution)' },
            ],
            narrative: 'Your scanner catches the tripwire. You disable it, then claim the prize. Smart and rewarded.',
          },
        ],
      },
    ],
  },
  {
    id: 'explore-ancient-shrine',
    title: 'The Forgotten Shrine',
    description: 'An ancient structure hums with energy. Symbols glow on its surface — they react to your presence.',
    category: 'exploration',
    triggerTags: ['arcane', 'divine', 'cosmic'],
    minTier: 'adventurer',
    regions: ['temple-forgotten-gods', 'crystal-wastes', 'cosmic-shore'],
    rarity: 'uncommon',
    repeatable: false,
    flavor: 'The symbols look like a language your bones remember but your brain forgot.',
    visualTheme: 'ancient_mystical',
    choices: [
      {
        id: 'explore-shrine-pray',
        label: 'Kneel and pray',
        description: 'Show respect to the old gods.',
        riskLevel: 'medium',
        check: { type: 'tag', target: 'divine', difficulty: 10 },
        successOutcomes: [
          {
            id: 'explore-shrine-blessed',
            description: 'The shrine responds.',
            effects: [
              { type: 'hp_change', value: 50, description: '+50 HP (divine healing)' },
              { type: 'xp_gain', value: 50, description: '+50 XP' },
              { type: 'trait_gain', stringValue: 'shrine_blessed', description: 'Trait: Shrine Blessed' },
            ],
            narrative: 'Warmth flows through you. Ancient power, older than the cities, older than the stars. For a moment, you feel whole.',
            isCritical: true,
          },
        ],
        failureOutcomes: [
          {
            id: 'explore-shrine-rejected',
            description: 'The old gods don\'t answer.',
            effects: [
              { type: 'xp_gain', value: 10, description: '+10 XP' },
            ],
            narrative: 'Silence. The symbols dim. Perhaps they were looking for someone else.',
          },
        ],
      },
      {
        id: 'explore-shrine-study',
        label: 'Study the symbols',
        description: 'There\'s knowledge here if you can decode it.',
        riskLevel: 'low',
        check: { type: 'stat', target: 'intelligence', difficulty: 9 },
        successOutcomes: [
          {
            id: 'explore-shrine-decoded',
            description: 'You translate the ancient text.',
            effects: [
              { type: 'xp_gain', value: 60, description: '+60 XP' },
              { type: 'region_unlock', stringValue: 'temple-forgotten-gods', description: 'Temple region revealed' },
            ],
            narrative: 'The symbols form a map. Not of geography — of possibility. You understand where to go next.',
          },
        ],
        failureOutcomes: [
          {
            id: 'explore-shrine-confused',
            description: 'The symbols resist understanding.',
            effects: [
              { type: 'xp_gain', value: 15, description: '+15 XP' },
            ],
            narrative: 'It almost makes sense. Almost. Like a word on the tip of your tongue that speaks an unknown language.',
          },
        ],
      },
    ],
  },
];

// ═══════════════════════════════════════════════
// ─── Mystery Events ───
// ═══════════════════════════════════════════════

const MYSTERY_EVENTS: StoryEvent[] = [
  {
    id: 'mystery-glitch-echo',
    title: 'The Glitch Echo',
    description: 'You see yourself walking ahead. Same clothes. Same gait. But you\'re standing still.',
    category: 'mystery',
    triggerTags: ['tech', 'psychic', 'cosmic', 'void'],
    minTier: 'adventurer',
    regions: ['deep-net', 'neon-nexus', 'void-rift'],
    rarity: 'rare',
    repeatable: false,
    flavor: 'Time doesn\'t taste right here.',
    visualTheme: 'glitch_reality',
    choices: [
      {
        id: 'mystery-glitch-follow',
        label: 'Follow your double',
        description: 'Chase the echo into the unknown.',
        riskLevel: 'high',
        check: { type: 'luck', target: 'luck', difficulty: 12 },
        successOutcomes: [
          {
            id: 'mystery-glitch-truth',
            description: 'You catch up to yourself.',
            effects: [
              { type: 'xp_gain', value: 100, description: '+100 XP' },
              { type: 'trait_gain', stringValue: 'echo_walker', description: 'Trait: Echo Walker' },
              { type: 'tag_gain', stringValue: 'cosmic', description: 'Tag: Cosmic' },
            ],
            narrative: 'The echo turns. It\'s you — from a timeline that didn\'t happen. It smiles, hands you an object that burns with possibility, and fades.',
            isCritical: true,
          },
        ],
        failureOutcomes: [
          {
            id: 'mystery-glitch-lost',
            description: 'Reality frays.',
            effects: [
              { type: 'hp_change', value: -40, description: '-40 HP' },
              { type: 'region_move', stringValue: 'random', description: 'Teleported to random region' },
            ],
            narrative: 'You chase your double through a corridor that shouldn\'t exist. When you stop running, you\'re somewhere else entirely.',
          },
        ],
      },
      {
        id: 'mystery-glitch-ignore',
        label: 'Close your eyes and walk away',
        description: 'Some mysteries are not meant to be solved.',
        riskLevel: 'safe',
        successOutcomes: [
          {
            id: 'mystery-glitch-wisdom',
            description: 'You choose sanity.',
            effects: [
              { type: 'xp_gain', value: 15, description: '+15 XP' },
            ],
            narrative: 'When you open your eyes, the echo is gone. Maybe it was never there. Sometimes the wisest choice is inaction.',
          },
        ],
      },
    ],
  },
];

// ═══════════════════════════════════════════════
// ─── Crisis Events ───
// ═══════════════════════════════════════════════

const CRISIS_EVENTS: StoryEvent[] = [
  {
    id: 'crisis-building-collapse',
    title: 'Structural Cascade',
    description: 'The ground shakes. A tower is coming down — with people inside.',
    category: 'crisis',
    triggerTags: ['heavy', 'speed', 'nature'],
    minTier: 'novice',
    regions: ['neon-nexus', 'titan-foundry', 'shadow-undercity'],
    rarity: 'uncommon',
    repeatable: true,
    flavor: 'You have maybe thirty seconds.',
    visualTheme: 'disaster_urban',
    choices: [
      {
        id: 'crisis-collapse-save',
        label: 'Rush in and save who you can',
        description: 'Risk your life for strangers.',
        riskLevel: 'extreme',
        check: { type: 'combat', target: 'strength', difficulty: 14 },
        successOutcomes: [
          {
            id: 'crisis-collapse-hero',
            description: 'You pull people from the rubble.',
            effects: [
              { type: 'xp_gain', value: 100, description: '+100 XP' },
              { type: 'title_gain', stringValue: 'Rubble Runner', description: 'Title: Rubble Runner' },
              { type: 'reputation_change', target: 'neon-nexus', value: 25, description: 'Heroic reputation +25' },
              { type: 'spawn_ally', stringValue: 'grateful_survivor', description: 'A grateful survivor joins you' },
            ],
            narrative: 'You carry three people out before the final collapse. They look at you like you\'re something more than human. Maybe you are.',
            isCritical: true,
          },
        ],
        failureOutcomes: [
          {
            id: 'crisis-collapse-buried',
            description: 'You\'re caught in the collapse.',
            effects: [
              { type: 'hp_change', value: -60, description: '-60 HP' },
              { type: 'status_change', stringValue: 'injured', description: 'Badly injured' },
            ],
            narrative: 'You save one person before the ceiling gives way. When they dig you out hours later, you can barely breathe.',
            isCritical: true,
          },
        ],
      },
      {
        id: 'crisis-collapse-tech',
        label: 'Use tech to stabilize the structure',
        description: 'Find and hack the building\'s systems.',
        riskLevel: 'high',
        requiredTags: ['tech'],
        check: { type: 'tag', target: 'tech', difficulty: 13 },
        successOutcomes: [
          {
            id: 'crisis-collapse-stabilized',
            description: 'Emergency systems activated.',
            effects: [
              { type: 'xp_gain', value: 80, description: '+80 XP' },
              { type: 'reputation_change', target: 'neon-nexus', value: 15, description: 'Tech hero +15' },
            ],
            narrative: 'You reroute power to emergency supports. The building groans but holds. Everyone gets out alive.',
          },
        ],
        failureOutcomes: [
          {
            id: 'crisis-collapse-overload',
            description: 'Power surge!',
            effects: [
              { type: 'hp_change', value: -30, description: '-30 HP' },
            ],
            narrative: 'The system overloads. You take a shock but the partial stabilization helps. Some people make it out.',
          },
        ],
      },
      {
        id: 'crisis-collapse-evacuate',
        label: 'Organize evacuation',
        description: 'Direct people to safety.',
        riskLevel: 'medium',
        check: { type: 'social', target: 'charisma', difficulty: 9 },
        successOutcomes: [
          {
            id: 'crisis-collapse-ordered',
            description: 'Orderly evacuation.',
            effects: [
              { type: 'xp_gain', value: 50, description: '+50 XP' },
              { type: 'reputation_change', target: 'neon-nexus', value: 10, description: 'Leader rep +10' },
            ],
            narrative: 'Your voice cuts through the panic. You direct, command, calm. People follow. Most make it out.',
          },
        ],
      },
    ],
  },
];

// ═══════════════════════════════════════════════
// ─── Trade Events ───
// ═══════════════════════════════════════════════

const TRADE_EVENTS: StoryEvent[] = [
  {
    id: 'trade-black-market',
    title: 'The Black Market',
    description: 'A hidden bazaar pulses with forbidden goods. Rare tech, cursed artifacts, illegal bioware.',
    category: 'trade',
    triggerTags: ['stealth', 'tech', 'arcane'],
    minTier: 'novice',
    regions: ['shadow-undercity', 'neon-nexus', 'deep-net'],
    rarity: 'common',
    repeatable: true,
    flavor: 'Everything is for sale. EVERYTHING.',
    visualTheme: 'underground_market',
    choices: [
      {
        id: 'trade-market-buy',
        label: 'Browse the exotic wares',
        description: 'See what credits can buy.',
        riskLevel: 'low',
        check: { type: 'luck', target: 'luck', difficulty: 6 },
        successOutcomes: [
          {
            id: 'trade-market-good-find',
            description: 'You find something special.',
            effects: [
              { type: 'item_gain', stringValue: 'exotic-artifact', description: 'Found: Exotic Artifact' },
              { type: 'xp_gain', value: 20, description: '+20 XP' },
            ],
            narrative: 'Among the junk, a gleam catches your eye. This... this is worth ten times what they\'re asking.',
          },
        ],
        failureOutcomes: [
          {
            id: 'trade-market-junk',
            description: 'Nothing but overpriced junk.',
            effects: [
              { type: 'score_change', value: -5, description: 'Wasted credits' },
            ],
            narrative: 'Everything\'s either broken, fake, or both. At least the noodles were good.',
          },
        ],
      },
      {
        id: 'trade-market-gamble',
        label: 'Join the high-stakes game',
        description: 'A card table beckons. Winner takes all.',
        riskLevel: 'high',
        check: { type: 'luck', target: 'luck', difficulty: 14 },
        successOutcomes: [
          {
            id: 'trade-market-jackpot',
            description: 'You clean them out!',
            effects: [
              { type: 'xp_gain', value: 50, description: '+50 XP' },
              { type: 'item_gain', stringValue: 'rare-tech-component', description: 'Won: Rare Tech Component' },
              { type: 'score_change', value: 20, description: '+20 Score (winnings)' },
            ],
            narrative: 'Three hands. Three wins. The table goes quiet. You pocket your winnings and leave before someone reconsiders.',
          },
        ],
        failureOutcomes: [
          {
            id: 'trade-market-bust',
            description: 'The house always wins.',
            effects: [
              { type: 'score_change', value: -15, description: '-15 Score (gambling losses)' },
              { type: 'item_loss', stringValue: 'random', description: 'Lost an item as collateral' },
            ],
            narrative: 'You were sure about that last hand. You were wrong. The dealer smiles with too many teeth.',
          },
        ],
      },
    ],
  },
];

// ═══════════════════════════════════════════════
// ─── Alliance Events ───
// ═══════════════════════════════════════════════

const ALLIANCE_EVENTS: StoryEvent[] = [
  {
    id: 'alliance-lone-warrior',
    title: 'The Lone Warrior',
    description: 'A battle-hardened fighter sits alone, nursing wounds. They carry an ancient weapon.',
    category: 'alliance',
    triggerTags: ['melee', 'brutal', 'heavy', 'divine'],
    minTier: 'adventurer',
    regions: ['wild-sprawl', 'crystal-wastes', 'titan-foundry'],
    rarity: 'uncommon',
    repeatable: false,
    flavor: 'Scars tell stories. Theirs tell a library.',
    visualTheme: 'warrior_campfire',
    choices: [
      {
        id: 'alliance-warrior-help',
        label: 'Offer to help heal their wounds',
        description: 'Show mercy to a stranger.',
        riskLevel: 'low',
        check: { type: 'social', target: 'charisma', difficulty: 7 },
        successOutcomes: [
          {
            id: 'alliance-warrior-friend',
            description: 'A bond forms.',
            effects: [
              { type: 'xp_gain', value: 40, description: '+40 XP' },
              { type: 'spawn_ally', stringValue: 'lone_warrior', description: 'The Lone Warrior becomes an ally' },
              { type: 'relationship_change', target: 'lone-warrior-npc', value: 30, description: 'Strong alliance formed' },
            ],
            narrative: '"You didn\'t have to stop," they say, as you bandage the wound. "Nobody stops." A slow nod. "I remember those who do."',
          },
        ],
        failureOutcomes: [
          {
            id: 'alliance-warrior-suspicious',
            description: 'They don\'t trust easily.',
            effects: [
              { type: 'xp_gain', value: 10, description: '+10 XP' },
            ],
            narrative: '"I don\'t need help." They pull away. But they don\'t attack. Progress, maybe.',
          },
        ],
      },
      {
        id: 'alliance-warrior-challenge',
        label: 'Challenge them to a sparring match',
        description: 'Earn respect through combat.',
        riskLevel: 'medium',
        check: { type: 'combat', target: 'strength', difficulty: 11 },
        successOutcomes: [
          {
            id: 'alliance-warrior-respect',
            description: 'They respect your skill.',
            effects: [
              { type: 'xp_gain', value: 60, description: '+60 XP' },
              { type: 'spawn_ally', stringValue: 'lone_warrior', description: 'The Lone Warrior becomes a mentor' },
              { type: 'trait_gain', stringValue: 'battle_honed', description: 'Trait: Battle Honed' },
            ],
            narrative: 'You fight hard and well. Even when they put you down, you get back up. "Good," they say, offering a hand. "I can teach you more."',
          },
        ],
        failureOutcomes: [
          {
            id: 'alliance-warrior-defeated',
            description: 'Utterly outclassed.',
            effects: [
              { type: 'hp_change', value: -25, description: '-25 HP' },
              { type: 'xp_gain', value: 20, description: '+20 XP (learned from defeat)' },
            ],
            narrative: 'You hit the ground three times in thirty seconds. They walk away without a word. But you learned something.',
          },
        ],
      },
    ],
  },
];

// ═══════════════════════════════════════════════
// ─── Betrayal Events ───
// ═══════════════════════════════════════════════

const BETRAYAL_EVENTS: StoryEvent[] = [
  {
    id: 'betrayal-ally-turns',
    title: 'The Knife in the Back',
    description: 'Someone you trusted leads you into a trap. The smile never reached their eyes.',
    category: 'betrayal',
    triggerTags: ['stealth', 'psychic', 'arcane'],
    minTier: 'adventurer',
    regions: ['shadow-undercity', 'neon-nexus', 'deep-net'],
    rarity: 'rare',
    repeatable: true,
    flavor: 'In hindsight, the signs were always there.',
    visualTheme: 'dark_betrayal',
    conditions: [{ type: 'has_relationship', target: 'any_ally', value: 1 }],
    choices: [
      {
        id: 'betrayal-fight-back',
        label: 'Fight back with everything',
        description: 'Rage fuels you. Make them regret it.',
        riskLevel: 'high',
        check: { type: 'combat', target: 'strength', difficulty: 13 },
        successOutcomes: [
          {
            id: 'betrayal-vengeance',
            description: 'You turn the trap on them.',
            effects: [
              { type: 'xp_gain', value: 80, description: '+80 XP' },
              { type: 'relationship_change', target: 'betrayer', value: -100, description: 'Ally becomes enemy' },
              { type: 'trait_gain', stringValue: 'trust_no_one', description: 'Trait: Trust No One' },
              { type: 'title_gain', stringValue: 'Unbreakable', description: 'Title: Unbreakable' },
            ],
            narrative: 'They expected you to crumble. They expected wrong. You shatter their trap, shatter their plan, and leave them in the wreckage of their own treachery.',
            isCritical: true,
          },
        ],
        failureOutcomes: [
          {
            id: 'betrayal-crushed',
            description: 'The trap was too well planned.',
            effects: [
              { type: 'hp_change', value: -50, description: '-50 HP' },
              { type: 'item_loss', stringValue: 'equipped', description: 'Lost equipped items' },
              { type: 'status_change', stringValue: 'injured', description: 'Badly injured by betrayal' },
            ],
            narrative: 'They knew you too well. Every move anticipated. When the dust settles, you\'re broken and alone.',
            isCritical: true,
          },
        ],
      },
      {
        id: 'betrayal-escape',
        label: 'Escape and regroup',
        description: 'Live to fight another day.',
        riskLevel: 'medium',
        check: { type: 'stat', target: 'speed', difficulty: 10 },
        successOutcomes: [
          {
            id: 'betrayal-escaped',
            description: 'You slip away.',
            effects: [
              { type: 'xp_gain', value: 30, description: '+30 XP' },
              { type: 'spawn_rival', stringValue: 'betrayer', description: 'The betrayer becomes a rival' },
            ],
            narrative: 'You vanish before the trap closes. They\'ll be looking for you. Good. You\'ll be looking for them too.',
          },
        ],
        failureOutcomes: [
          {
            id: 'betrayal-caught-escaping',
            description: 'Almost made it.',
            effects: [
              { type: 'hp_change', value: -35, description: '-35 HP' },
              { type: 'relationship_change', target: 'betrayer', value: -80, description: 'Deep enmity' },
            ],
            narrative: 'A stun bolt catches you mid-stride. They drag you back. It gets worse before it gets better.',
          },
        ],
      },
    ],
  },
];

// ═══════════════════════════════════════════════
// ─── Divine Events ───
// ═══════════════════════════════════════════════

const DIVINE_EVENTS: StoryEvent[] = [
  {
    id: 'divine-cosmic-trial',
    title: 'Trial of the Architect',
    description: 'A being of pure light descends. It speaks in mathematics and emotion. It\'s judging you.',
    category: 'divine',
    triggerTags: ['divine', 'cosmic', 'arcane', 'psychic'],
    minTier: 'champion',
    regions: ['cosmic-shore', 'temple-forgotten-gods', 'void-rift'],
    rarity: 'epic',
    repeatable: false,
    flavor: 'You can\'t tell if it\'s a god, an alien, or a really advanced AI. Maybe all three.',
    visualTheme: 'cosmic_divine',
    choices: [
      {
        id: 'divine-trial-accept',
        label: 'Accept the trial',
        description: 'Face divine judgment.',
        riskLevel: 'extreme',
        check: { type: 'tag', target: 'divine', difficulty: 16 },
        successOutcomes: [
          {
            id: 'divine-trial-worthy',
            description: 'You are deemed WORTHY.',
            effects: [
              { type: 'xp_gain', value: 200, description: '+200 XP' },
              { type: 'power_tier_up', description: 'Power Tier ascends!' },
              { type: 'title_gain', stringValue: 'Architect\'s Chosen', description: 'Title: Architect\'s Chosen' },
              { type: 'trait_gain', stringValue: 'divine_spark', description: 'Trait: Divine Spark' },
            ],
            narrative: 'The being touches your forehead. Reality bends around you. You feel yourself becoming... more. Not bigger, not stronger. MORE. You exist in dimensions you couldn\'t perceive before.',
            isCritical: true,
          },
        ],
        failureOutcomes: [
          {
            id: 'divine-trial-unworthy',
            description: 'Found wanting.',
            effects: [
              { type: 'hp_change', value: -80, description: '-80 HP' },
              { type: 'status_change', stringValue: 'near_death', description: 'Nearly destroyed by divine power' },
              { type: 'trait_gain', stringValue: 'humbled', description: 'Trait: Humbled' },
            ],
            narrative: 'The judgment is swift and absolute. You are NOT ENOUGH. The power crushes you like a thumb pressing an insect. But it lets you live. A lesson.',
            isCritical: true,
          },
        ],
      },
      {
        id: 'divine-trial-defy',
        label: 'Defy the divine being',
        description: '"No one judges me."',
        riskLevel: 'lethal',
        check: { type: 'luck', target: 'luck', difficulty: 18 },
        successOutcomes: [
          {
            id: 'divine-trial-defiance-works',
            description: 'Your defiance... impresses it?!',
            effects: [
              { type: 'xp_gain', value: 300, description: '+300 XP' },
              { type: 'trait_gain', stringValue: 'godkiller', description: 'Trait: Godkiller' },
              { type: 'title_gain', stringValue: 'The Defiant', description: 'Title: The Defiant' },
              { type: 'reputation_change', target: 'cosmic-shore', value: 50, description: 'Legendary reputation' },
            ],
            narrative: '"NO." The word thunders. Reality cracks under your will. The being pauses. Tilts. And then... it laughs. "Finally. Someone interesting."',
            isCritical: true,
          },
        ],
        failureOutcomes: [
          {
            id: 'divine-trial-smited',
            description: 'Fatal hubris.',
            effects: [
              { type: 'death', description: 'Struck down by cosmic power' },
            ],
            narrative: 'You stand against a god. The god does not blink. You cease. This is the ending some stories earn.',
            isCritical: true,
          },
        ],
      },
    ],
  },
];

// ═══════════════════════════════════════════════
// ─── Curse Events ───
// ═══════════════════════════════════════════════

const CURSE_EVENTS: StoryEvent[] = [
  {
    id: 'curse-shadow-mark',
    title: 'The Shadow Mark',
    description: 'A dark symbol appears on your skin overnight. It burns with a cold that isn\'t temperature.',
    category: 'curse',
    triggerTags: ['void', 'arcane', 'stealth', 'cursed'],
    minTier: 'adventurer',
    regions: ['shadow-undercity', 'void-rift', 'temple-forgotten-gods'],
    rarity: 'rare',
    repeatable: false,
    flavor: 'It seems to pulse with your heartbeat. Or is your heartbeat syncing to it?',
    visualTheme: 'dark_curse',
    choices: [
      {
        id: 'curse-mark-embrace',
        label: 'Embrace the darkness',
        description: 'Draw power from the curse.',
        riskLevel: 'extreme',
        check: { type: 'tag', target: 'void', difficulty: 13 },
        successOutcomes: [
          {
            id: 'curse-mark-power',
            description: 'You master the darkness.',
            effects: [
              { type: 'trait_gain', stringValue: 'shadow_marked', description: 'Trait: Shadow Marked (power + curse)' },
              { type: 'xp_gain', value: 80, description: '+80 XP' },
              { type: 'tag_gain', stringValue: 'void', description: 'Tag: Void' },
              { type: 'status_effect', stringValue: 'dark_power', duration: 10, description: 'Dark Power boost for 10 events' },
            ],
            narrative: 'The darkness is a river. You stop fighting the current and learn to swim. Power floods through the mark — terrible, beautiful power.',
            isCritical: true,
          },
        ],
        failureOutcomes: [
          {
            id: 'curse-mark-consumed',
            description: 'The darkness consumes partially.',
            effects: [
              { type: 'hp_change', value: -40, description: '-40 HP' },
              { type: 'status_change', stringValue: 'corrupted', description: 'Corrupted by the mark' },
              { type: 'status_effect', stringValue: 'shadow_drain', duration: 5, description: 'Shadow Drain: -5 HP per event' },
            ],
            narrative: 'You reach for the power and it reaches back. Harder. The darkness now flows BOTH ways.',
            isCritical: true,
          },
        ],
      },
      {
        id: 'curse-mark-purify',
        label: 'Attempt to purify the mark',
        description: 'Seek light to fight the darkness.',
        riskLevel: 'medium',
        requiredTags: ['divine'],
        check: { type: 'tag', target: 'divine', difficulty: 11 },
        successOutcomes: [
          {
            id: 'curse-mark-cleansed',
            description: 'The mark fades.',
            effects: [
              { type: 'xp_gain', value: 60, description: '+60 XP' },
              { type: 'hp_change', value: 20, description: '+20 HP' },
              { type: 'trait_gain', stringValue: 'purified_soul', description: 'Trait: Purified Soul' },
            ],
            narrative: 'Divine light burns through the mark. It screams — not a sound, a feeling. Then silence. Clean, warm silence.',
          },
        ],
        failureOutcomes: [
          {
            id: 'curse-mark-resistant',
            description: 'The curse is too strong to purify.',
            effects: [
              { type: 'hp_change', value: -20, description: '-20 HP' },
              { type: 'status_effect', stringValue: 'shadow_mark_active', duration: 8, description: 'Curse persists for 8 events' },
            ],
            narrative: 'Your power flickers against the mark and fades. The darkness is older than light here.',
          },
        ],
      },
      {
        id: 'curse-mark-ignore',
        label: 'Ignore it and press on',
        description: 'It\'s just a mark. Right? RIGHT?',
        riskLevel: 'medium',
        successOutcomes: [
          {
            id: 'curse-mark-dormant',
            description: 'It lies dormant. For now.',
            effects: [
              { type: 'status_effect', stringValue: 'dormant_curse', duration: 15, description: 'Dormant curse — may activate later' },
            ],
            narrative: 'You wrap it in bandages and march on. It\'s fine. Everything is fine. The whispering will stop eventually.',
          },
        ],
      },
    ],
  },
];

// ═══════════════════════════════════════════════
// ─── Blessing Events ───
// ═══════════════════════════════════════════════

const BLESSING_EVENTS: StoryEvent[] = [
  {
    id: 'blessing-starfall',
    title: 'Starfall',
    description: 'A shard of cosmic energy falls from the sky and lands at your feet. It pulses with warmth.',
    category: 'blessing',
    triggerTags: ['cosmic', 'divine', 'arcane', 'nature'],
    minTier: 'veteran',
    regions: ['cosmic-shore', 'crystal-wastes', 'wild-sprawl'],
    rarity: 'epic',
    repeatable: false,
    flavor: 'The universe just addressed you by name. Your real name. The one you forgot.',
    visualTheme: 'cosmic_blessing',
    choices: [
      {
        id: 'blessing-starfall-absorb',
        label: 'Absorb the cosmic energy',
        description: 'Let the starlight fill you.',
        riskLevel: 'medium',
        check: { type: 'tag', target: 'cosmic', difficulty: 10 },
        successOutcomes: [
          {
            id: 'blessing-starfall-empowered',
            description: 'Stellar energy courses through you.',
            effects: [
              { type: 'hp_change', value: 100, description: 'Full HP restoration' },
              { type: 'xp_gain', value: 150, description: '+150 XP' },
              { type: 'power_tier_up', description: 'Power Tier ascends!' },
              { type: 'trait_gain', stringValue: 'starborn', description: 'Trait: Starborn' },
            ],
            narrative: 'The shard dissolves into you. Every cell sings. You feel the rotation of galaxies, the whisper of dying stars, the first word ever spoken. You are remade.',
            isCritical: true,
          },
        ],
        failureOutcomes: [
          {
            id: 'blessing-starfall-overload',
            description: 'Too much power too fast.',
            effects: [
              { type: 'hp_change', value: -30, description: '-30 HP' },
              { type: 'xp_gain', value: 50, description: '+50 XP (partial absorption)' },
              { type: 'status_effect', stringValue: 'cosmic_overload', duration: 3, description: 'Cosmic Overload' },
            ],
            narrative: 'The energy overwhelms your mortal form. You contain some of it. The rest dissipates painfully.',
          },
        ],
      },
      {
        id: 'blessing-starfall-forge',
        label: 'Forge a weapon from the shard',
        description: 'Shape cosmic energy into a tool.',
        riskLevel: 'low',
        requiredTags: ['tech'],
        check: { type: 'tag', target: 'tech', difficulty: 9 },
        successOutcomes: [
          {
            id: 'blessing-starfall-weapon',
            description: 'You create a legendary weapon.',
            effects: [
              { type: 'item_gain', stringValue: 'starfall-blade', description: 'Legendary: Starfall Blade' },
              { type: 'xp_gain', value: 100, description: '+100 XP' },
            ],
            narrative: 'Your hands move with knowledge you don\'t have. The shard reshapes, compresses, solidifies. A blade of condensed starlight. It hums with purpose.',
            isCritical: true,
          },
        ],
      },
    ],
  },
];

// ═══════════════════════════════════════════════
// ─── Training Events ───
// ═══════════════════════════════════════════════

const TRAINING_EVENTS: StoryEvent[] = [
  {
    id: 'training-arena',
    title: 'The Training Arena',
    description: 'A holographic arena offers combat simulations. No real danger, maximum growth.',
    category: 'training',
    triggerTags: ['melee', 'ranged', 'speed', 'heavy'],
    minTier: 'novice',
    regions: ['neon-nexus', 'titan-foundry', 'sky-citadel'],
    rarity: 'common',
    repeatable: true,
    flavor: 'Sweat is the price of strength.',
    visualTheme: 'high_tech_gym',
    choices: [
      {
        id: 'training-arena-combat',
        label: 'Full combat simulation',
        description: 'Fight holographic enemies at your skill level.',
        riskLevel: 'safe',
        check: { type: 'combat', target: 'strength', difficulty: 8 },
        successOutcomes: [
          {
            id: 'training-arena-progress',
            description: 'You get stronger.',
            effects: [
              { type: 'xp_gain', value: 40, description: '+40 XP' },
            ],
            narrative: 'Round after round, you improve. Faster reactions, harder hits, better instincts. Growth is earned.',
          },
        ],
        failureOutcomes: [
          {
            id: 'training-arena-tough',
            description: 'Still learning.',
            effects: [
              { type: 'xp_gain', value: 20, description: '+20 XP' },
            ],
            narrative: 'You fail the final round but learn from every mistake. That\'s the point.',
          },
        ],
      },
      {
        id: 'training-arena-intense',
        label: '"Nightmare mode"',
        description: 'Set difficulty to maximum. Pain is a teacher.',
        riskLevel: 'medium',
        check: { type: 'combat', target: 'strength', difficulty: 14 },
        successOutcomes: [
          {
            id: 'training-arena-mastery',
            description: 'You conquer the impossible.',
            effects: [
              { type: 'xp_gain', value: 90, description: '+90 XP' },
              { type: 'trait_gain', stringValue: 'arena_master', description: 'Trait: Arena Master' },
            ],
            narrative: 'Nightmare mode. You break through. The leaderboard updates. Your name sits at the top.',
          },
        ],
        failureOutcomes: [
          {
            id: 'training-arena-humbled',
            description: 'Nightmare mode earned its name.',
            effects: [
              { type: 'xp_gain', value: 30, description: '+30 XP' },
              { type: 'hp_change', value: -10, description: '-10 HP (bruises from sim)' },
            ],
            narrative: 'The simulation doesn\'t pull punches. Neither does the floor when you hit it. Repeatedly.',
          },
        ],
      },
    ],
  },
];

// ═══════════════════════════════════════════════
// ─── Boss Events ───
// ═══════════════════════════════════════════════

const BOSS_EVENTS: StoryEvent[] = [
  {
    id: 'boss-neon-dragon',
    title: 'The Neon Dragon',
    description: 'A cybernetic wyrm the size of a skyscraper coils through the city, its chrome scales reflecting a thousand neon advertisements.',
    category: 'boss',
    triggerTags: ['tech', 'mech', 'divine', 'arcane', 'heavy'],
    minTier: 'champion',
    regions: ['neon-nexus', 'sky-citadel'],
    rarity: 'legendary',
    repeatable: false,
    flavor: 'It breathes plasma and thinks in binary. The old myths were right — dragons never died. They upgraded.',
    visualTheme: 'neon_dragon_boss',
    choices: [
      {
        id: 'boss-dragon-face',
        label: 'Face the Neon Dragon',
        description: 'Stand against a legend. This is what heroes do.',
        riskLevel: 'lethal',
        check: { type: 'combat', target: 'strength', difficulty: 18 },
        successOutcomes: [
          {
            id: 'boss-dragon-slain',
            description: 'YOU SLEW THE NEON DRAGON.',
            effects: [
              { type: 'xp_gain', value: 500, description: '+500 XP' },
              { type: 'power_tier_up', description: 'Power Tier ASCENDS!' },
              { type: 'title_gain', stringValue: 'Dragonslayer', description: 'Title: Dragonslayer' },
              { type: 'item_gain', stringValue: 'dragon-core', description: 'Legendary: Dragon Core' },
              { type: 'trait_gain', stringValue: 'dragonblood', description: 'Trait: Dragonblood' },
              { type: 'reputation_change', target: 'neon-nexus', value: 100, description: 'LEGENDARY in Neon Nexus' },
            ],
            narrative: 'You stand on the shattered chrome of its skull. The city below erupts in cheers. Your name will echo through generations. The Dragonslayer. That\'s you now.',
            isCritical: true,
          },
        ],
        failureOutcomes: [
          {
            id: 'boss-dragon-devoured',
            description: 'The dragon is too powerful.',
            effects: [
              { type: 'death', description: 'Incinerated by the Neon Dragon' },
            ],
            narrative: 'Plasma breath. 4000 degrees. You don\'t even have time to scream. The Dragon coils away, unperturbed. It has forgotten you already.',
            isCritical: true,
          },
        ],
      },
      {
        id: 'boss-dragon-hack',
        label: 'Hack into its neural network',
        description: 'It\'s part machine. Machines can be controlled.',
        riskLevel: 'extreme',
        requiredTags: ['tech'],
        check: { type: 'tag', target: 'tech', difficulty: 17 },
        successOutcomes: [
          {
            id: 'boss-dragon-tamed',
            description: 'You reprogram a DRAGON.',
            effects: [
              { type: 'xp_gain', value: 600, description: '+600 XP' },
              { type: 'title_gain', stringValue: 'Dragon Rider', description: 'Title: Dragon Rider' },
              { type: 'trait_gain', stringValue: 'dragon_linked', description: 'Trait: Dragon-Linked (companion)' },
              { type: 'power_tier_up', description: 'Power Tier ASCENDS!' },
            ],
            narrative: 'Your code pierces its firewalls. For a terrifying moment, you and the dragon share a mind. Then it bows. A DRAGON bows to you.',
            isCritical: true,
          },
        ],
        failureOutcomes: [
          {
            id: 'boss-dragon-counter-hack',
            description: 'It counter-hacks YOUR brain.',
            effects: [
              { type: 'hp_change', value: -90, description: '-90 HP' },
              { type: 'status_change', stringValue: 'near_death', description: 'Near death' },
              { type: 'status_effect', stringValue: 'neural_scramble', duration: 5, description: 'Neural Scramble' },
            ],
            narrative: 'The dragon\'s AI is older and smarter. It follows your hack back to your brain and sets fire to your synapses.',
            isCritical: true,
          },
        ],
      },
      {
        id: 'boss-dragon-flee',
        label: 'Run. Just... run.',
        description: 'Discretion is the better part of not being incinerated.',
        riskLevel: 'high',
        check: { type: 'luck', target: 'luck', difficulty: 12 },
        successOutcomes: [
          {
            id: 'boss-dragon-survived',
            description: 'You live to fight another day.',
            effects: [
              { type: 'xp_gain', value: 30, description: '+30 XP' },
            ],
            narrative: 'You run. Fast. The plasma breath misses you by meters. You don\'t stop running for an hour.',
          },
        ],
        failureOutcomes: [
          {
            id: 'boss-dragon-caught-fleeing',
            description: 'Dragons are faster than you think.',
            effects: [
              { type: 'hp_change', value: -70, description: '-70 HP' },
              { type: 'status_change', stringValue: 'injured', description: 'Severely burned' },
            ],
            narrative: 'Its tail catches you like a chrome whip. You fly through two buildings. Living was unexpected.',
          },
        ],
      },
    ],
  },
];

// ═══════════════════════════════════════════════
// ─── Rest Events ───
// ═══════════════════════════════════════════════

const REST_EVENTS: StoryEvent[] = [
  {
    id: 'rest-safe-haven',
    title: 'Safe Haven',
    description: 'You find a secure spot to rest. The sounds of danger feel distant.',
    category: 'rest',
    triggerTags: [],
    minTier: 'novice',
    regions: ['neon-nexus', 'wild-sprawl', 'sky-citadel', 'crystal-wastes'],
    rarity: 'common',
    repeatable: true,
    flavor: 'Sometimes the bravest thing is to stop and breathe.',
    visualTheme: 'peaceful_rest',
    choices: [
      {
        id: 'rest-haven-sleep',
        label: 'Rest and recover',
        description: 'Sleep heals all wounds. Most of them.',
        riskLevel: 'safe',
        successOutcomes: [
          {
            id: 'rest-haven-healed',
            description: 'You wake up stronger.',
            effects: [
              { type: 'hp_change', value: 40, description: '+40 HP' },
              { type: 'xp_gain', value: 10, description: '+10 XP' },
            ],
            narrative: 'For the first time in days, you sleep without dreaming of danger. You wake refreshed.',
          },
        ],
      },
      {
        id: 'rest-haven-meditate',
        label: 'Meditate and reflect',
        description: 'Look inward for strength.',
        riskLevel: 'safe',
        check: { type: 'tag', target: 'psychic', difficulty: 6 },
        successOutcomes: [
          {
            id: 'rest-haven-insight',
            description: 'Inner peace grants clarity.',
            effects: [
              { type: 'hp_change', value: 20, description: '+20 HP' },
              { type: 'xp_gain', value: 30, description: '+30 XP' },
              { type: 'status_effect', stringValue: 'centered', duration: 3, description: 'Centered: +2 to all checks' },
            ],
            narrative: 'In the silence, you find something you didn\'t know you were looking for. A clarity. A purpose.',
          },
        ],
        failureOutcomes: [
          {
            id: 'rest-haven-restless',
            description: 'Mind too restless to meditate.',
            effects: [
              { type: 'hp_change', value: 15, description: '+15 HP' },
              { type: 'xp_gain', value: 10, description: '+10 XP' },
            ],
            narrative: 'Your thoughts chase each other. Rest without meditation. Still better than nothing.',
          },
        ],
      },
      {
        id: 'rest-haven-train',
        label: 'Light training while resting',
        description: 'Practice basic moves.',
        riskLevel: 'safe',
        successOutcomes: [
          {
            id: 'rest-haven-practiced',
            description: 'A little practice goes a long way.',
            effects: [
              { type: 'hp_change', value: 15, description: '+15 HP' },
              { type: 'xp_gain', value: 25, description: '+25 XP' },
            ],
            narrative: 'You rest the body but keep the mind sharp. Every repetition counts.',
          },
        ],
      },
    ],
  },
];

// ═══════════════════════════════════════════════
// ─── Random / Wild Card Events ───
// ═══════════════════════════════════════════════

const RANDOM_EVENTS: StoryEvent[] = [
  {
    id: 'random-dimensional-rift',
    title: 'Dimensional Hiccup',
    description: 'Reality sneezes. You\'re briefly somewhere else entirely. When you come back, something is different.',
    category: 'random',
    triggerTags: ['cosmic', 'void', 'arcane', 'tech'],
    minTier: 'novice',
    regions: ['void-rift', 'deep-net', 'crystal-wastes', 'neon-nexus'],
    rarity: 'uncommon',
    repeatable: true,
    flavor: 'The universe has a sense of humor. A terrible one.',
    visualTheme: 'dimensional_chaos',
    choices: [
      {
        id: 'random-rift-embrace',
        label: 'Lean into the chaos',
        description: 'Let the rift take you somewhere new.',
        riskLevel: 'high',
        check: { type: 'luck', target: 'luck', difficulty: 10 },
        successOutcomes: [
          {
            id: 'random-rift-jackpot',
            description: 'The chaos blesses you!',
            effects: [
              { type: 'xp_gain', value: 70, description: '+70 XP' },
              { type: 'trait_gain', stringValue: 'chaos_touched', description: 'Trait: Chaos Touched' },
              { type: 'item_gain', stringValue: 'dimensional-fragment', description: 'Item: Dimensional Fragment' },
            ],
            narrative: 'You let go of "where" and embrace "everywhere." When you snap back, you\'re different. Better? Different. Definitely different.',
          },
        ],
        failureOutcomes: [
          {
            id: 'random-rift-bad',
            description: 'Chaos is... chaotic.',
            effects: [
              { type: 'hp_change', value: -30, description: '-30 HP' },
              { type: 'region_move', stringValue: 'random', description: 'Teleported somewhere random' },
            ],
            narrative: 'You bounce through three realities in two seconds. One of them was on fire. You come back smoking and confused.',
          },
        ],
      },
      {
        id: 'random-rift-resist',
        label: 'Anchor yourself',
        description: 'Focus on staying HERE.',
        riskLevel: 'safe',
        successOutcomes: [
          {
            id: 'random-rift-safe',
            description: 'You stay put.',
            effects: [
              { type: 'xp_gain', value: 15, description: '+15 XP' },
            ],
            narrative: 'You grab onto something solid and hold on until reality straightens out. Boring but alive.',
          },
        ],
      },
    ],
  },
];

// ═══════════════════════════════════════════════
// ─── Master Event Registry ───
// ═══════════════════════════════════════════════

/** All story events, indexed by ID */
export const ALL_STORY_EVENTS: StoryEvent[] = [
  ...COMBAT_EVENTS,
  ...SOCIAL_EVENTS,
  ...EXPLORATION_EVENTS,
  ...MYSTERY_EVENTS,
  ...CRISIS_EVENTS,
  ...TRADE_EVENTS,
  ...ALLIANCE_EVENTS,
  ...BETRAYAL_EVENTS,
  ...DIVINE_EVENTS,
  ...CURSE_EVENTS,
  ...BLESSING_EVENTS,
  ...TRAINING_EVENTS,
  ...BOSS_EVENTS,
  ...REST_EVENTS,
  ...RANDOM_EVENTS,
];

/** Lookup event by ID */
export function getStoryEvent(id: string): StoryEvent | undefined {
  return ALL_STORY_EVENTS.find((e) => e.id === id);
}

/** Get all events for a specific category */
export function getEventsByCategory(category: string): StoryEvent[] {
  return ALL_STORY_EVENTS.filter((e) => e.category === category);
}

/** Filter events that match a character's current context */
export function getEligibleEvents(
  category: string,
  characterTags: string[],
  region: string,
  powerTier: string
): StoryEvent[] {
  const tierOrder = [
    'novice', 'adventurer', 'veteran', 'champion',
    'hero', 'legend', 'mythic', 'ascendant',
  ];
  const charTierIdx = tierOrder.indexOf(powerTier);

  return ALL_STORY_EVENTS.filter((event) => {
    // Category must match
    if (event.category !== category) return false;

    // Power tier check
    const minIdx = tierOrder.indexOf(event.minTier);
    if (charTierIdx < minIdx) return false;
    if (event.maxTier) {
      const maxIdx = tierOrder.indexOf(event.maxTier);
      if (charTierIdx > maxIdx) return false;
    }

    // Region check (empty means global)
    if (event.regions.length > 0 && !event.regions.includes(region)) return false;

    return true;
  });
}

/** Count total event templates */
export function getTotalEventCount(): number {
  return ALL_STORY_EVENTS.length;
}
