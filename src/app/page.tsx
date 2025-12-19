import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import Login from "./(pages)/login/page";

export default function Home() {
  const x = 10;
  return (
    <>
      <div>hello</div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <div>
        <Button>Click me</Button>
      </div>
    </>
  );
}
