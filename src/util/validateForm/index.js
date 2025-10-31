// ✅ Regex helpers
export const isEmailValid = (email = "") => /\S+@\S+\.\S+/.test(email);
export const isPhoneValid = (number = "") => /^[0-9]{10}$/.test(number);

// ✅ Input validation helpers
export const validateNumericInput = (value, allowDecimals = true) => {
  if (allowDecimals) {
    // Only allow numbers and decimal point
    const numericValue = value.replace(/[^0-9.]/g, "");
    // Prevent multiple decimal points
    const parts = numericValue.split(".");
    return parts.length > 2
      ? parts[0] + "." + parts.slice(1).join("")
      : numericValue;
  } else {
    // Only allow whole numbers
    return value.replace(/[^0-9]/g, "");
  }
};

export const validateMoneyInput = (value) => {
  return validateNumericInput(value, true);
};

export const validateDurationInput = (value) => {
  return validateNumericInput(value, false);
};

// ✅ Field validation types
export const FIELD_VALIDATION_TYPES = {
  MONEY: "money",
  DURATION: "duration",
  TEXT: "text",
  EMAIL: "email",
  PHONE: "phone",
};

// ✅ Get validation function based on field type
export const getValidationFunction = (fieldType) => {
  switch (fieldType) {
    case FIELD_VALIDATION_TYPES.MONEY:
      return validateMoneyInput;
    case FIELD_VALIDATION_TYPES.DURATION:
      return validateDurationInput;
    case FIELD_VALIDATION_TYPES.EMAIL:
      return (value) => value; // No transformation for email
    case FIELD_VALIDATION_TYPES.PHONE:
      return (value) => value.replace(/[^0-9]/g, ""); // Only numbers for phone
    default:
      return (value) => value; // No transformation for text
  }
};

// ✅ Generic signup validation
export const getValidationStatus = (data) => {
  const errors = {
    name: !data.name?.trim(),
    emailAddress: !isEmailValid(data.emailAddress),
    number: !isPhoneValid(data.number),
    location: !data.location?.trim(),
    accountType: !data.accountType,
    createPassword: !data.createPassword?.trim(),
    confirmPassword: data.createPassword !== data.confirmPassword,

    // Always required
    about: !data.about?.trim(),
    // profilePic: !data.profilePic,
  };

  // tenant-specific validations
  if (data.accountType === "tenant") {
    errors.occupation = !data.occupation?.trim();
    errors.user_tag = !data.user_tag?.trim();
  }

  return {
    isValid: Object.values(errors).every((val) => !val),
    errors,
  };
};

// ✅ Field error messages
const FIELD_ERROR_MESSAGES = {
  name: "Name is required.",
  emailAddress: "Enter a valid email address.",
  number: "Phone number must be 10 digits.",
  location: "Location is required.",
  accountType: "Select an account type.",
  createPassword: "Password must be at least 6 characters.",
  confirmPassword: "Passwords do not match.",
};

export const getFieldErrorMessage = (field) =>
  FIELD_ERROR_MESSAGES[field] || "Invalid field";

// ✅ Map AI API response to form state
export const mapAiResponseToFormData = (aiData = {}) => ({
  property_requirement: aiData.property_requirement || "",
  space: {
    min: aiData.space?.min || 800,
    max: aiData.space?.max || 1200,
  },
  bhk_type: aiData.bhk_type || [],
  locality_details: {
    metro_station: !!aiData.locality_details?.metro_station,
    airport: !!aiData.locality_details?.airport,
    school: !!aiData.locality_details?.school,
    shopping_mall: !!aiData.locality_details?.shopping_mall,
    hospital: !!aiData.locality_details?.hospital,
    place_of_worship: !!aiData.locality_details?.place_of_worship,
    park: !!aiData.locality_details?.park,
  },
  amenities: {
    pool: !!aiData.amenities?.pool,
    gym: !!aiData.amenities?.gym,
    parking: !!aiData.amenities?.parking,
    lift: !!aiData.amenities?.lift,
    power_backup: !!aiData.amenities?.power_backup,
    garden: !!aiData.amenities?.garden,
    kids_play_area: !!aiData.amenities?.kids_play_area,
    security: !!aiData.amenities?.security,
  },
  furnishing: aiData.furnishing || "",
  preference: aiData.preference || "",
  rental_budget: {
    min: aiData.rental_budget?.min?.toString() || "",
    max: aiData.rental_budget?.max?.toString() || "",
  },
  deposit: {
    min: aiData.deposit?.min?.toString() || "",
    max: aiData.deposit?.max?.toString() || "",
  },
  possession_date: aiData.possession_date || "",
  lease_duration: aiData.lease_duration || "",
  verification_document: aiData.verification_document || null,
});

// ✅ Build payload for API
export const prepareProfilePayload = (formData, accountType) => {
  const num = (val, fallback = 0) => (val ? Number(val) : fallback);

  const basePayload = {
    property_requirement: formData.property_requirement || "",
    space: {
      min: num(formData.space?.min, 800),
      max: num(formData.space?.max, 1200),
    },
    area: formData.space?.max,
    bhk_type: formData.bhk_type || [],
    locality_details: formData.locality_details || {},
    amenities: formData.amenities || {},
    furnishing: formData.furnishing || "",
    preferred_tenants: formData.preference || "",
    rental_budget: {
      min: num(formData.rental_budget?.min || 0),
      max: num(formData.rental_budget?.max || 0),
    },
    rent_amount: formData.rental_budget?.max,
    // deposit: {
    //   min: num(formData.deposit?.min || 0),
    //   max: num(formData.deposit?.max || 0),
    // },
    deposit: Number(formData.deposit?.min),
    deposit_amount: Number(formData.deposit?.min),
    possession_date: formData.possession_date || "",
    lease_duration: formData.lease_duration || "",
    verification_document: formData.verification_document || null,
    property_type: formData.property_type || "",
  };

  // 🏠 Only landlord fields
  if (accountType === "landlord") {
    basePayload.property_images = formData.property_images || [];
    basePayload.title = formData.property_name || "";
    basePayload.address = formData.address || "";
    basePayload.about = formData.about || "";
    basePayload.is_primary = formData.is_primary || false;
  } else {
    basePayload.deposit = {
      min: num(formData.deposit?.min || 0),
      max: num(formData.deposit?.max || 0),
    };
  }

  return basePayload;
};

// ✅ Check Save button enable condition
export const isSaveFormValid = (formData, accountType) => {
  const requiredFields = [
    formData.rental_budget?.min,
    formData.deposit?.min,
    formData.possession_date,
    formData.lease_duration,
  ];

  if (accountType === "tenant") {
    requiredFields.push(formData.rental_budget?.max, formData.deposit?.max);
  }

  if (accountType === "landlord") {
    requiredFields.push(formData.preference);
  }

  return requiredFields.every((field) => !!field?.toString().trim());
};

// ✅ Check Property Details form validation
export const isPropertyDetailsFormValid = (formData) => {
  const requiredFields = [
    formData.title?.trim(),
    formData.location?.trim(),
    formData.rent_amount?.trim(),
    formData.deposit_amount?.trim(),
    formData.possession_date?.trim(),
    formData.lease_duration?.trim(),
    formData.about?.trim(),
    formData.property_type?.trim(),
  ];

  return requiredFields.every((field) => !!field);
};
