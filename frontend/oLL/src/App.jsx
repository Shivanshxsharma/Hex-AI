import { useState, useEffect } from 'react'
import './App.css'
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from 'react-router-dom'
import ChatInput from './components/ChatInput'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import ChatBubble from './components/ChatBubble'
import PersonalityCard from './components/PersonalityCard'
import Home from './pages/Home'
import ChatPage from './pages/ChatPage'

import { useUser, useAuth, } from '@clerk/clerk-react'
import Login from './pages/Login'
import SignConfirmation from './components/SignConfirmation'
import Signup from './pages/Signup'
const api_url = import.meta.env.VITE_API_URL

// Move router outside component - THIS IS IMPORTANT!
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<Home />} />
      {/* ADD routing="path" and path props - THIS FIXES THE ISSUE! */}
      <Route path='/login' element={<Login routing="path" path="/login" />} />
      <Route path='/signup' element={<Signup routing="path" path="/signup" />} />
      nu
      <Route path='/normal/new' element={<ChatPage Headline="Normal" />} />
      <Route path='/astro/new' element={<ChatPage Headline="Astro"/>} />
      <Route path='/code/new' element={<ChatPage Headline="Code"/>} />
      <Route path='/therapist/new' element={<ChatPage Headline="Therapist"/>} />
      <Route path='/friend/new' element={<ChatPage Headline="Friend"/>} />
      <Route path='/movie/new' element={<ChatPage Headline="Movie"/>} />
      <Route path='/study/new' element={<ChatPage Headline="Study"/>} />
      <Route path='/career/new' element={<ChatPage Headline="Career"/>} />

      <Route path='/normal/chats/:chatId' element={<ChatPage Headline="Normal" />} />
      <Route path='/astro/chats/:chatId' element={<ChatPage Headline="Astro"/>} />
      <Route path='/code/chats/:chatId' element={<ChatPage Headline="Code"/>} />
      <Route path='/therapist/chats/:chatId' element={<ChatPage Headline="Therapist"/>} />
      <Route path='/friend/chats/:chatId' element={<ChatPage Headline="Friend"/>} />
      <Route path='/movie/chats/:chatId' element={<ChatPage Headline="Movie"/>} />
      <Route path='/study/chats/:chatId' element={<ChatPage Headline="Study"/>} />
      <Route path='/career/chats/:chatId' element={<ChatPage Headline="Career"/>} />
    </>
  )
)

function App() {
  // ADD isLoaded - THIS IS CRUCIAL!
  const {user, isSignedIn, isLoaded} = useUser();
  const { getToken } = useAuth();
  
  // Replace localStorage with React state
  const [userSynced, setUserSynced] = useState(false);
  const [syncInProgress, setSyncInProgress] = useState(false);

  useEffect(() => {
    // ADD isLoaded check - WAIT FOR CLERK TO INITIALIZE!
    if (!isLoaded || !isSignedIn || !user || userSynced || syncInProgress) return;
    
    const SignInHandler = async () => {
      setSyncInProgress(true);
      try {
        const token = await getToken();
        const response = await fetch(`${api_url}/api/user`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        console.log("✅ User synced successfully");
        setUserSynced(true);
      } catch (error) {
        console.error("❌ Error syncing user:", error);
      } finally {
        setSyncInProgress(false);
      }
    }

    SignInHandler();
  }, [user?.id, isSignedIn, isLoaded, getToken, userSynced, syncInProgress])

  // ADD loading state - SHOW LOADING WHILE CLERK INITIALIZES!
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <>
      <RouterProvider router={router}/>
    </>
  );
}

export default App;