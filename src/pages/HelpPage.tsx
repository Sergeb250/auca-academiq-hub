import { AppLayout } from "@/components/AppLayout";
import { BookOpen, HelpCircle, MessageSquare, FileText, CalendarDays, Shield } from "lucide-react";

const faqs = [
  { q: "How do I reserve a project memoir?", a: "Navigate to the project detail page, go to the 'Memoir' tab, and click 'Request Reservation'. Choose an available time slot and confirm. You'll receive an email confirmation." },
  { q: "What are the regulated access hours?", a: "The memoir viewer is available Monday through Friday, 8:00 AM to 5:00 PM. Outside these hours, reservations cannot be made." },
  { q: "How many active reservations can I have?", a: "You can have up to 3 active reservations at any time. Past reservations don't count toward this limit." },
  { q: "How do I submit my final year project?", a: "Go to 'Submit Project' from the sidebar. Follow the 3-step wizard: fill in metadata, upload your memoir PDF, and connect your GitHub repository." },
  { q: "What file formats are accepted?", a: "Only PDF files are accepted for memoirs and publications. Maximum file size is 50MB." },
  { q: "How long does moderation take?", a: "Most submissions are reviewed within 1-3 business days. You'll receive a notification once your submission has been reviewed." },
  { q: "Can I request a renewal for an expired reservation?", a: "Yes, go to My Reservations → Past tab and click 'Request Renewal'. Renewals are subject to availability and admin approval." },
  { q: "How do I connect my GitHub repository?", a: "During the project submission process (Step 3), click 'Connect GitHub' to authorize with your GitHub account, then select your repository." },
];

const HelpPage = () => {
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-primary rounded-xl p-6 text-center">
          <HelpCircle className="w-10 h-10 text-primary-foreground mx-auto mb-3" />
          <h1 className="text-xl font-heading font-bold text-primary-foreground">Help Center</h1>
          <p className="text-primary-foreground/70 text-sm mt-1">Find answers to common questions about AUCA Connect Publication Hub</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: BookOpen, label: "Browse Repository", desc: "Find projects and publications" },
            { icon: FileText, label: "Submit Work", desc: "Upload projects or papers" },
            { icon: CalendarDays, label: "Reservations", desc: "Reserve memoir access" },
          ].map((c) => (
            <div key={c.label} className="bg-card rounded-xl border border-border p-5 card-shadow text-center">
              <c.icon className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-heading font-semibold text-foreground text-sm">{c.label}</h3>
              <p className="text-xs text-muted-foreground mt-1">{c.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-xl border border-border card-shadow">
          <div className="p-5 border-b border-border">
            <h2 className="font-heading font-semibold text-foreground">Frequently Asked Questions</h2>
          </div>
          <div className="divide-y divide-border">
            {faqs.map((faq, i) => (
              <details key={i} className="group">
                <summary className="px-5 py-4 cursor-pointer text-sm font-medium text-foreground hover:bg-muted/30 transition-colors list-none flex items-center justify-between">
                  {faq.q}
                  <span className="text-muted-foreground group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <div className="px-5 pb-4 text-sm text-muted-foreground">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 card-shadow text-center">
          <MessageSquare className="w-8 h-8 text-primary mx-auto mb-3" />
          <h3 className="font-heading font-semibold text-foreground">Still need help?</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">Contact the IT Help Desk for assistance</p>
          <p className="text-sm text-primary font-medium">helpdesk@auca.ac.rw</p>
          <p className="text-xs text-muted-foreground mt-1">Mon–Fri, 8:00 AM – 5:00 PM</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default HelpPage;
