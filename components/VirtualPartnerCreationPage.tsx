
import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { VirtualPartner } from '../types';
import { LoadingSpinner } from './LoadingSpinner';

export const VirtualPartnerCreationPage: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  if (!context) {
    throw new Error('AppContext must be used within an AppContext.Provider');
  }

  const {
    currentUser,
    virtualPartner,
    createVirtualPartner,
    updateVirtualPartner,
    resetVirtualPartner,
    loadingVirtualPartner,
    errorVirtualPartner,
    isDarkMode, 
  } = context;

  // Creation State
  const [nameInput, setNameInput] = useState('');
  const [visualStyleInput, setVisualStyleInput] = useState('');
  const [vibeInput, setVibeInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [commStyleInput, setCommStyleInput] = useState(''); // New state for communication style

  // Editing State
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedBio, setEditedBio] = useState('');
  const [editedInterests, setEditedInterests] = useState('');
  const [editedPersonalityTraits, setEditedPersonalityTraits] = useState('');
  const [editedScenario, setEditedScenario] = useState('');
  const [editedGoals, setEditedGoals] = useState('');


  // Redirect if no user is logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // Initialize edit fields when virtualPartner is loaded or changes
  useEffect(() => {
    if (virtualPartner) {
      setEditedName(virtualPartner.name);
      setEditedBio(virtualPartner.bio);
      setEditedInterests(virtualPartner.interests.join(', '));
      setEditedPersonalityTraits(virtualPartner.personalityTraits.join(', '));
      setEditedScenario(virtualPartner.currentScenario || '');
      setEditedGoals(virtualPartner.relationshipGoals.map(g => `${g.name}${g.complete ? ' (complete)' : ''}`).join('; '));
    }
  }, [virtualPartner]);

  const handleGeneratePartner = async () => {
    // Construct the prompt from detailed inputs if provided, else fallback to description
    let finalPrompt = descriptionInput;
    
    if (nameInput || visualStyleInput || vibeInput || commStyleInput) {
        finalPrompt = `Name: ${nameInput || 'Any'}. Visual Style: ${visualStyleInput || 'Any'}. Vibe/Relationship: ${vibeInput || 'Any'}. Communication Style: ${commStyleInput || 'Any'}. Additional Details: ${descriptionInput}`;
    }

    if (finalPrompt.trim()) {
      await createVirtualPartner(finalPrompt);
      setIsEditing(false); 
    }
  };

  const handleSaveEdits = () => {
    if (virtualPartner) {
      const updatedPartner: VirtualPartner = {
        ...virtualPartner,
        name: editedName.trim(),
        bio: editedBio.trim(),
        interests: editedInterests.split(',').map(s => s.trim()).filter(Boolean),
        personalityTraits: editedPersonalityTraits.split(',').map(s => s.trim()).filter(Boolean),
        currentScenario: editedScenario.trim() || null,
        relationshipGoals: editedGoals.split(';').map(s => s.trim()).filter(Boolean).map(goalStr => {
          const isComplete = goalStr.toLowerCase().includes('(complete)');
          const name = goalStr.replace(/\s*\(complete\)\s*/i, '');
          return { name, complete: isComplete };
        }),
      };
      updateVirtualPartner(updatedPartner);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    if (virtualPartner) {
      setEditedName(virtualPartner.name);
      setEditedBio(virtualPartner.bio);
      setEditedInterests(virtualPartner.interests.join(', '));
      setEditedPersonalityTraits(virtualPartner.personalityTraits.join(', '));
      setEditedScenario(virtualPartner.currentScenario || '');
      setEditedGoals(virtualPartner.relationshipGoals.map(g => `${g.name}${g.complete ? ' (complete)' : ''}`).join('; '));
    }
    setIsEditing(false);
  };

  const getProgressBarColor = (value: number) => {
    if (value > 75) return `bg-primary-teal ${isDarkMode ? 'dark:bg-primary-teal-dark' : ''}`;
    if (value > 40) return `bg-secondary-mint ${isDarkMode ? 'dark:bg-secondary-mint-dark' : ''}`;
    if (value > 20) return `bg-orange-400 ${isDarkMode ? 'dark:bg-orange-500' : ''}`;
    return `bg-red-500 ${isDarkMode ? 'dark:bg-red-600' : ''}`;
  }

  if (!currentUser) {
    return null; 
  }

  return (
    <div className="p-6 bg-white dark:bg-dark-mode-card-bg rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-dark-text dark:text-dark-mode-text mb-8 text-center">Your Virtual Wellness Partner</h2>

      {errorVirtualPartner && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline ml-2">{errorVirtualPartner}</span>
        </div>
      )}

      {loadingVirtualPartner ? (
        <div className="flex flex-col items-center justify-center h-64">
          <LoadingSpinner />
          <p className="mt-4 text-primary-teal dark:text-primary-teal-dark text-lg">Designing your ideal partner...</p>
        </div>
      ) : !virtualPartner ? (
        // Create Partner Form
        <div className="max-w-2xl mx-auto">
          <p className="text-xl text-text-base dark:text-dark-mode-text-base mb-6 text-center">Design your perfect companion:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Partner Name</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-dark-mode-input-bg text-dark-text dark:text-dark-mode-text"
                    placeholder="e.g. Soha"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                  />
              </div>
              <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Visual Style</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-dark-mode-input-bg text-dark-text dark:text-dark-mode-text"
                    placeholder="e.g. Model, Athletic, Artistic"
                    value={visualStyleInput}
                    onChange={(e) => setVisualStyleInput(e.target.value)}
                  />
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Relationship Vibe</label>
                  <select
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-dark-mode-input-bg text-dark-text dark:text-dark-mode-text"
                    value={vibeInput}
                    onChange={(e) => setVibeInput(e.target.value)}
                  >
                      <option value="">Select Vibe...</option>
                      <option value="Romantic & Affectionate">Romantic & Affectionate</option>
                      <option value="Supportive Best Friend">Supportive Best Friend</option>
                      <option value="Strict Coach">Strict Coach</option>
                      <option value="Wise Mentor">Wise Mentor</option>
                  </select>
              </div>
              <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Communication Style</label>
                  <select
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-dark-mode-input-bg text-dark-text dark:text-dark-mode-text"
                    value={commStyleInput}
                    onChange={(e) => setCommStyleInput(e.target.value)}
                  >
                      <option value="">Select Style...</option>
                      <option value="Bold & Direct">Bold & Direct</option>
                      <option value="Gentle & Empathetic">Gentle & Empathetic</option>
                      <option value="Playful & Witty">Playful & Witty</option>
                      <option value="Intellectual & Deep">Intellectual & Deep</option>
                      <option value="Open-Minded & Adventurous">Open-Minded & Adventurous</option>
                  </select>
              </div>
          </div>

          <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Detailed Description (Optional)</label>
              <textarea
                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-teal dark:focus:ring-primary-teal-dark bg-white dark:bg-dark-mode-input-bg text-dark-text dark:text-dark-mode-text"
                rows={4}
                placeholder="Any specific traits or backstory? e.g. She loves hiking and reading poetry..."
                value={descriptionInput}
                onChange={(e) => setDescriptionInput(e.target.value)}
              ></textarea>
          </div>

          <button
            onClick={handleGeneratePartner}
            className="w-full bg-gradient-to-r from-primary-teal to-brand-blue text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all font-bold text-lg disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={!nameInput && !descriptionInput}
          >
            Bring Partner to Life
          </button>
        </div>
      ) : (
        // Display Virtual Partner Profile
        <div className="flex flex-col items-center animate-fade-in">
          <div className="relative mb-6">
             <img
                src={virtualPartner.avatar}
                alt={`${virtualPartner.name}'s avatar`}
                className="w-40 h-40 rounded-full border-4 border-primary-teal dark:border-primary-teal-dark object-cover shadow-2xl"
             />
             <div className="absolute bottom-2 right-2 bg-white dark:bg-dark-mode-card-bg px-3 py-1 rounded-full text-xs font-bold text-brand-teal shadow-sm border border-gray-200 dark:border-gray-700">
                 {virtualPartner.visualStyle || 'Partner'}
             </div>
          </div>

          {isEditing ? (
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="text-4xl font-bold text-dark-text dark:text-dark-mode-text text-center mb-4 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-dark-mode-input-bg"
            />
          ) : (
            <h3 className="text-4xl font-bold text-dark-text dark:text-dark-mode-text mb-2">{virtualPartner.name}</h3>
          )}
          
          <div className="flex gap-2 mb-6">
             {virtualPartner.relationshipType && <span className="bg-brand-pink/10 text-brand-pink px-3 py-1 rounded-full text-sm font-bold">{virtualPartner.relationshipType}</span>}
             {virtualPartner.communicationStyle && <span className="bg-brand-blue/10 text-brand-blue px-3 py-1 rounded-full text-sm font-bold">{virtualPartner.communicationStyle}</span>}
          </div>

          <div className="w-full md:w-3/4 lg:w-2/3 space-y-6 text-center">
            {isEditing ? (
              <textarea
                value={editedBio}
                onChange={(e) => setEditedBio(e.target.value)}
                rows={4}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-sky dark:focus:ring-accent-sky-dark bg-white dark:bg-dark-mode-input-bg text-dark-text dark:text-dark-mode-text"
              ></textarea>
            ) : (
              <p className="text-lg text-text-base dark:text-dark-mode-text-base leading-relaxed italic">"{virtualPartner.bio}"</p>
            )}

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h4 className="text-xl font-bold text-dark-text dark:text-dark-mode-text mb-4">Interests</h4>
              {isEditing ? (
                <input
                  type="text"
                  value={editedInterests}
                  onChange={(e) => setEditedInterests(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-sky dark:focus:ring-accent-sky-dark bg-white dark:bg-dark-mode-input-bg text-dark-text dark:text-dark-mode-text"
                />
              ) : (
                <div className="flex flex-wrap justify-center gap-2">
                  {virtualPartner.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium shadow-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h4 className="text-xl font-bold text-dark-text dark:text-dark-mode-text mb-4">Personality Traits</h4>
              {isEditing ? (
                <input
                  type="text"
                  value={editedPersonalityTraits}
                  onChange={(e) => setEditedPersonalityTraits(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-sky dark:focus:ring-accent-sky-dark bg-white dark:bg-dark-mode-input-bg text-dark-text dark:text-dark-mode-text"
                />
              ) : (
                <div className="flex flex-wrap justify-center gap-2">
                  {virtualPartner.personalityTraits.map((trait, index) => (
                    <span
                      key={index}
                      className="bg-brand-mint dark:bg-teal-900/50 text-teal-800 dark:text-teal-200 px-4 py-2 rounded-lg font-bold shadow-sm"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* New Gameplay Elements Display */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 text-left w-full">
              <h4 className="text-xl font-bold text-dark-text dark:text-dark-mode-text mb-6 text-center">Relationship Dynamics</h4>

              {/* Current Scenario */}
              <div className="bg-light-background dark:bg-dark-mode-input-bg p-5 rounded-2xl shadow-inner mb-6 border border-gray-200 dark:border-gray-700">
                <p className="font-bold text-dark-text dark:text-dark-mode-text text-sm mb-2 uppercase tracking-wide">Current Context</p>
                {isEditing ? (
                  <textarea
                    value={editedScenario}
                    onChange={(e) => setEditedScenario(e.target.value)}
                    rows={2}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-dark-mode-input-bg text-dark-text dark:text-dark-mode-text"
                  ></textarea>
                ) : (
                  <p className="text-text-base dark:text-dark-mode-text-base text-lg font-serif">{virtualPartner.currentScenario || "No active scenario."}</p>
                )}
              </div>

              {/* Emotional State */}
              <div className="mb-6">
                <p className="font-bold text-dark-text dark:text-dark-mode-text text-sm mb-3 uppercase tracking-wide">Emotional State</p>
                <div className="space-y-3">
                  {['happiness', 'motivation', 'trust'].map((emotionKey) => {
                    const value = virtualPartner.emotionalState[emotionKey as keyof typeof virtualPartner.emotionalState];
                    return (
                      <div key={emotionKey}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-bold capitalize text-gray-600 dark:text-gray-400">{emotionKey}</span>
                          <span className="text-sm font-bold text-brand-teal">{value}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div
                            className={`${getProgressBarColor(value)} h-2.5 rounded-full transition-all duration-1000`}
                            style={{ width: `${value}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Relationship Goals */}
              <div>
                <p className="font-bold text-dark-text dark:text-dark-mode-text text-sm mb-3 uppercase tracking-wide">Shared Goals</p>
                {isEditing ? (
                  <textarea
                    value={editedGoals}
                    onChange={(e) => setEditedGoals(e.target.value)}
                    rows={3}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-dark-mode-input-bg text-dark-text dark:text-dark-mode-text"
                  ></textarea>
                ) : (
                  <ul className="space-y-2">
                    {virtualPartner.relationshipGoals.map((goal, index) => (
                      <li key={index} className="flex items-center bg-gray-50 dark:bg-dark-mode-input-bg p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                        {goal.complete ? (
                          <i className="fas fa-check-circle text-green-500 text-xl mr-3"></i>
                        ) : (
                          <i className="far fa-circle text-gray-400 text-xl mr-3"></i>
                        )}
                        <span className={`font-medium ${goal.complete ? 'line-through text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>{goal.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mt-10 w-full justify-center max-w-lg">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveEdits}
                  className="flex-1 bg-primary-teal text-white px-6 py-3 rounded-xl shadow font-bold hover:bg-secondary-mint transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 bg-white border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                >
                  Edit Persona
                </button>
                <button
                  onClick={() => navigate('/virtual-partner/chat')}
                  className="flex-1 bg-gradient-to-r from-brand-teal to-brand-blue text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all font-bold flex items-center justify-center gap-2"
                >
                  <i className="fas fa-comments"></i> Start Chat
                </button>
                <button
                  onClick={resetVirtualPartner}
                  className="flex-1 bg-red-50 text-red-600 border border-red-100 px-6 py-3 rounded-xl font-bold hover:bg-red-100 transition-colors"
                >
                  Reset
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
