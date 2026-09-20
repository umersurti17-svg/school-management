import { HiOutlineFilter, HiOutlineRefresh } from 'react-icons/hi';
import Select from '../common/Select';
import Button from '../common/Button';

export default function StudentFilters({
  filters,
  onChange,
  onReset,
  totalResults,
}) {
  const handleSelectChange = (name, value) => {
    onChange({ ...filters, [name]: value });
  };

  const hasActiveFilters = Boolean(
    filters.classFilter ||
    filters.sectionFilter ||
    filters.statusFilter ||
    filters.genderFilter
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
          <HiOutlineFilter className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          <span>Filter Students</span>
          {totalResults != null && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
              {totalResults} Total
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium inline-flex items-center gap-1"
          >
            <HiOutlineRefresh className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Select
          placeholder="All Classes"
          options={[
            { value: 'Playgroup', label: 'Playgroup' },
            { value: 'Nursery', label: 'Nursery' },
            { value: 'Prep', label: 'Prep' },
            { value: 'Grade 1', label: 'Grade 1' },
            { value: 'Grade 2', label: 'Grade 2' },
            { value: 'Grade 3', label: 'Grade 3' },
            { value: 'Grade 4', label: 'Grade 4' },
            { value: 'Grade 5', label: 'Grade 5' },
            { value: 'Grade 6', label: 'Grade 6' },
            { value: 'Grade 7', label: 'Grade 7' },
            { value: 'Grade 8', label: 'Grade 8' },
            { value: 'Grade 9', label: 'Grade 9' },
            { value: 'Grade 10', label: 'Grade 10' },
            { value: 'Grade 11', label: 'Grade 11' },
            { value: 'Grade 12', label: 'Grade 12' },
          ]}
          value={filters.classFilter}
          onChange={(e) => handleSelectChange('classFilter', e.target.value)}
        />

        <Select
          placeholder="All Sections"
          options={[
            { value: 'A', label: 'Section A' },
            { value: 'B', label: 'Section B' },
            { value: 'C', label: 'Section C' },
          ]}
          value={filters.sectionFilter}
          onChange={(e) => handleSelectChange('sectionFilter', e.target.value)}
        />

        <Select
          placeholder="All Statuses"
          options={[
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
            { value: 'graduated', label: 'Graduated' },
            { value: 'transferred', label: 'Transferred' },
          ]}
          value={filters.statusFilter}
          onChange={(e) => handleSelectChange('statusFilter', e.target.value)}
        />

        <Select
          placeholder="All Genders"
          options={[
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' },
          ]}
          value={filters.genderFilter}
          onChange={(e) => handleSelectChange('genderFilter', e.target.value)}
        />
      </div>
    </div>
  );
}
