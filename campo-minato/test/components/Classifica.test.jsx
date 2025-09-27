import { render, screen, fireEvent } from "@testing-library/react";
import Classifica from "@/components/Classifica";
import { useGameStateContext } from "@/context/GameStateContext";

jest.mock("@/context/GameStateContext", () => ({
  useGameStateContext: jest.fn(),
}));
jest.mock("lucide-react", () => ({
  Medal: () => <div data-testid="medal-icon">Medal</div>,
  Trophy: () => <div data-testid="trophy-icon">Trophy</div>,
}));

describe("Classifica component", () => {
  const mockUseGameStateContext = useGameStateContext;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("loading state", () => {
    it("should show loading when fetchedLeaderBoard is null", () => {
      mockUseGameStateContext.mockReturnValue({
        fetchedLeaderBoard: null,
      });

      render(<Classifica />);
      expect(screen.getByText(/caricamento classifica/i)).toBeInTheDocument();
    });
  });

  describe("empty state", () => {
    it("should show empty leaderboard message when there are no scores", () => {
      mockUseGameStateContext.mockReturnValue({
        fetchedLeaderBoard: [],
      });

      render(<Classifica />);
      expect(screen.getByText("Nessun punteggio salvato")).toBeInTheDocument();
      expect(screen.getByText("Inizia una nuova partita")).toBeInTheDocument();
    });
  });

  describe("leaderboard retrieved status", () => {
    const mockLeaderboard = [
      { username: "gigino", score: 40, difficulty: "easy", time: 5 },
      { username: "gigetto", score: 0, difficulty: "easy", time: 145 },
      { username: "gigione", score: 1000, difficulty: "easy", time: 900 },
      { username: "gigiatto", score: 2, difficulty: "easy", time: 940 },
    ];

    beforeEach(() => {
      mockUseGameStateContext.mockReturnValue({
        fetchedLeaderBoard: mockLeaderboard,
      });
    });

    it("should correctly render score list", () => {
      render(<Classifica />);

      expect(screen.getByText("Giocatore")).toBeInTheDocument();
      expect(screen.getByText("Punti")).toBeInTheDocument();
      expect(screen.getByText("Tempo")).toBeInTheDocument();

      expect(screen.getByText("gigino")).toBeInTheDocument();
      expect(screen.getByText("gigione")).toBeInTheDocument();
      expect(screen.getByText("gigetto")).toBeInTheDocument();
      expect(screen.getByText("gigiatto")).toBeInTheDocument();

      expect(screen.getByText("40")).toBeInTheDocument();
      expect(screen.getByText("0")).toBeInTheDocument();
      expect(screen.getByText(/1[,.]?000/)).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
    });

    it("should format correctly time scores", () => {
      render(<Classifica />);

      expect(screen.getByText("00:05")).toBeInTheDocument();
      expect(screen.getByText("02:25")).toBeInTheDocument();
      expect(screen.getByText("15:00")).toBeInTheDocument();
      expect(screen.getByText("15:40")).toBeInTheDocument();
    });

    it("should show correct ranking positions", () => {
      render(<Classifica />);

      expect(screen.getByText("1°")).toBeInTheDocument();
      expect(screen.getByText("2°")).toBeInTheDocument();
      expect(screen.getByText("3°")).toBeInTheDocument();

      expect(screen.getByText("Primo!")).toBeInTheDocument();
      expect(screen.getByText("Secondo!")).toBeInTheDocument();
      expect(screen.getByText("Terzo!")).toBeInTheDocument();
    });
  });
});
