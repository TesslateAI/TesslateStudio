// src/hooks/useAutocomplete.js
import { useState } from 'react';

function useAutocomplete(llmModels, commonPhrases) {
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  const handleInputChange = (value, setMessageInput) => {
    setMessageInput(value);
    const words = value.split(" ");
    const lastWord = words[words.length - 1];
    if (lastWord.startsWith("@")) {
      const query = lastWord.substring(1).toLowerCase();
      const filtered = llmModels.filter(model => model.name.toLowerCase().includes(query));
      setAutocompleteSuggestions(filtered);
      setShowAutocomplete(filtered.length > 0);
    } else if (value.length > 0 && !value.includes("@")) {
      const filtered = commonPhrases.filter(phrase =>
        phrase.toLowerCase().startsWith(value.toLowerCase()) && phrase.length > value.length
      );
      setAutocompleteSuggestions(filtered);
      setShowAutocomplete(filtered.length > 0);
    } else {
      setShowAutocomplete(false);
    }
  };

  const handleSuggestionClick = (suggestion, messageInput, setMessageInput) => {
    let newValue = "";
    if (typeof suggestion === "string") {
      newValue = suggestion;
    } else {
      const words = messageInput.split(" ");
      words[words.length - 1] = `@${suggestion.name}`;
      newValue = words.join(" ") + " ";
    }
    setMessageInput(newValue);
    setShowAutocomplete(false);
  };

  const handleKeyDown = (e) => {
    if (showAutocomplete) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedSuggestionIndex(prev => Math.min(prev + 1, autocompleteSuggestions.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedSuggestionIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && selectedSuggestionIndex >= 0) {
        e.preventDefault();
        // The suggestion click should be handled by the caller using the current index.
      } else if (e.key === "Escape") {
        setShowAutocomplete(false);
      }
    }
  };

  return {
    autocompleteSuggestions,
    showAutocomplete,
    selectedSuggestionIndex,
    setSelectedSuggestionIndex,
    handleInputChange,
    handleSuggestionClick,
    handleKeyDown
  };
}

export default useAutocomplete;
