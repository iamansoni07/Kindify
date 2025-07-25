// ✅ Section Updated by Cursor
import React, { useState } from 'react';
import { AnimationWrapper } from "../../common";

const NGOVerification = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        ngoName: '',
        registrationNumber: '',
        address: '',
        contactPerson: '',
        email: '',
        phone: '',
        website: '',
        mission: '',
        darpanCertificate: null,
        registrationCertificate: null,
        bankStatement: null,
        auditReport: null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const steps = [
        { id: 1, title: 'Basic Information', description: 'NGO details and contact information' },
        { id: 2, title: 'Documents Upload', description: 'Upload required verification documents' },
        { id: 3, title: 'Review & Submit', description: 'Review all information before submission' }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileUpload = (e, fieldName) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                [fieldName]: file
            }));
        }
    };

    const nextStep = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setCurrentStep(4); // Show status step
        }, 2000);
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    NGO Name *
                                </label>
                                <input
                                    type="text"
                                    name="ngoName"
                                    value={formData.ngoName}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Registration Number *
                                </label>
                                <input
                                    type="text"
                                    name="registrationNumber"
                                    value={formData.registrationNumber}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Address *
                            </label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contact Person *
                                </label>
                                <input
                                    type="text"
                                    name="contactPerson"
                                    value={formData.contactPerson}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Website (Optional)
                                </label>
                                <input
                                    type="url"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mission Statement *
                            </label>
                            <textarea
                                name="mission"
                                value={formData.mission}
                                onChange={handleInputChange}
                                rows="4"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Describe your NGO's mission and objectives..."
                                required
                            ></textarea>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="text-sm font-medium text-blue-800 mb-2">Required Documents</h3>
                            <p className="text-sm text-blue-700">
                                Please upload the following documents for verification. All documents should be in PDF, JPG, or PNG format (max 5MB each).
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Darpan Certificate *
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={(e) => handleFileUpload(e, 'darpanCertificate')}
                                        className="hidden"
                                        id="darpanCertificate"
                                        required
                                    />
                                    <label htmlFor="darpanCertificate" className="cursor-pointer">
                                        <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <span className="text-sm text-gray-600">
                                            {formData.darpanCertificate ? formData.darpanCertificate.name : 'Click to upload Darpan Certificate'}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Registration Certificate *
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={(e) => handleFileUpload(e, 'registrationCertificate')}
                                        className="hidden"
                                        id="registrationCertificate"
                                        required
                                    />
                                    <label htmlFor="registrationCertificate" className="cursor-pointer">
                                        <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <span className="text-sm text-gray-600">
                                            {formData.registrationCertificate ? formData.registrationCertificate.name : 'Click to upload Registration Certificate'}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bank Statement (Last 3 months) *
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={(e) => handleFileUpload(e, 'bankStatement')}
                                        className="hidden"
                                        id="bankStatement"
                                        required
                                    />
                                    <label htmlFor="bankStatement" className="cursor-pointer">
                                        <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <span className="text-sm text-gray-600">
                                            {formData.bankStatement ? formData.bankStatement.name : 'Click to upload Bank Statement'}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Audit Report (Last Year) *
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={(e) => handleFileUpload(e, 'auditReport')}
                                        className="hidden"
                                        id="auditReport"
                                        required
                                    />
                                    <label htmlFor="auditReport" className="cursor-pointer">
                                        <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <span className="text-sm text-gray-600">
                                            {formData.auditReport ? formData.auditReport.name : 'Click to upload Audit Report'}
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Review Your Information</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-medium text-gray-700 mb-2">Basic Information</h4>
                                    <div className="space-y-2 text-sm">
                                        <p><span className="font-medium">NGO Name:</span> {formData.ngoName}</p>
                                        <p><span className="font-medium">Registration Number:</span> {formData.registrationNumber}</p>
                                        <p><span className="font-medium">Contact Person:</span> {formData.contactPerson}</p>
                                        <p><span className="font-medium">Email:</span> {formData.email}</p>
                                        <p><span className="font-medium">Phone:</span> {formData.phone}</p>
                                    </div>
                                </div>
                                
                                <div>
                                    <h4 className="font-medium text-gray-700 mb-2">Documents Uploaded</h4>
                                    <div className="space-y-2 text-sm">
                                        <p className={formData.darpanCertificate ? 'text-green-600' : 'text-red-600'}>
                                            {formData.darpanCertificate ? '✅' : '❌'} Darpan Certificate
                                        </p>
                                        <p className={formData.registrationCertificate ? 'text-green-600' : 'text-red-600'}>
                                            {formData.registrationCertificate ? '✅' : '❌'} Registration Certificate
                                        </p>
                                        <p className={formData.bankStatement ? 'text-green-600' : 'text-red-600'}>
                                            {formData.bankStatement ? '✅' : '❌'} Bank Statement
                                        </p>
                                        <p className={formData.auditReport ? 'text-green-600' : 'text-red-600'}>
                                            {formData.auditReport ? '✅' : '❌'} Audit Report
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4">
                                <h4 className="font-medium text-gray-700 mb-2">Mission Statement</h4>
                                <p className="text-sm text-gray-600">{formData.mission}</p>
                            </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex">
                                <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-700">
                                        By submitting this form, you agree that all information provided is accurate and complete. 
                                        Verification typically takes 3-5 business days.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="text-center py-8">
                        {isSubmitting ? (
                            <div>
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Submitting Your Application</h3>
                                <p className="text-gray-600">Please wait while we process your verification request...</p>
                            </div>
                        ) : (
                            <div>
                                <div className="text-6xl mb-4">📋</div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Application Submitted Successfully!</h3>
                                <p className="text-gray-600 mb-4">
                                    Your NGO verification application has been submitted. We will review your documents and get back to you within 3-5 business days.
                                </p>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                                    <p className="text-sm text-blue-800">
                                        <strong>Application ID:</strong> NGO-{Date.now().toString().slice(-6)}
                                    </p>
                                    <p className="text-sm text-blue-800 mt-1">
                                        <strong>Status:</strong> Under Review
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <AnimationWrapper>
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-md border border-gray-200">
                    {/* Header */}
                    <div className="border-b border-gray-200 p-6">
                        <h2 className="text-2xl font-bold text-gray-800">NGO Verification</h2>
                        <p className="text-gray-600 mt-1">Complete your verification to start receiving donations</p>
                    </div>

                    {/* Progress Steps */}
                    {currentStep <= 3 && (
                        <div className="border-b border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                {steps.map((step, index) => (
                                    <div key={step.id} className="flex items-center">
                                        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                                            currentStep >= step.id 
                                                ? 'bg-blue-600 border-blue-600 text-white' 
                                                : 'border-gray-300 text-gray-500'
                                        }`}>
                                            {currentStep > step.id ? (
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            ) : (
                                                step.id
                                            )}
                                        </div>
                                        <div className="ml-3">
                                            <p className={`text-sm font-medium ${
                                                currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                                            }`}>
                                                {step.title}
                                            </p>
                                            <p className="text-xs text-gray-400">{step.description}</p>
                                        </div>
                                        {index < steps.length - 1 && (
                                            <div className={`w-16 h-0.5 mx-4 ${
                                                currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                                            }`}></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    <div className="p-6">
                        {renderStepContent()}
                    </div>

                    {/* Footer */}
                    {currentStep <= 3 && (
                        <div className="border-t border-gray-200 p-6 flex justify-between">
                            <button
                                onClick={prevStep}
                                disabled={currentStep === 1}
                                className={`px-4 py-2 rounded-md font-medium ${
                                    currentStep === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                Previous
                            </button>
                            
                            {currentStep === 3 ? (
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                                </button>
                            ) : (
                                <button
                                    onClick={nextStep}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700"
                                >
                                    Next
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AnimationWrapper>
    );
};

export default NGOVerification;
