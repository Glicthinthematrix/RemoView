// FIX: Replaced placeholder content with the main App component to orchestrate application state and navigation.
import React, { useState } from 'react';
import { AppState, SessionResult } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import HomeScreen from './components/HomeScreen';
import ChallengeScreen from './components/ChallengeScreen';
import ResultsScreen from './components/ResultsScreen';
import HistoryScreen from './components/HistoryScreen';
import Header from './components/Header';

function App() {
  const [appState, setAppState] = useState<AppState>(AppState.HOME);
  const [sessionHistory, setSessionHistory] = useLocalStorage<SessionResult[]>('sessionHistory', []);
  const [currentResult, setCurrentResult] = useState<SessionResult | null>(null);

  const handleStart = () => {
    setAppState(AppState.CHALLENGE);
  };

  const handleSessionComplete = (result: SessionResult) => {
    setCurrentResult(result);
    setSessionHistory(prevHistory => [result, ...prevHistory]);
    setAppState(AppState.RESULTS);
  };

  const handlePlayAgain = () => {
    setCurrentResult(null);
    setAppState(AppState.CHALLENGE);
  };

  const handleViewHistory = () => {
    setAppState(AppState.HISTORY);
  };

  const handleGoHome = () => {
    setCurrentResult(null);
    setAppState(AppState.HOME);
  };

  const renderScreen = () => {
    switch (appState) {
      case AppState.HOME:
        return <HomeScreen onStart={handleStart} />;
      case AppState.CHALLENGE:
        return <ChallengeScreen onSessionComplete={handleSessionComplete} />;
      case AppState.RESULTS:
        // A fallback to home if currentResult is null, which can happen on page refresh
        return currentResult ? (
          <ResultsScreen
            result={currentResult}
            onPlayAgain={handlePlayAgain}
            onViewHistory={handleViewHistory}
            onGoHome={handleGoHome}
          />
        ) : (
          <HomeScreen onStart={handleStart} />
        );
      case AppState.HISTORY:
        return <HistoryScreen history={sessionHistory} onBack={handleGoHome} />;
      default:
        return <HomeScreen onStart={handleStart} />;
    }
  };

  const showHeader = appState === AppState.RESULTS || appState === AppState.HISTORY;

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <div className="container mx-auto px-4 py-8">
        {showHeader && <Header />}
        <main className={showHeader ? 'mt-8' : ''}>
          {renderScreen()}
        </main>
      </div>
    </div>
  );
}

export default App;