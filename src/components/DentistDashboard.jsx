import { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";

const DentistDashboard = () => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchScans();
  }, []);

  const fetchScans = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("oralvisbackend-production.up.railway.app/api/scans", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setScans(response.data);
    } catch (error) {
      console.error("Failed to fetch scans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteScan = async (scanId) => {
    if (!window.confirm("Are you sure you want to delete this scan?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`oralvisbackend-production.up.railway.app/api/scans/${scanId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Remove scan locally after successful delete
      setScans((prev) => prev.filter((scan) => scan.id !== scanId));
    } catch (error) {
      alert("Failed to delete the scan.");
      console.error("Delete scan error:", error);
    }
  };

  const generatePDFReport = async (scan) => {
    const doc = new jsPDF();

    // Add header
    doc.setFontSize(20);
    doc.text("OralVis Healthcare - Dental Scan Report", 20, 30);

    // Add patient information
    doc.setFontSize(12);
    doc.text(`Patient Name: ${scan.patientName}`, 20, 50);
    doc.text(`Patient ID: ${scan.patientId}`, 20, 60);
    doc.text(`Scan Type: ${scan.scanType}`, 20, 70);
    doc.text(`Region: ${scan.region}`, 20, 80);
    doc.text(
      `Upload Date: ${new Date(scan.uploadDate).toLocaleDateString()}`,
      20,
      90
    );

    // Add image if possible (simplified)
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
    } catch (error) {
      console.log(error);
      doc.text("Scan image: See original file", 20, 110);
      doc.save(`dental-scan-${scan.patientId}-${scan.id}.pdf`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading scans...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dental Scans</h1>

        {scans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No scans uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scans.map((scan) => (
              <div
                key={scan.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <img
                  src={scan.imageUrl}
                  alt={`Scan for ${scan.patientName}`}
                  className="w-full h-48 object-cover cursor-pointer"
                  onClick={() => setSelectedImage(scan.imageUrl)}
                />

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {scan.patientName}
                  </h3>
                  <p className="text-sm text-gray-600">ID: {scan.patientId}</p>
                  <p className="text-sm text-gray-600">
                    {scan.scanType} - {scan.region}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(scan.uploadDate).toLocaleDateString()}
                  </p>

                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => setSelectedImage(scan.imageUrl)}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
                    >
                      View Full Image
                    </button>
                    <button
                      onClick={() => generatePDFReport(scan)}
                      className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700"
                    >
                      Download Report
                    </button>
                    <button
                      onClick={() => handleDeleteScan(scan.id)}
                      className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for full image view */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="relative bg-white p-4 rounded shadow-lg max-w-3xl max-h-full">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-0 right-0 text-black hover:text-gray-900 font-bold text-xl"
              >
                &times; {/* X close icon */}
              </button>
              <img
                src={selectedImage}
                alt="Full Scan"
                className="max-w-full max-h-[80vh] object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DentistDashboard;
