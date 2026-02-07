import React, { useState } from 'react';
import './TherapistRegistration.css';

const TherapistRegistration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    
    // Professional Information
    licenseType: '',
    licenseNumber: '',
    licenseState: '',
    licenseExpiration: '',
    npiNumber: '',
    
    // Education
    degree: '',
    university: '',
    graduationYear: '',
    additionalCertifications: '',
    
    // Experience
    yearsExperience: '',
    specialties: [],
    populationServed: [],
    therapeuticApproaches: [],
    
    // Practice Information
    practiceType: '',
    sessionTypes: [],
    insuranceAccepted: [],
    languages: [],
    
    // Documents
    licenseDocument: null,
    degreeDocument: null,
    liabilityInsurance: null,
    backgroundCheck: null,
    
    // Additional
    bio: '',
    acceptTerms: false
  });

  const [errors, setErrors] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({
    licenseDocument: null,
    degreeDocument: null,
    liabilityInsurance: null,
    backgroundCheck: null
  });

  const specialtyOptions = [
    'Anxiety & Depression',
    'Trauma & PTSD',
    'Relationship Counseling',
    'Family Therapy',
    'Addiction & Substance Abuse',
    'Eating Disorders',
    'Grief & Loss',
    'Life Transitions',
    'LGBTQ+ Issues',
    'Cultural Identity',
    'Postpartum Support'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleMultiSelect = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter(item => item !== value)
        : [...prev[name], value]
    }));
  };

  const handleFileUpload = (e, documentType) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          [documentType]: 'File size must be less than 10MB'
        }));
        return;
      }

      // Check file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          [documentType]: 'Only PDF, JPG, and PNG files are allowed'
        }));
        return;
      }

      setUploadedFiles(prev => ({
        ...prev,
        [documentType]: file
      }));

      setFormData(prev => ({
        ...prev,
        [documentType]: file
      }));

      setErrors(prev => ({ ...prev, [documentType]: '' }));
    }
  };

  const removeFile = (documentType) => {
    setUploadedFiles(prev => ({
      ...prev,
      [documentType]: null
    }));
    setFormData(prev => ({
      ...prev,
      [documentType]: null
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
      if (!formData.phone) newErrors.phone = 'Phone number is required';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    }

    if (step === 2) {
      if (!formData.licenseType) newErrors.licenseType = 'License type is required';
      if (!formData.licenseNumber) newErrors.licenseNumber = 'License number is required';
      if (!formData.licenseState) newErrors.licenseState = 'License state is required';
      if (!formData.licenseExpiration) newErrors.licenseExpiration = 'License expiration is required';
      if (!formData.npiNumber) newErrors.npiNumber = 'NPI number is required';
    }

    if (step === 3) {
      if (!formData.degree) newErrors.degree = 'Degree is required';
      if (!formData.university) newErrors.university = 'University is required';
      if (!formData.graduationYear) newErrors.graduationYear = 'Graduation year is required';
    }

    if (step === 4) {
      if (!formData.yearsExperience) newErrors.yearsExperience = 'Years of experience is required';
      if (formData.specialties.length === 0) newErrors.specialties = 'Select at least one specialty';
    }

    if (step === 5) {
      if (!uploadedFiles.licenseDocument) newErrors.licenseDocument = 'License document is required';
      if (!uploadedFiles.degreeDocument) newErrors.degreeDocument = 'Degree document is required';
      if (!uploadedFiles.liabilityInsurance) newErrors.liabilityInsurance = 'Liability insurance is required';
      if (!uploadedFiles.backgroundCheck) newErrors.backgroundCheck = 'Background check is required';
    }

    if (step === 6) {
      if (!formData.acceptTerms) newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 6));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(6)) {
      // In a real application, this would send data to the server
      console.log('Registration submitted:', formData);
      alert('Your registration has been submitted for review. We will contact you within 3-5 business days.');
    }
  };

  const renderStepIndicator = () => (
    <div className="step-indicator">
      {[1, 2, 3, 4, 5, 6].map(step => (
        <div key={step} className={`step ${currentStep >= step ? 'active' : ''}`}>
          <div className="step-number">{step}</div>
          <div className="step-label">
            {step === 1 && 'Personal'}
            {step === 2 && 'License'}
            {step === 3 && 'Education'}
            {step === 4 && 'Experience'}
            {step === 5 && 'Documents'}
            {step === 6 && 'Review'}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="registration-container">
      <div className="registration-card">
        <div className="registration-header">
          <h1 className="registration-title">Therapist Registration</h1>
          <p className="registration-subtitle">Join our network of verified mental health professionals</p>
        </div>

        {renderStepIndicator()}

        <form onSubmit={handleSubmit} className="registration-form">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="form-step">
              <h2 className="step-title">Personal Information</h2>
              
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`form-input ${errors.fullName ? 'input-error' : ''}`}
                  placeholder="Enter your full legal name"
                />
                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`form-input ${errors.email ? 'input-error' : ''}`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`form-input ${errors.phone ? 'input-error' : ''}`}
                    placeholder="(123) 456-7890"
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Date of Birth *</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className={`form-input ${errors.dateOfBirth ? 'input-error' : ''}`}
                  />
                  {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="">Select gender</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-Binary">Non-Binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Professional License */}
          {currentStep === 2 && (
            <div className="form-step">
              <h2 className="step-title">Professional License Information</h2>
              <p className="step-description">
                Please provide your current, valid professional license information.
              </p>

              <div className="form-group">
                <label className="form-label">License Type *</label>
                <select
                  name="licenseType"
                  value={formData.licenseType}
                  onChange={handleChange}
                  className={`form-input ${errors.licenseType ? 'input-error' : ''}`}
                >
                  <option value="">Select license type</option>
                  <option value="PhD">PhD - Licensed Clinical Psychologist</option>
                  <option value="PsyD">PsyD - Licensed Psychologist</option>
                  <option value="LCSW">LCSW - Licensed Clinical Social Worker</option>
                  <option value="LMFT">LMFT - Licensed Marriage & Family Therapist</option>
                  <option value="LPC">LPC - Licensed Professional Counselor</option>
                  <option value="LMHC">LMHC - Licensed Mental Health Counselor</option>
                  <option value="Other">Other</option>
                </select>
                {errors.licenseType && <span className="error-message">{errors.licenseType}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">License Number *</label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    className={`form-input ${errors.licenseNumber ? 'input-error' : ''}`}
                    placeholder="License number"
                  />
                  {errors.licenseNumber && <span className="error-message">{errors.licenseNumber}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">License State *</label>
                  <input
                    type="text"
                    name="licenseState"
                    value={formData.licenseState}
                    onChange={handleChange}
                    className={`form-input ${errors.licenseState ? 'input-error' : ''}`}
                    placeholder="State"
                  />
                  {errors.licenseState && <span className="error-message">{errors.licenseState}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">License Expiration Date *</label>
                  <input
                    type="date"
                    name="licenseExpiration"
                    value={formData.licenseExpiration}
                    onChange={handleChange}
                    className={`form-input ${errors.licenseExpiration ? 'input-error' : ''}`}
                  />
                  {errors.licenseExpiration && <span className="error-message">{errors.licenseExpiration}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">NPI Number *</label>
                  <input
                    type="text"
                    name="npiNumber"
                    value={formData.npiNumber}
                    onChange={handleChange}
                    className={`form-input ${errors.npiNumber ? 'input-error' : ''}`}
                    placeholder="National Provider Identifier"
                  />
                  {errors.npiNumber && <span className="error-message">{errors.npiNumber}</span>}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Education */}
          {currentStep === 3 && (
            <div className="form-step">
              <h2 className="step-title">Education & Training</h2>
              
              <div className="form-group">
                <label className="form-label">Highest Degree *</label>
                <select
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  className={`form-input ${errors.degree ? 'input-error' : ''}`}
                >
                  <option value="">Select degree</option>
                  <option value="PhD">PhD</option>
                  <option value="PsyD">PsyD</option>
                  <option value="EdD">EdD</option>
                  <option value="MSW">MSW - Master of Social Work</option>
                  <option value="MA">MA - Master of Arts</option>
                  <option value="MS">MS - Master of Science</option>
                  <option value="Other">Other</option>
                </select>
                {errors.degree && <span className="error-message">{errors.degree}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">University/Institution *</label>
                  <input
                    type="text"
                    name="university"
                    value={formData.university}
                    onChange={handleChange}
                    className={`form-input ${errors.university ? 'input-error' : ''}`}
                    placeholder="Name of institution"
                  />
                  {errors.university && <span className="error-message">{errors.university}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Graduation Year *</label>
                  <input
                    type="number"
                    name="graduationYear"
                    value={formData.graduationYear}
                    onChange={handleChange}
                    className={`form-input ${errors.graduationYear ? 'input-error' : ''}`}
                    placeholder="YYYY"
                    min="1950"
                    max={new Date().getFullYear()}
                  />
                  {errors.graduationYear && <span className="error-message">{errors.graduationYear}</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Additional Certifications</label>
                <textarea
                  name="additionalCertifications"
                  value={formData.additionalCertifications}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="List any additional certifications, specialized training, or continuing education (e.g., CBT, DBT, EMDR)"
                  rows="4"
                />
              </div>
            </div>
          )}

          {/* Step 4: Experience */}
          {currentStep === 4 && (
            <div className="form-step">
              <h2 className="step-title">Professional Experience</h2>
              
              <div className="form-group">
                <label className="form-label">Years of Clinical Experience *</label>
                <input
                  type="number"
                  name="yearsExperience"
                  value={formData.yearsExperience}
                  onChange={handleChange}
                  className={`form-input ${errors.yearsExperience ? 'input-error' : ''}`}
                  placeholder="Number of years"
                  min="0"
                  max="50"
                />
                {errors.yearsExperience && <span className="error-message">{errors.yearsExperience}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Specialties * (Select all that apply)</label>
                <div className="checkbox-grid">
                  {specialtyOptions.map(specialty => (
                    <label key={specialty} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.specialties.includes(specialty)}
                        onChange={() => handleMultiSelect('specialties', specialty)}
                      />
                      <span>{specialty}</span>
                    </label>
                  ))}
                </div>
                {errors.specialties && <span className="error-message">{errors.specialties}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Professional Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Tell us about your approach to therapy, your experience, and what makes you a great fit for our platform (max 500 words)"
                  rows="6"
                />
              </div>
            </div>
          )}

          {/* Step 5: Document Upload */}
          {currentStep === 5 && (
            <div className="form-step">
              <h2 className="step-title">Document Verification</h2>
              <p className="step-description">
                Please upload clear, legible copies of the following required documents. 
                All documents must be current and valid. Accepted formats: PDF, JPG, PNG (max 10MB each).
              </p>

              {/* License Document */}
              <div className="upload-group">
                <label className="upload-label">Professional License * {uploadedFiles.licenseDocument && '✓'}</label>
                <p className="upload-description">Upload a copy of your current professional license</p>
                <div className="upload-area">
                  <input
                    type="file"
                    id="licenseDocument"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload(e, 'licenseDocument')}
                    className="file-input"
                  />
                  <label htmlFor="licenseDocument" className="file-label">
                    {uploadedFiles.licenseDocument ? (
                      <div className="file-selected">
                        <span className="file-icon">📄</span>
                        <span className="file-name">{uploadedFiles.licenseDocument.name}</span>
                        <button 
                          type="button" 
                          onClick={() => removeFile('licenseDocument')}
                          className="remove-file"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="file-placeholder">
                        <span className="upload-icon">📤</span>
                        <span>Click to upload or drag and drop</span>
                      </div>
                    )}
                  </label>
                </div>
                {errors.licenseDocument && <span className="error-message">{errors.licenseDocument}</span>}
              </div>

              {/* Degree Document */}
              <div className="upload-group">
                <label className="upload-label">Degree/Diploma * {uploadedFiles.degreeDocument && '✓'}</label>
                <p className="upload-description">Upload a copy of your highest degree or diploma</p>
                <div className="upload-area">
                  <input
                    type="file"
                    id="degreeDocument"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload(e, 'degreeDocument')}
                    className="file-input"
                  />
                  <label htmlFor="degreeDocument" className="file-label">
                    {uploadedFiles.degreeDocument ? (
                      <div className="file-selected">
                        <span className="file-icon">📄</span>
                        <span className="file-name">{uploadedFiles.degreeDocument.name}</span>
                        <button 
                          type="button" 
                          onClick={() => removeFile('degreeDocument')}
                          className="remove-file"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="file-placeholder">
                        <span className="upload-icon">📤</span>
                        <span>Click to upload or drag and drop</span>
                      </div>
                    )}
                  </label>
                </div>
                {errors.degreeDocument && <span className="error-message">{errors.degreeDocument}</span>}
              </div>

              {/* Liability Insurance */}
              <div className="upload-group">
                <label className="upload-label">Professional Liability Insurance * {uploadedFiles.liabilityInsurance && '✓'}</label>
                <p className="upload-description">Upload proof of current professional liability insurance</p>
                <div className="upload-area">
                  <input
                    type="file"
                    id="liabilityInsurance"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload(e, 'liabilityInsurance')}
                    className="file-input"
                  />
                  <label htmlFor="liabilityInsurance" className="file-label">
                    {uploadedFiles.liabilityInsurance ? (
                      <div className="file-selected">
                        <span className="file-icon">📄</span>
                        <span className="file-name">{uploadedFiles.liabilityInsurance.name}</span>
                        <button 
                          type="button" 
                          onClick={() => removeFile('liabilityInsurance')}
                          className="remove-file"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="file-placeholder">
                        <span className="upload-icon">📤</span>
                        <span>Click to upload or drag and drop</span>
                      </div>
                    )}
                  </label>
                </div>
                {errors.liabilityInsurance && <span className="error-message">{errors.liabilityInsurance}</span>}
              </div>

              {/* Background Check */}
              <div className="upload-group">
                <label className="upload-label">Background Check * {uploadedFiles.backgroundCheck && '✓'}</label>
                <p className="upload-description">Upload a recent background check (within the last 12 months)</p>
                <div className="upload-area">
                  <input
                    type="file"
                    id="backgroundCheck"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload(e, 'backgroundCheck')}
                    className="file-input"
                  />
                  <label htmlFor="backgroundCheck" className="file-label">
                    {uploadedFiles.backgroundCheck ? (
                      <div className="file-selected">
                        <span className="file-icon">📄</span>
                        <span className="file-name">{uploadedFiles.backgroundCheck.name}</span>
                        <button 
                          type="button" 
                          onClick={() => removeFile('backgroundCheck')}
                          className="remove-file"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="file-placeholder">
                        <span className="upload-icon">📤</span>
                        <span>Click to upload or drag and drop</span>
                      </div>
                    )}
                  </label>
                </div>
                {errors.backgroundCheck && <span className="error-message">{errors.backgroundCheck}</span>}
              </div>
            </div>
          )}

          {/* Step 6: Review & Submit */}
          {currentStep === 6 && (
            <div className="form-step">
              <h2 className="step-title">Review & Submit</h2>
              
              <div className="review-section">
                <h3 className="review-heading">Application Summary</h3>
                
                <div className="review-item">
                  <strong>Name:</strong> {formData.fullName}
                </div>
                <div className="review-item">
                  <strong>Email:</strong> {formData.email}
                </div>
                <div className="review-item">
                  <strong>License:</strong> {formData.licenseType} #{formData.licenseNumber}
                </div>
                <div className="review-item">
                  <strong>Education:</strong> {formData.degree} from {formData.university}
                </div>
                <div className="review-item">
                  <strong>Experience:</strong> {formData.yearsExperience} years
                </div>
                <div className="review-item">
                  <strong>Specialties:</strong> {formData.specialties.join(', ')}
                </div>
                <div className="review-item">
                  <strong>Documents:</strong> {Object.values(uploadedFiles).filter(Boolean).length}/4 uploaded
                </div>
              </div>

              <div className="terms-section">
                <label className="checkbox-label large">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                  />
                  <span>
                    I certify that all information provided is accurate and complete. I understand that 
                    false information may result in denial or termination. I agree to the{' '}
                    <a href="/terms" className="terms-link">Terms & Conditions</a> and{' '}
                    <a href="/privacy" className="terms-link">Privacy Policy</a>.
                  </span>
                </label>
                {errors.acceptTerms && <span className="error-message">{errors.acceptTerms}</span>}
              </div>

              <div className="verification-notice">
                <h4>What happens next?</h4>
                <ul>
                  <li>Our verification team will review your application within 3-5 business days</li>
                  <li>We will verify your license with the state licensing board</li>
                  <li>Your credentials and documents will be thoroughly reviewed</li>
                  <li>You will receive an email notification of approval or if additional information is needed</li>
                </ul>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="form-navigation">
            {currentStep > 1 && (
              <button type="button" onClick={prevStep} className="nav-button prev-button">
                ← Previous
              </button>
            )}
            
            {currentStep < 6 ? (
              <button type="button" onClick={nextStep} className="nav-button next-button">
                Next →
              </button>
            ) : (
              <button type="submit" className="submit-button">
                Submit Application
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TherapistRegistration;