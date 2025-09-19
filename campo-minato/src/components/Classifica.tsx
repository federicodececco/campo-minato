const fake = [
  {
    name: "gigio",
    punteggio: 30,
  },
  {
    name: "gigetto",
    punteggio: 40,
  },
  {
    name: "gigione",
    punteggio: 10,
  },
  {
    name: "gigigigiato",
    punteggio: 20,
  },
];

export default function Classifica() {
  return (
    <>
      <section className="bg-purple-300 py-20 px-30 rounded-2xl rounded-t-none w-full h-full">
        <div className="grid grid-cols-15 text-center text-yellow-700 text-xl border-b-2 border-l-2 border-r-2">
          {fake.map((elem, index) => {
            return (
              <>
                <div className="col-span-1 py-2 border-t-2 px-2">
                  {index + 1 + "°"}
                </div>
                <div className="col-span-9 py-2 border-t-2">{elem.name}</div>
                <div className="col-span-5 py-2 border-t-2">
                  {elem.punteggio}
                </div>
              </>
            );
          })}
        </div>
      </section>
    </>
  );
}
