import { Award, Users, Target, Globe, BookOpen, GraduationCap } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function About() {
  const stats = [
    { number: "50+", label: "Courses Managed" },
    { number: "100+", label: "Faculty Members" },
    { number: "2000+", label: "Students Served" },
    { number: "99.9%", label: "System Uptime" }
  ];

  const missionValues = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To revolutionize academic scheduling through innovative technology, making timetable management seamless, efficient, and intelligent for the entire BMU community."
    },
    {
      icon: Users,
      title: "Our Vision",
      description: "To become the leading academic management platform that sets new standards in educational technology and enhances the learning experience for students and educators alike."
    },
    {
      icon: Award,
      title: "Our Values",
      description: "Excellence, Innovation, Reliability, and User-Centric Design drive everything we do. We believe in creating solutions that truly serve the academic community."
    }
  ];

  const team = [
    {
      name: "Ruchi Verma, Bhawna and Bhumika",
      role: "Lead Developers & Project Coordinators",
      description: "Final year Computer Science students passionate about solving real-world problems through technology.",
      contribution: "Full-stack development, system architecture, and project coordination"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-blue-900 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                About <span className="text-green-400">BMU TimeMaster</span>
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                The official intelligent timetable automation platform of BML Munjal University, 
                designed to streamline academic scheduling and enhance the educational experience.
              </p>
            </div>
          </div>
        </section>

        {/* University Introduction */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1">
                <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8">
                  <div className="flex items-center mb-6">
                    <GraduationCap className="h-8 w-8 text-blue-800 mr-3" />
                    <h2 className="text-2xl font-bold text-blue-900">About BML Munjal University</h2>
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    BML Munjal University (BMU) is a renowned educational institution founded by the Hero Group and 
                    named after the visionary founder, Dr. Brij Mohan Lall Munjal. Located in Gurugram, BMU is committed 
                    to creating a world-class teaching and learning environment.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    The university offers innovative programs that are designed to transform students into well-rounded 
                    professionals equipped to face global challenges. BMU's state-of-the-art campus and industry-oriented 
                    curriculum make it one of the premier educational destinations in India.
                  </p>
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                  <div className="flex items-center mb-6">
                    <BookOpen className="h-8 w-8 text-blue-800 mr-3" />
                    <h2 className="text-2xl font-bold text-blue-900">The TimeMaster Initiative</h2>
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    BMU TimeMaster was born from the need to modernize academic scheduling at BML Munjal University. 
                    Recognizing the challenges of manual timetable management, this project aims to leverage cutting-edge 
                    technology to create a seamless scheduling experience.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Developed as part of academic research and innovation, TimeMaster represents BMU's commitment to 
                    embracing digital transformation in education and providing students with exposure to real-world 
                    problem-solving.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-blue-800 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission, Vision & Values */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-blue-900 mb-4">
                Our Guiding Principles
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                The foundation upon which BMU TimeMaster is built
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {missionValues.map((item, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-md p-8 text-center hover:shadow-lg transition-shadow">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6">
                    <item.icon className="h-8 w-8 text-blue-800" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-900 mb-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Development Team */}
        <section className="py-20 bg-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-blue-900 mb-4">
                Development Team
              </h2>
              <p className="text-lg text-gray-600">
                The minds behind BMU TimeMaster
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              {team.map((member, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-shrink-0">
                      <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-12 w-12 text-blue-800" />
                      </div>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-2xl font-bold text-blue-900 mb-2">
                        {member.name}
                      </h3>
                      <p className="text-green-600 font-semibold mb-4">
                        {member.role}
                      </p>
                      <p className="text-gray-700 mb-4 leading-relaxed">
                        {member.description}
                      </p>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">
                          <strong>Key Contribution:</strong> {member.contribution}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Global Perspective */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6">
              <Globe className="h-8 w-8 text-blue-800" />
            </div>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">
              A Project with Global Standards
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              BMU TimeMaster is developed following international best practices in software engineering 
              and educational technology. While serving the specific needs of BML Munjal University, 
              the platform is designed with scalability and adaptability in mind, potentially serving 
              as a model for other educational institutions worldwide.
            </p>
            <div className="bg-blue-800 text-white rounded-2xl p-8">
              <p className="text-xl font-semibold">
                "Innovating education through technology, one schedule at a time."
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}