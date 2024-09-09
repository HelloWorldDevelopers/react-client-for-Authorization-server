export const validateAlphabets = (value, fieldName, showError) => {
    const regex = /^[a-zA-Z_.\s!@#$%^&*()-]*$/;
    if (value == null || value?.trim() === '') {
        showError(`Please fill the ${fieldName}`);
        return false;
    } else if (!regex.test(value)) {
        showError(`Only alphabets are allowed in ${fieldName}`);
        return false;
    }
    return true;
};

export const validateDigits = (value, fieldName, showError) => {
    const regex = /^[0-9]*$/;
    if (value == null || value?.trim() === '') {
        showError(`Please fill the ${fieldName}`);
        return false;
    }
    else if (!regex.test(value)) {
        showError(`Only digits are allowed in ${fieldName}`);
        return false;
    }
    return true;
};

export const validateEmpty = (value, fieldName, showError) => {
    if (value == null || value?.trim() === '' || value == "<p><br></p>") {
        showError(`Please fill the ${fieldName}`);
        return false;
    }
    return true;
};

export const validateEmail = (value, fieldName, showError) => {
    const regex = /^(?=.{1,64}@.{1,255}$)[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;
    if (value == null || value?.trim() === '') {
        showError(`Please fill the ${fieldName}`);
        return false;
    } else if (!regex.test(value)) {
        showError(`Invalid email for ${fieldName}`);
        return false;
    }
    const emailDomain = value?.split('@')[1]?.toLowerCase();
    if (emailDomain === 'rnt.ai') {
        showError(`Emails from rnt.ai are not allowed for ${fieldName}`);
        return false;
    }
    return true;
}

export const validatePan = (value, fieldName, showError, gstNo) => {
    const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (value == null || value.trim() === '') {
        showError(`Please fill the ${fieldName}`);
        return false;
    } else if (!panRegex.test(value)) {
        showError(`Please enter a valid PAN number for ${fieldName}`);
        return false;
    } else if (value && !value.includes(gstNo.slice(2, -3))) {
        showError(`PAN does not match GST number. Ensure both are accurate`);
        return false;
    }
    return true;
}

export const validateAlphanumeric = (value, fieldName, showError) => {
    const regex = /^[a-zA-Z0-9]*$/;
    if (value == null || value?.trim() === '') {
        showError(`Please fill the ${fieldName}`);
        return false;
    } else if (!regex.test(value)) {
        showError(`Only alphabets and digits are allowed in ${fieldName}`);
        return false;
    }
    return true;
}

export const validateIFSC = (ifsc, fieldName, showError) => {
    const regex = /^[a-zA-Z]{4}0[a-zA-Z0-9]{6}$/;
    if (ifsc == null || ifsc?.trim() === '') {
        showError(`Please fill the ${fieldName}`);
        return false;
    } else if (!regex.test(ifsc)) {
        showError(`Please enter a valid ${fieldName}`);
        return false;
    }
    return true;
}

export const validateZipcode = (value, fieldName, showError) => {
    // Regular expression for a generic ZIP code validation
    const regex = /^[a-zA-Z0-9\s,-]*$/;
    if (value == null || value?.trim() === '') {
        showError(`Please fill the ${fieldName}`);
        return false;
    } else if (!regex.test(value)) {
        showError(`Please enter a valid ${fieldName}`);
        return false;
    }
    return true;
}

export const validateSelectEmpty = (value, fieldName, showError) => {
    if (value == null || value === '') {
        showError(`Please select the ${fieldName}`);
        return false;
    }
    return true;
};

export const validateGstNo = (value, fieldName, showError) => {
    const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (value == null || value?.trim() === '') {
        showError(`Please fill the ${fieldName}`);
        return false;
    } else if (!regex.test(value)) {
        showError(`Please enter a valid GST number`);
        return false;
    }
    return true;
}

export const validateGstCode = (value, fieldName, showError) => {
    const regex = /^(0[1-9]|1\d|2[0-9])$/;
    if (value == null || value?.trim() === '') {
        showError(`Please fill the ${fieldName}`);
        return false;
    } else if (!regex.test(value)) {
        showError(`Please enter a GST code between 01 to 29`);
        return false;
    }
    return true;
};

export const validateCompSchemeUnderGst = (value, fieldName, showError) => {
    if (value == null || (value !== 'YES' && value !== 'NO')) {
        showError(`Please select whether you are composition scheme registered under GST`);
        return false;
    }
    return true;
};

export const validateBankName = (value, fieldName, showError) => {
    const regex = /^[A-Za-z0-9',.&() -]+$/;
    if (value == null || value?.trim() === '') {
        showError(`Please fill the ${fieldName}`);
        return false;
    } else if (!regex.test(value)) {
        showError(`Please enter valid ${fieldName}`);
        return false;
    }
    return true;
};

export const validateMobileNumber = (value, fieldName, showError) => {
    const regex = /^\d{10}$/;
    if (value == null || value?.trim() === '') {
        showError(`Please fill the ${fieldName}`);
        return false;
    } else if (!regex.test(value)) {
        showError(`Please enter a valid 10-digit mobile number in ${fieldName}`);
        return false;
    }
    return true;
};

export const validateZipCode = (value, fieldName, showError) => {
    // Regular expression to allow digits and spaces
    const regex = /^[0-9\s]*$/;

    if (value == null || value.trim() === '') {
        showError(`Please fill the ${fieldName}`);
        return false;
    }
    else if (!regex.test(value)) {
        showError(`Only digits are allowed in ${fieldName}`);
        return false;
    }
    return true;
};

export const validateServiceAccgCode = (code, fieldName, showError) => {
    if (!code || code.trim() === '') {
        showError(`${fieldName} cannot be empty.`);
        return false;
    }

    // Check if the code starts with "99" and has 2, 4, or 6 digits after that
    const pattern = /^99(\d{2}|\d{4}|\d{6})$/;
    if (!pattern.test(code)) {
        showError(`${fieldName} must start with "99" and have exactly 2, 4, or 6 digits after that.`);
        return false;
    }

    return true;
}

