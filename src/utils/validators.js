// Email validation
export function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Phone number validation
export function isValidPhone(phone) {
  const regex = /^[\d\s+()-]{7,15}$/;
  return regex.test(phone);
}

// Required field validation
export function isRequired(value) {
  if (typeof value === 'string') return value.trim().length > 0;
  return value != null;
}

// Minimum length
export function minLength(value, min) {
  return typeof value === 'string' && value.length >= min;
}

// Validate form fields — returns an object of errors
export function validateForm(fields, rules) {
  const errors = {};

  for (const [key, fieldRules] of Object.entries(rules)) {
    const value = fields[key];

    for (const rule of fieldRules) {
      if (rule.required && !isRequired(value)) {
        errors[key] = rule.message || `${key} is required`;
        break;
      }
      if (rule.email && value && !isValidEmail(value)) {
        errors[key] = rule.message || 'Invalid email address';
        break;
      }
      if (rule.phone && value && !isValidPhone(value)) {
        errors[key] = rule.message || 'Invalid phone number';
        break;
      }
      if (rule.minLength && value && !minLength(value, rule.minLength)) {
        errors[key] = rule.message || `Minimum ${rule.minLength} characters required`;
        break;
      }
    }
  }

  return errors;
}
