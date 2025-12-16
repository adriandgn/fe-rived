"use client";

import { Mail, Globe, MapPin } from "lucide-react";
import { Profile } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface DesignerHeaderProps {
    profile: Profile;
}

export function DesignerHeader({ profile }: DesignerHeaderProps) {
    return (
        <div className="flex flex-col items-center text-center space-y-4">
            <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback className="text-4xl text-muted-foreground">
                    {profile.username.substring(0, 1).toUpperCase()}
                </AvatarFallback>
            </Avatar>

            <div className="space-y-2">
                <h1 className="text-3xl font-bold">{profile.full_name || profile.username}</h1>
                <p className="text-muted-foreground font-medium">@{profile.username}</p>

                {profile.bio && (
                    <p className="max-w-md text-sm text-muted-foreground leading-relaxed mx-auto">
                        {profile.bio}
                    </p>
                )}
            </div>

            <div className="flex items-center gap-3 pt-2">
                {profile.email && (
                    <Button variant="outline" size="sm" asChild>
                        <a href={`mailto:${profile.email}`}>
                            <Mail className="h-4 w-4 mr-2" />
                            Contact
                        </a>
                    </Button>
                )}

                {profile.website && (
                    <Button variant="secondary" size="sm" className="rounded-full px-4 h-8" asChild>
                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                            <Globe className="h-3.5 w-3.5" />
                            <span className="text-xs font-medium">Website</span>
                        </a>
                    </Button>
                )}
            </div>
        </div>
    );
}
