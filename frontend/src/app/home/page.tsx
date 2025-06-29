import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Banknote } from "lucide-react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeModeToggle from "@/components/theme-mode-toggle";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="home home-container p-5">
        <header className="header flex flex-row justify-between align-middle items-center p-2">
          <div className="flex flex-row gap-5">
            <Banknote color="green" size={25} />
            <h1 className="font-black">Expense Ledger </h1>
          </div>
          <div className="flex flex-row gap-2">
            <Link href="/login" passHref>
              <Button variant="default" className="cursor-pointer">Log In</Button>
            </Link>
            <ThemeModeToggle />
          </div>
        </header>
      </div>
    </>
  );
}
