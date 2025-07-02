import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';

const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const [userData, setUserData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const user_data = localStorage.getItem("user_data");

    if (user_data == null) {
      router.replace("/login"); 
    } else {
      router.replace("/viewer"); 
      setUserData(user_data);
    }
  }, []);   

  return (
    <StateContext.Provider value={{ userData, setUserData }}> 
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
