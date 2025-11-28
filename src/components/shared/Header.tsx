import { User } from "lucide-react";

export function Header() {
    return (
        <div className="border-b">
            <div className="flex h-16 items-center px-4">
                <div className="ml-auto flex items-center space-x-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Agent Demo</span>
                        <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
                            <User className="h-5 w-5 text-slate-500" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
