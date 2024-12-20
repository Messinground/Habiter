document.addEventListener("DOMContentLoaded", () => {
  const saveDataButton = document.getElementById("save-data-button");
  const loadDataButton = document.getElementById("load-data-button");
  const loadDataFileInput = document.getElementById("load-data-file-input");

  // modal for choosing how to save data
  // Place this modal markup in a global include or on main page if needed.
  // This example assumes there's a modal in your main layout or a partial included globally.
  const saveModal = document.getElementById("save-modal");
  const closeSaveModal = document.querySelector(".close-save-modal");
  const saveLocalButton = document.getElementById("save-local-button");
  const downloadSaveButton = document.getElementById("download-save-button");

  // Placeholder: This function tries to get data from elsewhere.
  // If CardLocker.js defines window.getUserData(), we can call that.
  function getUserData() {
    if (typeof window.getUserData === "function") {
      return window.getUserData();
    } 
    // If no global function, return a placeholder structure
    return {
      cards: [],
      todos: [],
      progress: {}
    };
  }

  // Placeholder: This function sets data. CardLocker.js or another script could define window.setUserData
  function setUserData(data) {
    if (typeof window.setUserData === "function") {
      window.setUserData(data);
    } else {
      console.log("Loaded user data:", data);
      // Update your UI or store the data globally as needed
    }
  }

  function saveUserDataLocally(data) {
    localStorage.setItem("userData", JSON.stringify(data));
  }

  function loadUserDataLocally() {
    const json = localStorage.getItem("userData");
    return json ? JSON.parse(json) : null;
  }

  // --- Event Listeners ---

  saveDataButton.addEventListener("click", () => {
    saveModal.style.display = "block";
  });

  closeSaveModal.addEventListener("click", () => {
    saveModal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === saveModal) {
      saveModal.style.display = "none";
    }
  });

  saveLocalButton.addEventListener("click", () => {
    const data = getUserData();
    saveUserDataLocally(data);
    alert("Data saved to browser storage!");
    saveModal.style.display = "none";
  });

  downloadSaveButton.addEventListener("click", () => {
    const data = getUserData();
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "userdata.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    saveModal.style.display = "none";
  });

  loadDataButton.addEventListener("click", () => {
    loadDataFileInput.click();
  });

  loadDataFileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsedData = JSON.parse(e.target.result);
        setUserData(parsedData);
        alert("Data loaded successfully!");
      } catch (error) {
        alert("Failed to parse JSON file. Please make sure it's a valid JSON.");
      }
    };
    reader.readAsText(file);
  });

  // On every page load, we can also try to load from localStorage
  // so data persists without manual load every time.
  const existingData = loadUserDataLocally();
  if (existingData) {
    setUserData(existingData);
  }
});
