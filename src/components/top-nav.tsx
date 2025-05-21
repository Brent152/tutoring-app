
import { BookMarkedIcon, DatabaseIcon, HomeIcon } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "./ui/mode-toggle";

export function TopNav() {

    return (
        <nav className="flex w-full items-center justify-between p-4 text-xl font-semibold border-b">
            <Link href="/"><HomeIcon /></Link>
            <div className='flex gap-4 items-center'>
                <Link href="/saved-sessions"><BookMarkedIcon /></Link>
                {/* <Link href="/database-management"><DatabaseIcon /></Link> */}
                <ModeToggle />
            </div>
        </nav>
    );
}