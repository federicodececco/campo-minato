import { GoogleGenerativeAI } from "@google/generative-ai";

const ai = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
export interface GameStats {
  score: number;
  time: number;
  difficulty: string;
  totalCells: number;
  revealedCells: number;
  flagsUsed: number;
  bombsFound: number;
  victory: boolean;
  explosions: number;
  perfectMoves: number;
  riskyMoves: number;
}

export interface GameEvent {
  type:
    | "cell_revealed"
    | "flag_placed"
    | "bomb_exploded"
    | "game_won"
    | "game_lost"
    | "near_miss";
  timestamp: number;
  description: string;
  riskLevel?: "low" | "medium" | "high";
}

export class GameNarrator {
  private model;
  private gameEvents: GameEvent[] = [];

  constructor() {
    this.model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  addGameEvent(event: GameEvent) {
    this.gameEvents.push({
      ...event,
      timestamp: Date.now(),
    });
  }

  async generateGameNarration(gameStats: GameStats): Promise<string> {
    const prompt = this.createNarrationPrompt(gameStats);

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Errore nella generazione della narrazione:", error);
      return this.getFallbackNarration(gameStats);
    }
  }

  async generateLiveCommentary(
    event: GameEvent,
    currentStats: Partial<GameStats>
  ): Promise<string> {
    const prompt = this.createLiveCommentaryPrompt(event, currentStats);

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Errore nella generazione del commento:", error);
      return this.getFallbackCommentary(event);
    }
  }

  private createNarrationPrompt(gameStats: GameStats): string {
    const eventsDescription = this.gameEvents
      .map(
        (event) =>
          `${event.type}: ${event.description} (Rischio: ${event.riskLevel || "N/A"})`
      )
      .join("\n");

    return `
Sei un narratore esperto di videogiochi. Crea una narrazione coinvolgente e drammatica di questa partita a Campo Minato.

STATISTICHE PARTITA:
- Risultato: ${gameStats.victory ? "VITTORIA" : "SCONFITTA"}
- Punteggio: ${gameStats.score}
- Tempo: ${Math.floor(gameStats.time / 60)}:${(gameStats.time % 60).toString().padStart(2, "0")}
- Difficoltà: ${gameStats.difficulty}
- Celle totali: ${gameStats.totalCells}
- Celle rivelate: ${gameStats.revealedCells}
- Bandiere usate: ${gameStats.flagsUsed}
- Bombe trovate: ${gameStats.bombsFound}
- Esplosioni: ${gameStats.explosions}
- Mosse perfette: ${gameStats.perfectMoves}
- Mosse rischiose: ${gameStats.riskyMoves}

EVENTI PRINCIPALI:
${eventsDescription}

ISTRUZIONI:
- Scrivi in italiano
- Usa uno stile drammatico e coinvolgente, come un commentatore sportivo
- Massimo 3-4 paragrafi
- Includi momenti di tensione, successi e (se applicabile) il momento della sconfitta
- Usa metafore e linguaggio evocativo
- Conclude con una valutazione della performance del giocatore
`;
  }

  private createLiveCommentaryPrompt(
    event: GameEvent,
    currentStats: Partial<GameStats>
  ): string {
    return `
Sei un commentatore in tempo reale di Campo Minato. Genera un commento breve (max 1-2 frasi) per questo evento:

EVENTO: ${event.type}
DESCRIZIONE: ${event.description}
LIVELLO RISCHIO: ${event.riskLevel || "N/A"}

STATISTICHE ATTUALI:
- Punteggio: ${currentStats.score || 0}
- Tempo: ${currentStats.time || 0} secondi
- Difficoltà: ${currentStats.difficulty || "N/A"}

STILE:
- Italiano
- Entusiastico ma conciso
- Come un commentatore sportivo
- Adatto al livello di rischio dell'azione
`;
  }

  private getFallbackNarration(gameStats: GameStats): string {
    if (gameStats.victory) {
      return `Che partita incredibile! In ${Math.floor(gameStats.time / 60)} minuti e ${gameStats.time % 60} secondi hai conquistato la vittoria con ${gameStats.score} punti. La tua strategia si è rivelata vincente navigando attraverso ${gameStats.totalCells} celle in modalità ${gameStats.difficulty}. Una performance da vero maestro del Campo Minato!`;
    } else {
      return `Una battaglia coraggiosa che si conclude dopo ${Math.floor(gameStats.time / 60)} minuti e ${gameStats.time % 60} secondi. Hai raccolto ${gameStats.score} punti prima che il destino decidesse diversamente. In modalità ${gameStats.difficulty}, ogni mossa era una sfida, e hai dimostrato grande determinazione. La vittoria ti aspetta nella prossima partita!`;
    }
  }

  private getFallbackCommentary(event: GameEvent): string {
    const commentaries = {
      cell_revealed: "Mossa strategica!",
      flag_placed: "Bandiera piazzata con saggezza!",
      bomb_exploded: "Oh no! Esplosione!",
      game_won: "VITTORIA INCREDIBILE!",
      game_lost: "Che partita emozionante!",
      near_miss: "Per un pelo!",
    };

    return commentaries[event.type] || "Interessante sviluppo!";
  }

  resetEvents() {
    this.gameEvents = [];
  }

  getEventStats() {
    return {
      totalEvents: this.gameEvents.length,
      riskDistribution: this.gameEvents.reduce(
        (acc, event) => {
          if (event.riskLevel) {
            acc[event.riskLevel] = (acc[event.riskLevel] || 0) + 1;
          }
          return acc;
        },
        {} as Record<string, number>
      ),
      eventTypes: this.gameEvents.reduce(
        (acc, event) => {
          acc[event.type] = (acc[event.type] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ),
    };
  }
}
