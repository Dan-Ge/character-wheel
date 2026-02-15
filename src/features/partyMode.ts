// ── Party / Duo Mode ──
// Manages shared-screen duo spins where two players alternate wheels.

export interface DuoState {
  player1Name: string;
  player2Name: string;
  currentPlayer: 1 | 2;
  player1WheelIndices: number[];
  player2WheelIndices: number[];
}

export function createDuoState(
  p1Name: string = 'Player 1',
  p2Name: string = 'Player 2',
  totalWheels: number = 7
): DuoState {
  // Alternate wheels between players
  const p1: number[] = [];
  const p2: number[] = [];
  for (let i = 0; i < totalWheels; i++) {
    if (i % 2 === 0) p1.push(i);
    else p2.push(i);
  }

  return {
    player1Name: p1Name,
    player2Name: p2Name,
    currentPlayer: 1,
    player1WheelIndices: p1,
    player2WheelIndices: p2,
  };
}

export function getCurrentPlayerName(state: DuoState): string {
  return state.currentPlayer === 1 ? state.player1Name : state.player2Name;
}

export function getPlayerForWheel(state: DuoState, wheelIndex: number): 1 | 2 {
  if (state.player1WheelIndices.includes(wheelIndex)) return 1;
  return 2;
}

export function advanceDuoTurn(state: DuoState): DuoState {
  return {
    ...state,
    currentPlayer: state.currentPlayer === 1 ? 2 : 1,
  };
}
