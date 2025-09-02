import { useState } from "react";
import API from "../api";

const TechnicianDashboard = ({ logout }) => {
  const [formData, setFormData] = useState({
    patientName: "",
    patientId: "",
    scanType: "",
    region: "",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imageFiles.length === 0) {
      setMessage("Please select at least one image file.");
      return;
    }
    setUploading(true);
    setMessage("");
    try {
      for (const file of imageFiles) {
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) =>
          data.append(key, value)
        );
        data.append("image", file);
        await API.post("/api/upload", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setMessage("All scans uploaded successfully!");
      setFormData({ patientName: "", patientId: "", scanType: "", region: "" });
      setImageFiles([]);
      e.target.reset();
    } catch (err) {
      console.error("Upload error:", err);
      setMessage(
        err.response?.data?.error || "Upload failed. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Technician Dashboard
            </h1>
            <p className="text-sm text-gray-600">
              Upload and manage patient scans
            </p>
          </div>
          <button
            onClick={logout}
            className="bg-blue-600 hover:bg-white hover:text-blue-600 duration-150 border-2 hover:border-blue-600 text-white px-4 py-2 rounded-md flex items-center"
          >
            <i className="fas fa-sign-out-alt mr-2"></i> Logout
          </button>
        </div>
      </header>

      {/* Upload Form */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 border-b pb-2">
            <i className="fas fa-upload mr-2 text-blue-600"></i>
            Upload New Scan
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  placeholder="Enter patient name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  placeholder="Enter patient ID"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scan Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="scanType"
                  value={formData.scanType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select scan type</option>
                  <option value="X-Ray">X-Ray</option>
                  <option value="CT Scan">CT Scan</option>
                  <option value="Intraoral">Intraoral</option>
                  <option value="Panoramic">Panoramic</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Region <span className="text-red-500">*</span>
                </label>
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select region</option>
                  <option value="Upper Jaw">Upper Jaw</option>
                  <option value="Lower Jaw">Lower Jaw</option>
                  <option value="Full Mouth">Full Mouth</option>
                  <option value="Anterior">Anterior</option>
                  <option value="Posterior">Posterior</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Image(s) <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>Upload files</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
              {imageFiles.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    Selected files: {imageFiles.length}
                  </p>
                  <ul className="mt-1 text-xs text-gray-500">
                    {imageFiles.map((file, index) => (
                      <li key={index} className="truncate">
                        {file.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {message && (
              <div
                className={`rounded-md p-4 ${
                  message.includes("successfully")
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    {message.includes("successfully") ? (
                      <i className="fas fa-check-circle text-green-400"></i>
                    ) : (
                      <i className="fas fa-exclamation-circle text-red-400"></i>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm">{message}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={uploading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Uploading...
                  </>
                ) : (
                  <>
                    <i className="fas fa-cloud-upload-alt mr-2"></i>
                    Upload Scans
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TechnicianDashboard;
