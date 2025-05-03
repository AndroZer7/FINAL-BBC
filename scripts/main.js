// Theme Toggle
const themeToggle = document.querySelector(".theme-toggle");
const body = document.body;

// Check for saved theme preference
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  body.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);
}

themeToggle.addEventListener("click", () => {
  const currentTheme = body.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  body.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
  const icon = themeToggle.querySelector("i");
  icon.className = theme === "dark" ? "ri-sun-line" : "ri-moon-line";
}

// Text to Speech
const speechBtn = document.querySelector(".speech-btn");
let speechSynthesis = window.speechSynthesis;
let isSpeaking = false; // Track speaking state

speechBtn.addEventListener("click", () => {
  // Find the closest article container
  const articleContent = speechBtn.closest(".news-article, article");
  if (!articleContent) return;

  // Get article title and excerpt only, excluding metadata
  const title =
    articleContent.querySelector(".article__title")?.textContent || "";
  const excerpt =
    articleContent.querySelector(".article__excerpt")?.textContent || "";
  const body =
    articleContent.querySelector(".article__body")?.textContent || "";

  // Combine the content, prioritizing body content if available
  const contentToRead = body ? `${title}. ${body}` : `${title}. ${excerpt}`;

  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
    speechBtn.querySelector("i").className = "ri-volume-up-line";
    speechBtn.classList.remove("speech-active");
    isSpeaking = false;

    // Resume carousel auto-rotation if we're stopping speech
    if (carousel && typeof carousel.startAutoRotation === "function") {
      carousel.startAutoRotation();
    }
  } else {
    const utterance = new SpeechSynthesisUtterance(contentToRead);
    utterance.rate = 1;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
    speechBtn.querySelector("i").className = "ri-volume-mute-line";
    speechBtn.classList.add("speech-active");
    isSpeaking = true;

    // Pause carousel auto-rotation while speaking
    if (carousel && typeof carousel.pauseAutoRotation === "function") {
      carousel.pauseAutoRotation();
    }

    utterance.onend = () => {
      speechBtn.querySelector("i").className = "ri-volume-up-line";
      speechBtn.classList.remove("speech-active");
      isSpeaking = false;

      // Resume carousel auto-rotation when speech ends
      if (carousel && typeof carousel.startAutoRotation === "function") {
        carousel.startAutoRotation();
      }
    };
  }
});

// Scroll to Top Button
const scrollTopBtn = document.querySelector(".scroll-top");

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 300) {
    scrollTopBtn.classList.add("visible");
  } else {
    scrollTopBtn.classList.remove("visible");
  }
});

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// Bookmark Functionality
const bookmarkBtns = document.querySelectorAll(
  ".bookmark-btn, .article__action-btn[title='Bookmark']"
);
let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

// Initialize bookmark icons
function updateBookmarkIcons() {
  bookmarkBtns.forEach((btn) => {
    const articleTitle = btn
      .closest(".news-article, article")
      ?.querySelector(".article__title")?.textContent;
    if (articleTitle) {
      const isBookmarked = bookmarks.some(
        (bookmark) => bookmark.title === articleTitle
      );
      const icon = btn.querySelector("i");
      if (icon) {
        icon.className = isBookmarked ? "ri-bookmark-fill" : "ri-bookmark-line";
      }
    }
  });
}

// Initialize bookmark icons on page load
updateBookmarkIcons();

// Add click event to all bookmark buttons
bookmarkBtns.forEach((bookmarkBtn) => {
  bookmarkBtn.addEventListener("click", (e) => {
    // Stop event from bubbling up to parent links
    e.preventDefault();
    e.stopPropagation();

    // Find the correct article container
    const articleElement = bookmarkBtn.closest(".news-article, article");
    if (!articleElement) return;

    // Get title and excerpt from this specific article
    const title = articleElement.querySelector(".article__title")?.textContent;
    const excerpt =
      articleElement.querySelector(".article__excerpt")?.textContent;

    if (!title || !excerpt) return;

    const article = {
      title: title,
      excerpt: excerpt,
      date: new Date().toISOString(),
    };

    const isBookmarked = bookmarks.some(
      (bookmark) => bookmark.title === article.title
    );

    if (isBookmarked) {
      bookmarks = bookmarks.filter(
        (bookmark) => bookmark.title !== article.title
      );
      bookmarkBtn.querySelector("i").className = "ri-bookmark-line";
    } else {
      bookmarks.push(article);
      bookmarkBtn.querySelector("i").className = "ri-bookmark-fill";
    }

    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

    // Show feedback to user
    const feedback = document.createElement("div");
    feedback.className = "bookmark-feedback";
    feedback.textContent = isBookmarked
      ? "Removed from bookmarks"
      : "Added to bookmarks";
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
  });
});

