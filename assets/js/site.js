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


  // Modify saveUserDataLocally function
  function saveUserDataLocally(data) {
    try {
      const hasSpace = checkStorageLimit(data);
      localStorage.setItem("userData", JSON.stringify(data));
      
      if (!hasSpace) {
        alert("Warning: Local storage is getting full. Consider downloading your data as a backup.");
      }
    } catch (e) {
      alert(e.message);
      // Offer to download instead
      if (confirm("Would you like to download your data as a file instead?")) {
        downloadSaveButton.click();
      }
    }
  }

  function loadUserDataLocally() {
    const json = localStorage.getItem("userData");
    return json ? JSON.parse(json) : null;
  }

  // Storage limit checks
  function checkStorageLimit(data) {
    // Check available space (most browsers limit to ~5MB)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    
    // Get current localStorage usage
    let totalSize = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length * 2; // Multiply by 2 for UTF-16 encoding
      }
    }
    
    // Calculate size of new data
    const newDataSize = JSON.stringify(data).length * 2;
    
    // Check if adding new data would exceed limit
    if (totalSize + newDataSize > MAX_SIZE) {
      const remaining = Math.floor((MAX_SIZE - totalSize) / (1024 * 1024));
      throw new Error(`Cannot save: Storage limit reached. You have approximately ${remaining}MB remaining.`);
    }
    
    // If more than 80% full, warn user
    if (totalSize + newDataSize > MAX_SIZE * 0.8) {
      console.warn(`Storage is getting full: ${Math.floor((totalSize + newDataSize) / (MAX_SIZE) * 100)}% used`);
      return false;
    }
    
    return true;
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
            // Add debug logging
            console.log("File contents:", e.target.result);
            
            const parsedData = JSON.parse(e.target.result);
            console.log("Parsed data:", parsedData);
            
            // Validate data structure
            if (!parsedData.cards || !Array.isArray(parsedData.cards)) {
                throw new Error("Invalid save file format - missing cards array");
            }
            
            setUserData(parsedData);
            alert("Data loaded successfully!");
        } catch (error) {
            console.error("JSON parse error:", error);
            alert(`Failed to parse JSON file: ${error.message}`);
        }
    };
    reader.onerror = (error) => {
        console.error("FileReader error:", error);
        alert("Error reading file");
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
