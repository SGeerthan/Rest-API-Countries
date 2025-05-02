import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const SessionContext = createContext();

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

export const SessionProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  // Update last activity on user interaction
  const updateLastActivity = () => {
    setLastActivity(Date.now());
  };

  // Check session timeout
  useEffect(() => {
    const checkSessionTimeout = () => {
      const currentTime = Date.now();
      if (currentTime - lastActivity > SESSION_TIMEOUT) {
        handleLogout();
      }
    };

    const interval = setInterval(checkSessionTimeout, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [lastActivity]);

  // Add event listeners for user activity
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const handleUserActivity = () => {
      updateLastActivity();
    };

    events.forEach(event => {
      document.addEventListener(event, handleUserActivity);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });
    };
  }, []);

  // Handle user authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        // Fetch user details from Firestore
        const userDoc = await getDoc(doc(db, "Users", user.uid));
        if (userDoc.exists()) {
          setUserDetails(userDoc.data());
          // Update last login timestamp
          await updateDoc(doc(db, "Users", user.uid), {
            lastLogin: new Date().toISOString()
          });
        }
      } else {
        setUser(null);
        setUserDetails(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      if (user) {
        // Update last logout timestamp
        await updateDoc(doc(db, "Users", user.uid), {
          lastLogout: new Date().toISOString()
        });
      }
      await signOut(auth);
      setUser(null);
      setUserDetails(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Refresh session
  const refreshSession = async () => {
    if (user) {
      try {
        await updateDoc(doc(db, "Users", user.uid), {
          lastActivity: new Date().toISOString()
        });
        updateLastActivity();
      } catch (error) {
        console.error('Session refresh error:', error);
      }
    }
  };

  const value = {
    user,
    userDetails,
    loading,
    handleLogout,
    refreshSession,
    updateLastActivity
  };

  return (
    <SessionContext.Provider value={value}>
      {!loading && children}
    </SessionContext.Provider>
  );
}; 