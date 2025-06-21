import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, UserPlus, CalendarCheck } from "lucide-react";

const notifications = [
    {
        id: 1,
        icon: <UserPlus className="h-6 w-6 text-primary" />,
        text: "Marie Curie vous a envoyé une demande de match.",
        time: "Il y a 5 minutes",
    },
    {
        id: 2,
        icon: <CalendarCheck className="h-6 w-6 text-green-500" />,
        text: "Votre événement 'Hackathon: Créer une app' commence demain.",
        time: "Il y a 1 heure",
    },
];

export default function NotificationsPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl font-bold font-headline mb-8">Notifications</h1>
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Vos notifications récentes</CardTitle>
            </CardHeader>
            <CardContent>
                {notifications.length > 0 ? (
                    <ul className="space-y-1">
                        {notifications.map((notif) => (
                            <li key={notif.id} className="flex items-start gap-4 p-4 rounded-lg hover:bg-accent -mx-4">
                                <div className="mt-1">{notif.icon}</div>
                                <div className="flex-1">
                                    <p>{notif.text}</p>
                                    <p className="text-sm text-muted-foreground">{notif.time}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                     <div className="text-center py-12 text-muted-foreground">
                        <Bell className="h-12 w-12 mx-auto mb-4" />
                        <p>Vous n'avez aucune nouvelle notification.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  )
}
