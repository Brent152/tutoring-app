
import { Button } from "./ui/button";
import Link from "next/link";
import { ModeToggle } from "./ui/mode-toggle";

export function TopNav() {

    return (
        <nav className="flex w-full items-center justify-between p-4 text-xl font-semibold border-b">
            <Link href="/">Home</Link>
            <div className='flex gap-4'>
                <Link href="/database-management">DB Management</Link>
                <ModeToggle />
            </div>
        </nav>
    );
}