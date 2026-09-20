import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import Avatar from '../common/Avatar';
import {
  HiOutlineCamera,
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineCalendar,
  HiOutlineLocationMarker,
  HiOutlineIdentification,
} from 'react-icons/hi';
import { isValidEmail, isValidPhone } from '../../utils/validators';

export default function StudentForm({
  initialData = {},
  isEditing = false,
  onSubmit,
  loading = false,
}) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: initialData.name || '',
    guardianName: initialData.guardianName || '',
    email: initialData.email || '',
    phone: initialData.phone || initialData.guardianPhone || '',
    guardianPhone: initialData.guardianPhone || '',
    dateOfBirth: initialData.dateOfBirth || '',
    gender: initialData.gender || 'male',
    class: initialData.class || 'Grade 10',
    section: initialData.section || 'A',
    address: initialData.address || '',
    admissionDate: initialData.admissionDate || new Date().toISOString().split('T')[0],
    bloodGroup: initialData.bloodGroup || '',
    status: initialData.status || 'active',
    rollNumber: initialData.rollNumber || `STD-2026-${Math.floor(100 + Math.random() * 900)}`,
    avatarUrl: initialData.avatarUrl || null,
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(initialData.avatarUrl || null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          avatar: 'Image size must be less than 5MB',
        }));
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Student name is required';
    if (!formData.guardianName.trim()) errs.guardianName = 'Father / Guardian name is required';
    if (!formData.rollNumber.trim()) errs.rollNumber = 'Roll number is required';

    if (formData.email && !isValidEmail(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }

    if (formData.phone && !isValidPhone(formData.phone)) {
      errs.phone = 'Please enter a valid phone number';
    }

    if (!formData.class) errs.class = 'Class is required';
    if (!formData.section) errs.section = 'Section is required';
    if (!formData.gender) errs.gender = 'Gender is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData, avatarFile);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Profile Picture & Core Status Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
          Student Photo & Enrollment
        </h3>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar Preview & Upload Trigger */}
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-primary-100 dark:ring-primary-900/30 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Avatar name={formData.name || 'New Student'} size="xl" />
              )}
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-2 rounded-full bg-primary-600 text-white shadow-md hover:bg-primary-700 transition-colors"
              title="Upload Photo"
            >
              <HiOutlineCamera className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Roll Number *"
              name="rollNumber"
              icon={HiOutlineIdentification}
              value={formData.rollNumber}
              onChange={handleChange}
              error={errors.rollNumber}
              required
            />

            <Select
              label="Enrollment Status"
              name="status"
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'graduated', label: 'Graduated' },
                { value: 'transferred', label: 'Transferred' },
              ]}
              value={formData.status}
              onChange={handleChange}
            />

            <Input
              label="Admission Date"
              type="date"
              name="admissionDate"
              icon={HiOutlineCalendar}
              value={formData.admissionDate}
              onChange={handleChange}
            />
          </div>
        </div>
        {errors.avatar && (
          <p className="mt-2 text-xs text-red-500 text-center sm:text-left">{errors.avatar}</p>
        )}
      </div>

      {/* 2. Personal Information */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3">
          Personal Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Student Full Name *"
            name="name"
            placeholder="e.g. Hamza Ali"
            icon={HiOutlineUser}
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
          />

          <Input
            label="Father / Guardian Name *"
            name="guardianName"
            placeholder="e.g. Ali Raza"
            icon={HiOutlineUser}
            value={formData.guardianName}
            onChange={handleChange}
            error={errors.guardianName}
            required
          />

          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="e.g. student@educator.edu.pk"
            icon={HiOutlineMail}
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />

          <Input
            label="Contact / Phone Number"
            name="phone"
            placeholder="+92 300 1234567"
            icon={HiOutlinePhone}
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
          />

          <Input
            label="Date of Birth"
            type="date"
            name="dateOfBirth"
            icon={HiOutlineCalendar}
            value={formData.dateOfBirth}
            onChange={handleChange}
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Gender *"
              name="gender"
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' },
              ]}
              value={formData.gender}
              onChange={handleChange}
              error={errors.gender}
            />

            <Select
              label="Blood Group"
              name="bloodGroup"
              options={[
                { value: 'A+', label: 'A+' },
                { value: 'A-', label: 'A-' },
                { value: 'B+', label: 'B+' },
                { value: 'B-', label: 'B-' },
                { value: 'O+', label: 'O+' },
                { value: 'O-', label: 'O-' },
                { value: 'AB+', label: 'AB+' },
                { value: 'AB-', label: 'AB-' },
              ]}
              value={formData.bloodGroup}
              onChange={handleChange}
            />
          </div>
        </div>

        <Input
          label="Residential Address"
          name="address"
          placeholder="e.g. House #12, Street 4, Sector G-9, Islamabad"
          icon={HiOutlineLocationMarker}
          value={formData.address}
          onChange={handleChange}
        />
      </div>

      {/* 3. Academic Placement */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3">
          Academic Placement
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Enrolled Class / Grade *"
            name="class"
            options={[
              { value: 'Playgroup', label: 'Playgroup (Early Childhood)' },
              { value: 'Nursery', label: 'Nursery (Early Childhood)' },
              { value: 'Prep', label: 'Prep (Kindergarten)' },
              { value: 'Grade 1', label: 'Grade 1 (Primary)' },
              { value: 'Grade 2', label: 'Grade 2 (Primary)' },
              { value: 'Grade 3', label: 'Grade 3 (Primary)' },
              { value: 'Grade 4', label: 'Grade 4 (Primary)' },
              { value: 'Grade 5', label: 'Grade 5 (Primary)' },
              { value: 'Grade 6', label: 'Grade 6 (Middle School)' },
              { value: 'Grade 7', label: 'Grade 7 (Middle School)' },
              { value: 'Grade 8', label: 'Grade 8 (Middle School)' },
              { value: 'Grade 9', label: 'Grade 9 (Matriculation / O-Level)' },
              { value: 'Grade 10', label: 'Grade 10 (Matriculation / O-Level)' },
              { value: 'Grade 11', label: 'Grade 11 (Intermediate / A-Level)' },
              { value: 'Grade 12', label: 'Grade 12 (Intermediate / A-Level)' },
            ]}
            value={formData.class}
            onChange={handleChange}
            error={errors.class}
            required
          />

          <Select
            label="Class Section *"
            name="section"
            options={[
              { value: 'A', label: 'Section A' },
              { value: 'B', label: 'Section B' },
              { value: 'C', label: 'Section C' },
            ]}
            value={formData.section}
            onChange={handleChange}
            error={errors.section}
            required
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate('/students')}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" loading={loading} disabled={loading} size="lg">
          {isEditing ? 'Save Changes' : 'Register Student'}
        </Button>
      </div>
    </form>
  );
}
