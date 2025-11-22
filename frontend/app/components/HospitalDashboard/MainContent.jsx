'use client'
import React, { useState, useEffect } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Lock, Hospital, Menu, X, Search, Bell, Sun, Moon, User, Home, Users, Calendar, Clipboard, Settings, Upload, Check, AlertCircle, Clock, Download, Eye } from 'lucide-react';
import { hospitalAPI } from '../../utils/api';
// Mock data
const mockAppointments = [
  { id: 1, time: '09:00 AM', patient: 'John Doe', doctor: 'Dr. Smith', status: 'confirmed' },
  { id: 2, time: '10:30 AM', patient: 'Jane Wilson', doctor: 'Dr. Johnson', status: 'pending' },
  { id: 3, time: '02:00 PM', patient: 'Mike Brown', doctor: 'Dr. Davis', status: 'confirmed' },
  { id: 4, time: '03:30 PM', patient: 'Sarah Lee', doctor: 'Dr. Martinez', status: 'pending' }
];

const mockNotifications = [
  { id: 1, message: 'New patient registered', time: '5 min ago', severity: 'info' },
  { id: 2, message: 'Lab results ready for review', time: '15 min ago', severity: 'warning' },
  { id: 3, message: 'System backup completed', time: '1 hour ago', severity: 'success' },
  { id: 4, message: 'Appointment cancelled', time: '2 hours ago', severity: 'error' }
];

const mockLabReports = [
  { id: 1, patient: 'John Doe', test: 'Blood Test', status: 'Completed', date: '2024-11-20' },
  { id: 2, patient: 'Jane Wilson', test: 'X-Ray', status: 'Processing', date: '2024-11-20' },
  { id: 3, patient: 'Mike Brown', test: 'MRI Scan', status: 'Completed', date: '2024-11-19' },
  { id: 4, patient: 'Sarah Lee', test: 'CT Scan', status: 'Pending', date: '2024-11-19' }
];

const patientTrendData = [
  { name: 'Mon', value: 45 },
  { name: 'Tue', value: 52 },
  { name: 'Wed', value: 48 },
  { name: 'Thu', value: 61 },
  { name: 'Fri', value: 55 },
  { name: 'Sat', value: 42 },
  { name: 'Sun', value: 38 }
];

const occupancyData = [
  { name: 'Occupied', value: 75, color: '#3b82f6' },
  { name: 'Available', value: 25, color: '#e5e7eb' }
];

const specializations = [
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Radiology',
  'Surgery',
  'Internal Medicine',
  'Emergency Medicine'
];

// Component: Toast Notification
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  const Icon = type === 'success' ? Check : type === 'error' ? AlertCircle : Bell;

  return (
    <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in`}>
      <Icon className="w-5 h-5" />
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="hover:opacity-80">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Component: Button
const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-200',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// Component: Input
const Input = ({ label, error, className = '', ...props }) => (
  <div className="mb-4">
    {label && (
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label} {props.required && <span className="text-red-500">*</span>}
      </label>
    )}
    <input
      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
        ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
        bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
        ${className}`}
      {...props}
    />
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

// Component: Select
const Select = ({ label, options, error, className = '', ...props }) => (
  <div className="mb-4">
    {label && (
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label} {props.required && <span className="text-red-500">*</span>}
      </label>
    )}
    <select
      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
        ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
        bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
        ${className}`}
      {...props}
    >
      <option value="">Select an option</option>
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

// Component: Card
const Card = ({ title, children, className = '' }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl ${className}`}>
    {title && <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>}
    {children}
  </div>
);

