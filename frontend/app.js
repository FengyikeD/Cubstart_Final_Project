document.addEventListener("DOMContentLoaded", () => {
    const BASE_URL = "https://cubstart-final-project.onrender.com";

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

    function renderClothes(clothes) {
        const clothesContainer = document.getElementById("clothes-container");
        clothesContainer.innerHTML = "";
        clothes.forEach(item => {
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("clothing-item");

            itemDiv.innerHTML = `
                <img src="${item.image_url}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>Brand: ${item.brand || "N/A"}</p>
                <p>Color: ${item.color || "N/A"}</p>
                <p>Tags: ${item.tags ? item.tags.join(", ") : "None"}</p>
                <p>Price: $${item.price || "N/A"}</p>
                <p>Time of Purchase: ${item.time_of_purchase || "N/A"}</p>
                <p>Dry Wash: ${item.needs_dry_washing ? "Yes" : "No"}</p>
            `;
            clothesContainer.appendChild(itemDiv);
        });
        if (clothes.length === 0) {
            clothesContainer.innerHTML = "<p>No clothes found.</p>";
        }
    }

    async function addClothingItem(clothing) {
        try {
            const response = await fetch(BASE_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(clothing),
            });
            if (!response.ok) throw new Error(`Failed to add clothing item: ${response.statusText}`);
            console.log("Added Clothing Item:", await response.json());
            fetchClothes();
        } catch (error) {
            console.error("Error adding clothing item:", error);
        }
    }

    document.getElementById("apply-filter").addEventListener("click", () => {
        const tags = document.getElementById("tag-filter").value.split(",").map(tag => tag.trim());
        if (!tags[0]) alert("Please enter at least one tag.");
    });

    document.getElementById("apply-sort").addEventListener("click", () => {
        const sortOption = document.getElementById("sort-options").value;
        console.log("Selected Sort Option:", sortOption);
    });

    const uploadForm = document.getElementById("upload-form");
    uploadForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const clothing = {
            name: document.getElementById("name").value,
            brand: document.getElementById("brand").value,
            color: document.getElementById("color").value,
            texture: document.getElementById("texture").value,
            tags: document.getElementById("tags").value.split(","),
            price: parseFloat(document.getElementById("price").value),
            time_of_purchase: document.getElementById("time-of-purchase").value,
            needs_dry_washing: document.getElementById("needs-dry-washing").checked,
        };

        const imageInput = document.getElementById("image");
        if (imageInput.files.length > 0) {
            clothing.image_url = URL.createObjectURL(imageInput.files[0]);
        } else {
            clothing.image_url = "";
        }

        addClothingItem(clothing);
        uploadForm.reset();
    });

    fetchClothes();
});