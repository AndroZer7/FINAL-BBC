// Theme configuration
const THEMES = {
  light: {
    '--primary-color': '#bb1919',
    '--text-color': '#333',
    '--bg-color': '#fff',
    '--header-bg': '#fff',
    '--nav-hover': '#f5f5f5',
    '--border-color': '#e5e5e5',
    '--card-shadow': '0 2px 4px rgba(0, 0, 0, 0.1)',
    '--speech-btn-color': '#333',
    '--speech-active-color': '#bb1919'
  },
  dark: {
    '--primary-color': '#bb1919',
    '--text-color': '#fff',
    '--bg-color': '#1a1a1a',
    '--header-bg': '#2d2d2d',
    '--nav-hover': '#3d3d3d',
    '--border-color': '#333',
    '--card-shadow': '0 2px 4px rgba(255, 255, 255, 0.1)',
    '--speech-btn-color': '#fff',
    '--speech-active-color': '#bb1919'
  }
};

// Get current theme from localStorage or use light as default
let currentTheme = localStorage.getItem('theme') || 'light';

// Apply theme function
function applyTheme(theme) {
  const root = document.documentElement;
  const themeVars = THEMES[theme];
  
  // Apply all theme variables
  Object.entries(themeVars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
  
  // Update localStorage
  localStorage.setItem('theme', theme);
  
  // Update theme toggle button
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.querySelector('i').className = theme === 'light' ? 'ri-moon-line' : 'ri-sun-line';
  }
  
  // Update dark mode checkbox in profile
  const darkModeCheckbox = document.getElementById('dark-mode');
  if (darkModeCheckbox) {
    darkModeCheckbox.checked = theme === 'dark';
  }
}

// Initialize theme
applyTheme(currentTheme);

// Theme toggle function
function toggleTheme() {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  applyTheme(currentTheme);
}

// Add event listener for theme toggle button
document.addEventListener('DOMContentLoaded', () => {
  // Handle theme toggle button
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // Handle dark mode checkbox in profile
  const darkModeCheckbox = document.getElementById('dark-mode');
  if (darkModeCheckbox) {
    darkModeCheckbox.addEventListener('change', (e) => {
      const newTheme = e.target.checked ? 'dark' : 'light';
      applyTheme(newTheme);
    });
  }
});
