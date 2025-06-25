import React, { useState, useEffect } from 'react';
import { Printer, RotateCcw, Star, CheckCircle2, Calendar, Award, Book, Sun, Moon, Heart, Target } from 'lucide-react';

interface TaskItem {
  id: string;
  text: string;
  emoji: string;
}

interface TaskCategory {
  color: string;
  items: TaskItem[];
}

interface DayData {
  tasks: Record<string, boolean>;
  bonus: Record<string, boolean>;
}

interface State {
  name: string;
  days: Record<string, DayData>;
}

function App() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const tasks: Record<string, TaskCategory> = {
    '🌅 Morning Routine': {
      color: 'bg-gradient-to-br from-sky-100 to-sky-200',
      items: [
        { id: 'brush_teeth_morning', text: 'Brush teeth (morning)', emoji: '🦷' },
        { id: 'dress_up', text: 'Dress up nicely', emoji: '👕' },
        { id: 'breakfast', text: 'Eat breakfast by myself', emoji: '🍳' },
        { id: 'fajr_prayer', text: 'Fajr Prayer', emoji: '📿' }
      ]
    },
    '📚 Learning & Growth': {
      color: 'bg-gradient-to-br from-indigo-100 to-indigo-200',
      items: [
        { id: 'study', text: 'Study time (30 mins)', emoji: '📖' },
        { id: 'craft', text: 'Craft time (20 mins)', emoji: '🎨' },
        { id: 'play', text: 'Play time with puzzles/toys', emoji: '🧩' },
        { id: 'reading', text: 'Reading time (15 mins)', emoji: '📗' },
        { id: 'quran', text: 'Quran/Duaa practice', emoji: '🕌' },
        { id: 'edu_video', text: 'Educational video (15 mins)', emoji: '📺' }
      ]
    },
    '🏃‍♂️ Active Time': {
      color: 'bg-gradient-to-br from-emerald-100 to-emerald-200',
      items: [
        { id: 'outdoor_play', text: 'Exercise/Outdoor play', emoji: '⚽' },
        { id: 'video_games', text: 'Video games (30 mins max)', emoji: '🎮' }
      ]
    },
    '🕌 Prayer Time': {
      color: 'bg-gradient-to-br from-teal-100 to-teal-200',
      items: [
        { id: 'fajr', text: 'Fajr', emoji: '⏰' },
        { id: 'dhuhr', text: 'Dhuhr', emoji: '⏰' },
        { id: 'asr', text: 'Asr', emoji: '⏰' },
        { id: 'maghrib', text: 'Maghrib', emoji: '⏰' },
        { id: 'isha', text: 'Isha', emoji: '⏰' }
      ]
    },
    '🌟 Good Behavior': {
      color: 'bg-gradient-to-br from-rose-100 to-rose-200',
      items: [
        { id: 'chores', text: 'Help with chores', emoji: '🤝' },
        { id: 'listen', text: 'Listen to parents', emoji: '👂' },
        { id: 'no_fighting', text: 'No fighting', emoji: '✌️' },
        { id: 'finish_meals', text: 'Finish meals', emoji: '🍽️' },
        { id: 'brush_teeth_night', text: 'Brush teeth (night)', emoji: '🦷' }
      ]
    }
  };

  const bonusStars: TaskItem[] = [
    { id: 'helper', text: 'Helper Star', emoji: '🌈' },
    { id: 'sharing', text: 'Sharing Star', emoji: '🤝' },
    { id: 'tidy', text: 'Neat & Tidy Star', emoji: '✨' },
    { id: 'peaceful', text: 'Peaceful Star', emoji: '🕊️' },
    { id: 'kind_words', text: 'Kind Words Star', emoji: '💝' },
    { id: 'brave_learner', text: 'Brave Learner Star', emoji: '🧠' },
    { id: 'independence', text: 'Independence Star', emoji: '🚽' },
    { id: 'screen_time', text: 'Screen Time Star', emoji: '⏰' }
  ];

  const rewards = [
    { stars: 25, text: 'One candy treat! 🍬', icon: '🍬' },
    { stars: 50, text: 'Mama\'s choice treat! 💝', icon: '💝' },
    { stars: 75, text: '15 minutes extra playtime! 🎮', icon: '🎮' },
    { stars: 100, text: 'A small gift! 🎁', icon: '🎁' },
    { stars: 150, text: 'A big gift! 🎉', icon: '🎉' }
  ];

  const [currentDayIndex, setCurrentDayIndex] = useState(() => {
    const today = new Date().getDay();
    return today === 0 ? 6 : today - 1; // Convert Sunday=0 to our Monday=0 system
  });

  const [state, setState] = useState<State>(() => {
    const savedState = localStorage.getItem('awesomeDayState');
    if (savedState) {
      return JSON.parse(savedState);
    }

    const initialState: State = { name: '', days: {} };
    days.forEach(day => {
      initialState.days[day] = { tasks: {}, bonus: {} };
      Object.values(tasks).forEach(category => 
        category.items.forEach(task => initialState.days[day].tasks[task.id] = false)
      );
      bonusStars.forEach(star => initialState.days[day].bonus[star.id] = false);
    });
    return initialState;
  });

  const [isPrintMode, setIsPrintMode] = useState(false);

  useEffect(() => {
    localStorage.setItem('awesomeDayState', JSON.stringify(state));
  }, [state]);

  const updateTaskState = (taskId: string, checked: boolean) => {
    const currentDay = days[currentDayIndex];
    setState(prev => ({
      ...prev,
      days: {
        ...prev.days,
        [currentDay]: {
          ...prev.days[currentDay],
          tasks: {
            ...prev.days[currentDay].tasks,
            [taskId]: checked
          }
        }
      }
    }));
  };

  const updateBonusState = (bonusId: string, awarded: boolean) => {
    const currentDay = days[currentDayIndex];
    setState(prev => ({
      ...prev,
      days: {
        ...prev.days,
        [currentDay]: {
          ...prev.days[currentDay],
          bonus: {
            ...prev.days[currentDay].bonus,
            [bonusId]: awarded
          }
        }
      }
    }));
  };

  const calculateTotalStars = () => {
    return Object.values(state.days).reduce((total, dayData) => {
      const taskStars = Object.values(dayData.tasks).filter(Boolean).length;
      const bonusStars = Object.values(dayData.bonus).filter(Boolean).length;
      return total + taskStars + bonusStars;
    }, 0);
  };

  const resetWeek = () => {
    if (window.confirm('Are you sure you want to reset all progress for the week?')) {
      setState(prev => {
        const newState = { ...prev };
        days.forEach(day => {
          Object.keys(newState.days[day].tasks).forEach(taskId => {
            newState.days[day].tasks[taskId] = false;
          });
          Object.keys(newState.days[day].bonus).forEach(bonusId => {
            newState.days[day].bonus[bonusId] = false;
          });
        });
        return newState;
      });
    }
  };

  const handlePrint = () => {
    setIsPrintMode(true);
    setTimeout(() => {
      window.print();
      setIsPrintMode(false);
    }, 100);
  };

  const totalStars = calculateTotalStars();
  const currentDay = days[currentDayIndex];

  if (isPrintMode) {
    return (
      <div className="print-container">
        <style>{`
          @page {
            size: A4 landscape;
            margin: 0.5in;
          }
          
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              font-size: 10px;
              line-height: 1.2;
            }
            
            .print-container {
              width: 100%;
              height: 100%;
              font-family: Arial, sans-serif;
            }
            
            .print-header {
              text-align: center;
              margin-bottom: 8px;
            }
            
            .print-title {
              font-size: 18px;
              font-weight: bold;
              color: #d97706;
              margin: 0;
            }
            
            .print-section-title {
              font-size: 12px;
              font-weight: bold;
              color: #1e40af;
              margin: 0 0 4px 0;
              padding: 2px 0;
              border-bottom: 1px solid #e5e7eb;
            }
            
            .print-table {
              width: 100%;
              border-collapse: collapse;
              font-size: 9px;
              margin-bottom: 10px;
            }
            
            .print-table th,
            .print-table td {
              border: 1px solid #d1d5db;
              padding: 2px 3px;
              text-align: left;
            }
            
            .print-table th {
              background-color: #f3f4f6;
              font-weight: bold;
              font-size: 9px;
            }
            
            .print-table .category-row {
              background-color: #e0f2fe;
              font-weight: bold;
              font-size: 10px;
            }
            
            .print-table .task-cell {
              font-size: 9px;
              max-width: 180px;
            }
            
            .print-table .day-cell {
              text-align: center;
              width: 30px;
              font-size: 10px;
            }
            
            .print-rewards {
              margin-top: 10px;
            }
            
            .print-reward-item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 3px 6px;
              margin: 2px 0;
              border: 1px solid #e5e7eb;
              border-radius: 4px;
              background-color: #f9fafb;
            }
            
            .print-reward-unlocked {
              background-color: #fef3c7;
              border-color: #f59e0b;
            }
          }
        `}</style>
        
        <div className="print-header">
          <h1 className="print-title">
            {state.name || 'My'} Awesome Day! 🌟
          </h1>
        </div>

        <div>
          <h3 className="print-section-title">📋 Daily Tasks Checklist</h3>
          <table className="print-table">
            <thead>
              <tr>
                <th style={{ width: '180px' }}>Task</th>
                {days.map(day => (
                  <th key={day} className="day-cell">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(tasks).map(([category, data]) => (
                <React.Fragment key={category}>
                  <tr>
                    <td colSpan={days.length + 1} className="category-row">
                      {category}
                    </td>
                  </tr>
                  {data.items.map(task => (
                    <tr key={task.id}>
                      <td className="task-cell">
                        {task.emoji} {task.text}
                      </td>
                      {days.map(day => (
                        <td key={day} className="day-cell">
                          {state.days[day]?.tasks[task.id] ? '⭐' : '⬜'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
              
              {/* Bonus Stars Section */}
              <tr>
                <td colSpan={days.length + 1} className="category-row">
                  ✨ Bonus Stars
                </td>
              </tr>
              {bonusStars.map(star => (
                <tr key={star.id}>
                  <td className="task-cell">
                    {star.emoji} {star.text}
                  </td>
                  {days.map(day => (
                    <td key={day} className="day-cell">
                      {state.days[day]?.bonus[star.id] ? '🌟' : '⬜'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="print-rewards">
            <h3 className="print-section-title">🏆 Rewards Status</h3>
            <div>
              {rewards.map(reward => {
                const unlocked = totalStars >= reward.stars;
                return (
                  <div key={reward.stars} className={`print-reward-item ${unlocked ? 'print-reward-unlocked' : ''}`}>
                    <span style={{ fontWeight: 'bold' }}>{reward.stars}★</span>
                    <span style={{ flex: 1, margin: '0 8px' }}>{reward.text}</span>
                    <span>{unlocked ? '✅' : '🔒'}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="container mx-auto p-4 md:p-8 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
            My Awesome Day! 🌟
          </h1>
          <p className="text-lg text-amber-600 font-medium">Let's make today amazing!</p>
        </header>

        {/* Control Panel */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg mb-8 border border-amber-200">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <label htmlFor="childName" className="font-bold text-xl text-gray-700 flex items-center">
                <Heart className="mr-2 text-pink-500" />
                Name:
              </label>
              <input
                type="text"
                id="childName"
                value={state.name}
                onChange={(e) => setState(prev => ({ ...prev, name: e.target.value }))}
                className="text-xl p-3 rounded-xl border-2 border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition-all"
                placeholder="Your Name"
              />
            </div>
            
            <div className="text-center">
              <h2 className="text-xl font-bold text-amber-600 mb-1 flex items-center justify-center">
                <Target className="mr-2" />
                Weekly Star Count
              </h2>
              <div className="text-5xl font-bold text-yellow-500 animate-pulse">
                ⭐ {totalStars}
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg"
              >
                <Printer className="w-5 h-5" />
                Print
              </button>
              <button
                onClick={resetWeek}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Day Selector */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center text-sky-600 mb-4 flex items-center justify-center">
            <Calendar className="mr-2" />
            📋 Daily Tasks Checklist
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Click on a day to see your tasks, and check them off as you complete them to earn stars!
          </p>
          
          <div className="flex justify-center mb-6">
            <div className="flex flex-wrap justify-center gap-2 bg-white p-2 rounded-full shadow-lg">
              {days.map((day, index) => (
                <button
                  key={day}
                  onClick={() => setCurrentDayIndex(index)}
                  className={`px-6 py-3 rounded-full font-bold transition-all transform hover:scale-105 ${
                    index === currentDayIndex
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-amber-100'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Task Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {Object.entries(tasks).map(([category, data]) => (
            <div key={category} className={`${data.color} p-6 rounded-2xl shadow-lg border border-white/50`}>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
                {category.includes('Morning') && <Sun className="mr-2" />}
                {category.includes('Learning') && <Book className="mr-2" />}
                {category.includes('Prayer') && <Moon className="mr-2" />}
                {category}
              </h3>
              <div className="space-y-2">
                {data.items.map(task => (
                  <TaskCheckbox key={task.id} task={task} category={category} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bonus Stars Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-center text-rose-500 mb-4 flex items-center justify-center">
            <Star className="mr-2" />
            ✨ Bonus Stars Section
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Earn extra stars for amazing behavior! Click on a star when you do something special.
          </p>
          <div className="bg-white p-6 rounded-2xl shadow-lg grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {bonusStars.map(star => (
              <BonusStarCard key={star.id} star={star} />
            ))}
          </div>
        </div>

        {/* Rewards Center */}
        <div className="mb-10">
          <div>
            <h2 className="text-2xl font-bold text-center text-orange-500 mb-4 flex items-center justify-center">
              <Award className="mr-2" />
              🏆 Rewards Center
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Keep collecting stars to unlock these awesome rewards!
            </p>
            <div className="space-y-4 max-w-4xl mx-auto">
              {rewards.map((reward, index) => {
                const unlocked = totalStars >= reward.stars;
                const isNextGoal = !unlocked && (index === 0 || totalStars >= rewards[index - 1].stars);
                
                return (
                  <div
                    key={reward.stars}
                    className={`p-6 rounded-2xl border-2 flex justify-between items-center transition-all transform ${
                      unlocked
                        ? 'bg-gradient-to-r from-yellow-300 to-yellow-400 border-yellow-500 scale-105 shadow-lg'
                        : isNextGoal
                        ? 'bg-gradient-to-r from-green-100 to-green-200 border-green-400 shadow-md'
                        : 'bg-white border-gray-300 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{reward.icon}</div>
                      <div>
                        <div className="font-bold text-xl text-amber-600">
                          {reward.stars} stars
                        </div>
                        <div className="text-gray-700 text-lg">{reward.text}</div>
                      </div>
                    </div>
                    <div className="text-4xl">
                      {unlocked ? '✅' : isNextGoal ? '🎯' : '🔒'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function TaskCheckbox({ task, category }: { task: TaskItem, category: string }) {
    const isChecked = state.days[currentDay]?.tasks[task.id] || false;
    
    return (
      <div className="flex items-center group">
        <label className="flex items-center cursor-pointer w-full p-3 rounded-lg transition-all hover:bg-white/50 group-hover:scale-[1.02]">
          <div className={`w-6 h-6 mr-3 rounded-full border-2 flex items-center justify-center transition-all ${
            isChecked 
              ? 'bg-yellow-400 border-yellow-400 scale-110' 
              : 'border-gray-400 group-hover:border-yellow-400'
          }`}>
            {isChecked && <Star className="w-4 h-4 text-white fill-current" />}
          </div>
          <span className={`text-2xl mr-3 transition-all ${isChecked ? 'grayscale-0 scale-110' : 'grayscale opacity-60'}`}>
            {task.emoji}
          </span>
          <span className={`text-lg font-medium transition-all ${isChecked ? 'line-through text-gray-500' : 'text-gray-800'}`}>
            {task.text}
          </span>
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => updateTaskState(task.id, e.target.checked)}
            className="sr-only"
          />
        </label>
      </div>
    );
  }

  function BonusStarCard({ star }: { star: TaskItem }) {
    const isAwarded = state.days[currentDay]?.bonus[star.id] || false;
    
    return (
      <div 
        className={`p-4 rounded-xl cursor-pointer transition-all transform hover:scale-105 ${
          isAwarded 
            ? 'bg-gradient-to-br from-yellow-300 to-yellow-400 shadow-lg' 
            : 'bg-white hover:bg-yellow-50 shadow-md hover:shadow-lg'
        }`}
        onClick={() => updateBonusState(star.id, !isAwarded)}
      >
        <div className="text-center">
          <div className="text-4xl mb-2">
            {isAwarded ? '🌟' : star.emoji}
          </div>
          <p className="text-sm font-semibold text-gray-700">
            {star.text}
          </p>
        </div>
      </div>
    );
  }
}

export default App;