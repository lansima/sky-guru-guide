import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plane, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AircraftManagement from "@/components/admin/AircraftManagement";
import DocumentManagement from "@/components/admin/DocumentManagement";

export default function Admin() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Library
            </Link>
            <div className="h-6 w-px bg-border" />
            <h1 className="text-xl font-semibold text-foreground">Admin Panel</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="aircraft" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="aircraft" className="flex items-center gap-2">
              <Plane className="h-4 w-4" />
              Aircraft
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="aircraft">
            <AircraftManagement />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
