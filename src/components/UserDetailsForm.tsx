import { useState } from 'react';
import { User, Mail, Phone, GraduationCap, Sparkles } from 'lucide-react';

interface UserDetails {
  name: string;
  email: string;
  mobile: string;
  college: string;
}

interface UserDetailsFormProps {
  onSubmit: (details: UserDetails) => void;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  mobile?: string;
  college?: string;
}

const UserDetailsForm = ({ onSubmit }: UserDetailsFormProps) => {
  const [formData, setFormData] = useState<UserDetails>({
    name: '',
    email: '',
    mobile: '',
    college: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showEmailSuggestion, setShowEmailSuggestion] = useState(false);

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        if (!/^[a-zA-Z\s]+$/.test(value)) return 'Name can only contain letters';
        return undefined;

      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address';
        }
        return undefined;

      case 'mobile':
        if (!value.trim()) return 'Mobile number is required';
        const cleanNumber = value.replace(/\D/g, '');
        if (cleanNumber.length !== 10) return 'Mobile number must be exactly 10 digits';
        return undefined;

      case 'college':
        if (!value.trim()) return 'College name is required';
        if (value.trim().length < 3) return 'College name must be at least 3 characters';
        return undefined;

      default:
        return undefined;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Limit mobile number to 10 digits
    if (name === 'mobile') {
      const cleanNumber = value.replace(/\D/g, '');
      if (cleanNumber.length > 10) return;
      setFormData((prev) => ({ ...prev, [name]: cleanNumber }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Show email suggestion for @gmail.com
    if (name === 'email') {
      const hasAt = value.includes('@');
      const endsWithGmail = value.toLowerCase().endsWith('@gmail.com');
      setShowEmailSuggestion(!hasAt && value.length > 0 && !endsWithGmail);
    }

    // Validate on change if field has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
    
    // Hide email suggestion on blur
    if (name === 'email') {
      setTimeout(() => setShowEmailSuggestion(false), 200);
    }
  };

  const handleEmailSuggestionClick = () => {
    const currentEmail = formData.email;
    if (!currentEmail.includes('@')) {
      setFormData((prev) => ({ ...prev, email: currentEmail + '@gmail.com' }));
      setShowEmailSuggestion(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: ValidationErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof UserDetails]);
      if (error) newErrors[key as keyof ValidationErrors] = error;
    });

    // Mark all as touched
    setTouched({
      name: true,
      email: true,
      mobile: true,
      college: true,
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  const getInputClassName = (fieldName: keyof UserDetails) => {
    const baseClass =
      'w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white';
    const hasError = touched[fieldName] && errors[fieldName];
    
    if (hasError) {
      return `${baseClass} border-red-300 focus:border-red-400`;
    }
    return `${baseClass} border-gray-200 focus:border-emerald-400`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div 
        className="w-full max-w-lg"
        style={{
          animation: 'slideUp 0.6s ease-out',
        }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full mb-4 shadow-2xl">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 break-words">
            Welcome to Quiz Challenge
          </h1>
          <p className="text-gray-300 text-base sm:text-lg break-words">
            Please enter your details to begin
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8">
          <form onSubmit={handleSubmit} noValidate>
            {/* Name Field */}
            <div className="mb-5">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your full name"
                  className={getInputClassName('name')}
                />
              </div>
              {touched.name && errors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <span>⚠</span> {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="mb-5">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onFocus={() => formData.email.length > 0 && !formData.email.includes('@') && setShowEmailSuggestion(true)}
                  placeholder="your.email@example.com"
                  className={getInputClassName('email')}
                />
                {showEmailSuggestion && (
                  <button
                    type="button"
                    onMouseDown={handleEmailSuggestionClick}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-emerald-500 text-white text-xs px-3 py-1 rounded-lg hover:bg-emerald-600 transition-colors shadow-md"
                  >
                    + @gmail.com
                  </button>
                )}
              </div>
              {touched.email && errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <span>⚠</span> {errors.email}
                </p>
              )}
            </div>

            {/* Mobile Field */}
            <div className="mb-5">
              <label htmlFor="mobile" className="block text-sm font-semibold text-gray-700 mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="+1234567890"
                  className={getInputClassName('mobile')}
                />
              </div>
              {touched.mobile && errors.mobile && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <span>⚠</span> {errors.mobile}
                </p>
              )}
            </div>

            {/* College Field */}
            <div className="mb-6">
              <label htmlFor="college" className="block text-sm font-semibold text-gray-700 mb-2">
                College Name
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  id="college"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your college name"
                  className={getInputClassName('college')}
                />
              </div>
              {touched.college && errors.college && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <span>⚠</span> {errors.college}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-bold py-4 px-6 rounded-xl hover:from-emerald-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              Continue to Quiz
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-400 text-sm">
          <p>15 Questions • Timed Challenge • Leaderboard</p>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default UserDetailsForm;
