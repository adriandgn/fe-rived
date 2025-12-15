import { CreateDesignForm } from "@/components/create/create-design-form";

export default function CreateDesignPage() {
    return (
        <div className="container mx-auto py-10 px-4">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold tracking-tight">Share Your Redesign</h1>
                <p className="text-muted-foreground mt-2">
                    Show the community what you made and how you made it.
                </p>
            </div>

            <div className="bg-card border rounded-xl p-6 md:p-8 shadow-sm max-w-2xl mx-auto">
                <CreateDesignForm />
            </div>
        </div>
    );
}