// Handle all speech buttons in news grid
const gridSpeechBtns = document.querySelectorAll(".news-article .speech-btn");
gridSpeechBtns.forEach((speechBtn) => {
  speechBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Find article content
    const articleEl = speechBtn.closest(".news-article");
    if (!articleEl) return;

    const title = articleEl.querySelector(".article__title")?.textContent || "";
    const excerpt =
      articleEl.querySelector(".article__excerpt")?.textContent || "";
    const contentToRead = `${title}. ${excerpt}`;

    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      speechBtn.querySelector("i").className = "ri-volume-up-line";
      speechBtn.classList.remove("speech-active");
      isSpeaking = false;
    } else {
      const utterance = new SpeechSynthesisUtterance(contentToRead);
      utterance.rate = 1;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
      speechBtn.querySelector("i").className = "ri-volume-mute-line";
      speechBtn.classList.add("speech-active");
      isSpeaking = true;

      utterance.onend = () => {
        speechBtn.querySelector("i").className = "ri-volume-up-line";
        speechBtn.classList.remove("speech-active");
        isSpeaking = false;
      };
    }
  });
});

// Fix article action buttons to prevent default link behavior
document.addEventListener("DOMContentLoaded", () => {
  // Make article action buttons stop propagation
  const articleActions = document.querySelectorAll(".article__actions");
  articleActions.forEach((actionContainer) => {
    actionContainer.addEventListener("click", (e) => {
      // This prevents clicks on action buttons from triggering parent link navigation
      e.stopPropagation();
    });
  });

  // Handle standalone article page speech buttons (non-carousel)
  const articlePageSpeechBtns = document.querySelectorAll(
    '.article__action-btn[title="Text to Speech"]'
  );
  articlePageSpeechBtns.forEach((speechBtn) => {
    // Skip carousel buttons as they're handled separately
    if (speechBtn.closest(".carousel__slide")) return;

    speechBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Find article content
      const articleEl = speechBtn.closest("article");
      if (!articleEl) return;

      const title =
        articleEl.querySelector(".article__title")?.textContent || "";
      const body = articleEl.querySelector(".article__body")?.textContent || "";
      const excerpt =
        articleEl.querySelector(".article__excerpt")?.textContent || "";

      // Use body content if available (full article pages), otherwise excerpt
      const contentToRead = body ? `${title}. ${body}` : `${title}. ${excerpt}`;

      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        speechBtn.querySelector("i").className = "ri-volume-up-line";
        speechBtn.classList.remove("speech-active");
        isSpeaking = false;
      } else {
        const utterance = new SpeechSynthesisUtterance(contentToRead);
        utterance.rate = 1;
        utterance.pitch = 1;
        speechSynthesis.speak(utterance);
        speechBtn.querySelector("i").className = "ri-volume-mute-line";
        speechBtn.classList.add("speech-active");
        isSpeaking = true;

        utterance.onend = () => {
          speechBtn.querySelector("i").className = "ri-volume-up-line";
          speechBtn.classList.remove("speech-active");
          isSpeaking = false;
        };
      }
    });
  });

  // Handle article reactions (like/dislike)
  const initializeArticleReactions = () => {
    // Load saved reactions from localStorage
    const savedReactions =
      JSON.parse(localStorage.getItem("articleReactions")) || {};

    // Add reaction buttons to all articles
    const addReactionButtons = () => {
      const allArticles = document.querySelectorAll(".news-article, article");

      allArticles.forEach((article) => {
        const actionsContainer = article.querySelector(".article__actions");
        if (!actionsContainer) return;

        // Check if reaction buttons already exist
        if (
          actionsContainer.querySelector(".like-btn") ||
          actionsContainer.querySelector(".dislike-btn")
        ) {
          return;
        }

        // Create like button
        const likeBtn = document.createElement("button");
        likeBtn.className = "reaction-btn like-btn";
        likeBtn.setAttribute("aria-label", "Like");
        likeBtn.innerHTML = '<i class="ri-thumb-up-line"></i>';

        // Create dislike button
        const dislikeBtn = document.createElement("button");
        dislikeBtn.className = "reaction-btn dislike-btn";
        dislikeBtn.setAttribute("aria-label", "Dislike");
        dislikeBtn.innerHTML = '<i class="ri-thumb-down-line"></i>';

        // Add buttons directly to the actions container
        actionsContainer.appendChild(likeBtn);
        actionsContainer.appendChild(dislikeBtn);

        // Get article ID (using title as unique identifier)
        const title = article
          .querySelector(".article__title")
          ?.textContent?.trim();
        if (!title) return;

        // Check if there's a saved reaction and update buttons
        if (savedReactions[title]) {
          const reaction = savedReactions[title];
          if (reaction === "like") {
            likeBtn.querySelector("i").className = "ri-thumb-up-fill";
            likeBtn.classList.add("active");
          } else if (reaction === "dislike") {
            dislikeBtn.querySelector("i").className = "ri-thumb-down-fill";
            dislikeBtn.classList.add("active");
          }
        }

        // Add event listeners
        likeBtn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          handleReaction(title, "like", likeBtn, dislikeBtn);
        });

        dislikeBtn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          handleReaction(title, "dislike", likeBtn, dislikeBtn);
        });
      });
    };

    // Handle reaction click
    const handleReaction = (
      articleTitle,
      reactionType,
      likeBtn,
      dislikeBtn
    ) => {
      const currentReaction = savedReactions[articleTitle];

      // Reset both buttons
      likeBtn.querySelector("i").className = "ri-thumb-up-line";
      dislikeBtn.querySelector("i").className = "ri-thumb-down-line";
      likeBtn.classList.remove("active");
      dislikeBtn.classList.remove("active");

      // If clicking the same reaction again, remove it
      if (currentReaction === reactionType) {
        delete savedReactions[articleTitle];
      } else {
        // Set the new reaction
        savedReactions[articleTitle] = reactionType;

        // Highlight the selected button
        if (reactionType === "like") {
          likeBtn.querySelector("i").className = "ri-thumb-up-fill";
          likeBtn.classList.add("active");
        } else {
          dislikeBtn.querySelector("i").className = "ri-thumb-down-fill";
          dislikeBtn.classList.add("active");
        }
      }

      // Save to localStorage
      localStorage.setItem("articleReactions", JSON.stringify(savedReactions));

      // Show feedback to user
      showReactionFeedback(
        reactionType === currentReaction
          ? "Reaction removed"
          : `Article ${reactionType}d`
      );
    };

    // Show user feedback
    const showReactionFeedback = (message) => {
      const feedback = document.createElement("div");
      feedback.className = "reaction-feedback";
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
    };

    // Initialize reaction buttons
    addReactionButtons();

    // Add reaction functionality to carousel articles after they're loaded
    if (typeof carousel !== "undefined" && carousel.track) {
      // Use MutationObserver to detect when new slides are added
      const carouselObserver = new MutationObserver(() => {
        addReactionButtons();
      });

      carouselObserver.observe(carousel.track, {
        childList: true,
        subtree: true,
      });
    }
  };

  // Initialize reactions
  initializeArticleReactions();

  // Completely revamp featured carousel links for better control
  const carouselSlides = document.querySelectorAll(".carousel__slide");
  carouselSlides.forEach((slide) => {
    const articleLink = slide.querySelector(".article-link");
    if (!articleLink) return;

    // Store the href and then disable the link entirely
    const href = articleLink.getAttribute("href");

    // Create a full replacement of the link behavior
    // First, prevent default link behavior completely
    articleLink.addEventListener(
      "click",
      (e) => {
        e.preventDefault();
        return false;
      },
      true
    ); // Use capturing phase

    // Disable the link by removing href (will restore selectively)
    articleLink.removeAttribute("href");
    articleLink.style.cursor = "default";

    // Make specific elements clickable
    const title = slide.querySelector(".article__title");
    const image = slide.querySelector(".article__image");
    const actionBtns = slide.querySelectorAll(".article__action-btn");

    // Enable redirection for title
    if (title) {
      title.style.cursor = "pointer";
      title.addEventListener("click", (e) => {
        e.stopPropagation();
        window.location.href = href;
      });

      // Visual feedback
      title.addEventListener("mouseenter", () => {
        title.style.color = "var(--primary-color)";
      });
      title.addEventListener("mouseleave", () => {
        title.style.color = "";
      });
    }

    // Enable redirection for image
    if (image) {
      image.style.cursor = "pointer";
      image.addEventListener("click", (e) => {
        e.stopPropagation();
        window.location.href = href;
      });

      // Visual feedback
      image.addEventListener("mouseenter", () => {
        image.style.transform = "scale(1.02)";
        image.style.transition = "transform 0.3s ease";
      });
      image.addEventListener("mouseleave", () => {
        image.style.transform = "";
      });
    }

    // Ensure action buttons never trigger navigation
    actionBtns.forEach((btn) => {
      // Multiple levels of protection
      btn.style.cursor = "pointer";
      btn.style.position = "relative";
      btn.style.zIndex = "10";

      // Multiple event listeners to be extra safe
      const preventNavigation = (e) => {
        e.stopPropagation();
        e.preventDefault();
        return false;
      };

      // Add listeners for both capturing and bubbling phases
      btn.addEventListener("click", preventNavigation, true);
      btn.addEventListener("click", preventNavigation);
      btn.addEventListener("mousedown", preventNavigation, true);
      btn.addEventListener("mouseup", preventNavigation, true);
    });

    // Handle touch events for mobile
    articleLink.addEventListener(
      "touchend",
      (e) => {
        e.preventDefault();
        return false;
      },
      true
    );
  });

  // Specific handler for text-to-speech in carousel (replace existing handler)
  const carouselSpeechBtns = document.querySelectorAll(
    '.carousel__slide .article__action-btn[title="Text to Speech"]'
  );
  carouselSpeechBtns.forEach((speechBtn) => {
    speechBtn.addEventListener(
      "click",
      (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Handle text-to-speech functionality directly
        const articleEl = speechBtn.closest("article");
        if (!articleEl) return;

        const title =
          articleEl.querySelector(".article__title")?.textContent || "";
        const excerpt =
          articleEl.querySelector(".article__excerpt")?.textContent || "";
        const contentToRead = `${title}. ${excerpt}`;

        if (speechSynthesis.speaking) {
          speechSynthesis.cancel();
          speechBtn.querySelector("i").className = "ri-volume-up-line";
          speechBtn.classList.remove("speech-active");
          isSpeaking = false;

          // Resume carousel rotation
          if (carousel) {
            carousel.isAutoPaused = false;
            carousel.startAutoRotation();
          }
        } else {
          const utterance = new SpeechSynthesisUtterance(contentToRead);
          utterance.rate = 1;
          utterance.pitch = 1;
          speechSynthesis.speak(utterance);
          speechBtn.querySelector("i").className = "ri-volume-mute-line";
          speechBtn.classList.add("speech-active");
          isSpeaking = true;

          // Pause carousel rotation while speaking
          if (carousel) {
            carousel.pauseAutoRotation();
          }

          utterance.onend = () => {
            speechBtn.querySelector("i").className = "ri-volume-up-line";
            speechBtn.classList.remove("speech-active");
            isSpeaking = false;

            // Resume carousel rotation when speech ends
            if (carousel) {
              carousel.isAutoPaused = false;
              carousel.startAutoRotation();
            }
          };
        }

        return false;
      },
      true
    ); // Use capture phase to ensure we catch it first
  });

  // Replace existing bookmark handler for carousel with a more robust version
  const carouselBookmarkBtns = document.querySelectorAll(
    '.carousel__slide .article__action-btn[title="Bookmark"]'
  );
  carouselBookmarkBtns.forEach((bookmarkBtn) => {
    // Remove existing listeners if any
    const newBtn = bookmarkBtn.cloneNode(true);
    bookmarkBtn.parentNode.replaceChild(newBtn, bookmarkBtn);

    newBtn.addEventListener(
      "click",
      (e) => {
        e.preventDefault();
        e.stopPropagation();

        const articleEl = newBtn.closest("article");
        if (!articleEl) return;

        const title =
          articleEl.querySelector(".article__title")?.textContent || "";
        const excerpt =
          articleEl.querySelector(".article__excerpt")?.textContent || "";

        if (!title || !excerpt) return;

        const article = {
          title: title,
          excerpt: excerpt,
          date: new Date().toISOString(),
        };

        const isBookmarked = bookmarks.some(
          (bookmark) => bookmark.title === article.title
        );

        if (isBookmarked) {
          bookmarks = bookmarks.filter(
            (bookmark) => bookmark.title !== article.title
          );
          newBtn.querySelector("i").className = "ri-bookmark-line";
        } else {
          bookmarks.push(article);
          newBtn.querySelector("i").className = "ri-bookmark-fill";
        }

        localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

        // Show feedback
        const feedback = document.createElement("div");
        feedback.className = "bookmark-feedback";
        feedback.textContent = isBookmarked
          ? "Removed from bookmarks"
          : "Added to bookmarks";
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

        return false;
      },
      true
    ); // Use capture phase to ensure we catch it first
  });

  // Implement share functionality for the entire codebase
  const implementShareFunctionality = () => {
    // Get all share buttons (both types used in codebase)
    const allShareButtons = document.querySelectorAll(
      '.share-btn, .article__action-btn[title="Share"]'
    );

    allShareButtons.forEach((shareBtn) => {
      shareBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Find the article container
        const articleEl = shareBtn.closest(".news-article, article");
        if (!articleEl) return false;

        // Get article information
        const title =
          articleEl.querySelector(".article__title")?.textContent?.trim() ||
          document.title;
        const excerpt =
          articleEl.querySelector(".article__excerpt")?.textContent?.trim() ||
          "";

        // Get the current URL or the article's href if it's a link
        let url = window.location.href;
        const articleLink =
          articleEl.closest("a[href]") || articleEl.querySelector("a[href]");
        if (articleLink && articleLink.getAttribute("href")) {
          // Make it an absolute URL
          const href = articleLink.getAttribute("href");
          const link = document.createElement("a");
          link.href = href;
          url = link.href; // This gives us the absolute URL
        }

        // Create share data
        const shareData = {
          title: title,
          text: excerpt,
          url: url,
        };

        // Try to use the Web Share API if available
        if (
          navigator.share &&
          navigator.canShare &&
          navigator.canShare(shareData)
        ) {
          navigator
            .share(shareData)
            .then(() => {
              showShareFeedback("Shared successfully");
            })
            .catch((err) => {
              if (err.name !== "AbortError") {
                showFallbackShareUI(shareData);
              }
            });
        } else {
          // Fallback for browsers that don't support Web Share API
          showFallbackShareUI(shareData);
        }

        return false;
      });
    });
  };

  // Function to show share feedback
  const showShareFeedback = (message) => {
    const feedback = document.createElement("div");
    feedback.className = "share-feedback";
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
  };

  // Function to show fallback share UI
  const showFallbackShareUI = (shareData) => {
    // Create modal for fallback share options
    const modal = document.createElement("div");
    modal.className = "share-modal";
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    modal.style.zIndex = "1001";

    // Create modal content
    const modalContent = document.createElement("div");
    modalContent.className = "share-modal-content";
    modalContent.style.backgroundColor = "var(--bg-color)";
    modalContent.style.color = "var(--text-color)";
    modalContent.style.borderRadius = "8px";
    modalContent.style.padding = "20px";
    modalContent.style.maxWidth = "500px";
    modalContent.style.width = "90%";

    // Create header
    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "center";
    header.style.marginBottom = "20px";

    const title = document.createElement("h3");
    title.textContent = "Share Article";
    title.style.margin = "0";

    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = '<i class="ri-close-line"></i>';
    closeBtn.style.background = "none";
    closeBtn.style.border = "none";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.fontSize = "1.5rem";
    closeBtn.style.color = "var(--text-color)";

    closeBtn.addEventListener("click", () => {
      document.body.removeChild(modal);
    });

    header.appendChild(title);
    header.appendChild(closeBtn);

    // Create share options
    const shareOptions = document.createElement("div");
    shareOptions.style.display = "grid";
    shareOptions.style.gridTemplateColumns =
      "repeat(auto-fit, minmax(80px, 1fr))";
    shareOptions.style.gap = "10px";
    shareOptions.style.marginBottom = "20px";

    // Define share platforms
    const platforms = [
      {
        name: "Facebook",
        icon: "ri-facebook-fill",
        color: "#1877f2",
        url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareData.url
        )}`,
      },
      {
        name: "Twitter",
        icon: "ri-twitter-fill",
        color: "#1da1f2",
        url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          shareData.title
        )}&url=${encodeURIComponent(shareData.url)}`,
      },
      {
        name: "LinkedIn",
        icon: "ri-linkedin-fill",
        color: "#0077b5",
        url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
          shareData.url
        )}&title=${encodeURIComponent(
          shareData.title
        )}&summary=${encodeURIComponent(shareData.text)}`,
      },
      {
        name: "WhatsApp",
        icon: "ri-whatsapp-line",
        color: "#25d366",
        url: `https://api.whatsapp.com/send?text=${encodeURIComponent(
          shareData.title + " " + shareData.url
        )}`,
      },
      {
        name: "Email",
        icon: "ri-mail-line",
        color: "#ea4335",
        url: `mailto:?subject=${encodeURIComponent(
          shareData.title
        )}&body=${encodeURIComponent(shareData.text + "\n\n" + shareData.url)}`,
      },
    ];

    platforms.forEach((platform) => {
      const option = document.createElement("a");
      option.href = platform.url;
      option.target = "_blank";
      option.rel = "noopener noreferrer";
      option.style.display = "flex";
      option.style.flexDirection = "column";
      option.style.alignItems = "center";
      option.style.textDecoration = "none";
      option.style.color = "var(--text-color)";
      option.style.padding = "10px";
      option.style.borderRadius = "8px";
      option.style.transition = "background-color 0.3s";

      option.addEventListener("mouseenter", () => {
        option.style.backgroundColor = "var(--nav-hover)";
      });

      option.addEventListener("mouseleave", () => {
        option.style.backgroundColor = "";
      });

      option.addEventListener("click", (e) => {
        if (platform.name === "Email") {
          // Allow default for email
        } else {
          e.preventDefault();
          window.open(platform.url, "_blank", "width=600,height=400");
        }
        setTimeout(() => {
          document.body.removeChild(modal);
          showShareFeedback("Shared via " + platform.name);
        }, 500);
      });

      const icon = document.createElement("i");
      icon.className = platform.icon;
      icon.style.fontSize = "2rem";
      icon.style.marginBottom = "5px";
      icon.style.color = platform.color;

      const name = document.createElement("span");
      name.textContent = platform.name;
      name.style.fontSize = "0.8rem";

      option.appendChild(icon);
      option.appendChild(name);
      shareOptions.appendChild(option);
    });

    // Create copy link section
    const copySection = document.createElement("div");
    copySection.style.marginTop = "15px";
    copySection.style.position = "relative";

    const linkInput = document.createElement("input");
    linkInput.type = "text";
    linkInput.readOnly = true;
    linkInput.value = shareData.url;
    linkInput.style.width = "100%";
    linkInput.style.padding = "10px";
    linkInput.style.paddingRight = "50px";
    linkInput.style.borderRadius = "4px";
    linkInput.style.border = "1px solid var(--border-color)";
    linkInput.style.backgroundColor = "var(--bg-color)";
    linkInput.style.color = "var(--text-color)";

    const copyBtn = document.createElement("button");
    copyBtn.textContent = "Copy";
    copyBtn.style.position = "absolute";
    copyBtn.style.right = "5px";
    copyBtn.style.top = "5px";
    copyBtn.style.padding = "5px 10px";
    copyBtn.style.backgroundColor = "var(--primary-color)";
    copyBtn.style.color = "white";
    copyBtn.style.border = "none";
    copyBtn.style.borderRadius = "4px";
    copyBtn.style.cursor = "pointer";

    copyBtn.addEventListener("click", () => {
      linkInput.select();
      document.execCommand("copy");
      copyBtn.textContent = "Copied!";
      setTimeout(() => {
        copyBtn.textContent = "Copy";
      }, 2000);
    });

    copySection.appendChild(linkInput);
    copySection.appendChild(copyBtn);

    // Assemble modal
    modalContent.appendChild(header);
    modalContent.appendChild(shareOptions);
    modalContent.appendChild(copySection);
    modal.appendChild(modalContent);

    // Close when clicking outside
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });

    // Add to body
    document.body.appendChild(modal);
  };

  // Initialize share functionality
  implementShareFunctionality();

  // Create a special handler for carousel share buttons that's more robust
  const handleCarouselShareButtons = () => {
    const carouselShareBtns = document.querySelectorAll(
      '.carousel__slide .article__action-btn[title="Share"]'
    );

    carouselShareBtns.forEach((shareBtn) => {
      // First, clone to remove any existing handlers
      const newBtn = shareBtn.cloneNode(true);
      shareBtn.parentNode.replaceChild(newBtn, shareBtn);

      // Add the share functionality with special handling
      newBtn.addEventListener(
        "click",
        (e) => {
          e.preventDefault();
          e.stopPropagation();

          // Cancel any parent click events to prevent navigation
          const cancelEvent = (event) => {
            event.stopPropagation();
            event.preventDefault();
            document.removeEventListener("click", cancelEvent, true);
          };
          document.addEventListener("click", cancelEvent, true);

          // Find the article container
          const articleEl = newBtn.closest("article");
          if (!articleEl) return false;

          // Get article information
          const title =
            articleEl.querySelector(".article__title")?.textContent?.trim() ||
            document.title;
          const excerpt =
            articleEl.querySelector(".article__excerpt")?.textContent?.trim() ||
            "";

          // Get the correct URL for carousel article
          let url = window.location.href;
          const carouselSlide = newBtn.closest(".carousel__slide");
          if (carouselSlide) {
            const articleLink = carouselSlide.querySelector(".article-link");
            if (articleLink && articleLink.getAttribute("href")) {
              // Create absolute URL
              const href = articleLink.getAttribute("href");
              const link = document.createElement("a");
              link.href = href;
              url = link.href;
            }
          }

          // Create share data
          const shareData = {
            title: title,
            text: excerpt,
            url: url,
          };

          // Use Web Share API if available
          if (
            navigator.share &&
            navigator.canShare &&
            navigator.canShare(shareData)
          ) {
            navigator
              .share(shareData)
              .then(() => {
                showShareFeedback("Shared successfully");
              })
              .catch((err) => {
                if (err.name !== "AbortError") {
                  showFallbackShareUI(shareData);
                }
              });
          } else {
            // Fallback for browsers that don't support Web Share API
            showFallbackShareUI(shareData);
          }

          return false;
        },
        true
      ); // Use capture phase to ensure we catch it first
    });
  };

  // Initialize carousel share button handlers
  handleCarouselShareButtons();
});

// Reading Progress Bar
const progressBar = document.createElement("div");
progressBar.className = "progress-bar";
document.body.appendChild(progressBar);

window.addEventListener("scroll", () => {
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight - windowHeight;
  const scrollTop = window.pageYOffset;
  const progress = (scrollTop / documentHeight) * 100;

  progressBar.style.width = `${progress}%`;
});

// Add progress bar styles
const style = document.createElement("style");
style.textContent = `
    .progress-bar {
        position: fixed;
        top: 0;
        left: 0;
        height: 4px;
        background-color: var(--primary-color);
        z-index: 1000;
        transition: width 0.1s ease;
    }
