document.addEventListener("DOMContentLoaded", () => {
    
    console.log("DOM fully loaded");

    // Toggle the visibility of the Add Clothes section
const toggleButton = document.getElementById("toggle-add-clothes-btn");
const addClothesSection = document.getElementById("add-clothes-section");

toggleButton.addEventListener("click", () => {
    if (addClothesSection.style.display === "none") {
        addClothesSection.style.display = "block";
        toggleButton.textContent = "Hide Add Clothes";
    } else {
        addClothesSection.style.display = "none";
        toggleButton.textContent = "Add Clothes";
    }
});

    const BASE_URL = "https://cubstart-final-project.onrender.com/api/clothes";

    // Fetch clothes from backend and render them
    async function fetchClothes() {
        try {
            const response = await fetch(BASE_URL);
            if (!response.ok) throw new Error(`Failed to fetch clothes: ${response.statusText}`);
            const data = await response.json();
            console.log("Clothes data:", data);
            renderClothes(data);
        } catch (error) {
            console.error("Error fetching clothes:", error);
        }
    }

    // Delete a clothing item
async function deleteClothingItem(id, name) {
    if (!confirm(`Are you sure you want to delete "${name}" from your closet permanently?`)) {
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) throw new Error(`Failed to delete clothing item: ${response.statusText}`);

        console.log(`Clothing item '${name}' deleted successfully`);
        fetchClothes(); // Refresh the gallery
    } catch (error) {
        console.error("Error deleting clothing item:", error);
    }
}

    // Render clothes in the gallery
    function renderClothes(clothes) {
        const clothesContainer = document.getElementById("clothes-container");
        if (!clothesContainer) {
            console.error("Clothes container not found!");
            return;
        }
    
        clothesContainer.innerHTML = "";
        clothes.forEach(item => {
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("clothing-item");
    
            itemDiv.innerHTML = `
                <img src="${item.image_url || 'default-image.jpg'}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>Brand: ${item.brand || "N/A"}</p>
                <p>Color: ${item.color || "N/A"}</p>
                <p>Tags: ${item.tags ? item.tags.join(", ") : "None"}</p>
                <p>Price: $${item.price || "N/A"}</p>
                <p>Time of Purchase: ${item.time_of_purchase || "N/A"}</p>
                <p>Dry Wash: ${item.needs_dry_washing ? "Yes" : "No"}</p>
                <button class="delete-btn" data-id="${item._id}" data-name="${item.name}">Delete</button>
            `;
    
            clothesContainer.appendChild(itemDiv);
        });
    
        // Add event listeners for delete buttons
        const deleteButtons = document.querySelectorAll(".delete-btn");
        deleteButtons.forEach(button => {
            button.addEventListener("click", (event) => {
                const id = event.target.getAttribute("data-id");
                const name = event.target.getAttribute("data-name");
                deleteClothingItem(id, name);
            });
        });
    
        if (clothes.length === 0) {
            clothesContainer.innerHTML = "<p>No clothes found.</p>";
        }
    }    

    // Add a clothing item to the backend
    async function addClothingItem(formData) {
        try {
            const response = await fetch(BASE_URL, {
                method: "POST",
                body: formData, // Send FormData with file and text data
            });
            if (!response.ok) throw new Error(`Failed to add clothing item: ${response.statusText}`);
            console.log("Added Clothing Item:", await response.json());
            fetchClothes(); // Refresh the gallery
        } catch (error) {
            console.error("Error adding clothing item:", error);
        }
    }

    // Handle the upload form submission
    const uploadForm = document.getElementById("upload-form");
    if (uploadForm) {
        uploadForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            // Create FormData to handle file uploads
            const formData = new FormData();
            formData.append("name", document.getElementById("name").value);
            formData.append("brand", document.getElementById("brand").value);
            formData.append("color", document.getElementById("color").value);
            formData.append("texture", document.getElementById("texture").value);
            formData.append("tags", document.getElementById("tags").value);
            formData.append("price", document.getElementById("price").value);
            formData.append("time_of_purchase", document.getElementById("time-of-purchase").value);
            formData.append("needs_dry_washing", document.getElementById("needs-dry-washing").checked);

            const imageInput = document.getElementById("image");
            if (imageInput.files.length > 0) {
                formData.append("image", imageInput.files[0]); // Attach the image file
            }

            await addClothingItem(formData); // Call function to upload clothing item
            uploadForm.reset(); // Reset the form after submission
        });
    } else {
        console.error("Upload Form not found!");
    }

    // Handle filtering (placeholder functionality)
    const applyFilter = document.getElementById("apply-filter");
    if (applyFilter) {
        applyFilter.addEventListener("click", () => {
            const tags = document.getElementById("tag-filter").value.split(",").map(tag => tag.trim());
            if (!tags[0]) alert("Please enter at least one tag.");
        });
    } else {
        console.error("Apply Filter button not found!");
    }

    // Handle sorting (placeholder functionality)
    const applySort = document.getElementById("apply-sort");
    if (applySort) {
        applySort.addEventListener("click", () => {
            const sortOption = document.getElementById("sort-options").value;
            console.log("Selected Sort Option:", sortOption);
        });
    } else {
        console.error("Apply Sort button not found!");
    }

    // Fetch clothes on page load
    fetchClothes();
});
