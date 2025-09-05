"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const testRoles = [
  { value: "ACTOR", label: "Actor" },
  { value: "DIRECTOR", label: "Director" },
  { value: "PRODUCER", label: "Producer" },
];

export default function TestDropdownPage() {
  const [selectedRole, setSelectedRole] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-900 dark:to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center">Test Dropdown</h1>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Role:</label>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {testRoles.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-center">
          <p>Selected: {selectedRole || "None"}</p>
        </div>

        <Button 
          onClick={() => setSelectedRole("")}
          className="w-full"
        >
          Clear Selection
        </Button>
      </div>
    </div>
  );
}
