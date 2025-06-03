"use client";

import { useState, useCallback, useRef } from 'react';
import FlappyBirdGame from '@/components/games/flappy-bird';

type GameEvent = {
  type: string;
  data: unknown;
  timestamp: number;
};

export default function FlappyBirdPage() {
  const [events, setEvents] = useState<GameEvent[]>([]);
  const eventsEndRef = useRef<HTMLDivElement>(null);

  const handleGameEvent = useCallback((event: GameEvent) => {
    setEvents(prev => {
      // Keep only the last 50 events to prevent memory issues
      const newEvents = [...prev, event].slice(-50);
      return newEvents;
    });

    // Auto-scroll to bottom when new events come in
    setTimeout(() => {
      eventsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100 p-4 gap-4">
      {/* Game Container */}
      <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-lg shadow-lg p-4">
        <h1 className="text-2xl font-bold mb-4">Flappy Bird</h1>
        <div className="relative overflow-hidden bg-blue-100 rounded-lg">
          <FlappyBirdGame 
            onGameEvent={handleGameEvent} 
            onGameComplete={(stats) => {
              console.log('Game complete!', stats);
            }} 
          />
        </div>
      </div>

      {/* Event Monitor */}
      <div className="w-full lg:w-96 bg-white rounded-lg shadow-lg p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-4">Game Events</h2>
        <div className="flex-1 overflow-y-auto bg-gray-50 p-3 rounded border border-gray-200 font-mono text-sm">
          {events.length === 0 ? (
            <p className="text-gray-500 italic">Game events will appear here...</p>
          ) : (
            <ul className="space-y-2">
              {events.map((event, index) => (
                <li key={index} className="break-words p-2 bg-white rounded border border-gray-100">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span className="font-semibold">{event.type}</span>
                    <span>{event.timestamp.toFixed(2)}s</span>
                  </div>
                  <div className="text-gray-800">
                    {JSON.stringify(event.data, null, 2)}
                  </div>
                </li>
              ))}
              <div ref={eventsEndRef} />
            </ul>
          )}
        </div>
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => setEvents([])}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
          >
            Clear Events
          </button>
          <span className="text-sm text-gray-500">
            {events.length} events
          </span>
        </div>
      </div>
    </div>
  );
}
