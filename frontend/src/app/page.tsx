import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";

export default function Home() {
  return (
    <div className="h-[500px] flex justify-center items-center bg-primary text-primary-foreground">
      <Button variant="outline" className="text-amber-800">Click Me!</Button>
    </div>
  );
}
