import { useState, useEffect } from 'react'
import './App.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, useNavigate } from 'react-router-dom'
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
import ConfigureKeys from './components/configure_keys'
import { RingLoader } from './components/Loader'
const api_url = import.meta.env.VITE_API_URL






function App() {

  const { user, isSignedIn, isLoaded } = useUser();
  const { getToken } = useAuth();

  // Replace localStorage with React state
  const [userSynced, setUserSynced] = useState(false);
  const [syncInProgress, setSyncInProgress] = useState(false);



  // check saved api keys 
  const [encryptedApiKey, setencryptedApiKey] = useState("")
  const [keyFetched, setKeyFetched] = useState(false);
  // navigate=useNavigate();

  useEffect(() => {
    if (!isLoaded) return;

    if (!user?.id) {
      console.log("No user authenticated");
      setencryptedApiKey("");
      setKeyFetched(true);
      return;
    }

    const getkeys = async () => {
      try {
        const res = await fetch(`${api_url}/api/getkeys`, {
          method: "GET",
          headers: {
            'userId': user.id,
            "Content-Type": "application/json"
          },
        });

        if (!res.ok) throw new Error("Failed to fetch key");

        const data = await res.json();
        console.log("Key data received:", data);

        if (data.status) {
          setencryptedApiKey(data.key)
        }
      } catch (error) {
        console.error("Error fetching keys:", error);
      } finally {
        setKeyFetched(true);
      }
    };

    getkeys();
  }, [isLoaded, user?.id, api_url]);



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
  if (!isLoaded || (user && !keyFetched)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <RingLoader text="Initializing..." />
      </div>
    );
  }








  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path='/' element={<Home encryptedApiKey={encryptedApiKey} />} />
        <Route path='/login' element={<Login routing="path" path="/login" />} />
        <Route path='/signup' element={<Signup routing="path" path="/signup" />} />
        <Route path='/normal/new' element={<ChatPage routing="path" path="/normal/new" Headline="Normal" />} />
        <Route path='/astro/new' element={<ChatPage routing="path" path="/astro/new" Headline="Astro" />} />
        <Route path='/code/new' element={<ChatPage Headline="Code" />} />
        <Route path='/therapist/new' element={<ChatPage Headline="Therapist" />} />
        <Route path='/friend/new' element={<ChatPage Headline="Friend" />} />
        <Route path='/movie/new' element={<ChatPage Headline="Movie" />} />
        <Route path='/study/new' element={<ChatPage Headline="Study" />} />
        <Route path='/career/new' element={<ChatPage Headline="Career" />} />


        <Route path='/configure_keys' element={<ConfigureKeys encryptedApiKey={encryptedApiKey} setencryptedApiKey={setencryptedApiKey} />} />

        <Route path='/normal/chats/:chatId' element={<ChatPage Headline="Normal" />} />
        <Route path='/astro/chats/:chatId' element={<ChatPage Headline="Astro" />} />
        <Route path='/code/chats/:chatId' element={<ChatPage Headline="Code" />} />
        <Route path='/therapist/chats/:chatId' element={<ChatPage Headline="Therapist" />} />
        <Route path='/friend/chats/:chatId' element={<ChatPage Headline="Friend" />} />
        <Route path='/movie/chats/:chatId' element={<ChatPage Headline="Movie" />} />
        <Route path='/study/chats/:chatId' element={<ChatPage Headline="Study" />} />
        <Route path='/career/chats/:chatId' element={<ChatPage Headline="Career" />} />
      </>
    )
  )

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;