`;
document.head.appendChild(style);

// Search Functionality
const searchToggle = document.querySelector(".search-toggle");
const searchContainer = document.createElement("div");
searchContainer.className = "search-container";
searchContainer.innerHTML = `
    <div class="search-box">
        <input type="text" placeholder="Search news..." class="search-input">
        <button class="search-close">
            <i class="ri-close-line"></i>
        </button>
    </div>
`;

document.body.appendChild(searchContainer);

searchToggle.addEventListener("click", () => {
  searchContainer.classList.add("active");
  searchContainer.querySelector(".search-input").focus();
});

searchContainer.querySelector(".search-close").addEventListener("click", () => {
  searchContainer.classList.remove("active");
});

// Add search styles
const searchStyle = document.createElement("style");
searchStyle.textContent = `
    .search-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--bg-color);
        z-index: 1000;
        display: none;
        align-items: center;
        justify-content: center;
    }
    
    .search-container.active {
        display: flex;
    }
    
    .search-box {
        width: 90%;
        max-width: 600px;
        position: relative;
    }
    
    .search-input {
        width: 100%;
        padding: 1rem;
        font-size: 1.2rem;
        border: 2px solid var(--border-color);
        border-radius: 8px;
        background-color: var(--bg-color);
        color: var(--text-color);
    }
    
    .search-close {
        position: absolute;
        right: 1rem;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: var(--text-color);
        cursor: pointer;
    }
