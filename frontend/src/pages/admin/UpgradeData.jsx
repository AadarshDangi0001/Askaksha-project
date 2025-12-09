import React, { useState, useEffect } from "react";
import { collegeAPI } from "../../services/api";

const UpgradeData = () => {
  const [activeTab, setActiveTab] = useState("basic");
  const [collegeCode, setCollegeCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [basicInfo, setBasicInfo] = useState({
    name: "",
    address: "",
    about: "",
    website: "",
  });

  const [feeInfo, setFeeInfo] = useState({
    tuitionFee: "",
    hostelFee: "",
    examFee: "",
    otherFees: "",
  });

  const [scholarship, setScholarship] = useState({
    name: "",
    eligibility: "",
    amount: "",
    deadline: "",
  });

  const [scholarships, setScholarships] = useState([]);

  const [courses, setCourses] = useState([]);

  const [deadlineInfo, setDeadlineInfo] = useState({
    event: "",
    date: "",
    description: "",
  });

  const [deadlines, setDeadlines] = useState([]);

  const [facilities, setFacilities] = useState("");

  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
    whatsapp: "",
    admissionOffice: "",
  });

  const [additionalInfo, setAdditionalInfo] = useState({
    establishedYear: "",
    accreditation: "",
    avgPackage: "",
    placementRate: "",
    recruiters: "",
  });

  // Load college data on component mount
  useEffect(() => {
    loadCollegeData();
  }, []);

  const loadCollegeData = async () => {
    try {
      setLoading(true);
      const data = await collegeAPI.getMy();
      
      if (data) {
        // Populate form fields with existing data
        setBasicInfo({
          name: data.name || "",
          address: data.address || "",
          about: data.about || "",
          website: data.website || "",
        });

        setFeeInfo({
          tuitionFee: data.fees?.tuitionFee || "",
          hostelFee: data.fees?.hostelFee || "",
          examFee: data.fees?.examFee || "",
          otherFees: data.fees?.otherFees || "",
        });

        setCourses(data.courses || []);
        setScholarships(data.scholarships || []);
        setDeadlines(data.deadlines || []);
        setFacilities(data.facilities?.join(", ") || "");

        setContactInfo({
          email: data.contactInfo?.email || "",
          phone: data.contactInfo?.phone || "",
          whatsapp: data.contactInfo?.whatsapp || "",
          admissionOffice: data.contactInfo?.admissionOffice || "",
        });

        setAdditionalInfo({
          establishedYear: data.establishedYear || "",
          accreditation: data.accreditation || "",
          avgPackage: data.placement?.averagePackage || "",
          placementRate: data.placement?.placementRate || "",
          recruiters: data.placement?.topRecruiters?.join(", ") || "",
        });

        // Get college code from admin info
        const adminInfo = JSON.parse(localStorage.getItem("adminInfo") || "{}");
        setCollegeCode(adminInfo.collegeCode || data.collegeCode || "");
      } else {
        // Generate new college code if none exists
        const adminInfo = JSON.parse(localStorage.getItem("adminInfo") || "{}");
        setCollegeCode(adminInfo.collegeCode || "CLG-" + Math.random().toString(36).substring(2, 8).toUpperCase());
      }
    } catch (error) {
      console.error("Error loading college data:", error);
      // Generate code even on error
      const adminInfo = JSON.parse(localStorage.getItem("adminInfo") || "{}");
      setCollegeCode(adminInfo.collegeCode || "CLG-" + Math.random().toString(36).substring(2, 8).toUpperCase());
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleSaveBasic = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await collegeAPI.update({
        name: basicInfo.name,
        address: basicInfo.address,
        about: basicInfo.about,
        website: basicInfo.website,
      });
      showMessage("success", "Basic information saved successfully!");
    } catch (error) {
      showMessage("error", error.message || "Failed to save data");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDetailed = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const facilitiesArray = facilities.split(",").map(f => f.trim()).filter(f => f);
      const recruitersArray = additionalInfo.recruiters.split(",").map(r => r.trim()).filter(r => r);

      await collegeAPI.update({
        fees: feeInfo,
        courses: courses,
        scholarships: scholarships,
        deadlines: deadlines,
        facilities: facilitiesArray,
        contactInfo: contactInfo,
        establishedYear: additionalInfo.establishedYear,
        accreditation: additionalInfo.accreditation,
        placement: {
          averagePackage: additionalInfo.avgPackage,
          placementRate: additionalInfo.placementRate,
          topRecruiters: recruitersArray,
        }
      });
      showMessage("success", "Detailed information saved successfully!");
    } catch (error) {
      showMessage("error", error.message || "Failed to save data");
    } finally {
      setSaving(false);
    }
  };

  // Fallback questions (when AI can’t answer)
  const [fallbackQuestions] = useState([
    {
      id: 1,
      question: "What is the exact process to apply for lateral entry admission?",
      source: "Student Portal Chatbot",
      createdAt: "12 Dec 2025, 10:32 AM",
    },
    {
      id: 2,
      question: "Can I shift from hostel to day scholar in the middle of semester?",
      source: "WhatsApp Bot",
      createdAt: "11 Dec 2025, 08:17 PM",
    },
    {
      id: 3,
      question:
        "Is there any special quota or relaxation for sports category in fee payment?",
      source: "Web Widget",
      createdAt: "10 Dec 2025, 04:05 PM",
    },
  ]);

  const handleBasicChange = (e) =>
    setBasicInfo({ ...basicInfo, [e.target.name]: e.target.value });

  const handleFeeChange = (e) =>
    setFeeInfo({ ...feeInfo, [e.target.name]: e.target.value });

  const handleScholarshipChange = (e) =>
    setScholarship({ ...scholarship, [e.target.name]: e.target.value });

  const handleDeadlineChange = (e) =>
    setDeadlineInfo({ ...deadlineInfo, [e.target.name]: e.target.value });

  const handleContactChange = (e) =>
    setContactInfo({ ...contactInfo, [e.target.name]: e.target.value });

  const handleAdditionalChange = (e) =>
    setAdditionalInfo({ ...additionalInfo, [e.target.name]: e.target.value });

  const handleAddCourse = () => {
    setCourses([
      ...courses,
      { name: "", duration: "", description: "" },
    ]);
  };

  const handleCourseChange = (index, field, value) => {
    setCourses((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    );
  };

  const handleRemoveCourse = (index) => {
    setCourses((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddScholarship = () => {
    if (scholarship.name && scholarship.amount) {
      setScholarships([...scholarships, { ...scholarship }]);
      setScholarship({ name: "", eligibility: "", amount: "", deadline: "" });
      showMessage("success", "Scholarship added!");
    }
  };

  const handleRemoveScholarship = (index) => {
    setScholarships((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddDeadline = () => {
    if (deadlineInfo.event && deadlineInfo.date) {
      setDeadlines([...deadlines, { ...deadlineInfo }]);
      setDeadlineInfo({ event: "", date: "", description: "" });
      showMessage("success", "Deadline added!");
    }
  };

  const handleRemoveDeadline = (index) => {
    setDeadlines((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(collegeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="w-full mt-10 min-h-screen overflow-y-auto pb-24">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading college data...</p>
          </div>
        </div>
      ) : (
        <div className="w-full px-8 lg:px-16 py-6 mt-20 lg:mt-6">
        {/* College Code */}
        <div className="bg-[#CAECFF] rounded-3xl shadow-md p-4 lg:p-6 mb-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">College Data</h2>
            <p className="text-sm text-gray-700">Manage college information.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#F3F7FF] border border-gray-300 rounded-2xl px-4 py-2 font-mono text-sm">
              Code: {collegeCode || "Not assigned"}
            </div>
            {collegeCode && (
              <button
                onClick={handleCopyCode}
                className="bg-[#3B7DDD] hover:bg-[#5A97E4] text-white px-3 py-2 rounded-xl text-xs"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            )}
          </div>
        </div>

        {/* Success/Error Message */}
        {message.text && (
          <div className={`mb-4 p-4 rounded-2xl ${
            message.type === "success" 
              ? "bg-green-100 text-green-800 border border-green-300" 
              : "bg-red-100 text-red-800 border border-red-300"
          }`}>
            {message.text}
          </div>
        )}

        {/* Container */}
        <div className="bg-[#CAECFF] rounded-3xl shadow-md p-4 lg:p-6">
          {/* Tabs */}
          <div className="flex gap-3 mb-5 flex-wrap">
            <button
              className={`px-4 py-2 rounded-2xl text-sm ${
                activeTab === "basic"
                  ? "bg-[#3B7DDD] text-white"
                  : "bg-white text-gray-800 border hover:bg-[#5A97E4]"
              }`}
              onClick={() => setActiveTab("basic")}
            >
              Basic Information
            </button>

            <button
              className={`px-4 py-2 rounded-2xl text-sm ${
                activeTab === "detailed"
                  ? "bg-[#3B7DDD] text-white"
                  : "bg-white text-gray-800 border hover:bg-[#5A97E4]"
              }`}
              onClick={() => setActiveTab("detailed")}
            >
              Detailed Information
            </button>

            <button
              className={`px-4 py-2 rounded-2xl text-sm ${
                activeTab === "fallback"
                  ? "bg-[#3B7DDD] text-white"
                  : "bg-white text-gray-800 border hover:bg-[#5A97E4]"
              }`}
              onClick={() => setActiveTab("fallback")}
            >
              Fallback Questions
            </button>
          </div>

          {/* ================= BASIC ================== */}
          {activeTab === "basic" && (
            <form className="space-y-4 mt-3" onSubmit={handleSaveBasic}>
              <Field
                label="College Name"
                name="name"
                placeholder="Enter college name"
                value={basicInfo.name}
                onChange={handleBasicChange}
              />
              <TextArea
                label="Address"
                name="address"
                placeholder="Enter complete address"
                rows={3}
                value={basicInfo.address}
                onChange={handleBasicChange}
              />
              <TextArea
                label="About"
                name="about"
                placeholder="Short description about the college"
                rows={4}
                value={basicInfo.about}
                onChange={handleBasicChange}
              />
              <Field
                label="Website"
                name="website"
                placeholder="https://www.collegewebsite.com"
                value={basicInfo.website}
                onChange={handleBasicChange}
              />

              <SaveBtn text={saving ? "Saving..." : "Save Changes"} disabled={saving} />
            </form>
          )}

          {/* ================ DETAILED ================= */}
          {activeTab === "detailed" && (
            <form className="space-y-6 mt-3" onSubmit={handleSaveDetailed}>
              {/* Fees */}
              <Section title="Fees Structure">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <FeeInput
                    label="Tuition Fee"
                    name="tuitionFee"
                    placeholder="e.g. 75000"
                    value={feeInfo.tuitionFee}
                    onChange={handleFeeChange}
                  />
                  <FeeInput
                    label="Hostel Fee"
                    name="hostelFee"
                    placeholder="e.g. 50000"
                    value={feeInfo.hostelFee}
                    onChange={handleFeeChange}
                  />
                  <FeeInput
                    label="Exam Fee"
                    name="examFee"
                    placeholder="e.g. 3000"
                    value={feeInfo.examFee}
                    onChange={handleFeeChange}
                  />
                  <FeeInput
                    label="Other Fees"
                    name="otherFees"
                    placeholder="e.g. 5000"
                    value={feeInfo.otherFees}
                    onChange={handleFeeChange}
                  />
                </div>
              </Section>

              {/* Courses */}
              <Section title="Courses Offered">
                <button
                  type="button"
                  onClick={handleAddCourse}
                  className="bg-white border border-gray-300 px-3 py-2 rounded-xl text-sm hover:bg-[#FFEDD5]"
                >
                  + Add Course
                </button>

                <div className="space-y-3 mt-3">
                  {courses.map((course, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-2xl px-4 py-3 grid sm:grid-cols-3 gap-3"
                    >
                      <Input
                        label="Course Name"
                        placeholder="e.g. B.Tech CSE"
                        value={course.name}
                        onChange={(e) =>
                          handleCourseChange(index, "name", e.target.value)
                        }
                      />
                      <Input
                        label="Duration"
                        placeholder="e.g. 4 Years"
                        value={course.duration}
                        onChange={(e) =>
                          handleCourseChange(index, "duration", e.target.value)
                        }
                      />
                      <div>
                        <Input
                          label="Description"
                          placeholder="e.g. Undergraduate"
                          value={course.description}
                          onChange={(e) =>
                            handleCourseChange(index, "description", e.target.value)
                          }
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveCourse(index)}
                          className="text-red-500 text-xs mt-1 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              {/* Scholarships */}
              <Section title="Scholarships" card>
                <div className="space-y-3">
                  <div className="grid sm:grid-cols-4 gap-3">
                    <Input
                      label="Scholarship Name"
                      name="name"
                      placeholder="e.g. Merit Scholarship"
                      value={scholarship.name}
                      onChange={handleScholarshipChange}
                    />
                    <Input
                      label="Eligibility"
                      name="eligibility"
                      placeholder="e.g. 85% marks"
                      value={scholarship.eligibility}
                      onChange={handleScholarshipChange}
                    />
                    <Input
                      label="Amount"
                      name="amount"
                      placeholder="e.g. 25000"
                      value={scholarship.amount}
                      onChange={handleScholarshipChange}
                    />
                    <div>
                      <Input
                        label="Deadline"
                        name="deadline"
                        type="date"
                        value={scholarship.deadline}
                        onChange={handleScholarshipChange}
                      />
                      <button
                        type="button"
                        onClick={handleAddScholarship}
                        className="text-blue-600 text-xs mt-1 hover:underline"
                      >
                        + Add Scholarship
                      </button>
                    </div>
                  </div>

                  {scholarships.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <h4 className="text-sm font-semibold">Added Scholarships:</h4>
                      {scholarships.map((s, index) => (
                        <div key={index} className="bg-[#F3F7FF] p-2 rounded-lg flex justify-between items-center">
                          <div className="text-sm">
                            <span className="font-medium">{s.name}</span> - ₹{s.amount}
                            {s.eligibility && <span className="text-gray-600"> ({s.eligibility})</span>}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveScholarship(index)}
                            className="text-red-500 text-xs hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Section>

              {/* Important Deadlines */}
              <Section title="Important Deadlines" card>
                <div className="space-y-3">
                  <Input
                    label="Event Name"
                    name="event"
                    placeholder="e.g. Entrance Exam Date"
                    value={deadlineInfo.event}
                    onChange={handleDeadlineChange}
                  />
                  <Input
                    label="Deadline Date"
                    type="date"
                    name="date"
                    value={deadlineInfo.date}
                    onChange={handleDeadlineChange}
                  />
                  <TextArea
                    label="Description"
                    name="description"
                    placeholder="Important submission reminder"
                    rows={2}
                    value={deadlineInfo.description}
                    onChange={handleDeadlineChange}
                  />
                  <button
                    type="button"
                    onClick={handleAddDeadline}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    + Add Deadline
                  </button>

                  {deadlines.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <h4 className="text-sm font-semibold">Added Deadlines:</h4>
                      {deadlines.map((d, index) => (
                        <div key={index} className="bg-[#F3F7FF] p-2 rounded-lg flex justify-between items-center">
                          <div className="text-sm">
                            <span className="font-medium">{d.event}</span> - {new Date(d.date).toLocaleDateString()}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveDeadline(index)}
                            className="text-red-500 text-xs hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Section>

              {/* Facilities */}
              <Section title="Facilities" card>
                <Input
                  placeholder="Library, Hostel, Sports Complex (comma separated)"
                  value={facilities}
                  onChange={(e) => setFacilities(e.target.value)}
                />
              </Section>

              {/* Contact Info */}
              <Section title="Contact Information" card>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="college@example.com"
                    value={contactInfo.email}
                    onChange={handleContactChange}
                  />
                  <Input
                    label="Phone"
                    name="phone"
                    placeholder="9876543210"
                    value={contactInfo.phone}
                    onChange={handleContactChange}
                  />
                  <Input
                    label="WhatsApp"
                    name="whatsapp"
                    placeholder="9876543210"
                    value={contactInfo.whatsapp}
                    onChange={handleContactChange}
                  />
                  <Input
                    label="Admission Office Number"
                    name="admissionOffice"
                    placeholder="0755-123456"
                    value={contactInfo.admissionOffice}
                    onChange={handleContactChange}
                  />
                </div>
              </Section>

              {/* Additional Info */}
              <Section title="Additional Information" card>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Input
                    label="Established Year"
                    name="establishedYear"
                    placeholder="e.g. 1965"
                    value={additionalInfo.establishedYear}
                    onChange={handleAdditionalChange}
                  />
                  <Input
                    label="Accreditation"
                    name="accreditation"
                    placeholder="e.g. NAAC A+"
                    value={additionalInfo.accreditation}
                    onChange={handleAdditionalChange}
                  />
                </div>

                <div className="grid sm:grid-cols-3 gap-3 mt-3">
                  <Input
                    label="Average Package"
                    name="avgPackage"
                    placeholder="₹6 LPA"
                    value={additionalInfo.avgPackage}
                    onChange={handleAdditionalChange}
                  />
                  <Input
                    label="Placement Rate"
                    name="placementRate"
                    placeholder="85%"
                    value={additionalInfo.placementRate}
                    onChange={handleAdditionalChange}
                  />
                  <Input
                    label="Top Recruiters"
                    name="recruiters"
                    placeholder="Infosys, TCS, Wipro (comma separated)"
                    value={additionalInfo.recruiters}
                    onChange={handleAdditionalChange}
                  />
                </div>
              </Section>

              <SaveBtn text={saving ? "Saving..." : "Save All Details"} disabled={saving} />
            </form>
          )}

          {/* ================ FALLBACK QUESTIONS ================= */}
          {activeTab === "fallback" && (
            <div className="mt-3 space-y-4">
              <Section title="Fallback Questions (AI couldn't answer)" card>
                {fallbackQuestions.length === 0 ? (
                  <p className="text-sm text-gray-700 text-center">
                    No fallback questions yet. All queries are being answered
                    correctly.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {fallbackQuestions.map((item) => (
                      <div
                        key={item.id}
                        className="bg-[#F3F7FF] rounded-2xl px-4 py-3 border border-gray-200"
                      >
                        <p className="text-sm text-gray-900 mb-2">
                          {item.question}
                        </p>
                        <div className="flex flex-wrap justify-between gap-2 text-[0.7rem] text-gray-600">
                          <span className="px-2 py-1 rounded-full bg-white border border-gray-200">
                            Source: {item.source}
                          </span>
                          <span>{item.createdAt}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Section>
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
};

/* ---------------- COMPONENTS ---------------- */

const Field = ({ label, ...props }) => (
  <div>
    <label className="block text-xs mb-1">{label}</label>
    <input
      {...props}
      className="w-full px-3 py-2 bg-[#F3F7FF] border border-gray-300 rounded-xl text-sm focus:outline-none"
    />
  </div>
);

const TextArea = ({ label, ...props }) => (
  <div>
    <label className="block text-xs mb-1">{label}</label>
    <textarea
      {...props}
      className="w-full px-3 py-2 bg-[#F3F7FF] border border-gray-300 rounded-xl text-sm resize-none focus:outline-none"
    />
  </div>
);

const Section = ({ title, children, card }) => (
  <div>
    <h3 className="text-base font-semibold text-gray-900 mb-2">{title}</h3>
    <div className={card ? "bg-white rounded-2xl px-4 py-4 space-y-3" : ""}>
      {children}
    </div>
  </div>
);

const Input = ({ label, ...props }) => (
  <div>
    {label && <label className="block text-xs mb-1">{label}</label>}
    <input
      {...props}
      className="w-full px-3 py-2 bg-[#F3F7FF] border border-gray-300 rounded-lg text-sm focus:outline-none"
    />
  </div>
);

const FeeInput = (props) => <Input type="number" {...props} />;

const SaveBtn = ({ text, disabled }) => (
  <button 
    type="submit"
    disabled={disabled}
    className="bg-[#5A97E6] hover:bg-[#3B7DDD] text-white font-semibold w-full rounded-xl py-2.5 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {text}
  </button>
);

export default UpgradeData;
