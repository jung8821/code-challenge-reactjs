/* Form Validation */
export default function validateForm(data, startDate, endDate) {
    let errors = {}; // To contain error messages

    // Policy Max
    if (data.policyMax === '0') {
        errors.policyMax = "Please select your policy maximum.";
    }

    // Age
    if (data.age > 100) {
        const currentYear = new Date().getFullYear();
        const currentAge = currentYear - data.age;

        if (currentAge > 100 ) 
            errors.age = 'Age cannot be more than 100 years old.'

        if (currentAge <= 0) 
            errors.age = 'Age needs to be greater than 0'
    }

    // Travel Dates
    if (startDate >= endDate) 
        errors.endDate =  "The end date should be after the start date."


    return errors;
}
