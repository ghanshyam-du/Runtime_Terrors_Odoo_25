'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const SwapContext = createContext();

export function SwapProvider({ children }) {
  const [swaps, setSwaps] = useState([]);
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    const savedSwaps = localStorage.getItem('swaps');
    const savedFeedback = localStorage.getItem('feedback');
    
    if (savedSwaps) setSwaps(JSON.parse(savedSwaps));
    if (savedFeedback) setFeedback(JSON.parse(savedFeedback));
  }, []);

  const createSwapRequest = (requestData) => {
    const newSwap = {
      id: Date.now().toString(),
      ...requestData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    const updatedSwaps = [...swaps, newSwap];
    setSwaps(updatedSwaps);
    localStorage.setItem('swaps', JSON.stringify(updatedSwaps));
    
    return newSwap;
  };

  const updateSwapStatus = (swapId, status) => {
    const updatedSwaps = swaps.map(swap =>
      swap.id === swapId ? { ...swap, status, updatedAt: new Date().toISOString() } : swap
    );
    setSwaps(updatedSwaps);
    localStorage.setItem('swaps', JSON.stringify(updatedSwaps));
  };

  const submitFeedback = (feedbackData) => {
    const newFeedback = {
      id: Date.now().toString(),
      ...feedbackData,
      createdAt: new Date().toISOString()
    };
    
    const updatedFeedback = [...feedback, newFeedback];
    setFeedback(updatedFeedback);
    localStorage.setItem('feedback', JSON.stringify(updatedFeedback));
    
    return newFeedback;
  };

  return (
    <SwapContext.Provider value={{
      swaps,
      feedback,
      createSwapRequest,
      updateSwapStatus,
      submitFeedback
    }}>
      {children}
    </SwapContext.Provider>
  );
}

export const useSwap = () => {
  const context = useContext(SwapContext);
  if (!context) {
    throw new Error('useSwap must be used within a SwapProvider');
  }
  return context;
};