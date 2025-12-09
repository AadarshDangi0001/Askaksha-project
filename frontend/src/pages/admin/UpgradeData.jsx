import React, { useState } from "react";

const UpgradeData = () => {
  const [activeTab, setActiveTab] = useState("basic");
  const [collegeCode] = useState(
    () => "CLG-" + Math.random().toString(36).substring(2, 8).toUpperCase()
  );
  const [copied, setCopied] = useState(false);

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
    otherFee: "",
  });

  const [scholarship, setScholarship] = useState({
    name: "",
    state: "",
    amount: "",
    date: "",
    deadlineEvent: "",
    deadlineDate: "",
    description: "",
  });

  const [courses, setCourses] = useState([]);

  const [deadlineInfo, setDeadlineInfo] = useState({
    event: "",
    date: "",
    description: "",
  });

  const [facilities, setFacilities] = useState("");

  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
    admissionOffice: "",
  });

  const [additionalInfo, setAdditionalInfo] = useState({
    establishedYear: "",
    accreditation: "",
    avgPackage: "",
    placementRate: "",
    recruiters: "",
  });

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
      { id: Date.now(), name: "", duration: "", level: "" },
    ]);
  };

  const handleCourseChange = (id, field, value) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(collegeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="w-full mt-10 min-h-screen overflow-y-auto pb-24">
      <div className="w-full px-8 lg:px-16 py-6 mt-20 lg:mt-6">
        {/* College Code */}
        <div className="bg-[#CAECFF] rounded-3xl shadow-md p-4 lg:p-6 mb-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">College Data</h2>
            <p className="text-sm text-gray-700">Manage college information.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#F3F7FF] border border-gray-300 rounded-2xl px-4 py-2 font-mono text-sm">
              Code: {collegeCode}
            </div>
            <button
              onClick={handleCopyCode}
              className="bg-[#3B7DDD] hover:bg-[#5A97E4] text-white px-3 py-2 rounded-xl text-xs"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

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
            <form className="space-y-4 mt-3">
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

              <SaveBtn text="Save Changes" />
            </form>
          )}

          {/* ================ DETAILED ================= */}
          {activeTab === "detailed" && (
            <form className="space-y-6 mt-3">
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
                    label="Other Fee"
                    name="otherFee"
                    placeholder="e.g. 5000"
                    value={feeInfo.otherFee}
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
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="bg-white rounded-2xl px-4 py-3 grid sm:grid-cols-3 gap-3"
                    >
                      <Input
                        label="Course Name"
                        placeholder="e.g. B.Tech CSE"
                        value={course.name}
                        onChange={(e) =>
                          handleCourseChange(course.id, "name", e.target.value)
                        }
                      />
                      <Input
                        label="Duration"
                        placeholder="e.g. 4 Years"
                        value={course.duration}
                        onChange={(e) =>
                          handleCourseChange(
                            course.id,
                            "duration",
                            e.target.value
                          )
                        }
                      />
                      <Input
                        label="Department / Level"
                        placeholder="e.g. UG / PG"
                        value={course.level}
                        onChange={(e) =>
                          handleCourseChange(
                            course.id,
                            "level",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              </Section>

              {/* Scholarships */}
              <Section title="Scholarships" card>
                <ScholarshipInputs
                  scholarship={scholarship}
                  onChange={handleScholarshipChange}
                />
              </Section>

              {/* Important Deadline */}
              <Section title="Important Deadlines" card>
                <Input
                  label="Event Name"
                  name="event"
                  placeholder="e.g. Entrance Exam Date"
                  onChange={handleDeadlineChange}
                />
                <Input
                  label="Deadline Date"
                  type="date"
                  name="date"
                  onChange={handleDeadlineChange}
                />
                <TextArea
                  label="Description"
                  name="description"
                  placeholder="Important submission reminder"
                  rows={2}
                  onChange={handleDeadlineChange}
                />
              </Section>

              {/* Facilities */}
              <Section title="Facilities" card>
                <Input
                  placeholder="Library, Hostel, Sports Complex"
                  value={facilities}
                  onChange={(e) => setFacilities(e.target.value)}
                />
              </Section>

              {/* Contact Info */}
              <Section title="Contact Information" card>
                <div className="grid sm:grid-cols-3 gap-3">
                  <Input
                    label="Email"
                    name="email"
                    placeholder="college@example.com"
                    onChange={handleContactChange}
                  />
                  <Input
                    label="Phone"
                    name="phone"
                    placeholder="9876543210"
                    onChange={handleContactChange}
                  />
                  <Input
                    label="Admission Office Number"
                    name="admissionOffice"
                    placeholder="0755-123456"
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
                    onChange={handleAdditionalChange}
                  />
                  <Input
                    label="Accreditation"
                    name="accreditation"
                    placeholder="e.g. NAAC A+"
                    onChange={handleAdditionalChange}
                  />
                </div>

                <div className="grid sm:grid-cols-3 gap-3 mt-3">
                  <Input
                    label="Average Package"
                    name="avgPackage"
                    placeholder="₹6 LPA"
                    onChange={handleAdditionalChange}
                  />
                  <Input
                    label="Placement Rate"
                    name="placementRate"
                    placeholder="85%"
                    onChange={handleAdditionalChange}
                  />
                  <Input
                    label="Top Recruiters"
                    name="recruiters"
                    placeholder="Infosys, TCS, Wipro"
                    onChange={handleAdditionalChange}
                  />
                </div>
              </Section>

              <SaveBtn text="Save All Details" />
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

const ScholarshipInputs = ({ scholarship, onChange }) => (
  <div className="space-y-3">
    <div className="grid sm:grid-cols-4 gap-3">
      <Input
        label="Scholarship Name"
        name="name"
        placeholder="e.g. Merit Scholarship"
        value={scholarship.name}
        onChange={onChange}
      />
      <Input
        label="State"
        name="state"
        placeholder="e.g. Madhya Pradesh"
        value={scholarship.state}
        onChange={onChange}
      />
      <Input
        label="Amount"
        type="number"
        name="amount"
        placeholder="e.g. 25000"
        value={scholarship.amount}
        onChange={onChange}
      />
      <Input
        label="Applicable Date"
        type="date"
        name="date"
        value={scholarship.date}
        onChange={onChange}
      />
    </div>
    <div className="grid sm:grid-cols-3 gap-3">
      <Input
        label="Deadline Event"
        name="deadlineEvent"
        placeholder="e.g. Application Last Date"
        value={scholarship.deadlineEvent}
        onChange={onChange}
      />
      <Input
        label="Deadline Date"
        type="date"
        name="deadlineDate"
        value={scholarship.deadlineDate}
        onChange={onChange}
      />
      <Input
        label="Description"
        name="description"
        placeholder="Short scholarship note"
        value={scholarship.description}
        onChange={onChange}
      />
    </div>
  </div>
);

const SaveBtn = ({ text }) => (
  <button className="bg-[#5A97E6] hover:bg-[#3B7DDD] text-white font-semibold w-full rounded-xl py-2.5 mt-2">
    {text}
  </button>
);

export default UpgradeData;
