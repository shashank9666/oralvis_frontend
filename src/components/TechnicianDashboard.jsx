import { useState } from 'react';
import axios from 'axios';

const TechnicianDashboard = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    patientId: '',
    scanType: '',
    region: '',
  });
  const [imageFiles, setImageFiles] = useState([]); // supports multiple files
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  const handleFileChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imageFiles.length === 0) {
      setMessage('Please select at least one image file.');
      return;
    }
    setUploading(true);
    setMessage('');

    try {
      for (const imageFile of imageFiles) {
        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
          formDataToSend.append(key, formData[key]);
        });
        formDataToSend.append('image', imageFile);

        const token = localStorage.getItem('token');
        await axios.post(`${backendUrl}/api/upload`, formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      setMessage('All scans uploaded successfully!');
      setFormData({ patientName: '', patientId: '', scanType: '', region: '' });
      setImageFiles([]);
      e.target.reset(); // clear native file input
    } catch {
      setMessage('Upload failed. Please try again.');
      console.error('Upload error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full bg-white shadow-lg rounded-lg p-8 space-y-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center">Upload Dental Scans</h2>

        {message && (
          <div
            className={`p-4 rounded ${
              message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            } text-center`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Patient Name</label>
              <input
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                placeholder="Enter patient name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Patient ID</label>
              <input
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.patientId}
                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                placeholder="Enter patient ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Scan Type</label>
              <select
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.scanType}
                onChange={(e) => setFormData({ ...formData, scanType: e.target.value })}
              >
                <option value="">Select scan type</option>
                <option value="X-Ray">X-Ray</option>
                <option value="CT Scan">CT Scan</option>
                <option value="Intraoral">Intraoral</option>
                <option value="Panoramic">Panoramic</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Region</label>
              <select
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
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

          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Custom file input button */}
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Choose Image File
            </label>
            <input
              id="file-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {/* Previews */}
            <div className="flex space-x-2 overflow-x-auto max-w-xs">
              {imageFiles.map((file, idx) => {
                const url = URL.createObjectURL(file);
                return (
                  <img
                    key={idx}
                    src={url}
                    alt={`Preview ${idx + 1}`}
                    className="h-16 w-16 object-cover rounded border border-gray-300"
                    onLoad={() => URL.revokeObjectURL(url)}
                  />
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full py-2 px-6 rounded-md bg-indigo-600 text-white text-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload Scan'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TechnicianDashboard;
