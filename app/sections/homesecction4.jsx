import {
  PieChart,
  FileText,
  HeartHandshake,
  FileChartLine,
  ShieldAlert,
  BookUser,
  Database,
   AlarmClock,
} from "lucide-react"; // Example icons
import Link from 'next/link';

const features = [
  {
    icon: <PieChart className="h-[60px] w-[60px] text-purple-500" />,
    title: "Digital records for you and your family",
    description:
      "Manage and share your family's health records securely, all in one convenient place.",
  },
  {
    icon: <FileText className="h-[60px] w-[60px] text-sky-500" />,
    title: "Accurate interpretation of your medical reports",
    description:
      "Unlock clear insights from medical reports with our easy-to-understand summaries and health tips.",
  },
  {
    icon: <HeartHandshake className="h-[60px] w-[60px] text-teal-400" />,
    title: "Informed decision making for critical care",
    description:
      "Get second opinions faster & make informed healthcare decisions even during crucial times.",
  },
  {
    icon: <FileChartLine className="h-[60px] w-[60px] text-sky-500" />,
    title: "Comprehensive predictive health analysis",
    description:
      "Understand and act on health predictions with our straightforward, comprehensive data analysis.",
  },
  {
    icon: <ShieldAlert className="h-[60px] w-[60px] text-purple-500" />,
    title: "Data privacy, security and authenticity",
    description:
      "UTrust in the secure and authentic sharing of your health data, with your privacy as our priority.",
  },
  {
    icon: <BookUser className="h-[60px] w-[60px] text-blue-500" />,
    title: "Detailed health profile at your fingertips",
    description:
      "Access & manage your profile from the Homescreen for a complete, easy-to-use health overview.",
  },
  {
    icon: <Database className="h-[60px] w-[60px] text-blue-500" />,
    title: "Health data on demand",
    description:
      "Streamline care and emergency preparedness with on-demand health data sharing.",
  },
  {
    icon: < AlarmClock className="h-[60px] w-[60px] text-blue-500" />,
    title: "Your health routine empowered",
    description:
      "Empower your health routine with simplified check-ins and seamless tracking of vital metrics.",
  },
];

export default function Section4() {
  return (
    <>
      <section className="my-0">
        <div className=" bg-gradient-to-b from-blue-50 to-white min-h-screen">
          {/* Header */}
          <header className="container mx-auto px-6 py-10">
            <div className="flex flex-col items-center">
              {/* Icon only logo - replace with your actual icon component or SVG */}
              <HeartHandshake className="h-20 w-20 text-blue-600" />
            </div>
          </header>
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl text-center font-extrabold leading-tight text-gray-600 mb-6 sm:mb-8">
              We’re Here to Take the Complexity Out of Healthcare
            </h2>
          </div>
          <div className="text-gray-800 font-dmsans font-medium text-base sm:text-lg text-center mx-auto max-w-2xl">
            <p>
              An all-encompassing digital health locker that makes healthcare
              convenient – Organize your medical records, share information
              seamlessly and better understand the status of your health.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 gap-y-20 px-6 py-10 max-w-7xl mx-20">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-xl/30 p-6 flex flex-col space-y-4"
              >
                <div className="my-3">{feature.icon}</div>
                <h3 className="text-[22px] font-semibold text-gray-600 py-4">
                  {feature.title}
                </h3>
                <p className="text-gray-500 leading-relaxed text-[20px] font-dmsans">
                  {feature.description}
                </p>
              </div>
            ))}
            <Link href="/pages/features">
            <div className="rounded-2xl shadow-xl/50 bg-gradient-to-r from-violet-900 via-violet-500 to-blue-500">
                <p className="text-white leading-relaxed text-[20px] font-dmsans text-center py-20 px-2-">Want to Understand the our Features in Details how they can empower your health journey?</p>
                <p className=" text-center text-white text-[22px] font-semibold pb-10">Know More<span aria-hidden="true">&rarr;</span></p>
            </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
