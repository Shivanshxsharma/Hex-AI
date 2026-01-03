import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Edit2, Save, X } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router';

const ConfigureKeys = ({encryptedApiKey}) => {
  const [apiKey, setApiKey] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [showKey, setShowKey] = useState(false);
  const {user, isLoaded} = useUser();
  const navigate = useNavigate();

  const api_url = import.meta.env.VITE_API_URL

  useEffect(() => {
    if(encryptedApiKey) setApiKey(encryptedApiKey)
  }, [encryptedApiKey])

  const handleAddKey = async() => {
    if (editValue.trim()) {
      if(isLoaded && !user || !user.id){
        console.log("Failed to set key")
      } else {
        try {
          const res = await fetch(`${api_url}/api/setkeys`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              'userId': user.id,
              "apikey": editValue
            })
          });

          if (!res.ok) {
            throw new Error("Failed to set key");
          }

          const data = await res.json();
          console.log(data);
          if(data.status) setApiKey(data.key)

        } catch (error) {
          console.error("Error setting keys:", error);
        }
        setEditValue('');
        setIsEditing(false);
      }
    }
  };

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
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-3">Add or Edit API Keys</h1>
          <p className="text-gray-400 text-lg">Configure your API key</p>
        </div>

        {/* Main Content */}
        <div className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800 shadow-2xl">
          {!apiKey ? (
            // Add New Key
            <div>
              <h2 className="text-2xl font-semibold mb-6">Add API Key</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-3 text-gray-300">
                    Enter Your API Key
                  </label>
                  <input
                    type="password"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    placeholder="Enter your API key"
                    className="w-full px-5 py-4 bg-black border border-zinc-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent text-white placeholder-gray-500 transition-all"
                  />
                </div>
                <button
                 id='addKeyButton'
                  onClick={handleAddKey}
                  disabled={!editValue.trim()}
                  className="w-full bg-black text-black hover:bg-gray-200 disabled:bg-zinc-700 disabled:cursor-not-allowed  font-semibold py-4 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:text-gray-500"
                >
                  Add API Key
                </button>
              </div>
            </div>
          ) : (
            // Display/Edit Key
            <div>
              <h2 className="text-2xl font-semibold mb-6">Your API Key</h2>
              
              {isEditing ? (
                // Edit Mode
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full px-5 py-4 bg-black border border-zinc-700 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleAddKey}
                      className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-white hover:bg-gray-200 text-black font-semibold rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <Save size={20} />
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-2xl transition-all duration-200"
                    >
                      <X size={20} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <button
                      onClick={() => setShowKey(!showKey)}
                      className="p-3 hover:bg-zinc-800 rounded-xl transition-all duration-200"
                      title={showKey ? "Hide key" : "Show key"}
                    >
                      {showKey ? <EyeOff size={22} /> : <Eye size={22} />}
                    </button>
                    <button
                      onClick={startEdit}
                      className="p-3 hover:bg-zinc-800 rounded-xl transition-all duration-200"
                      title="Edit key"
                    >
                      <Edit2 size={22} />
                    </button>
                  </div>
                  <div className="bg-black px-6 py-4 rounded-2xl font-mono text-sm break-all border border-zinc-800">
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