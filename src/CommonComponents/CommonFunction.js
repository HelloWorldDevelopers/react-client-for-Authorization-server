



  export const validateEmail = (emailId, isValidateRNTEmails) => {
    // General regex to validate email format with no dots after @
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
 
    // Check if the email matches the general format
    if (!regex.test(emailId)) {
      return false;
    }
 
    // Split the email into local and domain parts
    const [localPart, domainPart] = emailId.split('@');
 
    // Ensure no dots in the domain part after the @ symbol
    if (domainPart.includes('..') || domainPart.endsWith('.')) {
      return false;
    }
 
    // Check for empty segments in domain
    const domainSegments = domainPart.split('.');
    if (domainSegments.length < 2 || domainSegments.some(segment => segment.length === 0)) {
      return false;
    }
 
    // Ensure no extra dots before the TLD
    const tld = domainSegments.pop();
    if (domainSegments.length > 1) {
      return false;
    }
 
    // Special case for Gmail
    if (emailId.endsWith('@gmail.com')) {
      if (domainPart !== 'gmail.com') {
        return false;
      }
    }
 
    // Check against a list of invalid domains
    if (isValidateRNTEmails) {
      const invalidDomains = ['rnt.ai', 'rabbitandtortoise.com'];
      for (const domain of invalidDomains) {
        if (emailId.endsWith(`@${domain}`)) {
          return false;
        }
      }
    }
 
    return true;
  }