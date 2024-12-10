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
    let clothes = []; // Global array to store all clothes data

    // Fetch clothes from backend and render them
    async function fetchClothes() {
        try {
            const response = await fetch(BASE_URL);
            if (!response.ok) throw new Error(`Failed to fetch clothes: ${response.statusText}`);
            clothes = await response.json(); // Populate global array
            console.log("Clothes data:", clothes);
            renderClothes(clothes);
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
    function renderClothes(clothesToRender) {
        const clothesContainer = document.getElementById("clothes-container");
        const clothesCount = document.getElementById("clothes-count");

        if (!clothesContainer) {
            console.error("Clothes container not found!");
            return;
        }

        clothesContainer.innerHTML = "";

        clothesToRender.forEach(item => {
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

        clothesCount.textContent = `${clothesToRender.length} Pieces of Clothes Displayed`;

        if (clothesToRender.length === 0) {
            clothesContainer.innerHTML = "<p>No clothes found.</p>";
        }

        const deleteButtons = document.querySelectorAll(".delete-btn");
        deleteButtons.forEach(button => {
            button.addEventListener("click", (event) => {
                const id = event.target.getAttribute("data-id");
                const name = event.target.getAttribute("data-name");
                deleteClothingItem(id, name);
            });
        });
    }

    // Add a clothing item to the backend
    async function addClothingItem(formData) {
        try {
            const response = await fetch(BASE_URL, {
                method: "POST",
                body: formData,
            });
            if (!response.ok) throw new Error(`Failed to add clothing item: ${response.statusText}`);
            console.log("Added Clothing Item:", await response.json());
            fetchClothes();
        } catch (error) {
            console.error("Error adding clothing item:", error);
        }
    }

    // Handle the upload form submission
    const uploadForm = document.getElementById("upload-form");
    if (uploadForm) {
        uploadForm.addEventListener("submit", async (event) => {
            event.preventDefault();

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
                formData.append("image", imageInput.files[0]);
            }

            await addClothingItem(formData);
            uploadForm.reset();
        });
    } else {
        console.error("Upload Form not found!");
    }

    // Filter clothes
    const applyFilter = document.getElementById("apply-filter");
    if (applyFilter) {
        applyFilter.addEventListener("click", () => {
            const tags = document.getElementById("tag-filter").value.split(",").map(tag => tag.trim());
            if (!tags[0]) {
                alert("Please enter at least one tag.");
                return;
            }
            const filteredClothes = clothes.filter(item => {
                const itemTags = item.tags || [];
                return tags.every(tag => itemTags.includes(tag));
            });
            renderClothes(filteredClothes);
        });
    } else {
        console.error("Apply Filter button not found!");
    }

    // Sort clothes
    const applySort = document.getElementById("apply-sort");
    if (applySort) {
        applySort.addEventListener("click", () => {
            const sortOption = document.getElementById("sort-options").value;
            if (!sortOption) {
                alert("Please select a sort option.");
                return;
            }
            const sortedClothes = [...clothes].sort((a, b) => {
                if (sortOption === "price") {
                    return (a.price || 0) - (b.price || 0);
                }
                if (sortOption === "time_of_purchase") {
                    return new Date(a.time_of_purchase || "1970-01-01") - new Date(b.time_of_purchase || "1970-01-01");
                }
            });
            renderClothes(sortedClothes);
        });
    } else {
        console.error("Apply Sort button not found!");
    }

    // Fetch clothes on page load
    fetchClothes();
});
