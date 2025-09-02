import { useState, useEffect } from "react";
import API from "../api";
import jsPDF from "jspdf";

const DentistDashboard = ({ logout }) => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchScans();
  }, []);

  const fetchScans = async () => {
    try {
      const { data } = await API.get("/api/scans");
      setScans(data);
    } catch (err) {
      alert("Failed to fetch scans.", err);
    } finally {
      setLoading(false);
    }
  };

  const generatePDFReport = (scan) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(59, 130, 246); // #3b82f6
    doc.text("OralVis Healthcare - Dental Scan Report", 20, 30);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black
    doc.text(`Patient Name: ${scan.patientName}`, 20, 50);
    doc.text(`Patient ID: ${scan.patientId}`, 20, 60);
    doc.text(`Scan Type: ${scan.scanType}`, 20, 70);
    doc.text(`Region: ${scan.region}`, 20, 80);
    doc.text(`Upload Date: ${new Date(scan.uploadDate).toLocaleDateString()}`, 20, 90);
    
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const imgData = canvas.toDataURL("image/jpeg");
        doc.addImage(imgData, "JPEG", 20, 110, 160, 120);
        doc.save(`dental-scan-${scan.patientId}-${scan.id}.pdf`);
      };
      img.src = scan.imageUrl;
    } catch {
      doc.text("Scan image: see original file", 20, 110);
      doc.save(`dental-scan-${scan.patientId}-${scan.id}.pdf`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this scan?")) return;
    try {
      await API.delete(`/api/scans/${id}`);
      setScans(scans.filter((s) => s.id !== id));
    } catch {
      alert("Failed to delete scan.");
    }
  };

  const filteredScans = scans.filter(scan => {
    const matchesFilter = filter === "all" || scan.scanType === filter;
    const matchesSearch = scan.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         scan.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading scans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dentist Dashboard</h1>
            <p className="text-sm text-gray-600">Manage patient scans and reports</p>
          </div>
          <button 
            onClick={logout} 
            className="bg-blue-600 hover:bg-white hover:text-blue-600 border-2 duration-150 hover:border-2 hover:border-blue-600 text-white px-4 py-2 rounded-md flex items-center"
          >
            <i className="fas fa-sign-out-alt mr-2"></i> Logout
          </button>
        </div>
      </header>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-search text-gray-400"></i>
                </div>
                <input
                  type="text"
                  placeholder="Search patients or IDs..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <select 
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Scan Types</option>
                <option value="X-Ray">X-Ray</option>
                <option value="CT">CT Scan</option>
                <option value="Panoramic">Panoramic</option>
                <option value="Intraoral">Intraoral</option>
              </select>
              <button 
                onClick={fetchScans}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
              >
                <i className="fas fa-sync-alt mr-2"></i> Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Scans Grid */}
        {filteredScans.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <i className="fas fa-folder-open text-4xl text-gray-300 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {scans.length === 0 ? "No scans uploaded yet." : "No scans match your search."}
            </h3>
            <p className="text-gray-500">
              {scans.length === 0 
                ? "Upload new scans to get started." 
                : "Try adjusting your search or filter criteria."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredScans.map((scan) => (
              <div key={scan.id} className="bg-white rounded-lg shadow overflow-hidden transition-transform duration-200 hover:shadow-md">
                <div className="relative">
                  <img
                    src={scan.imageUrl}
                    alt={`${scan.patientName} scan`}
                    className="w-full h-48 object-cover cursor-pointer"
                    onClick={() => setSelectedImage(scan.imageUrl)}
                  />
                  <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    {scan.scanType}
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-lg font-semibold text-gray-900">{scan.patientName}</h2>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      ID: {scan.patientId}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <i className="fas fa-tooth mr-2"></i>
                    <span>{scan.region}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <i className="far fa-calendar-alt mr-2"></i>
                    <span>{new Date(scan.uploadDate).toLocaleDateString()}</span>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedImage(scan.imageUrl)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded flex items-center justify-center text-sm"
                    >
                      <i className="fas fa-eye mr-1"></i> View
                    </button>
                    <button
                      onClick={() => generatePDFReport(scan)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded flex items-center justify-center text-sm"
                    >
                      <i className="fas fa-download mr-1"></i> Report
                    </button>
                    <button
                      onClick={() => handleDelete(scan.id)}
                      className="flex-1 bg-blue-600 hover:bg-blue-600 text-white py-2 rounded flex items-center justify-center text-sm"
                    >
                      <i className="fas fa-trash mr-1"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full">
            <button
              className="absolute -top-12 right-0 text-white text-2xl"
              onClick={() => setSelectedImage(null)}
            >
              <i className="fas fa-times"></i>
            </button>
            <img 
              src={selectedImage} 
              alt="Scan full view" 
              className="max-w-full max-h-screen mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DentistDashboard;