// Main Dashboard Component
export default function HospitalDashboard() {
  const [theme, setTheme] = useState('light');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const [hospitalData, setHospitalData] = useState(null)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialization: '',
    licenseNo: '',
    clinic: '',
    availability: '',
    photo: null
  });
  const [formErrors, setFormErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("")
   useEffect(() => {
      const fetchDashboardData = async () => {
        setLoading(true);
        setError("");
  
        try {
          const res = await hospitalAPI.getDashboard({withCredentials: true})
          console.log("Fetched data from API:", res.data);
          setHospitalData(res.data);
        } catch (err) {
          console.error(
            "Dashboard fetch error:",
            err.response?.data || err.message
          );
          setError("Failed to load doctor dashboard");
        } finally {
          setLoading(false);
        }
      };
  
      fetchDashboardData();
    }, []);
if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone is required';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      errors.phone = 'Invalid phone format';
    }
    
    if (!formData.specialization) errors.specialization = 'Specialization is required';
    if (!formData.licenseNo.trim()) errors.licenseNo = 'License number is required';
    if (!formData.clinic.trim()) errors.clinic = 'Clinic/Hospital is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setFormData(prev => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setToast({ message: 'Please fix form errors', type: 'error' });
      return;
    }

    setIsSubmitting(true);

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate API response
      const response = { success: true, id: Date.now() };
      
      if (response.success) {
        setToast({ message: 'Doctor registered successfully!', type: 'success' });
        // Reset form
        setFormData({
          fullName: '', email: '', phone: '', specialization: '',
          licenseNo: '', clinic: '', availability: '', photo: null
        });
        setPhotoPreview(null);
      }
    } catch (error) {
      setToast({ message: 'Registration failed. Please try again.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'doctors', icon: Users, label: 'Doctors' },
    { id: 'patients', icon: User, label: 'Patients' },
    { id: 'appointments', icon: Calendar, label: 'Appointments' },
    { id: 'labs', icon: Clipboard, label: 'Labs' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Toast Container */}
      {toast && (
        <div className="fixed top-4 right-4 z-50">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        </div>
      )}

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              MediCare Hospital
            </h1>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
              <Search className="w-5 h-5 text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm w-48"
              />
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>

            <button
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              A
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ${
            sidebarOpen ? "w-64" : "w-0"
          } overflow-hidden`}
        >
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="mb-8">
                  <div className="bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-700 text-white rounded-3xl p-8 shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between">
                        <div>
                          <h1 className="text-4xl font-bold mb-2">{}</h1>
                          <p className="text-blue-100 text-lg mb-4">Ready to make a difference today</p>
                       
                        </div>
                        <div className="hidden md:block">
                          <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6">
                            <Hospital className="h-16 w-16 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
            {/* Doctor Registration Card */}

            <Card
              title="Doctor Registration"
              className="lg:col-span-2 xl:col-span-1"
            >
              <form onSubmit={handleSubmit}>
                <Input
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  error={formErrors.fullName}
                  required
                  placeholder="Dr. John Smith"
                />

                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={formErrors.email}
                  required
                  placeholder="john.smith@hospital.com"
                />

                <Input
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  error={formErrors.phone}
                  required
                  placeholder="+1 (555) 123-4567"
                />

                <Select
                  label="Specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  error={formErrors.specialization}
                  options={specializations}
                  required
                />

                <Input
                  label="License Number"
                  name="licenseNo"
                  value={formData.licenseNo}
                  onChange={handleInputChange}
                  error={formErrors.licenseNo}
                  required
                  placeholder="MD123456"
                />
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a strong password"
                  icon={<Lock className="h-5 w-5 text-blue-500" />}
                  error={errors.password}
                />

                {/* Confirm Password */}
                <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Re-enter your password"
                  icon={<Lock className="h-5 w-5 text-blue-500" />}
                  error={errors.confirmPassword}
                />

                <Input
                  label="Clinic/Hospital"
                  name="clinic"
                  value={formData.clinic}
                  onChange={handleInputChange}
                  error={formErrors.clinic}
                  required
                  placeholder="MediCare Central"
                />

                <Input
                  label="Availability Schedule"
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  placeholder="Mon-Fri, 9AM-5PM"
                />

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Profile Photo
                  </label>
                  <div className="flex items-center gap-4">
                    {photoPreview && (
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )}
                    <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">Upload Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Registering..." : "Register Doctor"}
                </Button>
              </form>
            </Card>

            {/* Patient Statistics Card */}
            <Card title="Patient Statistics">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">1,234</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Patients
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">42</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    New Today
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">4.2</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Avg. Stay (days)
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-orange-600">75%</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Bed Occupancy
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Weekly Trend
                </p>
                <ResponsiveContainer width="100%" height={100}>
                  <LineChart data={patientTrendData}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={120}>
                  <PieChart>
                    <Pie
                      data={occupancyData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={50}
                    >
                      {occupancyData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Today's Appointments */}
            <Card title="Today's Appointments">
              <div className="space-y-3">
                {mockAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {apt.patient}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {apt.time} • {apt.doctor}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        apt.status === "confirmed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Notifications Card */}
            <Card title="Notifications">
              <div className="space-y-3">
                {mockNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        notif.severity === "success"
                          ? "bg-green-500"
                          : notif.severity === "warning"
                            ? "bg-yellow-500"
                            : notif.severity === "error"
                              ? "bg-red-500"
                              : "bg-blue-500"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {notif.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {notif.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Lab Reports */}
            {/* <Card title="Recent Lab Reports" className="lg:col-span-2">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Patient</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Test Type</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockLabReports.map(report => (
                      <tr key={report.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{report.patient}</td>
                        <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">{report.test}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            report.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            report.status === 'Processing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                          }`}>
                            {report.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">{report.date}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded" aria-label="View report">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded" aria-label="Download report">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card> */}
          </div>
        </main>
      </div>

      <style jsx global>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}