interface CardInterface {
  turned: boolean;
  proximity: number;
  bomba: boolean;
  explosion: Function;
}

export default function Card({
  turned,
  proximity,
  bomba,
  explosion,
}: CardInterface) {
  if (turned && bomba) {
    explosion();
    return (
      <>
        <div className="bg-black w-8 h-8">
          <div> </div>
        </div>
      </>
    );
  }
  if (turned) {
    return (
      <>
        <div className="bg-red-900 w-8 h-8">
          <div> {proximity}</div>
        </div>
      </>
    );
  }
  if (!turned) {
    return (
      <>
        <div className="bg-red-500 w-8 h-8">
          <div></div>
        </div>
      </>
    );
  }
}
