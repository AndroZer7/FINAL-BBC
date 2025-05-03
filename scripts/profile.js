// Load Bookmarks
function loadBookmarks() {
  const bookmarksContainer = document.querySelector(".bookmarks__container");
  const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

  if (bookmarks.length === 0) {
    bookmarksContainer.innerHTML = `
            <div class="empty-state">
                <i class="ri-bookmark-line"></i>
                <p>No bookmarks yet</p>
                <p class="empty-state__message">Articles you bookmark will appear here</p>
            </div>
        `;
    return;
  }

  bookmarksContainer.innerHTML = bookmarks
    .map(
      (bookmark) => `
        <div class="bookmark__item">
            <h4 class="bookmark__title">${bookmark.title}</h4>
            <p class="bookmark__excerpt">${bookmark.excerpt}</p>
            <div class="bookmark__meta">
                <span class="bookmark__date">${formatDate(bookmark.date)}</span>
                <button class="bookmark__remove" data-title="${
                  bookmark.title
                }" aria-label="Remove bookmark">
                    <i class="ri-delete-bin-line"></i>
                </button>
            </div>
        </div>
    `
    )
    .join("");

  // Add event listeners to remove buttons
  document.querySelectorAll(".bookmark__remove").forEach((button) => {
    button.addEventListener("click", () => {
      const title = button.dataset.title;
      removeBookmark(title);
    });
  });

  // Make bookmark items clickable to open related content
  document.querySelectorAll(".bookmark__item").forEach((item) => {
    const title = item.querySelector(".bookmark__title").textContent;
    item.style.cursor = "pointer";
    item.addEventListener("click", (e) => {
      // Don't navigate if clicking on the delete button
      if (e.target.closest(".bookmark__remove")) return;

      // In a real app, we would have URLs stored with bookmarks
      // For this demo, we'll just alert that we would navigate
      alert(`Would navigate to article: ${title}`);
    });
  });
}

// Format date nicely
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 1) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString();
  }
}

// Remove Bookmark
function removeBookmark(title) {
  let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
  bookmarks = bookmarks.filter((bookmark) => bookmark.title !== title);
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  loadBookmarks();

  // Show feedback
  showFeedback("Bookmark removed");
}

// Show feedback
function showFeedback(message) {
  const feedback = document.createElement("div");
  feedback.className = "feedback";
  feedback.textContent = message;
  feedback.style.position = "fixed";
  feedback.style.bottom = "20px";
  feedback.style.left = "50%";
  feedback.style.transform = "translateX(-50%)";
  feedback.style.padding = "10px 20px";
  feedback.style.backgroundColor = "var(--primary-color)";
  feedback.style.color = "white";
  feedback.style.borderRadius = "4px";
  feedback.style.zIndex = "1000";

  document.body.appendChild(feedback);

  setTimeout(() => {
    feedback.style.opacity = "0";
    feedback.style.transition = "opacity 0.5s ease";
    setTimeout(() => feedback.remove(), 500);
  }, 2000);
}

// Preferences
const darkModeToggle = document.getElementById("dark-mode");
const textToSpeechToggle = document.getElementById("text-to-speech");
const newsAlertsToggle = document.getElementById("news-alerts");

// Load saved preferences
function loadPreferences() {
  // Get current theme from body data-theme
  const currentTheme = document.body.getAttribute("data-theme") || "light";

  const preferences = JSON.parse(localStorage.getItem("preferences")) || {
    darkMode: currentTheme === "dark",
    textToSpeech: true,
    newsAlerts: true,
  };

  // Apply dark mode immediately if needed
  darkModeToggle.checked = preferences.darkMode;
  applyDarkMode(preferences.darkMode);

  textToSpeechToggle.checked = preferences.textToSpeech;
  newsAlertsToggle.checked = preferences.newsAlerts;
}

// Apply dark mode
function applyDarkMode(isDark) {
  document.body.setAttribute("data-theme", isDark ? "dark" : "light");

  // Update theme toggle icon
  const themeToggleIcon = document.querySelector(".theme-toggle i");
  if (themeToggleIcon) {
    themeToggleIcon.className = isDark ? "ri-sun-line" : "ri-moon-line";
  }
}

