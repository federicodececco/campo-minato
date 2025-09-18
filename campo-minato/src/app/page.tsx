import { Grid, generateGrid } from "@/lib/gridUtils";
import GridForm from "@/components/GridForm";
export default function Home() {
  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Campo Minato</h1>
        <GridForm></GridForm>
      </div>
    </>
  );
}
