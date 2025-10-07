import { CalendarDays, Users, Cpu, Clock } from "lucide-react";

export default function Features() {
  const features = [
    { icon: CalendarDays, title: "Auto Scheduling", desc: "Generate conflict-free timetables instantly." },
    { icon: Users, title: "Role Management", desc: "Admins, Professors, and Students have personalized dashboards." },
    { icon: Cpu, title: "AI Optimization", desc: "Use OR-Tools to compute optimal schedules." },
    { icon: Clock, title: "Real-time Updates", desc: "View instant changes across all users." }
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-10 py-16 bg-gray-50">
      {features.map((feature, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition"
        >
          <feature.icon className="mx-auto text-green-500" size={40} />
          <h3 className="text-lg font-semibold mt-4 text-blue-800">{feature.title}</h3>
          <p className="text-sm text-gray-600 mt-2">{feature.desc}</p>
        </div>
      ))}
    </section>
  );
}