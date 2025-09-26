import { render, screen, fireEvent } from "@testing-library/react";
import Card from "@/components/Card";

describe("Card Component", () => {
  const testExplosion = jest.fn();
  const testRightClick = jest.fn();

  beforeEach(() => {
    testExplosion.mockClear();
    testRightClick.mockClear();
  });

  it("shows bomb when it's turned and has a bomb", () => {
    render(
      <Card
        turned={true}
        proximity={0}
        bomba={true}
        explosion={testExplosion}
        onRightClick={testRightClick}
        flag={false}
      />
    );
    expect(testExplosion).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("bomb-icon")).toBeInTheDocument();
  });
  it("shows proximity when turned", () => {
    render(
      <Card
        turned={true}
        proximity={2}
        bomba={false}
        explosion={testExplosion}
        onRightClick={testRightClick}
        flag={false}
      />
    );
    expect(testExplosion).toHaveBeenCalledTimes(0);
    expect(screen.getByText("2")).toBeInTheDocument();
  });
  it("handles correctly right click", () => {
    render(
      <Card
        turned={false}
        proximity={0}
        bomba={false}
        explosion={testExplosion}
        onRightClick={testRightClick}
        flag={false}
      />
    );
    const card = screen.getByTestId("card");
    fireEvent.contextMenu(card);

    expect(testRightClick).toHaveBeenCalledTimes(1);
  });
});