`;
document.head.appendChild(searchStyle);

// Navigation Active State
const sections = document.querySelectorAll(".news-section");
const navLinks = document.querySelectorAll(".nav__link");

function setActiveLink() {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.pageYOffset >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("scroll", setActiveLink);

// Smooth Scroll for Navigation Links
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href");
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      window.scrollTo({
        top: targetSection.offsetTop - 100, // Account for fixed header
        behavior: "smooth",
      });
    }
  });
});

// Initialize active state
document.addEventListener("DOMContentLoaded", () => {
  setActiveLink();
});

// Featured Articles Carousel
const carousel = {
  track: document.querySelector(".carousel__track"),
  slides: document.querySelectorAll(".carousel__slide"),
  prevBtn: document.querySelector(".carousel__btn--prev"),
  nextBtn: document.querySelector(".carousel__btn--next"),
  indicators: document.querySelectorAll(".carousel__indicator"),
  currentIndex: 0,
  interval: null,
  isAutoPaused: false,

  init() {
    // Randomize initial slide
    this.currentIndex = Math.floor(Math.random() * this.slides.length);
    this.updateCarousel();

    // Add event listeners
    this.prevBtn.addEventListener("click", () => this.prevSlide());
    this.nextBtn.addEventListener("click", () => this.nextSlide());

    // Add indicator click handlers
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => this.goToSlide(index));
    });

    // Start auto-rotation
    this.startAutoRotation();
  },

  updateCarousel() {
    const offset = -this.currentIndex * 100;
    this.track.style.transform = `translateX(${offset}%)`;

    // Update indicators
    this.indicators.forEach((indicator, index) => {
      if (index === this.currentIndex) {
        indicator.classList.add("active");
      } else {
        indicator.classList.remove("active");
      }
    });
  },

  goToSlide(index) {
    this.currentIndex = index;
    this.updateCarousel();
    this.resetAutoRotation();
  },

  prevSlide() {
    this.currentIndex =
      (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.updateCarousel();
    this.resetAutoRotation();
  },

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.updateCarousel();
    this.resetAutoRotation();
  },

  startAutoRotation() {
    // Don't start if speech is playing or auto-rotation is paused
    if (isSpeaking || this.isAutoPaused) return;

    this.interval = setInterval(() => this.nextSlide(), 5000);
  },

  pauseAutoRotation() {
    this.isAutoPaused = true;
    clearInterval(this.interval);
    this.interval = null;
  },

  resetAutoRotation() {
    clearInterval(this.interval);
    this.startAutoRotation();
  },
};

// Initialize carousel when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  carousel.init();
});

// Initialize active state
setActiveLink();
