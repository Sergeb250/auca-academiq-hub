import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";

const courseMaterials = [
  { id: "m1", course: "CS301", title: "CS301 Course Outline and Syllabus 2025", type: "Course Outline", uploadedAt: "Jan 10, 2025", size: "2.4 MB" },
  { id: "m2", course: "CS301", title: "Lecture 1: Intro to Software Engineering", type: "Lecture Notes", uploadedAt: "Feb 02, 2025", size: "5.1 MB" },
  { id: "m3", course: "CS301", title: "Assignment 1 Marking Scheme", type: "Marking Scheme", uploadedAt: "Mar 01, 2025", size: "1.2 MB" },
  { id: "m4", course: "IT201", title: "IT201 Full Syllabus", type: "Course Outline", uploadedAt: "Jan 12, 2025", size: "1.8 MB" },
  { id: "m5", course: "IT201", title: "Lecture 4: React Components (Slides)", type: "Lecture Notes", uploadedAt: "Feb 15, 2025", size: "8.4 MB" },
];

const LecturerCourseMaterialsPage = () => {
  const [isUploading, setIsUploading] = useState(false);
  
  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      toast.success("Course material uploaded successfully");
    }, 1500);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-heading font-bold text-foreground">Course Materials</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Upload and manage course outlines, lecture notes, and marking schemes.
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Upload Material</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Upload Course Material</DialogTitle>
                <DialogDescription>Add a new document to your course repository.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpload} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Course</Label>
                  <Select required>
                    <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CS301">CS301 - Software Engineering</SelectItem>
                      <SelectItem value="IT201">IT201 - Web Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Material Type</Label>
                  <Select required>
                    <SelectTrigger><SelectValue placeholder="Select document type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="outline">Course Outline / Syllabus</SelectItem>
                      <SelectItem value="notes">Lecture Notes (PDF/Slides)</SelectItem>
                      <SelectItem value="scheme">Marking Scheme</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Document Title</Label>
                  <Input required placeholder="e.g. Chapter 1 Slides" />
                </div>
                <div className="space-y-2">
                  <Label>File Upload</Label>
                  <Input type="file" required className="cursor-pointer" />
                </div>
                <div className="pt-2 flex justify-end">
                  <Button type="submit" disabled={isUploading}>
                    {isUploading ? "Uploading..." : "Upload Document"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-heading">Uploaded Materials</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px] uppercase tracking-wider">Title</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider">Course</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider">Type</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider">Size</TableHead>
                  <TableHead className="text-right text-[11px] uppercase tracking-wider">Uploaded</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courseMaterials.map(m => (
                  <TableRow key={m.id}>
                    <TableCell className="text-xs font-semibold text-foreground">{m.title}</TableCell>
                    <TableCell className="text-xs font-medium text-foreground">{m.course}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-[10px] ${
                        m.type === "Course Outline" ? "bg-purple-50 text-purple-700 border-purple-200" :
                        m.type === "Lecture Notes" ? "bg-blue-50 text-blue-700 border-blue-200" :
                        "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}>
                        {m.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[10px] text-muted-foreground">{m.size}</TableCell>
                    <TableCell className="text-right text-[10px] text-muted-foreground">{m.uploadedAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default LecturerCourseMaterialsPage;
