import { Button,  Input } from '@mui/material';
import React, { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';

interface ExcelRow {
  id: number;
  name: string;
  [key: string]: any;
}

const Dashboard: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<ExcelRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newName, setNewName] = useState<string>('');

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError(null);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as ExcelRow[];

      setData(
        jsonData.map((row, index) => ({
          id: row.id || index + 1,
          name: row.name || 'Unknown',
        })),
      );
    } catch (error) {
      console.error('Error reading file:', error);
      setError('Error reading file. Please try a different file.');
    }
  }, []);

  // get last id is number
  const getLastId = () => {
    return data.length > 0 ? data[data.length - 1].id : 0;
  };

  // Create operation
  const handleCreate = useCallback(() => {
    if (newName.trim()) {
      setData((prevData) => [...prevData, { id: getLastId() + 1, name: newName.trim() }]);
      setNewName('');
    }
  }, [newName]);

  // Update operation
  const handleUpdate = useCallback((id: number, newName: string) => {
    setData((prevData) => prevData.map((row) => (row.id === id ? { ...row, name: newName } : row)));
    setEditingId(null);
  }, []);

  // Delete operation
  const handleDelete = useCallback((id: number) => {
    setData((prevData) => prevData.filter((row) => row.id !== id));
  }, []);

  // Export function
  const handleExport = useCallback(() => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'exported_data.xlsx');
  }, [data]);

  return (
    <div className="p-4">
      <h1>Excel CRUD Dashboard</h1>
      <Input type="file" onChange={handleFileChange} className="mb-4" />
      {file && <h2 className="text-lg font-semibold mb-2">Selected File: {file.name}</h2>}
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <div>
        <Input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Enter new name"
        />
        <Button onClick={handleCreate} variant="contained" color="primary">
          Add New
        </Button>
      </div>

      {data.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Data:</h2>
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">ID</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map(({ id, name }) => (
                <tr key={id}>
                  <td className="border p-2">{id}</td>
                  <td className="border p-2">
                    {editingId === id ? (
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => handleUpdate(id, e.target.value)}
                        onBlur={() => setEditingId(null)}
                        className="border p-1"
                      />
                    ) : (
                      <span onDoubleClick={() => setEditingId(id)}>{name}</span>
                    )}
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => setEditingId(id)}
                      className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={handleExport}
            className="mt-4 bg-purple-500 text-white px-4 py-2 rounded"
          >
            Export to Excel
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