// Save preferences
function savePreferences() {
  const preferences = {
    darkMode: darkModeToggle.checked,
    textToSpeech: textToSpeechToggle.checked,
    newsAlerts: newsAlertsToggle.checked,
  };

  localStorage.setItem("preferences", JSON.stringify(preferences));

  // Apply dark mode immediately
  applyDarkMode(preferences.darkMode);

  // Show feedback
  showFeedback("Preferences saved");
}

// Event listeners for preferences
darkModeToggle.addEventListener("change", savePreferences);
textToSpeechToggle.addEventListener("change", savePreferences);
newsAlertsToggle.addEventListener("change", savePreferences);

// Categories
const categoryCheckboxes = document.querySelectorAll(
  '.category__item input[type="checkbox"]'
);

// Load saved categories
function loadCategories() {
  const categories = JSON.parse(localStorage.getItem("categories")) || {
    india: true,
    world: true,
    business: true,
    politics: true,
    tech: true,
  };

  categoryCheckboxes.forEach((checkbox) => {
    const category = checkbox.id.split("-")[1];
    checkbox.checked = categories[category] !== false; // Default to true if not set
  });
}

// Save categories
function saveCategories() {
  const categories = {};
  categoryCheckboxes.forEach((checkbox) => {
    const category = checkbox.id.split("-")[1];
    categories[category] = checkbox.checked;
  });

  localStorage.setItem("categories", JSON.stringify(categories));

  // Show feedback
  showFeedback("Categories updated");
}

// Event listeners for categories
categoryCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", saveCategories);
});

// Profile Edit
const profileEditBtn = document.querySelector(".profile__edit");
const profileName = document.querySelector(".profile__name");
const profileEmail = document.querySelector(".profile__email");

profileEditBtn.addEventListener("click", () => {
  const currentName = profileName.textContent;
  const currentEmail = profileEmail.textContent;

  const newName = prompt("Enter your name:", currentName);
  if (newName && newName.trim()) {
    profileName.textContent = newName;
    localStorage.setItem("userName", newName);
  }

  const newEmail = prompt("Enter your email:", currentEmail);
  if (newEmail && newEmail.trim()) {
    profileEmail.textContent = newEmail;
    localStorage.setItem("userEmail", newEmail);
  }

  if ((newName && newName.trim()) || (newEmail && newEmail.trim())) {
    showFeedback("Profile updated");
  }
});

// Default avatar placeholder - data URI for a simple user silhouette icon
const defaultAvatar =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23cccccc'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'%3E%3C/path%3E%3C/svg%3E";

// Avatar Upload
const avatarEdit = document.querySelector(".avatar-edit");
const avatarInput = document.createElement("input");
avatarInput.type = "file";
avatarInput.accept = "image/*";
avatarInput.style.display = "none";

document.body.appendChild(avatarInput);

avatarEdit.addEventListener("click", () => {
  avatarInput.click();
});

avatarInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const avatar = document.querySelector(".profile__avatar img");
      avatar.src = e.target.result;
      localStorage.setItem("avatar", e.target.result);
      showFeedback("Avatar updated");
    };
    reader.readAsDataURL(file);
  }
});

// Load user data
function loadUserData() {
  // Load saved avatar or use placeholder
  const avatar = document.querySelector(".profile__avatar img");
  const savedAvatar = localStorage.getItem("avatar");

  if (savedAvatar) {
    avatar.src = savedAvatar;
  } else {
    avatar.src = defaultAvatar;
    avatar.alt = "Default Profile";
  }

  // Add error handling for avatar loading
  avatar.onerror = () => {
    avatar.src = defaultAvatar;
    avatar.alt = "Default Profile";
  };

  // Load user name and email
  const savedName = localStorage.getItem("userName");
  if (savedName) {
    profileName.textContent = savedName;
  }

  const savedEmail = localStorage.getItem("userEmail");
  if (savedEmail) {
    profileEmail.textContent = savedEmail;
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadBookmarks();
  loadPreferences();
  loadCategories();
  loadUserData();
});
