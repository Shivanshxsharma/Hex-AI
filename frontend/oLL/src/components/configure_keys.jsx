import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Edit2, Save, X } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router';

const ConfigureKeys = ({encryptedApiKey}) => {
  const [apiKey, setApiKey] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [showKey, setShowKey] = useState(false);
const{user,isLoaded}=useUser();
const navigate = useNavigate();

const api_url =import.meta.env.VITE_API_URL


useEffect(() => {
  
if(encryptedApiKey) setApiKey(encryptedApiKey)


}, [encryptedApiKey])





  const handleAddKey = async() => {
    if (editValue.trim()) {
if(isLoaded&&!user||!user.id){
    console.log("Failed to set key")
}else{
      try {
    const res = await fetch(`${api_url}/api/setkeys`, {
      method: "PUT",
      headers: {
         "Content-Type": "application/json"
       },
      body:JSON.stringify({
        'userId':user.id,
        "apikey":editValue

      })
    });

    if (!res.ok) {
      throw new Error("Failed to set key");
    }

    const data = await res.json();
    console.log(data);
    if(data.status)setApiKey(data.key)


  } catch (error) {
    console.error("Error setting keys:", error);
  }
      setEditValue('');
      setIsEditing(false);
    }
  };
  }








  const startEdit = () => {
    setIsEditing(true);
    setEditValue(apiKey);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditValue('');
  };

  const maskKey = (key) => {
    if (!key) return '';
    if (key.length <= 8) return '•'.repeat(key.length);
    return key.slice(0, 4) + '•'.repeat(key.length - 8) + key.slice(-4);
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Add or Edit api keys</h1>
          <p className="text-gray-400">Configure your API key</p>
        </div>

        {/* Main Content */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          {!apiKey ? (
            // Add New Key
            <div>
              <h2 className="text-xl font-semibold mb-4">Add API Key</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Enter Your API Key
                  </label>
                  <input
                    type="password"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    placeholder="Enter your API key"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                  />
                </div>
                <button
                  onClick={handleAddKey}
                  disabled={!editValue.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Add API Key
                </button>
              </div>
            </div>
          ) : (
            // Display/Edit Key
            <div>
              <h2 className="text-xl font-semibold mb-4">Your API Key</h2>
              
              {isEditing ? (
                // Edit Mode
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddKey}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                    >
                      <Save size={18} />
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
                    >
                      <X size={18} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <button
                      onClick={() => setShowKey(!showKey)}
                      className="p-2 hover:bg-gray-700 rounded transition-colors"
                      title={showKey ? "Hide key" : "Show key"}
                    >
                      {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    <button
                      onClick={startEdit}
                      className="p-2 hover:bg-gray-700 rounded transition-colors"
                      title="Edit key"
                    >
                      <Edit2 size={20} />
                    </button>
                  </div>
                  <div className="bg-gray-900 px-4 py-3 rounded-lg font-mono text-sm break-all border border-gray-700">
                    {showKey ? apiKey : maskKey(apiKey)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfigureKeys;