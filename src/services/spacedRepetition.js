export const calculateNextReview = (currentInterval, isCorrect) => {
    if (isCorrect) {
      // If correct, increase the interval (e.g., double it)
      return currentInterval * 2;
    } else {
      // If incorrect, reset the interval to 1 day
      return 1;
    }
  };
  
  export const shouldReviewConcept = (lastReviewDate, nextReviewDate) => {
    const now = new Date();
    return !nextReviewDate || now >= new Date(nextReviewDate);
  };
  
  export const getPriority = (lastReviewDate, nextReviewDate) => {
    if (!nextReviewDate) return Infinity; // Highest priority if never reviewed
    
    const now = new Date();
    const daysOverdue = (now - new Date(nextReviewDate)) / (1000 * 60 * 60 * 24);
    
    return Math.max(0, daysOverdue); // Return 0 if not due yet, otherwise return days overdue
  };