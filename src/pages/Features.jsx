import { CalendarDays, Users, Cpu, Clock, Shield, BarChart3, Zap, Smartphone } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Features() {
  const mainFeatures = [
    {
      icon: CalendarDays,
      title: "Intelligent Auto-Scheduling",
      description: "AI-powered algorithm that automatically generates conflict-free timetables while considering faculty preferences, room availability, and student requirements.",
      highlights: ["Conflict Detection", "Optimal Resource Allocation", "Real-time Updates"]
    },
    {
      icon: Users,
      title: "Multi-Role Dashboard",
      description: "Tailored interfaces for Students, Faculty, and Administrators with role-specific functionalities and access controls.",
      highlights: ["Personalized Views", "Role-based Access", "Custom Workflows"]
    },
    {
      icon: Cpu,
      title: "AI Optimization Engine",
      description: "Advanced optimization algorithms using OR-Tools to compute the most efficient schedules while minimizing conflicts and maximizing resource utilization.",
      highlights: ["Constraint Programming", "Machine Learning", "Performance Analytics"]
    },
    {
      icon: Clock,
      title: "Real-time Synchronization",
      description: "Instant updates across all platforms ensuring everyone has access to the latest schedule changes and notifications.",
      highlights: ["Live Updates", "Push Notifications", "Cross-platform Sync"]
    }
  ];

  const additionalFeatures = [
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with data encryption, secure authentication, and regular backups."
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Comprehensive reporting and analytics for attendance, resource utilization, and academic performance."
    },
    {
      icon: Zap,
      title: "Fast Performance",
      description: "Optimized for speed with quick timetable generation and instant search capabilities across large datasets."
    },
    {
      icon: Smartphone,
      title: "Mobile Responsive",
      description: "Fully responsive design that works seamlessly across desktop, tablet, and mobile devices."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-blue-900 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Powerful Features for <span className="text-green-400">Academic Excellence</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Discover how BMU TimeMaster transforms timetable management with cutting-edge technology and intuitive design.
            </p>
          </div>
        </section>

        {/* Main Features */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
                Core Features
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Designed specifically for BML Munjal University's academic ecosystem
              </p>
            </div>

            <div className="space-y-16">
              {mainFeatures.map((feature, index) => (
                <div key={index} className={`flex flex-col lg:flex-row items-center gap-12 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                  <div className="flex-1">
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6">
                        <feature.icon className="h-8 w-8 text-blue-800" />
                      </div>
                      <h3 className="text-2xl font-bold text-blue-900 mb-4">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {feature.description}
                      </p>
                      <ul className="space-y-2">
                        {feature.highlights.map((highlight, idx) => (
                          <li key={idx} className="flex items-center text-gray-700">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8 h-64 flex items-center justify-center">
                      <div className="text-center">
                        <feature.icon className="h-16 w-16 text-blue-800 mx-auto mb-4" />
                        <p className="text-lg font-semibold text-gray-700">Feature Preview</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Features Grid */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-blue-900 mb-4">
                Additional Capabilities
              </h2>
              <p className="text-lg text-gray-600">
                Everything you need for efficient academic management
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {additionalFeatures.map((feature, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
                    <feature.icon className="h-6 w-6 text-blue-800" />
                  </div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Transform Your Academic Scheduling?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join BMU TimeMaster and experience the future of timetable management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold">
                Get Started Today
              </button>
              <button className="bg-transparent border border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-blue-800 transition-colors font-semibold">
                Schedule a Demo
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}