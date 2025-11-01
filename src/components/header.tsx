import { Mountain, PlusCircle, Bell, User, Settings, LogOut, LayoutDashboard, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/match" className="mr-6 flex items-center gap-2">
          <Mountain className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline text-lg">APP Campus</span>
        </Link>
        <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
             <Link href="/dashboard" className="text-muted-foreground transition-colors hover:text-foreground">
                Dashboard
             </Link>
             <Link href="/events" className="text-muted-foreground transition-colors hover:text-foreground">
                Événements
             </Link>
             <Link href="/coworking" className="text-muted-foreground transition-colors hover:text-foreground">
                Espaces
             </Link>
             <Link href="/annonces" className="text-muted-foreground transition-colors hover:text-foreground">
                Annonces
             </Link>
             <Link href="/verification" className="text-muted-foreground transition-colors hover:text-foreground">
                Vérification
             </Link>
             <Link href="/messages" className="text-muted-foreground transition-colors hover:text-foreground">
                Messages
             </Link>
        </nav>
        <div className="flex items-center gap-4 ml-auto">
          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <Link href="/notifications">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
            </Link>
          </Button>
          <Button asChild>
            <Link href="/events/create">
                <PlusCircle className="mr-2 h-5 w-5" />
                Créer un événement
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="https://placehold.co/100x100.png" alt="Alex" data-ai-hint="profile picture" />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
               <DropdownMenuItem asChild>
                <Link href="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile/me">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/verification">
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    <span>Vérification</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Paramètres</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/login">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
